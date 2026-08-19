# 个人网站

基于 Next.js App Router 的静态个人网站。内容在构建时从本仓库的 Markdown 读取，部署产物为 `out/`，可直接交给 Cloudflare Pages。

## 本地使用

```bash
pnpm dev
pnpm lint
pnpm typecheck
pnpm build
```

开发服务器会读取所有内容，包括草稿；生产构建只读取公开内容。发布前使用 `pnpm check`，并用 `pnpm build` 生成的 `out/` 目录进行静态预览。

## 内容目录

```text
content/
├─ projects/
├─ essays/
└─ notes/
```

每篇公开 Markdown 都必须使用以下 Frontmatter。文件名会作为默认 slug，也可以显式指定 `slug`；slug 仅允许小写英文、数字和连字符。

```md
---
title: 标题
summary: 一句话摘要
date: 2026-07-28
category: 软件开发
tags:
  - Next.js
draft: false
featured: false
---

正文从这里开始。
```

可选字段：`updated`、`slug`、`cover`。Frontmatter 不符合规则时，构建会失败。草稿在 `pnpm dev` 中可见，但不会进入生产页面、RSS 或 Sitemap。

## 首次发布前要填写

- `src/lib/site.ts`：网站名称、简介、正式域名和导航。
- `src/app/about/page.tsx`：个人定位、介绍和公开联系渠道。
- `content/`：首批作品、文章和笔记。
- Cloudflare Pages：构建命令 `pnpm build`，输出目录 `out`，生产分支 `main`。

shadcn/ui 暂未添加未使用的组件；在实现移动端导航、筛选或弹层时，再按实际需要将组件源码放入 `src/components/ui/`。
