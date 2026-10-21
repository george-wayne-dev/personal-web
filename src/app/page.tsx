import type { Metadata } from "next";
import { HomeView } from "@/components/home/home-view";
import { getContent } from "@/lib/content";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Home() {
  const content = getContent();
  const projects = content.filter((item) => item.collection === "projects");
  const essays = content.filter((item) => item.collection === "essays");
  const featured = projects.find((item) => item.featured) ?? projects[0];
  const viewProps = {
    projects,
    essays,
    featured,
  };

  return <HomeView {...viewProps} />;
}
