import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EvidenceTabs } from "@/components/projects/evidence-tabs";
import Image from "next/image";
import { LandscapeShell } from "@/components/site/landscape-chrome";
import { RailcodeHorizon } from "@/components/site/railcode-horizon";
import { ArticleToc } from "@/components/content/article-toc";
import {
  contentUrl,
  getCollection,
  getContent,
  getDocument,
  isContentCollection,
  renderMarkdown,
} from "@/lib/content";
import {
  collectionMeta,
  displayCategory,
  displayDate,
} from "@/lib/content/presentation";
import { siteConfig } from "@/lib/site";

type PageProps = { params: Promise<{ collection: string; slug: string }> };
type StaticParamsOptions = { params: { collection: string } };
export const dynamicParams = false;

export function generateStaticParams({ params }: StaticParamsOptions) {
  if (!isContentCollection(params.collection)) return [];
  const documents = getContent().filter(
    (document) => document.collection === params.collection,
  );
  return documents.length
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
  return document
    ? {
        title: document.title,
        description: document.summary,
        alternates: { canonical: contentUrl(document) },
        robots: document.draft ? { index: false, follow: false } : undefined,
        openGraph: {
          type: "article",
          title: document.title,
          description: document.summary,
          url: contentUrl(document),
          publishedTime: document.date,
          modifiedTime: document.updated ?? document.date,
          images: document.cover ? [document.cover] : undefined,
        },
      }
    : { title: "未找到内容" };
}

export default async function ContentPage({ params }: PageProps) {
  const { collection, slug } = await params;
  if (!isContentCollection(collection) || slug === "__placeholder__")
    notFound();
  const document = getDocument(collection, slug);
  if (!document) notFound();
  const { html, headings } = await renderMarkdown(document.body);
  const siblings = getCollection(collection);
  const index = siblings.findIndex((item) => item.slug === document.slug);
  const newer = index > 0 ? siblings[index - 1] : undefined;
  const older = index < siblings.length - 1 ? siblings[index + 1] : undefined;
  const meta = collectionMeta[collection];
  const related = getContent()
    .filter(
      (item) =>
        contentUrl(item) !== contentUrl(document) &&
        (item.category === document.category ||
          item.tags.some((tag) => document.tags.includes(tag))),
    )
    .slice(0, 3);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": collection === "projects" ? "CreativeWork" : "BlogPosting",
    headline: document.title,
    name: document.title,
    description: document.summary,
    datePublished: document.date,
    dateModified: document.updated ?? document.date,
    url: new URL(contentUrl(document), siteConfig.url).href,
    author: { "@type": "Person", name: siteConfig.name },
    ...(document.cover
      ? { image: new URL(document.cover, siteConfig.url).href }
      : {}),
  };

  const facts =
    collection === "projects"
      ? [
          ["我的角色", document.role],
          ["使用工具", document.stack],
          ["当前阶段", document.state ?? document.status],
        ].filter(([, value]) => value)
      : [];

  return (
    <LandscapeShell site={siteConfig} current={`/${collection}`} reading>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replaceAll("<", "\\u003c"),
        }}
      />
      <article className="landscape-reader" aria-labelledby="article-title">
        <header className="landscape-article-header">
          <div className="landscape-reading-column">
            <Link className="landscape-back" href={`/${collection}`}>
              ← 返回{meta.label}
            </Link>
            <h1 id="article-title">{document.title}</h1>
            <p className="landscape-article-summary">{document.summary}</p>
            <div className="landscape-reading-meta">
              <time dateTime={document.date}>{displayDate(document.date)}</time>
              {document.readingMinutes ? (
                <span>{document.readingMinutes} 分钟阅读</span>
              ) : null}
              {displayCategory(document) !== "未分类" ? (
                <span>{displayCategory(document)}</span>
              ) : null}
              {document.draft ? (
                <span className="landscape-draft">草稿预览</span>
              ) : null}
            </div>
          </div>
        </header>
        <RailcodeHorizon />
        <div className="landscape-reading-layout">
          {headings.length ? <ArticleToc headings={headings} /> : null}
          <div className="landscape-reader-body">
            {document.cover ? (
              <Image
                className="landscape-article-cover"
                src={document.cover}
                alt=""
                width={1280}
                height={720}
                sizes="(max-width: 720px) 100vw, 640px"
                unoptimized
              />
            ) : null}
            {facts.length ? (
              <dl className="landscape-project-facts">
                {facts.map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
            <div
              className="landscape-prose"
              dangerouslySetInnerHTML={{ __html: html }}
            />
            {collection === "projects" && document.evidence ? (
              <section
                className="landscape-evidence"
                aria-labelledby="evidence-title"
              >
                <h2 id="evidence-title">过程与证据</h2>
                <EvidenceTabs views={document.evidence} />
              </section>
            ) : null}
            <div className="landscape-article-end">
              <ul className="landscape-tags" aria-label="标签">
                {document.tags.map((tag) => (
                  <li key={tag}>
                    <Link
                      href={`/${collection}?tag=${encodeURIComponent(tag)}`}
                    >
                      {tag}
                    </Link>
                  </li>
                ))}
              </ul>
              {document.updated ? (
                <p className="landscape-updated">
                  更新于{" "}
                  <time dateTime={document.updated}>
                    {displayDate(document.updated)}
                  </time>
                </p>
              ) : null}
            </div>
            {related.length ? (
              <section
                className="landscape-related"
                aria-labelledby="related-title"
              >
                <h2 id="related-title">接着读</h2>
                <ul>
                  {related.map((item) => (
                    <li key={contentUrl(item)}>
                      <Link href={contentUrl(item)}>
                        {item.title}
                        <span aria-hidden="true">↗</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
            <nav className="landscape-adjacent" aria-label="相邻内容">
              {newer ? (
                <Link href={contentUrl(newer)}>
                  <small>← 更新一篇</small>
                  <span>{newer.title}</span>
                </Link>
              ) : (
                <span />
              )}
              {older ? (
                <Link href={contentUrl(older)}>
                  <small>更早一篇 →</small>
                  <span>{older.title}</span>
                </Link>
              ) : (
                <span />
              )}
            </nav>
          </div>
        </div>
      </article>
    </LandscapeShell>
  );
}
