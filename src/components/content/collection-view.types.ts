import type { ContentCollection, ContentPreview } from "@/lib/content/schema";
export type CollectionFilters = {
  kind: string;
  category: string;
  tag: string;
  year: string;
};
export type CollectionFilterProps = {
  collection: ContentCollection;
  items: ContentPreview[];
  filteredItems: ContentPreview[];
  filters: CollectionFilters;
  onFilterChange: (key: keyof CollectionFilters, value: string) => void;
  onReset: () => void;
};
