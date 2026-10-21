import fs from "node:fs";
import path from "node:path";
import { z } from "zod";

const siteFileSchema = z.object({
  name: z.string().min(1),
  mark: z.string().min(1),
  description: z.string().min(1),
  url: z.union([
    z.literal(""),
    z
      .url()
      .refine((value) => /^https?:\/\//.test(value), "网站地址须为 HTTP(S)"),
  ]),
  location: z.string().min(1),
  contacts: z.object({
    email: z.union([
      z.literal(""),
      z.email(),
      z.string().regex(/^mailto:[^\s]+$/),
    ]),
    github: z.union([
      z.literal(""),
      z.url().refine((value) => /^https?:\/\//.test(value)),
    ]),
    rss: z.union([
      z.literal(""),
      z.literal("/rss.xml"),
      z.url().refine((value) => /^https?:\/\//.test(value)),
    ]),
  }),
});

const defaults = {
  name: "个人文稿",
  mark: "M·Z",
  description: "作品与文章。",
  url: "https://example.com",
  location: "Shanghai",
  contacts: { email: "", github: "", rss: "" },
};

function loadSiteFile() {
  const configuredPath = process.env.SITE_CONFIG_PATH;
  const inferredPath = process.env.CONTENT_ROOT
    ? path.join(
        path.dirname(
          path.resolve(/* turbopackIgnore: true */ process.env.CONTENT_ROOT),
        ),
        "site.json",
      )
    : undefined;
  const filePath = configuredPath ?? inferredPath;
  if (!filePath) return defaults;
  if (!fs.existsSync(filePath)) throw new Error(`网站配置不存在：${filePath}`);

  const result = siteFileSchema.safeParse(
    JSON.parse(fs.readFileSync(filePath, "utf8")),
  );
  if (!result.success) {
    throw new Error(`无效的网站配置：${filePath}\n${result.error.message}`);
  }

  return {
    ...result.data,
    url: result.data.url || defaults.url,
  };
}

const loadedSite = loadSiteFile();
const configuredUrl = process.env.SITE_URL || loadedSite.url;
const siteUrl = z
  .url()
  .refine((value) => /^https?:\/\//.test(value), "SITE_URL 须为 HTTP(S) 地址")
  .parse(configuredUrl)
  .replace(/\/$/, "");

export const siteConfig = {
  ...loadedSite,
  url: siteUrl,
  navigation: [
    { href: "/projects", label: "作品" },
    { href: "/essays", label: "文章" },
    { href: "/about", label: "关于" },
  ],
} as const;
