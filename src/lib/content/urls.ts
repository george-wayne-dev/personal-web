import type { ContentDocument } from "./schema";

export function contentUrl(
  document: Pick<ContentDocument, "collection" | "slug">,
) {
  return `/${document.collection}/${document.slug}`;
}
