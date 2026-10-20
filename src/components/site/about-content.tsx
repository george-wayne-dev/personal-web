import Link from "next/link";
import { siteConfig } from "@/lib/site";

const principles = [
  [
    "从真实问题开始",
    "先确认问题是否持续存在，再决定值得写文章、做工具，还是只留一条笔记。",
  ],
  [
    "让证据靠近判断",
    "项目不仅展示结果，也保留样本、限制和做出关键取舍时的背景。",
  ],
  [
    "维护成本也是设计",
    "能长期使用的系统，应该允许内容与技术分别演进，并随时可以迁移。",
  ],
] as const;

export function AboutContent() {
  return (
    <main className="about-page">
      <aside className="margin-rail">
        <p>About / 04</p>
        <span>Practice over profile</span>
      </aside>
      <div className="about-main">
        <header className="about-hero">
          <p className="micro-label">A personal practice</p>
          <h1>
            比起介绍我是谁，<em>我更想说明自己怎样工作。</em>
          </h1>
          <p>
            我关注
            AI、工程、产品与长期学习。这个网站用来保存其中已经形成的作品、写得较完整的判断，以及仍在变化的工作笔记。
          </p>
        </header>
        <section className="about-principles">
          <div className="section-heading">
            <div>
              <p className="micro-label">Method / 01</p>
              <h2>几个反复使用的原则</h2>
            </div>
          </div>
          {principles.map(([title, copy], index) => (
            <details open={index === 0} key={title}>
              <summary>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {title}
                <b>＋</b>
              </summary>
              <p>{copy}</p>
            </details>
          ))}
        </section>
        <section className="about-now">
          <p className="micro-label">Now / 02</p>
          <div>
            <h2>目前在做</h2>
            <p>
              把个人内容库、静态网站和日常写作流程接成一套低维护的系统；同时继续验证
              Agent 在长期上下文中的边界。
            </p>
          </div>
          <dl>
            <div>
              <dt>位置</dt>
              <dd>{siteConfig.location}</dd>
            </div>
            <div>
              <dt>状态</dt>
              <dd>Building in public</dd>
            </div>
            <div>
              <dt>更新</dt>
              <dd>2026.08</dd>
            </div>
          </dl>
        </section>
        <section className="about-contact">
          <p className="micro-label">Contact / 03</p>
          <h2>保持联系</h2>
          <p>可以通过已公开的渠道联系我，也可以订阅 RSS 跟进更新。</p>
          <div>
            {siteConfig.contacts.email ? (
              <a
                href={
                  siteConfig.contacts.email.startsWith("mailto:")
                    ? siteConfig.contacts.email
                    : `mailto:${siteConfig.contacts.email}`
                }
              >
                Email ↗
              </a>
            ) : (
              <span>Email · 待接入</span>
            )}
            {siteConfig.contacts.github ? (
              <a href={siteConfig.contacts.github}>GitHub ↗</a>
            ) : (
              <span>GitHub · 待接入</span>
            )}
            <Link href="/rss.xml">RSS ↗</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
