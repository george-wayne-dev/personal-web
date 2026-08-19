import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "关于" };

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16 sm:px-10">
      <Link className="text-sm underline" href="/">
        返回首页
      </Link>
      <h1 className="mt-8 text-4xl font-semibold tracking-tight">关于</h1>
      <p className="mt-6 leading-8 text-[var(--quiet)]">
        此页用于放置一句个人定位、简短介绍、关注方向和公开联系渠道。首次发布前请替换为真实信息。
      </p>
    </main>
  );
}
