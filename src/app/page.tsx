import type { Metadata } from "next";
import { DesktopHomeView } from "@/components/desktop/home-view";
import { MobileHomeView } from "@/components/mobile/home-view";
import { getContent } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Home() {
  const content = getContent();
  const projects = content.filter((item) => item.collection === "projects");
  const essays = content.filter((item) => item.collection === "essays");
  const notes = content.filter((item) => item.collection === "notes");
  const featured = projects.find((item) => item.featured) ?? projects[0];
  const viewProps = {
    projects,
    essays,
    notes,
    featured,
    description: siteConfig.description,
  };

  return (
    <>
      <DesktopHomeView {...viewProps} />
      <MobileHomeView
        {...viewProps}
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
