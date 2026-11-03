import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import matter from "gray-matter";
import {
  collections,
  contentFrontmatterSchema,
} from "../src/lib/content/schema.ts";

// Copies published (draft: false) content from the private library named by
// CONTENT_ROOT into this repository's content/, which Cloudflare Pages builds.
// content/ becomes a mirror: files that are no longer published are removed.
const require = createRequire(import.meta.url);
const nextRequire = createRequire(require.resolve("next/package.json"));
nextRequire("@next/env").loadEnvConfig(process.cwd());

const target = path.resolve("content");
const source = process.env.CONTENT_ROOT
  ? path.resolve(process.env.CONTENT_ROOT)
  : undefined;
if (
  !source ||
  source === target ||
  !collections.some((collection) =>
    fs.existsSync(path.join(source, collection)),
  )
) {
  console.error(
    "请在 .env.local 中把 CONTENT_ROOT 设为私有内容库的 content/ 目录（其中包含 projects/ 或 essays/）。",
  );
  process.exit(1);
}
const siteConfigPath =
  process.env.SITE_CONFIG_PATH ?? path.join(path.dirname(source), "site.json");

function walk(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory()
      ? walk(file)
      : entry.isFile() && file.endsWith(".md")
        ? [file]
        : [];
  });
}
function check(contentRoot) {
  const args = [...process.execArgv, "scripts/check-content.mjs"];
  const result = spawnSync(process.execPath, args, {
    stdio: "inherit",
    env: {
      ...process.env,
      CONTENT_ROOT: contentRoot,
      SITE_CONFIG_PATH: siteConfigPath,
    },
  });
  return result.status === 0;
}

console.log(`检查私有内容库：${source}`);
if (!check(source)) {
  console.error("私有内容库检查未通过，没有同步任何文件。");
  process.exit(1);
}

const documents = collections.flatMap((collection) =>
  walk(path.join(source, collection)).map((file) => {
    const text = fs.readFileSync(file, "utf8");
    const data = contentFrontmatterSchema.parse(matter(text).data);
    const slug = data.slug ?? path.basename(file, ".md");
    return {
      text,
      data,
      relative: path.relative(source, file),
      url: `/${collection}/${slug}`,
    };
  }),
);
const published = documents.filter((document) => !document.data.draft);
const publishedUrls = new Set(published.map((document) => document.url));

const written = new Set();
const changes = [];
for (const document of published) {
  let text = document.text;
  const reviews = document.data.reviews ?? [];
  const kept = reviews.filter((review) => publishedUrls.has(review));
  // Unpublished reviews are hidden on the site anyway; left in, they would point
  // at drafts that are not copied and fail the public content check.
  if (kept.length !== reviews.length) {
    const parsed = matter(text);
    text = matter.stringify(parsed.content, { ...parsed.data, reviews: kept });
  }
  const output = path.join(target, document.relative);
  written.add(output);
  const exists = fs.existsSync(output);
  if (exists && fs.readFileSync(output, "utf8") === text) continue;
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, text);
  changes.push(`${exists ? "更新" : "新增"} content/${document.relative}`);
}
for (const collection of collections) {
  for (const file of walk(path.join(target, collection))) {
    if (written.has(file)) continue;
    fs.rmSync(file);
    changes.push(`删除 content/${path.relative(target, file)}`);
  }
}

console.log(
  `\n${changes.length ? changes.join("\n") : "content/ 已是最新，没有变化。"}`,
);
console.log("\n检查同步后的 content/：");
if (!check(target)) {
  console.error("同步后的 content/ 检查未通过，请修正私有内容库后重新同步。");
  process.exit(1);
}
console.log(
  `\n已同步 ${published.length} 篇公开内容，${documents.length - published.length} 篇草稿留在私有内容库。${changes.length ? "确认后提交并推送 content/，Cloudflare Pages 会自动构建。" : ""}`,
);
