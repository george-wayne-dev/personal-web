import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { createRequire } from "node:module";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import {
  collections,
  contentFrontmatterSchema,
} from "../src/lib/content/schema.ts";

const require = createRequire(import.meta.url);
const nextRequire = createRequire(require.resolve("next/package.json"));
nextRequire("@next/env").loadEnvConfig(process.cwd());

const root = path.resolve(process.env.CONTENT_ROOT ?? "content");
const publicRoot = path.resolve("public");
const failures = [];
const documents = [];
const routes = new Set([
  "/",
  "/about",
  "/projects",
  "/essays",
  "/rss.xml",
  "/sitemap.xml",
  "/robots.txt",
]);
const parser = remark().use(remarkGfm);
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
function visit(node, callback) {
  callback(node);
  for (const child of node.children ?? []) visit(child, callback);
}
for (const collection of collections) {
  for (const file of walk(path.join(root, collection))) {
    try {
      const parsed = matter(fs.readFileSync(file, "utf8"));
      const data = contentFrontmatterSchema.parse(parsed.data);
      const slug = data.slug ?? path.basename(file, ".md");
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
        throw new Error("无效的 slug");
      const url = `/${collection}/${slug}`;
      if (documents.some((document) => document.url === url))
        throw new Error(`重复的内容地址 ${url}`);
      const tree = parser.parse(parsed.content);
      const headingCount = (tree.children ?? []).filter(
        (node) => node.type === "heading" && node.depth === 2,
      ).length;
      const anchors = new Set(
        Array.from(
          { length: headingCount },
          (_, index) => `section-${String(index + 1).padStart(2, "0")}`,
        ),
      );
      documents.push({ ...data, file, url, tree, anchors });
      if (!data.draft) routes.add(url);
    } catch (error) {
      failures.push(`${file}: ${error.message}`);
    }
  }
}
function checkUrl(value, document, resource = false) {
  if (/^(https?:|mailto:|tel:)/i.test(value)) return;
  if (/^[a-z][a-z0-9+.-]*:/i.test(value) || value.startsWith("//")) {
    failures.push(`${document.file}: 不支持的链接协议 ${value}`);
    return;
  }
  try {
    const resolved = new URL(value, `https://content.invalid${document.url}`);
    const pathname =
      decodeURIComponent(resolved.pathname).replace(/\/$/, "") || "/";
    const asset = path.resolve(publicRoot, `.${pathname}`);
    const isAsset =
      asset.startsWith(publicRoot + path.sep) &&
      fs.existsSync(asset) &&
      fs.statSync(asset).isFile();
    if (resource ? !isAsset : !routes.has(pathname) && !isAsset) {
      failures.push(
        `${document.file}: 缺失的${resource ? "资源" : "内部链接"} ${value}`,
      );
      return;
    }
    if (resolved.hash && !isAsset) {
      const target = documents.find((item) => item.url === pathname);
      if (
        target &&
        !target.anchors.has(decodeURIComponent(resolved.hash.slice(1)))
      )
        failures.push(`${document.file}: 缺失的章节锚点 ${value}`);
    }
  } catch {
    failures.push(`${document.file}: 无效的链接 ${value}`);
  }
}
for (const document of documents.filter((item) => !item.draft)) {
  if (document.cover) checkUrl(document.cover, document, true);
  const definitions = new Map();
  visit(document.tree, (node) => {
    if (node.type === "definition") definitions.set(node.identifier, node);
  });
  visit(document.tree, (node) => {
    if (node.type === "html")
      failures.push(
        `${document.file}: 原始 HTML 会被清理，请使用 Markdown 图片或媒体链接`,
      );
    if (node.type === "image" || node.type === "imageReference") {
      if (!node.alt?.trim())
        failures.push(`${document.file}: 图片缺少替代文本`);
    }
    if (node.type === "link" || node.type === "image")
      checkUrl(node.url, document, node.type === "image");
    if (node.type === "linkReference" || node.type === "imageReference") {
      const definition = definitions.get(node.identifier);
      if (definition)
        checkUrl(definition.url, document, node.type === "imageReference");
      else failures.push(`${document.file}: 未定义的引用 ${node.identifier}`);
    }
    if (
      node.type === "link" &&
      ["audio", "video"].includes(node.title) &&
      !node.url.startsWith("https://")
    )
      failures.push(`${document.file}: 媒体嵌入需要 HTTPS 链接`);
  });
}
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(
    `内容检查通过：${documents.filter((item) => !item.draft).length} 篇公开内容，${documents.filter((item) => item.draft).length} 篇草稿。已检查元信息、重复地址、内部链接、章节锚点与本地资源。`,
  );
}
