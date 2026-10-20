"use client";
import { useEffect, useMemo, useState } from "react";
import { DesktopCollectionView } from "@/components/desktop/collection-view";
import { MobileCollectionView } from "@/components/mobile/collection-view";
import type { ContentCollection, ContentPreview } from "@/lib/content/schema";
import type { InteriorSiteConfig } from "@/components/desktop/interior-shell";
import type { CollectionFilters } from "./collection-view.types";
const empty: CollectionFilters = { kind: "", category: "", tag: "", year: "" };
export function CollectionView({
  collection,
  items,
  site,
}: {
  collection: ContentCollection;
  items: ContentPreview[];
  site: InteriorSiteConfig;
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
  const props = {
    collection,
    items,
    filteredItems,
    filters,
    site,
    onFilterChange: (key: keyof CollectionFilters, value: string) =>
      update({ ...filters, [key]: value }),
    onReset: () => update(empty),
  };
  return (
    <>
      <DesktopCollectionView {...props} />
      <MobileCollectionView {...props} />
    </>
  );
}
