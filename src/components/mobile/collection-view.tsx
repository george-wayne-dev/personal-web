import Link from "next/link";
import { contentUrl } from "@/components/content/collection-parts";
import type { CollectionDeviceViewProps } from "@/components/content/collection-view.types";
import { CollectionFilterControls } from "@/components/content/collection-filters";
import { MotherDuckMobileShell } from "@/components/mobile/motherduck-shell";
import { collectionMeta, groupBy } from "@/lib/content/presentation";
export function MobileCollectionView(props: CollectionDeviceViewProps) {
  const { collection, items, filteredItems, site } = props;
  const meta = collectionMeta[collection];
  const groups = groupBy(filteredItems, (item) => item.date.slice(0, 4));
  return (
    <MotherDuckMobileShell
      site={site}
      current={`/${collection}`}
      statusLabel={meta.label}
      statusText={`${items.length} 条内容`}
      statusHref="#mobile-collection-index"
      menuMeta={meta.label}
      footerMeta={meta.label}
      footerSignoff="留下实践，也留下尚未解决的问题。"
      footerEnd={`${items.length} 条记录`}
      className={`mdm-${collection}-page`}
    >
      <section className="mdm-interior-hero">
        <span className="mdm-section-kicker">{meta.eyebrow}</span>
        <h1>{meta.title}</h1>
        <p>{meta.description}</p>
      </section>
      <section className="mdm-interior-content" id="mobile-collection-index">
        <CollectionFilterControls {...props} />
        {!filteredItems.length ? (
          <p className="mdm-empty-state">
            {items.length
              ? "没有符合筛选条件的内容。清除筛选可查看全部记录。"
              : "这里还没有公开内容，之后的作品与记录会收录在这里。"}
          </p>
        ) : (
          Object.entries(groups)
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([year, entries]) => (
              <section className="mdm-archive-block" key={year}>
                <div className="mdm-archive-mark">
                  <strong>{year}</strong>
                  <span className="mdm-mono">{entries.length} 条</span>
                </div>
                <ul>
                  {entries.map((item) => (
                    <li key={item.slug}>
                      <Link href={contentUrl(item)}>
                        <span className="mdm-entry-meta">
                          {item.category} ·{" "}
                          {item.status ?? item.tags.join(" / ")}
                        </span>
                        <h2>{item.title}</h2>
                        <p>{item.summary}</p>
                        <time dateTime={item.date}>
                          {item.date}
                          {item.readingMinutes
                            ? ` · ${item.readingMinutes} 分钟`
                            : ""}
                        </time>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))
        )}
      </section>
    </MotherDuckMobileShell>
  );
}
