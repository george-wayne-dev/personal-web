# 个人网站

基于 Next.js App Router、React 和本地 Markdown 的个人网站，包含作品、文章和关于页。支持分类、标签、年度筛选、相关内容、RSS、站点地图和结构化数据。首页、作品、文章、详情和关于页共用响应式布局及导航。

首页的白云、游乐场、树林和泥土使用从 [Railcode](https://railcode.dev/) 提取的原始 Canvas 绘制逻辑；作品配图使用原站的四张像素插画。源地址和图片校验值记录在 `public/railcode/SOURCES.md`。场景可暂停，并跟随系统“减少动态效果”设置。首页组件位于 `src/components/home/`，共用页头、页尾位于 `src/components/site/`，场景绘制位于 `src/lib/railcode/`。样式按基础、首页、内页分在 `src/styles/landscape-*.css`；列表筛选可展开，正文目录在桌面与手机端共用同一组锚点。

## 本地运行

使用 Node.js `24.21.0` 和 pnpm `12.9.1`。Node 版本记录在 `.nvmrc` 和 `.node-version`，包管理器版本记录在 `package.json`。

```bash
nvm use
npm install --global pnpm@12.9.1
pnpm install --frozen-lockfile
pnpm dev
```

打开 <http://localhost:3000>。仓库不包含作者的私有文章，未配置内容时会显示空状态。

```bash
pnpm content:check # 内容结构、内部链接和资源检查
pnpm lint          # 代码规范
pnpm typecheck     # 类型检查
pnpm check         # 规范、类型、内容检查和正式构建
pnpm start         # 预览 out/ 中的静态构建
pnpm preview --port 3100
```

`pnpm start` 使用本地静态服务器，必须先构建；默认只监听本机 `127.0.0.1:3000`。构建结果为 `out/`，不依赖 Next.js 服务进程。

## 网站配置与私有内容

复制 `.env.example` 为 `.env.local`，复制 `site.example.json` 到自己的内容目录并修改。示例中的 `example.com` 需要替换为正式域名；联系人字段可留空，邮箱填写地址，GitHub 填写完整主页 URL。

```dotenv
CONTENT_ROOT=/absolute/path/to/personal-content/content
SITE_CONFIG_PATH=/absolute/path/to/personal-content/site.json
```

这些是路径示例，不包含任何真实凭据。未配置 `CONTENT_ROOT` 时读取本仓库 `content/`。配置内容目录后，默认也会尝试读取其父目录的 `site.json`；`SITE_CONFIG_PATH` 可显式指定配置位置。`.env.local` 不应提交。

当前作者公开的位置、GitHub、X 和邮箱同时保存在 `src/lib/site.ts` 的默认配置中，远端未接入私人内容库时也能展示。指定 `site.json` 后使用该文件中的配置；`contacts.x` 可选，填写完整主页 URL。首页、关于页和页脚共用这些联系方式，RSS 保留在关于页、页脚和订阅入口。

代码仓库和内容仓库可以分开管理。公开仓库仅保存代码和模板，私有内容应放在另一个私有仓库；生产构建环境必须能够访问内容文件。仅连接代码仓库不会自动获得另一私有仓库中的内容。

## 写作

```text
content/
├─ projects/
└─ essays/
```

将 `templates/` 中对应模板复制到内容目录，修改文件名和 Frontmatter。文件名作为默认 slug；显式 slug 仅允许小写英文、数字和连字符。日期使用带引号的 `YYYY-MM-DD`。

通用字段为 `title`、`summary`、`date`、`category`、`tags`、`draft`、`featured`；可选字段包括 `updated`、`slug`、`cover`、`locale`、`kind`、`code`、`status`。文章可设置 `readingMinutes`；项目可设置 `role`、`stack`、`evidence`。详细规则见 `src/lib/content/schema.ts`。

作品使用统一模板，详情页顶部依次显示：

| 字段                                               | 含义                                              |
| -------------------------------------------------- | ------------------------------------------------- |
| `problem`                                          | 解决什么问题                                      |
| `audience`                                         | 给谁用                                            |
| `state`                                            | 当前状态                                          |
| `results.users`、`results.revenue`、`results.asOf` | 真实结果：用户数、收入、数据截至日期；为 0 也要写 |
| `reviews`                                          | 复盘文章的站内路径列表，如 `/essays/slug`         |

草稿可以留空；`draft: false` 的作品缺少前四项中的任何一项，或 `reviews` 指向不存在的文章，`pnpm content:check` 会失败。`reviews` 指向尚未发布的文章时，正式站点不显示该篇；没有已发布的复盘时显示「复盘待写」。

## 订阅入口

首页、文章结尾和空的作品/文章列表页显示订阅入口。RSS 始终显示；邮件和公众号在 `site.json` 中配置，不接入任何服务：

```json
"subscribe": {
  "email": "https://邮件服务的订阅页",
  "wechat": { "name": "公众号名称", "qrcode": "/subscribe/wechat-qrcode.png" }
}
```

二维码图片放在 `public/` 下，或填写完整的 HTTPS 地址。未配置的渠道在正式站点不显示，开发预览中显示占位框。

关于页的「我的故事」写在 `src/app/about/page.tsx` 的 `story` 数组中，每个字符串一段；留空时正式站点不显示该节。

开发预览显示草稿；可见页面每 3 秒刷新内容，页面隐藏后暂停，生产不启用此刷新。生产构建始终排除草稿，包括页面、RSS 和 Sitemap。确认文章可公开后再改为 `draft: false`。发布前运行 `pnpm check`；验证不通过会阻止构建。

图片放到 `public/`，在 Markdown 中使用 `/images/example.webp` 等站内路径，并填写替代文本。外部音视频使用独立段落中的链接：

```md
[音频：本次实践的讲解](https://media.example.com/explanation.mp3 "audio")

[视频：功能操作演示](https://media.example.com/demo.mp4 "video")
```

使用支持直接播放的媒体 URL，并在附近提供说明或文字稿。正文二级标题自动使用 `section-01`、`section-02` 等锚点。原始 HTML 会被清理且不能通过发布检查，避免 Markdown 注入脚本。大型音视频不应进入 Git 仓库。

## GitHub 与发布

GitHub Actions 在推送 `main` 和提交 Pull Request 时安装锁定依赖并执行 `pnpm check`，成功后保留静态产物 7 天。CI 默认构建仓库内的公开内容，不读取本机 `.env.local` 或私有内容目录。

Cloudflare Pages 可使用以下配置：

- 构建命令：`pnpm build`
- 输出目录：`out`
- 生产分支：`main`
- 环境变量：`NODE_VERSION=24.21.0`、`PNPM_VERSION=12.9.1`

当前工程本身即仓库根目录，无需另设构建根目录。使用私有内容时，需要另行配置受限的构建访问权限和内容检出步骤，或从本地已验证的 `out/` 上传；不要把仓库令牌写进源码。代码推送到 GitHub 与生产部署是两个独立步骤。

首次上线前，填写真实网站配置和内容，确认正式域名、联系入口及分享图，并检查 `out/robots.txt`、`out/sitemap.xml` 和 `out/rss.xml`。部署完成后可接入 Search Console 和 Bing Webmaster Tools。

### 站点地址与自定义域名

canonical、分享图、RSS、Sitemap、robots 和结构化数据中的绝对地址都来自同一个站点地址，代码中不写死域名。优先级为：环境变量 `SITE_URL` > `site.json` 的 `url` > 示例地址 `https://example.com`。

- 在 Cloudflare Pages 上构建（存在 `CF_PAGES`）时，`main` 分支没有配置站点地址会直接构建失败；预览分支未配置时使用本次部署的预览地址。
- 其他环境的生产构建未配置时会打印警告并使用示例地址，CI 因此不受影响。
- 当前正式站点在 Cloudflare 设置的是 `SITE_URL=https://<项目名>.pages.dev`。

绑定自定义域名：

1. 在 Cloudflare Pages 的 Custom domains 中添加域名，等待 DNS 和证书生效。
2. 把生产环境变量 `SITE_URL` 改为 `https://你的域名`，重新部署。
3. 检查线上首页的 canonical、`/rss.xml` 和 `/sitemap.xml` 是否已换成新域名。
4. 为 `*.pages.dev` 设置到新域名的 301 跳转（Cloudflare Bulk Redirects），避免两个地址同时被收录。

Cloudflare 仅连接代码仓库，私人内容尚未接入远端构建，当前部署不会包含草稿。

原“笔记”已并入“文章”，短记录与长文统一保存在 `content/essays/`，按分类和标签区分。私人内容迁移时保留草稿状态；模板仅保留作品与文章两类。
