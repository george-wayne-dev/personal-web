import type { ContentPreview } from "@/lib/content/schema";
import { displayCategory, displayDate } from "@/lib/content/presentation";

export function ContentMeta({ item }: { item: ContentPreview }) {
  const category = displayCategory(item);
  return (
    <div className="landscape-entry-meta">
      {category !== "未分类" ? (
        <span className="landscape-entry-category">{category}</span>
      ) : null}
      <time dateTime={item.date}>{displayDate(item.date)}</time>
      {item.collection === "essays" && item.readingMinutes ? (
        <span>{item.readingMinutes} 分钟阅读</span>
      ) : null}
      {item.collection === "projects" && (item.state || item.status) ? (
        <span>{item.state || item.status}</span>
      ) : null}
    </div>
  );
}
