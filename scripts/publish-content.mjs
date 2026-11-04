import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import {
  collections,
  contentFrontmatterSchema,
} from "../src/lib/content/schema.ts";

// Publishes draft: false content from the private library named by CONTENT_ROOT.
// It is copied into a temporary checkout of origin/main, so the current branch and
// uncommitted work do not matter, and only content/ is committed and pushed.
// content/ is a mirror: files that are no longer published are removed.
const require = createRequire(import.meta.url);
const nextRequire = createRequire(require.resolve("next/package.json"));
nextRequire("@next/env").loadEnvConfig(process.cwd());

const source = process.env.CONTENT_ROOT
  ? path.resolve(process.env.CONTENT_ROOT)
  : undefined;
if (
  !source ||
  source === path.resolve("content") ||
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
const checkScript = fileURLToPath(
  new URL("./check-content.mjs", import.meta.url),
);

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
function check(contentRoot, cwd) {
  const args = [...process.execArgv, checkScript];
  const result = spawnSync(process.execPath, args, {
    cwd,
    stdio: "inherit",
    env: {
      ...process.env,
      CONTENT_ROOT: contentRoot,
      SITE_CONFIG_PATH: siteConfigPath,
      // The real address is set on Cloudflare; these checks only read content.
      SITE_URL: process.env.SITE_URL || "https://content.invalid",
    },
  });
  return result.status === 0;
}
function git(args, cwd = process.cwd()) {
  const result = spawnSync("git", args, { cwd, encoding: "utf8" });
  if (result.status !== 0)
    throw new Error(result.stderr.trim() || `git ${args[0]} 失败`);
  return result.stdout.trim();
}

function copyPublished(documents, target) {
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
      text = matter.stringify(parsed.content, {
        ...parsed.data,
        reviews: kept,
      });
    }
    const output = path.join(target, document.relative);
    written.add(output);
    const exists = fs.existsSync(output);
    if (exists && fs.readFileSync(output, "utf8") === text) continue;
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, text);
    changes.push(`${exists ? "更新" : "新增"} ${document.relative}`);
  }
  for (const collection of collections) {
    for (const file of walk(path.join(target, collection))) {
      if (written.has(file)) continue;
      fs.rmSync(file);
      changes.push(`下线 ${path.relative(target, file)}`);
    }
  }
  return { changes, publishedCount: published.length };
}

console.log(`检查内容库：${source}`);
if (!check(source, process.cwd())) {
  console.error("内容库检查未通过，没有发布任何内容。");
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

let pushed = false;
let worktree;
try {
  git(["fetch", "--quiet", "origin", "main"]);
  worktree = fs.mkdtempSync(path.join(os.tmpdir(), "content-publish-"));
  git(["worktree", "add", "--quiet", "--detach", worktree, "origin/main"]);

  const target = path.join(worktree, "content");
  const { changes, publishedCount } = copyPublished(documents, target);
  const draftCount = documents.length - publishedCount;
  if (!changes.length) {
    console.log(
      `\n线上内容已是最新，不需要发布（${publishedCount} 篇公开内容，${draftCount} 篇草稿）。`,
    );
  } else {
    console.log(`\n${changes.join("\n")}\n\n检查将要上线的内容：`);
    if (!check(target, worktree))
      throw new Error(
        "将要上线的内容检查未通过，没有发布。如果提示缺失的资源，说明图片还没有提交到 main。",
      );
    git(["add", "--", "content"], worktree);
    git(
      ["commit", "--quiet", "-m", `Publish content\n\n${changes.join("\n")}`],
      worktree,
    );
    git(["push", "--quiet", "origin", "HEAD:main"], worktree);
    pushed = true;
    console.log(
      `\n已发布 ${git(["rev-parse", "--short", "HEAD"], worktree)}：${publishedCount} 篇公开内容，${draftCount} 篇草稿留在内容库。Cloudflare Pages 构建完成后上线。`,
    );
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  if (worktree) {
    spawnSync("git", ["worktree", "remove", "--force", worktree]);
    fs.rmSync(worktree, { recursive: true, force: true });
    spawnSync("git", ["worktree", "prune"]);
  }
}

if (pushed) {
  // Keep local main in step; the content is already live if this cannot run.
  const onMain = git(["branch", "--show-current"]) === "main";
  try {
    git(
      onMain
        ? ["merge", "--quiet", "--ff-only", "origin/main"]
        : ["fetch", "--quiet", "origin", "main:main"],
    );
  } catch {
    console.warn("本地 main 没有自动更新，需要时请手动运行 git pull。");
  }
}
