import type { Metadata } from "next";
import Link from "next/link";
import { LandscapeShell } from "@/components/site/landscape-chrome";
import { siteConfig } from "@/lib/site";
import { RidgeScene } from "@/components/site/ridge-scene";
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

// 由作者本人口述并确认，每个字符串是一段。改动内容要先问作者。
const story = [
  "我 33 岁，做了 9 年 Web 开发。毕业后我加入一家 500 人的公司，开发给政企人员用的 OA 办公系统，让审批流程做到无纸化。系统有三套：后台的表单设计器和流程设计器，还有综合展示表单和流程的前台。后来公司开始亏损。",
  "随后我进了一家大厂，开发 IM 系统和一些附属的小项目，用来打通公司内部的业务，提高沟通效率。后来因为个人原因，我也离职了。",
  "我开始想不上班，是因为意识到了几件事。",
  "我开发的功能都来自别人提的需求，要这样、要那样，我就像一块随处可以搬动的砖头。团队内部随时都在淘汰人，我没有归属感。我也有危机感：这样的开发不可能一直做下去，总会有新鲜血液涌进来，没有前期的公司红利，就等于站不稳。我的人生商业模式也有问题，一份时间换一份报酬，注定赚不到更多的钱。而且好累，为了更好地完成任务，总在延长自己的工作时间。",
  "早上挤地铁的时候，非常多人密密麻麻地跟着安排好的队列，挤着进站上车。我就在想，我为什么跟大众一样，过着一样的生活？我想要的是不一样。",
  "现在我一个人 + AI 做产品。这条路是否可行，我真的不知道。AI 的发展真的太强大了：知识丰富，执行力高，对你的任务总会没有情绪地回应，软件开发的整条链路都能落地。就算碰到我不懂的知识盲区，也可以跟它交流，把问题解决。而我又是开发者，只能在自己的舒适区去发展，AI 是一个可以辅助我的有力工具。",
  "不上班之后，如果收入能够覆盖我的生活成本，我就认为成功了。不只是产品的收入，接外包单、跟 AI 相关的、提供服务之类的收入都算。没做成就是失败。后面怎么办，我不知道，还没有想好，只想很努力地去做好这些事情。",
];

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
      <RidgeScene variant="band" seed="about" className="landscape-horizon" />
      <div className="landscape-reading-column landscape-about">
        <section className="landscape-about-intro" aria-label="个人介绍">
          <p>我关心一件事为什么值得做，以及它最后有没有真的被用起来。</p>
        </section>
        <section
          className="landscape-about-section"
          aria-labelledby="story-title"
        >
          <h2 id="story-title">我的故事</h2>
          <div className="landscape-story">
            {story.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
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
            <li>做第一个产品：数字对白（本网站）。</li>
            <li>验证一个人 + AI 能否做出赚钱的产品。</li>
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
