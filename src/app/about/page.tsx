import type { Metadata } from "next";
import Link from "next/link";
import { LandscapeShell } from "@/components/site/landscape-chrome";
import { siteConfig } from "@/lib/site";
import { RailcodeHorizon } from "@/components/site/railcode-horizon";
import { ContactLinks } from "@/components/site/contact-links";

export const metadata: Metadata = {
  title: "关于",
  description: siteConfig.description,
  alternates: { canonical: "/about" },
};

const principles = [
  ["先理解现场，再定义问题", "先看清人、数据和约束，再决定做什么。"],
  ["让取舍可以被解释", "说明为什么这样选择，也保留尚未解决的问题。"],
  ["用可见结果校正判断", "让实际运行和使用反馈，检验原来的想法。"],
];

export default function AboutPage() {
  return (
    <LandscapeShell site={siteConfig} current="/about">
      <header className="landscape-about-hero">
        <div className="landscape-reading-column">
          <h1>关于我</h1>
          <p>
            我是一名软件开发者，做网站、移动应用与 AI
            Agent，也把实践中的想法写下来。
          </p>
          <div className="landscape-about-location">{siteConfig.location}</div>
        </div>
      </header>
      <RailcodeHorizon />
      <div className="landscape-reading-column landscape-about">
        <section className="landscape-about-intro" aria-label="个人介绍">
          <p>我关心一件事为什么值得做，以及它最后有没有真的被用起来。</p>
        </section>
        <section
          className="landscape-about-section"
          aria-labelledby="principles-title"
        >
          <h2 id="principles-title">我如何做事</h2>
          <div className="landscape-principles">
            {principles.map(([title, copy]) => (
              <div className="landscape-principle" key={title}>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            ))}
          </div>
        </section>
        <section
          className="landscape-about-section"
          aria-labelledby="now-title"
        >
          <h2 id="now-title">最近在做</h2>
          <ul className="landscape-now-list">
            <li>维护个人内容网站和日常写作流程。</li>
            <li>探索 Agent 的记忆、控制流与评估。</li>
            <li>记录软件、产品与学习中反复出现的问题。</li>
          </ul>
        </section>
        <section
          className="landscape-about-section"
          aria-labelledby="contact-title"
        >
          <h2 id="contact-title">保持联系</h2>
          <ContactLinks contacts={siteConfig.contacts} detailed />
          <div className="landscape-contact-links">
            <a href={siteConfig.contacts.rss || "/rss.xml"}>订阅 RSS ↗</a>
            <Link href="/projects">浏览作品 →</Link>
          </div>
        </section>
      </div>
    </LandscapeShell>
  );
}
