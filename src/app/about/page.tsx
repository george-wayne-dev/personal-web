import type { Metadata } from "next";
import { DesktopAboutView } from "@/components/desktop/about-view";
import { MobileAboutView } from "@/components/mobile/about-view";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "关于",
  description: siteConfig.description,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <DesktopAboutView />
      <MobileAboutView
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
