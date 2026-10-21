import type { ContentCollection, ContentPreview } from "./schema";

export const collectionMeta: Record<
  ContentCollection,
  { label: string; eyebrow: string; title: string; description: string }
> = {
  projects: {
    label: "作品",
    eyebrow: "Selected work / 01",
    title: "把判断做成可以检查的东西。",
    description:
      "这里记录我正在构建的工具、实验和长期项目，也保留它们尚未解决的问题。",
  },
  essays: {
    label: "文章",
    eyebrow: "Long-form / 02",
    title: "长一点写清楚，慢一点形成判断。",
    description:
      "围绕 AI、工程、产品与学习方法的长文。按时间归档，不追逐更新频率。",
  },
};

export const kindLabels: Record<string, string> = {
  all: "全部",
  ai: "AI / Agent",
  web: "网站",
  mobile: "移动端",
  other: "其他",
  engineering: "工程",
  product: "产品",
  learning: "学习",
  design: "设计",
};

export function displayCategory(document: ContentPreview) {
  return document.kind
    ? (kindLabels[document.kind] ?? document.kind)
    : document.category;
}

export function displayDate(date: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(new Date(`${date}T00:00:00`))
    .replaceAll("/", ".");
}

export function monthKey(date: string) {
  return date.slice(0, 7);
}

export function groupBy<T>(items: T[], key: (item: T) => string) {
  return items.reduce<Record<string, T[]>>((groups, item) => {
    const value = key(item);
    groups[value] = [...(groups[value] ?? []), item];
    return groups;
  }, {});
}
