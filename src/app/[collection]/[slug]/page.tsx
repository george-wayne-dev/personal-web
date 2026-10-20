import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { EvidenceTabs } from "@/components/projects/evidence-tabs";
import {
  MobileDetailView,
  type MobileDetailSection,
} from "@/components/mobile/detail-view";
import { ResponsiveHeader, SiteFooter } from "@/components/site/chrome";
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
import { cn } from "@/lib/utils";

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
  const mobileSections = splitMobileSections(html, headings);
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

  const article = (
    <article className={cn("reading-article", `reading-${collection}`)}>
      <header className="detail-hero">
        <p className="micro-label">
          {document.code ?? meta.eyebrow} · {displayCategory(document)}
        </p>
        <h1>{document.title}</h1>
        <p className="detail-summary">{document.summary}</p>
        <div className="detail-byline">
          <time dateTime={document.date}>{displayDate(document.date)}</time>
          {document.updated ? (
            <time dateTime={document.updated}>
              更新于 {displayDate(document.updated)}
            </time>
          ) : null}
          {document.readingMinutes ? (
            <span>{document.readingMinutes} min read</span>
          ) : null}
          {document.status ? <span>{document.status}</span> : null}
          {document.draft ? <span className="draft-badge">DRAFT</span> : null}
        </div>
        <ul className="tag-list" aria-label="标签">
          {document.tags.map((tag) => (
            <li key={tag}>
              <Link href={`/${collection}?tag=${encodeURIComponent(tag)}`}>
                {tag}
              </Link>
            </li>
          ))}
        </ul>
      </header>
      {collection === "projects" ? (
        <dl className="project-facts">
          <div>
            <dt>我的角色</dt>
            <dd>{document.role ?? "设计 / 开发"}</dd>
          </div>
          <div>
            <dt>使用工具</dt>
            <dd>{document.stack ?? "持续补充"}</dd>
          </div>
          <div>
            <dt>当前阶段</dt>
            <dd>{document.state ?? document.status ?? "记录中"}</dd>
          </div>
        </dl>
      ) : null}
      <div
        className="markdown-body"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {collection === "projects" && document.evidence ? (
        <section className="detail-evidence">
          <p className="micro-label">Evidence views</p>
          <h2>把过程证据放回项目里</h2>
          <EvidenceTabs views={document.evidence} />
        </section>
      ) : null}
      {related.length ? (
        <section aria-label="相关内容">
          <h2>相关内容</h2>
          <ul>
            {related.map((item) => (
              <li key={contentUrl(item)}>
                <Link href={contentUrl(item)}>{item.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <nav className="adjacent-nav" aria-label="相邻内容">
        {newer ? (
          <Link href={contentUrl(newer)}>
            <ArrowLeft size={17} />
            <span>
              <small>更新一篇</small>
              {newer.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {older ? (
          <Link href={contentUrl(older)}>
            <span>
              <small>更早一篇</small>
              {older.title}
            </span>
            <ArrowRight size={17} />
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replaceAll("<", "\\u003c"),
        }}
      />
      <div className="desktop-only">
        <ResponsiveHeader
          mark={siteConfig.mark}
          name={siteConfig.name}
          navigation={siteConfig.navigation}
          current={`/${collection}`}
        />
        <main className="detail-page">
          <aside className="detail-rail">
            <Link className="back-link" href={`/${collection}`}>
              ← 返回{meta.label}
            </Link>
            <p className="micro-label">On this page</p>
            <nav>
              {headings.map((heading, headingIndex) => (
                <a href={`#${heading.id}`} key={heading.id}>
                  <span>{String(headingIndex + 1).padStart(2, "0")}</span>
                  {heading.label}
                </a>
              ))}
            </nav>
          </aside>
          {article}
        </main>
        <SiteFooter name={siteConfig.name} />
      </div>
      <MobileDetailView
        site={siteConfig}
        document={document}
        sections={mobileSections}
        adjacent={older ?? newer}
        related={related}
      />
    </>
  );
}

function splitMobileSections(
  html: string,
  headings: Array<{ id: string; label: string }>,
): MobileDetailSection[] {
  const introEnd = headings.length
    ? html.indexOf(`<h2 id="${headings[0].id}">`)
    : html.length;
  const introduction = html.slice(0, introEnd).trim();
  const sections = headings.map((heading, index) => {
    const headingStart = html.indexOf(`<h2 id="${heading.id}">`);
    const bodyStart = html.indexOf("</h2>", headingStart) + 5;
    const nextHeading = headings[index + 1];
    const bodyEnd = nextHeading
      ? html.indexOf(`<h2 id="${nextHeading.id}">`, bodyStart)
      : html.length;
    return {
      id: `mobile-${heading.id}`,
      label: heading.label,
      html: html
        .slice(bodyStart, bodyEnd)
        .replaceAll('href="#section-', 'href="#mobile-section-'),
    };
  });
  return [
    ...(introduction
      ? [
          {
            id: "mobile-introduction",
            label: "正文",
            html: introduction.replaceAll(
              'href="#section-',
              'href="#mobile-section-',
            ),
          },
        ]
      : []),
    ...sections,
  ];
}
