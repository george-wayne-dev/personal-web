import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";
import { DevRefresh } from "@/components/content/dev-refresh";
import "./globals.css";

const homeTitle = `${siteConfig.name} | 一个人 + AI，从需求到上线做产品`;

const authorId = `${siteConfig.url}/#author`;
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
      description: siteConfig.description,
      inLanguage: "zh-CN",
      author: { "@id": authorId },
    },
    {
      "@type": "Person",
      "@id": authorId,
      name: siteConfig.author,
      url: `${siteConfig.url}/about`,
      sameAs: [siteConfig.contacts.github, siteConfig.contacts.x].filter(
        Boolean,
      ),
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: homeTitle,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: siteConfig.name,
    title: homeTitle,
    description: siteConfig.description,
  },
  twitter: { card: "summary_large_image" },
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
      <head>
        {/* Not in metadata: a page's alternates replace the layout's entirely. */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title={siteConfig.name}
          href={siteConfig.contacts.rss || "/rss.xml"}
        />
      </head>
      <body className="min-h-full">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replaceAll("<", "\\u003c"),
          }}
        />
        {process.env.NODE_ENV === "development" ? <DevRefresh /> : null}
        {children}
      </body>
    </html>
  );
}
