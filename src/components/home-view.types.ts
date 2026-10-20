import type { ContentPreview } from "@/lib/content/schema";

export type HomeViewProps = {
  projects: ContentPreview[];
  essays: ContentPreview[];
  notes: ContentPreview[];
  featured?: ContentPreview;
  description: string;
};
