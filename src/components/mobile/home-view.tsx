import Link from "next/link";
import type { InteriorSiteConfig } from "@/components/desktop/interior-shell";
import type { HomeViewProps } from "@/components/home-view.types";
import { MobileHomeChapterBar } from "@/components/mobile/motherduck-interactions";
import { MotherDuckMobileShell } from "@/components/mobile/motherduck-shell";
import { contentUrl } from "@/lib/content";
export function MobileHomeView({
  projects,
  essays,
  notes,
  featured,
  description,
  site,
}: HomeViewProps & { site: InteriorSiteConfig }) {
  const selected = featured
    ? [
        featured,
        ...projects.filter((item) => item.slug !== featured.slug),
      ].slice(0, 3)
    : projects.slice(0, 3);
  const sections = [
    {
      id: "projects",
      label: "精选作品",
      kicker: "Selected work",
      items: selected,
    },
    {
      id: "essays",
      label: "最新文章",
      kicker: "Essays",
      items: essays.slice(0, 3),
    },
    {
      id: "notes",
      label: "最新笔记",
      kicker: "Working notes",
      items: notes.slice(0, 4),
    },
  ];
  return (
    <MotherDuckMobileShell
      site={site}
      current="/"
      statusLabel="PERSONAL NOTES"
      statusText="作品、文章与笔记"
      statusHref="#mobile-projects"
      menuMeta={site.location}
      footerMeta={site.name}
      footerSignoff="把实践留下来，让思考可以继续。"
      footerEnd="持续记录"
      backHref="/rss.xml"
      backLabel="RSS ↗"
      className="mdm-home"
    >
      <section className="mdm-hero">
        <div className="mdm-hero-meta">
          <div className="mdm-folio">
            <span className="mdm-mono">Folio</span>
            <span className="mdm-folio-number">26</span>
            <span className="mdm-mono">个人文稿</span>
          </div>
          <div className="mdm-hero-now">
            <span className="mdm-mono">Now</span>
            <p>
              <span className="mdm-live-dot" aria-hidden="true" />
              记录软件实践，也整理一路留下的问题。
            </p>
          </div>
        </div>
        <span className="mdm-eyebrow">软件开发 · 产品思考 · AI 实践</span>
        <h1>把软件做成可用的东西，也把思考写下来。</h1>
        <p className="mdm-hero-description">
          我关注网站、移动应用与 AI
          工具如何真正进入人的工作和生活。这里收录完成的作品，也保留问题形成、方案取舍与持续修正的过程。
        </p>
        <div className="mdm-hero-actions">
          <a className="mdm-button-primary" href="#mobile-projects">
            <span>浏览作品</span>
            <span>↓</span>
          </a>
          <a className="mdm-button-secondary" href="#mobile-essays">
            <span>阅读文章</span>
            <span>→</span>
          </a>
        </div>
        <div className="mdm-working-memo">
          <span>Working memo</span>
          <p>每个项目都从问题、判断和证据开始。</p>
        </div>
      </section>

      <MobileHomeChapterBar />
      {sections.map(({ id, label, kicker, items }) => (
        <section className="mdm-section" id={`mobile-${id}`} key={id}>
          <div className="mdm-section-head">
            <div>
              <span className="mdm-section-kicker">{kicker}</span>
              <h2>{label}</h2>
            </div>
            <Link href={`/${id}`}>全部 →</Link>
          </div>
          {items.length ? (
            <div className="home-live-entries">
              {items.map((item) => (
                <article className="home-live-entry" key={item.slug}>
                  <span className="mdm-entry-meta">
                    {item.category} · {item.date}
                  </span>
                  <h3>
                    <Link href={contentUrl(item)}>{item.title}</Link>
                  </h3>
                  <p>{item.summary}</p>
                  <span className="mdm-mono">{item.tags.join(" / ")}</span>
                </article>
              ))}
            </div>
          ) : (
            <p className="mdm-empty-state">
              这里还没有公开内容，后续记录会收录在这里。
            </p>
          )}
        </section>
      ))}
      <section className="mdm-section" id="mobile-about">
        <div className="mdm-section-head">
          <h2>关于</h2>
          <Link href="/about">了解更多 →</Link>
        </div>
        <p className="home-about-copy">{description}</p>
      </section>
    </MotherDuckMobileShell>
  );
}
