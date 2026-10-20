import { contentUrl, getContent } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-static";

function escapeXml(value: string) {
  return value.replace(
    /[<>&'\"]/g,
    (character) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        "'": "&apos;",
        '"': "&quot;",
      })[character] ?? character,
  );
}

export function GET() {
  const items = getContent({ includeDrafts: false })
    .map(
      (document) => `<item>
  <title>${escapeXml(document.title)}</title>
  <link>${escapeXml(`${siteConfig.url}${contentUrl(document)}`)}</link>
  <guid isPermaLink="true">${escapeXml(`${siteConfig.url}${contentUrl(document)}`)}</guid>
  <description>${escapeXml(document.summary)}</description>
  <category>${escapeXml(document.category)}</category>
  <pubDate>${new Date(document.date).toUTCString()}</pubDate>
</item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>
<title>${escapeXml(siteConfig.name)}</title>
<link>${escapeXml(siteConfig.url)}</link>
<language>zh-CN</language>
<atom:link href="${escapeXml(`${siteConfig.url}/rss.xml`)}" rel="self" type="application/rss+xml"/>
<description>${escapeXml(siteConfig.description)}</description>
${items}
</channel></rss>`;

  return new Response(xml, {
    headers: { "content-type": "application/rss+xml; charset=utf-8" },
  });
}
