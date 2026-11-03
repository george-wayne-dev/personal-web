import fs from "node:fs";
import path from "node:path";
import { z } from "zod";

const httpUrl = z.url().refine((value) => /^https?:\/\//.test(value));

const siteFileSchema = z.object({
  name: z.string().min(1),
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
    github: z.union([z.literal(""), httpUrl]),
    x: z.union([z.literal(""), httpUrl]).default(""),
    rss: z.union([z.literal(""), z.literal("/rss.xml"), httpUrl]),
  }),
  // Subscription entry points only link out; no subscription service runs on this site.
  subscribe: z
    .object({
      email: z.union([z.literal(""), httpUrl]).default(""),
      wechat: z
        .object({
          name: z.string().default(""),
          qrcode: z
            .union([z.literal(""), z.string().regex(/^\/[^\s]+$/), httpUrl])
            .default(""),
        })
        .default({ name: "", qrcode: "" }),
    })
    .default({ email: "", wechat: { name: "", qrcode: "" } }),
});

export type SiteSubscribe = z.infer<typeof siteFileSchema>["subscribe"];

const exampleUrl = "https://example.com";

const defaults = {
  name: "数字对白",
  description:
    "一个人 + AI，从需求到上线做产品，公开记录每个产品的需求、取舍和真实结果。",
  url: "",
  location: "广州市，中国",
  contacts: {
    email: "george.wayne.work@gmail.com",
    github: "https://github.com/george-wayne-dev",
    x: "https://x.com/georgewaynex",
    rss: "/rss.xml",
  },
  subscribe: { email: "", wechat: { name: "", qrcode: "" } },
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

  return result.data;
}

/** SITE_URL wins over site.json. A Cloudflare production build without either
 * fails instead of publishing canonical, RSS and sitemap links to example.com;
 * elsewhere the content check warns about the fallback.
 */
function resolveSiteUrl(configured: string) {
  if (configured) return configured;
  if (process.env.CF_PAGES) {
    // Preview branches may use their own deployment address; main is production.
    if (process.env.CF_PAGES_BRANCH !== "main" && process.env.CF_PAGES_URL) {
      return process.env.CF_PAGES_URL;
    }
    throw new Error(
      "Cloudflare Pages 正式构建需要设置 SITE_URL（例如 https://你的域名）",
    );
  }
  return exampleUrl;
}

const loadedSite = loadSiteFile();
const siteUrl = z
  .url()
  .refine((value) => /^https?:\/\//.test(value), "SITE_URL 须为 HTTP(S) 地址")
  .parse(resolveSiteUrl(process.env.SITE_URL || loadedSite.url))
  .replace(/\/$/, "");

export const siteUrlIsFallback = siteUrl === exampleUrl;

export const siteConfig = {
  ...loadedSite,
  url: siteUrl,
  navigation: [
    { href: "/projects", label: "作品" },
    { href: "/essays", label: "文章" },
    { href: "/about", label: "关于" },
  ],
} as const;
