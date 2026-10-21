import type { ContentPreview } from "@/lib/content/schema";

export type HomeViewProps = {
  projects: ContentPreview[];
  essays: ContentPreview[];
  featured?: ContentPreview;
  description: string;
};
