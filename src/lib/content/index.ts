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

export const contentRoot = path.resolve(
  /* turbopackIgnore: true */
  process.env.CONTENT_ROOT ??
    path.join(/* turbopackIgnore: true */ process.cwd(), "content"),
);

function contentFiles(directory: string): string[] {
  if (!fs.existsSync(directory)) return [];

  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(
      /* turbopackIgnore: true */ directory,
      entry.name,
    );
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
  return process.env.NODE_ENV !== "production";
}

export function getContent(
  options: { includeDrafts?: boolean } = {},
): ContentDocument[] {
  const includeDrafts = options.includeDrafts ?? shouldIncludeDrafts();

  const documents = collections.flatMap((collection) =>
    contentFiles(
      path.join(/* turbopackIgnore: true */ contentRoot, collection),
    ).map((filePath) => parseContentFile(filePath, collection)),
  );

  const paths = new Set<string>();
  for (const document of documents) {
    const url = contentUrl(document);
    if (paths.has(url)) throw new Error(`重复的内容地址：${url}`);
    paths.add(url);
  }

  return documents
    .filter((document) => includeDrafts || !document.draft)
    .sort(
      (left, right) =>
        right.date.localeCompare(left.date) ||
        contentUrl(left).localeCompare(contentUrl(right)),
    );
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

type MarkdownNode = {
  type?: string;
  depth?: number;
  value?: string;
  children?: MarkdownNode[];
};

export type MarkdownHeading = { id: string; label: string };

function nodeText(node: MarkdownNode): string {
  if (node.value) return node.value;
  return (node.children ?? []).map(nodeText).join("");
}

function headingId(index: number) {
  return `section-${String(index + 1).padStart(2, "0")}`;
}

export async function renderMarkdown(markdown: string) {
  const parser = remark().use(remarkGfm);
  const tree = parser.parse(markdown) as MarkdownNode;
  const headings = (tree.children ?? [])
    .filter((node) => node.type === "heading" && node.depth === 2)
    .map((node, index) => ({ id: headingId(index), label: nodeText(node) }));

  const result = await remark()
    .use(remarkGfm)
    .use(remarkHtml)
    .process(markdown);
  let headingIndex = 0;
  const html = result.toString().replace(/<h2>/g, () => {
    const id = headingId(headingIndex);
    headingIndex += 1;
    return `<h2 id="${id}">`;
  });

  return { html: renderMediaLinks(html), headings };
}

export function isContentCollection(value: string): value is ContentCollection {
  return collections.includes(value as ContentCollection);
}

export function contentUrl(
  document: Pick<ContentDocument, "collection" | "slug">,
) {
  return `/${document.collection}/${document.slug}`;
}

/** Standalone Markdown links with title "audio" or "video" become accessible players.
 * Raw HTML remains sanitized by remark-html; only HTTPS media URLs are embedded.
 */
function renderMediaLinks(html: string) {
  return html.replace(
    /<p><a href="([^"<>]+)" title="(audio|video)">([^<]+)<\/a><\/p>/g,
    (original, source: string, kind: string, label: string) => {
      if (!source.startsWith("https://")) return original;
      return `<figure class="media-embed"><${kind} controls preload="metadata" aria-label="${label.replaceAll('"', "&quot;")}" style="width:100%;max-width:100%"><source src="${source}"><a href="${source}">${label}</a></${kind}><figcaption>${label} · <a href="${source}">打开媒体</a></figcaption></figure>`;
    },
  );
}

export function getContentFacets(documents: ContentDocument[]) {
  const count = (values: string[]) =>
    Array.from(new Set(values)).map((value) => ({
      value,
      count: values.filter((item) => item === value).length,
    }));
  return {
    categories: count(documents.map((document) => document.category)),
    tags: count(documents.flatMap((document) => [...new Set(document.tags)])),
    years: count(documents.map((document) => document.date.slice(0, 4))).sort(
      (a, b) => b.value.localeCompare(a.value),
    ),
  };
}

export function getRelatedContent(document: ContentDocument, limit = 3) {
  return getContent()
    .filter((candidate) => contentUrl(candidate) !== contentUrl(document))
    .map((candidate) => ({
      candidate,
      score:
        candidate.tags.filter((tag) => document.tags.includes(tag)).length * 2 +
        Number(candidate.category === document.category),
    }))
    .filter(({ score }) => score > 0)
    .sort(
      (a, b) =>
        b.score - a.score || b.candidate.date.localeCompare(a.candidate.date),
    )
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}
