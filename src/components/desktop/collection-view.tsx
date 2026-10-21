import Link from "next/link";
import { contentUrl } from "@/components/content/collection-parts";
import type { CollectionDeviceViewProps } from "@/components/content/collection-view.types";
import { CollectionFilterControls } from "@/components/content/collection-filters";
import { InteriorShell } from "@/components/desktop/interior-shell";
import { collectionMeta, groupBy } from "@/lib/content/presentation";
export function DesktopCollectionView(props: CollectionDeviceViewProps) {
  const { collection, items, filteredItems, site } = props;
  const meta = collectionMeta[collection];
  const groups = groupBy(filteredItems, (item) => item.date.slice(0, 4));
  return (
    <InteriorShell
      site={site}
      current={`/${collection}`}
      statusLabel={meta.eyebrow}
      statusText={`${items.length} 条内容`}
      statusHref="#collection-index"
      footerRail={meta.label}
      footerSignoff="留下实践，也留下尚未解决的问题。"
      footerMeta={`${items.length} entries`}
    >
      <section className="interior-hero" data-interior-sticky-trigger>
        <div className="motherduck-page-grid">
          <aside className="motherduck-rail interior-hero-rail">
            <span className="rail-label">{meta.label}</span>
            <p className="interior-rail-copy">
              按时间浏览，也可以从分类和标签进入。
            </p>
          </aside>
          <div className="interior-hero-main">
            <span className="eyebrow">{meta.eyebrow}</span>
            <h1 className="interior-page-title">{meta.title}</h1>
            <div className="interior-intro-foot">
              <p className="interior-intro-copy">{meta.description}</p>
              <span className="interior-count">
                <strong>{String(items.length).padStart(2, "0")}</strong>
                <span>条记录</span>
              </span>
            </div>
          </div>
        </div>
      </section>
      <section className="interior-section" id="collection-index">
        <div className="motherduck-page-grid">
          <aside className="motherduck-rail section-rail">
            <span className="section-kicker">Browse</span>
            <span className="section-number">索引</span>
          </aside>
          <div className="interior-section-main">
            <CollectionFilterControls {...props} />
            {!filteredItems.length ? (
              <p className="interior-empty-state">
                {items.length
                  ? "没有符合筛选条件的内容。清除筛选可查看全部记录。"
                  : "这里还没有公开内容，之后的作品与记录会收录在这里。"}
              </p>
            ) : collection === "projects" ? (
              <ul className="interior-project-grid">
                {filteredItems.map((item) => (
                  <li className="interior-project-card" key={item.slug}>
                    <Link href={contentUrl(item)}>
                      <span className="project-meta">
                        {item.category} · {item.status ?? "项目记录"}
                      </span>
                      <h2>{item.title}</h2>
                      <p>{item.summary}</p>
                      <div className="card-foot">
                        <span className="mono">{item.tags.join(" / ")}</span>
                        <span aria-hidden="true">↗</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              Object.entries(groups)
                .sort(([a], [b]) => b.localeCompare(a))
                .map(([year, entries]) => (
                  <section className="archive-block" key={year}>
                    <div className="archive-mark">
                      <strong>{year}</strong>
                      <span className="mono">{entries.length} 条</span>
                    </div>
                    <ul className="interior-essay-list">
                      {entries.map((item) => (
                        <li className="interior-essay-item" key={item.slug}>
                          <div>
                            <span className="entry-meta">
                              {item.category} · {item.tags.join(" / ")}
                            </span>
                            <h2>
                              <Link
                                className="detail-index-link"
                                href={contentUrl(item)}
                              >
                                {item.title}
                              </Link>
                            </h2>
                            <p>{item.summary}</p>
                          </div>
                          <time dateTime={item.date}>
                            {item.date}
                            {item.readingMinutes
                              ? ` · ${item.readingMinutes} 分钟`
                              : ""}
                          </time>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))
            )}
          </div>
        </div>
      </section>
    </InteriorShell>
  );
}
