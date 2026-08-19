export const siteConfig = {
  name: "个人网站",
  description: "作品、文章与笔记。",
  // Replace this before the first public deployment. It is used for canonical
  // URLs, sitemap entries, and feed links during the static build.
  url: "https://example.com",
  navigation: [
    { href: "/projects", label: "作品" },
    { href: "/essays", label: "文章" },
    { href: "/notes", label: "笔记" },
    { href: "/about", label: "关于" },
  ],
} as const;
