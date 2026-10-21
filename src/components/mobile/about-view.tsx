import { siteConfig } from "@/lib/site";
import Link from "next/link";
import type { InteriorSiteConfig } from "@/components/desktop/interior-shell";
import { MotherDuckMobileShell } from "@/components/mobile/motherduck-shell";

export function MobileAboutView({ site }: { site: InteriorSiteConfig }) {
  return (
    <MotherDuckMobileShell
      site={site}
      current="/about"
      statusLabel="COLOPHON"
      statusText="About this person"
      statusHref="#mobile-principles"
      menuMeta="Colophon"
      footerMeta="Colophon · 个人文稿"
      footerSignoff="持续修订的个人文稿，也是一份可以被验证的工作记录。"
      footerEnd="Chinese first"
      className="mdm-about-page"
    >
      <section className="mdm-interior-hero">
        <div className="mdm-page-code-row">
          <span className="mdm-page-code">A.03</span>
          <span className="mdm-mono">About / Colophon</span>
        </div>
        <span className="mdm-eyebrow">About this person</span>
        <h1>我更关心一件事为什么值得做，以及它最后有没有真的被用起来。</h1>
        <p>我是一名软件开发者，持续实践网站、移动应用与 AI Agent。</p>
      </section>
      <section className="mdm-interior-content">
        <div className="mdm-about-position">
          <p>
            关注技术如何被做成真正<em>可用、可维护</em>
            ，也值得长期留下来的东西。
          </p>
          <p>
            技术选型、信息架构和交互方案，都应该说明当前约束下为什么这个顺序更重要。
          </p>
        </div>
      </section>
      <section className="mdm-interior-content" id="mobile-principles">
        <AboutHead kicker="How I work" title="我如何做事" meta="点击展开" />
        <div className="mdm-principles">
          <details open>
            <summary>
              <span className="mdm-mono">01</span>
              <h3>先理解现场，再定义问题</h3>
            </summary>
            <p>先找出真正影响结果的人、数据和约束。</p>
          </details>
          <details>
            <summary>
              <span className="mdm-mono">02</span>
              <h3>让取舍可以被解释</h3>
            </summary>
            <p>说明在当前约束下，为什么这个选择更合适。</p>
          </details>
          <details>
            <summary>
              <span className="mdm-mono">03</span>
              <h3>用可见结果校正判断</h3>
            </summary>
            <p>从浏览器检查到真实反馈，尽早让方案接受现实。</p>
          </details>
        </div>
      </section>
      <section className="mdm-interior-content">
        <AboutHead kicker="Now" title="最近在做" />
        <div className="mdm-now-grid">
          <div>
            <span className="project-badge">Building</span>
            <h3>长期维护的个人内容网站</h3>
          </div>
          <div>
            <span className="project-badge">Exploring</span>
            <h3>Agent 记忆、控制流与评估闭环</h3>
          </div>
          <div>
            <span className="project-badge">Writing</span>
            <h3>记录软件与产品中反复出现的问题</h3>
          </div>
        </div>
      </section>
      <section className="mdm-interior-content">
        <AboutHead kicker="Keep in touch" title="联系" />
        <p className="mdm-interior-copy">
          如果你有一个值得认真解决的问题，可以告诉我它发生在哪里、现在卡在哪里。
        </p>
        <ul className="mdm-contact-list">
          {siteConfig.contacts.email ? (
            <li>
              <a
                href={
                  siteConfig.contacts.email.startsWith("mailto:")
                    ? siteConfig.contacts.email
                    : `mailto:${siteConfig.contacts.email}`
                }
              >
                <span>Email</span>
                <span>联系 ↗</span>
              </a>
            </li>
          ) : null}
          {siteConfig.contacts.github ? (
            <li>
              <a href={siteConfig.contacts.github}>
                <span>GitHub</span>
                <span>联系 ↗</span>
              </a>
            </li>
          ) : null}
          <li>
            <Link href={siteConfig.contacts.rss || "/rss.xml"}>
              <span>RSS</span>
              <span>订阅更新 ↗</span>
            </Link>
          </li>
          <li>
            <Link href="/projects">
              <span>Projects</span>
              <span>浏览作品 ↗</span>
            </Link>
          </li>
        </ul>
      </section>
    </MotherDuckMobileShell>
  );
}

function AboutHead({
  kicker,
  title,
  meta,
}: {
  kicker: string;
  title: string;
  meta?: string;
}) {
  return (
    <div className="mdm-interior-head">
      <div>
        <span className="mdm-section-kicker">{kicker}</span>
        <h2>{title}</h2>
      </div>
      {meta ? <span className="mdm-mono">{meta}</span> : null}
    </div>
  );
}
