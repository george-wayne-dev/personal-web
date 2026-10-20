import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionView } from "@/components/content/collection-view";
import { getCollection, isContentCollection } from "@/lib/content";
import { collectionMeta } from "@/lib/content/presentation";
import { siteConfig } from "@/lib/site";

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
    <>
      <CollectionView
        collection={collection}
        items={items}
        site={{
          mark: siteConfig.mark,
          name: siteConfig.name,
          location: siteConfig.location,
          navigation: siteConfig.navigation,
        }}
      />
    </>
  );
}
