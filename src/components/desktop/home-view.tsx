import Link from "next/link";
import { DesktopChapterBar } from "@/components/desktop/home-interactions";
import type { HomeViewProps } from "@/components/home-view.types";
import { contentUrl } from "@/lib/content";
import { siteConfig } from "@/lib/site";
export function DesktopHomeView({
  projects,
  essays,
  notes,
  featured,
}: HomeViewProps) {
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
    <div className="desktop-only motherduck-home" id="top">
      <div className="motherduck-site-shell">
        <a className="skip-link" href="#main-content">
          跳到正文
        </a>
        <a className="motherduck-status-strip" href="#projects">
          <strong>NOW BUILDING</strong>
          <span>作品、文章与持续更新的笔记</span>
          <span className="status-arrow" aria-hidden="true">
            →
          </span>
        </a>

        <header className="motherduck-site-header">
          <Link
            className="motherduck-identity"
            href="#top"
            aria-label="返回首页顶部"
          >
            <span className="identity-mark">{siteConfig.mark}</span>
            <span className="identity-copy">
              <span className="identity-name">{siteConfig.name}</span>
              <span className="identity-note">Software &amp; Field Notes</span>
            </span>
          </Link>
          <span className="edition">Edition 2026 · {siteConfig.location}</span>
          <nav className="motherduck-site-nav" aria-label="主导航">
            {siteConfig.navigation.map((item) => (
              <Link
                className="motherduck-nav-link"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>

        <main id="main-content" tabIndex={-1}>
          <section
            className="motherduck-hero"
            id="top-content"
            aria-labelledby="hero-title"
          >
            <div className="motherduck-page-grid">
              <aside
                className="motherduck-rail hero-rail"
                aria-label="当前状态与首页目录"
              >
                <div className="folio">
                  <span className="rail-label">Folio</span>
                  <span className="folio-number">
                    26<small>个人文稿</small>
                  </span>
                </div>
                <div className="rail-status">
                  <span className="rail-label">Now</span>
                  <p>
                    <span className="live-dot" aria-hidden="true" />
                    记录软件实践，也整理一路留下的问题。
                  </p>
                </div>
                <nav className="rail-nav" aria-label="首页章节导航">
                  <a href="#top" aria-current="true">
                    <span>00</span>
                    <span>现在</span>
                  </a>
                  <a href="#projects">
                    <span>01</span>
                    <span>作品</span>
                  </a>
                  <a href="#essays">
                    <span>02</span>
                    <span>文章</span>
                  </a>
                  <a href="#notes">
                    <span>03</span>
                    <span>笔记</span>
                  </a>
                  <a href="#about">
                    <span>04</span>
                    <span>关于</span>
                  </a>
                </nav>
              </aside>

              <div className="motherduck-hero-main">
                <span className="eyebrow">软件开发 · 产品思考 · AI 实践</span>
                <h1 className="motherduck-hero-title" id="hero-title">
                  把软件做成可用的东西，
                  <span className="indent">也把思考写下来。</span>
                </h1>
                <div className="motherduck-hero-bottom">
                  <p className="motherduck-hero-description">
                    我关注网站、移动应用与 AI
                    工具如何真正进入人的工作和生活。这里收录完成的作品，也保留问题形成、方案取舍与持续修正的过程。
                  </p>
                  <div className="motherduck-hero-actions">
                    <a className="motherduck-button-primary" href="#projects">
                      <span>浏览作品</span>
                      <span aria-hidden="true">↘</span>
                    </a>
                    <a className="motherduck-button-secondary" href="#essays">
                      <span>阅读文章</span>
                      <span aria-hidden="true">→</span>
                    </a>
                  </div>
                </div>
                <div
                  className="motherduck-working-memo"
                  aria-label="当前工作便签"
                >
                  <span className="working-memo-label">Working memo</span>
                  <p>每个项目都从问题、判断和证据开始。</p>
                  <a href="#projects">查看实践 ↘</a>
                </div>
              </div>
            </div>
          </section>

          <DesktopChapterBar />

          {sections.map(({ id, label, kicker, items }, index) => (
            <section className="motherduck-content-section" id={id} key={id}>
              <div className="motherduck-page-grid">
                <aside className="motherduck-rail section-rail">
                  <span className="section-kicker">{kicker}</span>
                  <span className="section-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </aside>
                <div className="motherduck-section-main">
                  <div className="motherduck-section-head">
                    <h2 className="motherduck-section-title">{label}</h2>
                    <Link className="motherduck-section-link" href={`/${id}`}>
                      全部 →
                    </Link>
                  </div>
                  {items.length ? (
                    <div
                      className={
                        id === "projects"
                          ? "home-live-projects"
                          : "home-live-entries"
                      }
                    >
                      {items.map((item, index) => (
                        <article
                          className={
                            id === "projects" && index === 0
                              ? "home-live-featured"
                              : "home-live-entry"
                          }
                          key={item.slug}
                        >
                          <div>
                            <span className="project-meta">
                              {item.category} · {item.status ?? item.date}
                            </span>
                            <h3>
                              <Link href={contentUrl(item)}>{item.title}</Link>
                            </h3>
                            <p>{item.summary}</p>
                            <span className="entry-meta">
                              {item.tags.join(" / ")}
                            </span>
                          </div>
                          <Link
                            className="project-open"
                            href={contentUrl(item)}
                          >
                            阅读{id === "projects" ? "案例" : "全文"}{" "}
                            <span aria-hidden="true">→</span>
                          </Link>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <p className="interior-empty-state">
                      这里还没有公开内容，后续记录会收录在这里。
                    </p>
                  )}
                </div>
              </div>
            </section>
          ))}
          <section className="motherduck-content-section" id="about">
            <div className="motherduck-page-grid">
              <aside className="motherduck-rail section-rail">
                <span className="section-kicker">About</span>
                <span className="section-number">04</span>
              </aside>
              <div className="motherduck-section-main">
                <h2 className="motherduck-section-title">
                  关于这个人，也关于这个网站。
                </h2>
                <p className="home-about-copy">{siteConfig.description}</p>
                <Link className="motherduck-section-link" href="/about">
                  关于与联系 →
                </Link>
              </div>
            </div>
          </section>
        </main>
        <footer className="motherduck-footer">
          <div className="footer-rail">
            <span className="footer-meta">{siteConfig.name}</span>
          </div>
          <div className="footer-main">
            <p className="footer-signoff">把实践留下来，让思考可以继续。</p>
            <Link href="/rss.xml">RSS ↗</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
