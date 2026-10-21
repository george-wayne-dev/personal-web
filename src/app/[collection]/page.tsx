import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionView } from "@/components/content/collection-view";
import { getCollection, isContentCollection } from "@/lib/content";
import { collectionMeta } from "@/lib/content/presentation";
import { siteConfig } from "@/lib/site";
import { LandscapeShell } from "@/components/site/landscape-chrome";

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
  const items = getCollection(collection).map(({ body, ...item }) => {
    void body;
    return item;
  });

  return (
    <LandscapeShell site={siteConfig} current={`/${collection}`}>
      <CollectionView collection={collection} items={items} />
    </LandscapeShell>
  );
}
