import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import {
  collections,
  contentFrontmatterSchema,
  type ContentCollection,
  type ContentDocument,
} from "./schema";

const contentRoot = path.join(process.cwd(), "content");

function contentFiles(directory: string): string[] {
  if (!fs.existsSync(directory)) return [];

  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return contentFiles(entryPath);
    return /\.md$/.test(entry.name) ? [entryPath] : [];
  });
}

function parseContentFile(
  filePath: string,
  collection: ContentCollection,
): ContentDocument {
  const source = fs.readFileSync(filePath, "utf8");
  const parsed = matter(source);
  const result = contentFrontmatterSchema.safeParse(parsed.data);

  if (!result.success) {
    throw new Error(`无效的 Frontmatter：${filePath}\n${result.error.message}`);
  }

  const filenameSlug = path.basename(filePath, ".md");
  const slug = result.data.slug ?? filenameSlug;

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(`无效的 slug：${filePath}`);
  }

  return { ...result.data, collection, slug, body: parsed.content };
}

function shouldIncludeDrafts() {
  return (
    process.env.NODE_ENV !== "production" ||
    process.env.CONTENT_PREVIEW === "true"
  );
}

export function getContent(
  options: { includeDrafts?: boolean } = {},
): ContentDocument[] {
  const includeDrafts = options.includeDrafts ?? shouldIncludeDrafts();

  const documents = collections.flatMap((collection) =>
    contentFiles(path.join(contentRoot, collection)).map((filePath) =>
      parseContentFile(filePath, collection),
    ),
  );

  return documents
    .filter((document) => includeDrafts || !document.draft)
    .sort((left, right) => right.date.localeCompare(left.date));
}

export function getCollection(
  collection: ContentCollection,
  options?: { includeDrafts?: boolean },
) {
  return getContent(options).filter(
    (document) => document.collection === collection,
  );
}

export function getDocument(
  collection: ContentCollection,
  slug: string,
  options?: { includeDrafts?: boolean },
) {
  return getCollection(collection, options).find(
    (document) => document.slug === slug,
  );
}

export async function renderMarkdown(markdown: string) {
  const result = await remark()
    .use(remarkGfm)
    .use(remarkHtml)
    .process(markdown);
  return result.toString();
}

export function isContentCollection(value: string): value is ContentCollection {
  return collections.includes(value as ContentCollection);
}

export function contentUrl(
  document: Pick<ContentDocument, "collection" | "slug">,
) {
  return `/${document.collection}/${document.slug}`;
}
