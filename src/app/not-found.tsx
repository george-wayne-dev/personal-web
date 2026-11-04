import type { Metadata } from "next";
import Link from "next/link";
import { LandscapeShell } from "@/components/site/landscape-chrome";
import { RidgeScene } from "@/components/site/ridge-scene";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = { title: "页面不存在" };

export default function NotFound() {
  return (
    <LandscapeShell site={siteConfig} current="">
      <header className="landscape-about-hero">
        <div className="landscape-reading-column">
          <h1>这一页不存在</h1>
          <p>链接可能写错了，或者内容已经挪走。</p>
        </div>
      </header>
      <RidgeScene
        variant="band"
        seed="not-found"
        className="landscape-horizon"
      />
      <div className="landscape-reading-column landscape-about">
        <div className="landscape-contact-links">
          <Link href="/">回到首页 →</Link>
          <Link href="/projects">看看作品 →</Link>
          <Link href="/essays">读点文章 →</Link>
        </div>
      </div>
    </LandscapeShell>
  );
}
