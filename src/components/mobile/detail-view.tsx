import Link from "next/link";
import type { InteriorSiteConfig } from "@/components/desktop/interior-shell";
import { MobileDetailChapterBar } from "@/components/mobile/motherduck-interactions";
import { MotherDuckMobileShell } from "@/components/mobile/motherduck-shell";
import type { ContentDocument, ContentPreview } from "@/lib/content/schema";
import { contentUrl } from "@/lib/content";

export type MobileDetailSection = { id: string; label: string; html: string };

export function MobileDetailView({
  site,
  document,
  sections,
  adjacent,
  related = [],
}: {
  site: InteriorSiteConfig;
  document: ContentDocument;
  sections: MobileDetailSection[];
  adjacent?: ContentDocument;
  related?: ContentPreview[];
}) {
  const collection = document.collection;
  const indexHref = `/${collection}`;
  const isProject = collection === "projects";
  const isEssay = collection === "essays";
  const collectionLabel = isProject ? "作品" : "文章";
  const statusLabel = `${isProject ? "PROJECT CASE" : "ESSAY"} ${document.code?.replace(/\D/g, "") || ""}`;
  const statusText = isProject
    ? (document.status ?? "In progress")
    : `${document.readingMinutes ?? 8} min read`;
  const code = document.code?.replace(" / ", ".") ?? collectionLabel;
  const displaySections = sections;
  const footerLead = isProject ? "Project case" : "Essay";
  const footerSignoff = isProject
    ? "案例保留过程证据，也保留尚未解决的问题。"
    : "一篇文章只解决一个值得重新使用的判断。";

  return (
    <MotherDuckMobileShell
      site={site}
      current={indexHref}
      statusLabel={statusLabel}
      statusText={statusText}
      statusHref={indexHref}
      statusArrow="←"
      menuMeta={footerLead}
      footerMeta={`${footerLead} · ${code}`}
      footerSignoff={footerSignoff}
      footerEnd={
        isEssay
          ? `${document.readingMinutes ?? 8} MIN`
          : formatDate(document.updated ?? document.date).slice(0, 7)
      }
      backHref={indexHref}
      backLabel={`← ${collectionLabel}索引`}
      className="mdm-detail-page"
    >
      <section className="mdm-detail-hero">
        <div className="mdm-detail-code">
          <strong>{code}</strong>
          <span>
            {isProject && document.evidence
              ? `${document.evidence.length.toString().padStart(2, "0")} evidence views`
              : formatDate(document.date)}
          </span>
        </div>
        <span className="mdm-detail-kicker">
          {`${document.category} / ${document.kind ?? collection} / ${document.status ?? (isEssay ? "Writing" : "Published")}`}
        </span>
        <h1>{document.title}</h1>
        {document.draft ? <span className="draft-badge">草稿预览</span> : null}
        <p>{document.summary}</p>
        <div className="mdm-detail-meta-row">
          <ul>
            {document.tags.map((tag) => (
              <li key={tag}>
                <Link href={`${indexHref}?tag=${encodeURIComponent(tag)}`}>
                  {tag}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mdm-detail-stat">
            <strong>
              {isEssay
                ? (document.readingMinutes ?? 8)
                : formatDate(document.updated ?? document.date).slice(0, 7)}
            </strong>
            <span>{isEssay ? "Min read" : "Updated"}</span>
          </div>
        </div>
      </section>

      <MobileDetailChapterBar
        indexHref={indexHref}
        headings={displaySections.map(({ id, label }) => ({ id, label }))}
      />

      <article className="mdm-detail-article">
        {displaySections.map((section, index) => (
          <section id={section.id} key={section.id}>
            <div className="mdm-detail-section-head">
              <span>
                {String(index + 1).padStart(2, "0")} /{" "}
                {String(displaySections.length).padStart(2, "0")}
              </span>
              <h2>{section.label}</h2>
            </div>
            <div
              className="mdm-detail-prose"
              dangerouslySetInnerHTML={{ __html: section.html }}
            />
          </section>
        ))}
        {isProject && document.evidence ? (
          <section aria-label="项目证据">
            <h2>项目证据</h2>
            {document.evidence.map((view) => (
              <div className="mdm-project-evidence" key={view.id}>
                <h3>{view.title}</h3>
                {view.summary ? <p>{view.summary}</p> : null}
                <dl>
                  {view.items.map((item) => (
                    <div key={item.label}>
                      <dt>{item.label}</dt>
                      <dd>{item.text}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
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
      </article>

      <nav
        className="mdm-detail-pagination"
        aria-label={`相邻${collectionLabel}`}
      >
        <Link href={indexHref}>
          <span>← 返回</span>
          <strong>浏览全部{collectionLabel}</strong>
        </Link>
        {adjacent ? (
          <Link href={contentUrl(adjacent)}>
            <span>
              Next {isProject ? "case" : isEssay ? "essay" : "note"} →
            </span>
            <strong>{adjacent.title}</strong>
          </Link>
        ) : (
          <Link href={indexHref}>
            <span>Next →</span>
            <strong>返回{collectionLabel}索引</strong>
          </Link>
        )}
      </nav>
    </MotherDuckMobileShell>
  );
}

function formatDate(date: string) {
  return date.replaceAll("-", ".");
}
