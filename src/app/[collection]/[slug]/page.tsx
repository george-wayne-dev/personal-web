import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  contentUrl,
  getContent,
  getDocument,
  isContentCollection,
  renderMarkdown,
} from "@/lib/content";

type PageProps = { params: Promise<{ collection: string; slug: string }> };
type StaticParamsOptions = { params: { collection: string } };

export const dynamicParams = false;

export function generateStaticParams({ params }: StaticParamsOptions) {
  if (!isContentCollection(params.collection)) return [];

  const documents = getContent({ includeDrafts: false }).filter(
    (document) => document.collection === params.collection,
  );

  // A placeholder keeps the static-export route valid before the first public
  // document exists. The page immediately resolves it to a 404.
  return documents.length > 0
    ? documents.map((document) => ({ slug: document.slug }))
    : [{ slug: "__placeholder__" }];
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { collection, slug } = await params;
  const document = isContentCollection(collection)
    ? getDocument(collection, slug)
    : undefined;

  if (!document) return { title: "未找到内容" };

  return {
    title: document.title,
    description: document.summary,
    alternates: { canonical: contentUrl(document) },
  };
}

export default async function ContentPage({ params }: PageProps) {
  const { collection, slug } = await params;
  if (!isContentCollection(collection)) notFound();
  if (slug === "__placeholder__") notFound();

  const document = getDocument(collection, slug);
  if (!document) notFound();

  const html = await renderMarkdown(document.body);

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16 sm:px-10">
      <Link className="text-sm underline" href={`/${document.collection}`}>
        返回
        {document.collection === "projects"
          ? "作品"
          : document.collection === "essays"
            ? "文章"
            : "笔记"}
      </Link>
      <article className="mt-10">
        <p className="text-sm text-[var(--quiet)]">
          {document.date} · {document.category}
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          {document.title}
        </h1>
        <p className="mt-5 text-lg leading-8 text-[var(--quiet)]">
          {document.summary}
        </p>
        <ul className="mt-6 flex flex-wrap gap-2" aria-label="标签">
          {document.tags.map((tag) => (
            <li
              className="rounded-full border border-black/15 px-3 py-1 text-sm"
              key={tag}
            >
              {tag}
            </li>
          ))}
        </ul>
        <div
          className="prose prose-slate mt-12 max-w-none"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>
    </main>
  );
}
