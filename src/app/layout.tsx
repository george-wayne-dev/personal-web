import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";
import { StatusStrip } from "@/components/site/chrome";
import { DevRefresh } from "@/components/content/dev-refresh";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
  },
  twitter: { card: "summary" },
  robots:
    process.env.CONTENT_PREVIEW === "true" &&
    process.env.NODE_ENV !== "production"
      ? { index: false, follow: false }
      : undefined,
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      data-scroll-behavior="smooth"
      id="top"
      className="h-full antialiased"
    >
      <body className="min-h-full">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: siteConfig.name,
              url: siteConfig.url,
              description: siteConfig.description,
              sameAs: siteConfig.contacts.github
                ? [siteConfig.contacts.github]
                : [],
            }).replaceAll("<", "\\u003c"),
          }}
        />
        {process.env.NODE_ENV === "development" ? <DevRefresh /> : null}
        <StatusStrip />
        {children}
      </body>
    </html>
  );
}
