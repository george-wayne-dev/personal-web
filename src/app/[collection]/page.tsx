import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionView } from "@/components/content/collection-view";
import { getCollection, isContentCollection } from "@/lib/content";
import { collectionMeta } from "@/lib/content/presentation";
import { siteConfig } from "@/lib/site";
import { LandscapeShell } from "@/components/site/landscape-chrome";
import { SubscribeBlock } from "@/components/site/subscribe-block";

type PageProps = { params: Promise<{ collection: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { collection } = await params;
  return {
    alternates: { canonical: `/${collection}` },
    description: isContentCollection(collection)
      ? collectionMeta[collection].description
      : undefined,
    title: isContentCollection(collection)
      ? collectionMeta[collection].label
      : "未找到内容",
  };
}

export default async function CollectionPage({ params }: PageProps) {
  const { collection } = await params;
  if (!isContentCollection(collection)) notFound();
  // 这些数据会发到浏览器。reviews 可能指向还没发布的文章，不能带上。
  const items = getCollection(collection).map(({ body, reviews, ...item }) => {
    void body;
    void reviews;
    return item;
  });

  return (
    <LandscapeShell site={siteConfig} current={`/${collection}`}>
      <CollectionView
        collection={collection}
        items={items}
        subscribe={
          <SubscribeBlock
            subscribe={siteConfig.subscribe}
            rss={siteConfig.contacts.rss}
            heading="h3"
          />
        }
      />
    </LandscapeShell>
  );
}
