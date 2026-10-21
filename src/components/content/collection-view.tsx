"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { ContentCollection, ContentPreview } from "@/lib/content/schema";
import { contentUrl } from "@/lib/content/urls";
import { collectionMeta } from "@/lib/content/presentation";
import type { CollectionFilters } from "./collection-view.types";
import { CollectionFilterControls } from "./collection-filters";
import { ContentMeta } from "./content-meta";
import { RailcodeHorizon } from "@/components/site/railcode-horizon";

const empty: CollectionFilters = { kind: "", category: "", tag: "", year: "" };

export function CollectionView({
  collection,
  items,
}: {
  collection: ContentCollection;
  items: ContentPreview[];
}) {
  const [filters, setFilters] = useState<CollectionFilters>(empty);
  useEffect(() => {
    const read = () => {
      const params = new URLSearchParams(window.location.search);
      setFilters({
        kind: params.get("kind") ?? "",
        category: params.get("category") ?? "",
        tag: params.get("tag") ?? "",
        year: params.get("year") ?? "",
      });
    };
    read();
    window.addEventListener("popstate", read);
    return () => window.removeEventListener("popstate", read);
  }, []);

  const update = (next: CollectionFilters) => {
    setFilters(next);
    const url = new URL(window.location.href);
    for (const key of Object.keys(empty) as Array<keyof CollectionFilters>) {
      if (next[key]) url.searchParams.set(key, next[key]);
      else url.searchParams.delete(key);
    }
    window.history.pushState(null, "", url);
  };
  const filteredItems = useMemo(
    () =>
      items.filter(
        (item) =>
          (!filters.kind || item.kind === filters.kind) &&
          (!filters.category || item.category === filters.category) &&
          (!filters.tag || item.tags.includes(filters.tag)) &&
          (!filters.year || item.date.startsWith(filters.year)),
      ),
    [filters, items],
  );
  const meta = collectionMeta[collection];
  const filtering = Object.values(filters).some(Boolean);
  const featured = items.find((item) => item.featured) ?? items[0];
  const entries = filtering
    ? filteredItems
    : filteredItems.filter((item) => item.slug !== featured?.slug);

  return (
    <>
      <header className="landscape-journal-hero">
        <div className="landscape-container landscape-journal-wrap">
          <div className="landscape-journal-masthead">
            <h1>{meta.label}</h1>
            <p>
              {collection === "projects"
                ? "做过的工具、实验，以及还在生长的想法。"
                : "关于软件、AI 与日常实践的记录。"}
            </p>
          </div>
          {featured && !filtering ? (
            <article className="landscape-featured-entry">
              <Link href={contentUrl(featured)}>
                <ContentMeta item={featured} />
                <h2>
                  {featured.title}
                  <span aria-hidden="true"> ↗</span>
                </h2>
                <p>{featured.summary}</p>
              </Link>
            </article>
          ) : null}
        </div>
      </header>
      <RailcodeHorizon />
      <section
        className="landscape-container landscape-journal-wrap landscape-index"
        aria-label={`${meta.label}列表`}
      >
        <div className="landscape-index-heading">
          <h2>
            {filtering
              ? "筛选结果"
              : featured
                ? collection === "projects"
                  ? "更多作品"
                  : "更多文章"
                : meta.label}
          </h2>
        </div>
        {items.length ? (
          <CollectionFilterControls
            collection={collection}
            items={items}
            filteredItems={filtering ? filteredItems : entries}
            filters={filters}
            onFilterChange={(key, value) =>
              update({ ...filters, [key]: value })
            }
            onReset={() => update(empty)}
          />
        ) : null}
        {!entries.length ? (
          <div className="landscape-index-empty" role="status">
            <h3>
              {filtering
                ? "没有找到对应的内容"
                : featured
                  ? "更多内容，陆续更新"
                  : `${meta.label}整理中`}
            </h3>
            <p>
              {filtering
                ? "试试其他条件，或清除筛选查看全部。"
                : "新的记录会陆续放在这里。"}
            </p>
          </div>
        ) : (
          <div className="landscape-editorial-list">
            {entries.map((item) => (
              <article className="landscape-editorial-entry" key={item.slug}>
                <Link href={contentUrl(item)}>
                  <ContentMeta item={item} />
                  <div className="landscape-entry-copy">
                    <h3>
                      {item.title}
                      <span aria-hidden="true"> ↗</span>
                    </h3>
                    <p>{item.summary}</p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
