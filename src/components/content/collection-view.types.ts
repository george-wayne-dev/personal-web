import type { ContentCollection, ContentPreview } from "@/lib/content/schema";
import type { InteriorSiteConfig } from "@/components/desktop/interior-shell";
export type CollectionFilters = {
  kind: string;
  category: string;
  tag: string;
  year: string;
};
export type CollectionDeviceViewProps = {
  collection: ContentCollection;
  items: ContentPreview[];
  filteredItems: ContentPreview[];
  filters: CollectionFilters;
  onFilterChange: (key: keyof CollectionFilters, value: string) => void;
  onReset: () => void;
  site: InteriorSiteConfig;
};
