import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { createRequire } from "node:module";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import {
  collections,
  contentFrontmatterSchema,
  missingProjectFields,
} from "../src/lib/content/schema.ts";

const require = createRequire(import.meta.url);
const nextRequire = createRequire(require.resolve("next/package.json"));
nextRequire("@next/env").loadEnvConfig(process.cwd());
// Imported after the env is loaded; on Cloudflare a missing site URL fails here.
const { siteUrlIsFallback } = await import("../src/lib/site.ts");

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
function nodeText(node) {
  return node.value ?? (node.children ?? []).map(nodeText).join("");
}
function paragraphs(tree) {
  return (tree.children ?? [])
    .filter((node) => node.type === "paragraph")
    .map(nodeText);
}
// Published content must replace what templates and skeletons leave behind.
const placeholderWords = /待写|待填写|待整理|待分类|replace-with-/;
const templatePrompts = new Set(
  [path.resolve("templates"), path.join(path.dirname(root), "_templates")]
    .flatMap(walk)
    .flatMap((file) =>
      paragraphs(parser.parse(matter(fs.readFileSync(file, "utf8")).content)),
    ),
);
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
      documents.push({
        ...data,
        frontmatter: data,
        collection,
        file,
        url,
        tree,
        anchors,
      });
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
  if (placeholderWords.test(JSON.stringify(document.frontmatter)))
    failures.push(
      `${document.file}: Frontmatter 还留着模板占位词（待写、待填写、待整理、待分类等）`,
    );
  if (paragraphs(document.tree).some((text) => templatePrompts.has(text)))
    failures.push(`${document.file}: 正文还留着模板里的提示语`);
  if (
    !(document.tree.children ?? []).some(
      (node) => !["heading", "definition"].includes(node.type),
    )
  )
    failures.push(`${document.file}: 正文还没有内容`);
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
  if (document.collection === "projects") {
    const missing = missingProjectFields(document);
    if (missing.length)
      failures.push(
        `${document.file}: 公开作品必须填写 ${missing.join("、")}（数字为 0 也要写）`,
      );
    for (const review of document.reviews ?? []) {
      if (!documents.some((item) => item.url === review))
        failures.push(`${document.file}: 复盘文章不存在 ${review}`);
    }
  }
}
if (siteUrlIsFallback)
  console.warn(
    "未设置 SITE_URL，canonical、RSS 和 Sitemap 暂用 https://example.com；正式发布前请配置。",
  );
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(
    `内容检查通过：${documents.filter((item) => !item.draft).length} 篇公开内容，${documents.filter((item) => item.draft).length} 篇草稿。已检查元信息、作品必填字段、模板占位、重复地址、内部链接、章节锚点与本地资源。`,
  );
}
