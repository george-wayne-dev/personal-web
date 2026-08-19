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
  <link>${siteConfig.url}${contentUrl(document)}</link>
  <guid>${siteConfig.url}${contentUrl(document)}</guid>
  <description>${escapeXml(document.summary)}</description>
  <pubDate>${new Date(document.date).toUTCString()}</pubDate>
</item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>${escapeXml(siteConfig.name)}</title>
<link>${siteConfig.url}</link>
<description>${escapeXml(siteConfig.description)}</description>
${items}
</channel></rss>`;

  return new Response(xml, {
    headers: { "content-type": "application/rss+xml; charset=utf-8" },
  });
}
