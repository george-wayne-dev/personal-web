import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ContentCollection } from "@/lib/content/schema";
import { contentUrl, getCollection, isContentCollection } from "@/lib/content";

const labels: Record<ContentCollection, string> = {
  projects: "作品",
  essays: "文章",
  notes: "笔记",
};

type PageProps = { params: Promise<{ collection: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { collection } = await params;
  return {
    title: isContentCollection(collection) ? labels[collection] : "未找到内容",
  };
}

export default async function CollectionPage({ params }: PageProps) {
  const { collection } = await params;
  if (!isContentCollection(collection)) notFound();

  const items = getCollection(collection);

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16 sm:px-10">
      <Link className="text-sm underline" href="/">
        返回首页
      </Link>
      <h1 className="mt-8 text-4xl font-semibold tracking-tight">
        {labels[collection]}
      </h1>
      <p className="mt-3 text-[var(--quiet)]">按时间倒序排列的公开内容。</p>
      {items.length > 0 ? (
        <ul className="mt-10 divide-y divide-black/10 border-y border-black/10">
          {items.map((item) => (
            <li className="py-6" key={item.slug}>
              <Link className="block hover:opacity-70" href={contentUrl(item)}>
                <p className="text-sm text-[var(--quiet)]">
                  {item.date} · {item.category}
                </p>
                <h2 className="mt-1 text-2xl font-medium">{item.title}</h2>
                <p className="mt-2 leading-7 text-[var(--quiet)]">
                  {item.summary}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-10 rounded-lg border border-dashed border-black/15 bg-[var(--surface)] p-6 text-[var(--quiet)]">
          暂无公开内容。
        </p>
      )}
    </main>
  );
}
