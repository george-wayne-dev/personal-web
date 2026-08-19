import { collections } from "@/lib/content/schema";

export const dynamicParams = false;

export function generateStaticParams() {
  return collections.map((collection) => ({ collection }));
}

export default function CollectionLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
