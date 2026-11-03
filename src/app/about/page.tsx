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

// 「我的故事」由作者本人撰写，每个字符串是一段。留空时正式站点不显示这一节，
// 开发预览显示下面的提纲作为占位。
const story: string[] = [];
const storyOutline = [
  "9 年 Web 开发",
  "33 岁",
  "选择不上班",
  "用一年验证一个人 + AI 能否做出赚钱的产品",
];
const showStoryPlaceholder = process.env.NODE_ENV === "development";

export default function AboutPage() {
  return (
    <LandscapeShell site={siteConfig} current="/about">
      <header className="landscape-about-hero">
        <div className="landscape-reading-column">
          <h1>关于我</h1>
          <p>
            我是 George，做了 9 年 Web 开发，现在一个人 + AI
            做产品，并公开记录过程。
          </p>
        </div>
      </header>
      <RailcodeHorizon />
      <div className="landscape-reading-column landscape-about">
        <section className="landscape-about-intro" aria-label="个人介绍">
          <p>我关心一件事为什么值得做，以及它最后有没有真的被用起来。</p>
        </section>
        {story.length || showStoryPlaceholder ? (
          <section
            className="landscape-about-section"
            aria-labelledby="story-title"
          >
            <h2 id="story-title">我的故事</h2>
            {story.length ? (
              <div className="landscape-story">
                {story.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            ) : (
              <div className="landscape-story-placeholder">
                <p>待撰写，填写前正式站点不显示这一节。提纲：</p>
                <ul>
                  {storyOutline.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <code>src/app/about/page.tsx → story</code>
              </div>
            )}
          </section>
        ) : null}
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
            <li>做第一个产品：数字对白（本网站）。</li>
            <li>用一年验证一个人 + AI 能否做出赚钱的产品。</li>
            <li>公开记录每个产品的需求、取舍和真实结果。</li>
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
