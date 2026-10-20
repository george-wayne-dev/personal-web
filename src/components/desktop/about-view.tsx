import Link from "next/link";
import { InteriorShell } from "@/components/desktop/interior-shell";
import { siteConfig } from "@/lib/site";

export function DesktopAboutView() {
  return (
    <InteriorShell
      site={siteConfig}
      current="/about"
      statusLabel="COLOPHON"
      statusText="关于这个人和这份持续修订的文稿"
      statusHref="#principles"
      footerRail={
        <>
          Colophon
          <br />
          个人文稿
        </>
      }
      footerSignoff="这里是一份持续修订的个人文稿，也是一份可以被验证的工作记录。"
      footerMeta="Chinese first"
    >
      <section className="interior-hero" data-interior-sticky-trigger>
        <div className="motherduck-page-grid">
          <aside className="motherduck-rail interior-hero-rail">
            <div>
              <span className="rail-label">About / Colophon</span>
              <span className="interior-code">A.04</span>
            </div>
            <p className="interior-rail-copy">
              <strong>Chinese first</strong>
              <br />
              软件、产品判断与长期写作。
            </p>
          </aside>
          <div className="interior-hero-main">
            <span className="eyebrow">About this person</span>
            <h1 className="interior-page-title">
              我更关心一件事为什么值得做，
              <br />
              以及它最后有没有真的被用起来。
            </h1>
            <div className="interior-intro-foot">
              <p className="interior-intro-copy">
                我是一名软件开发者，持续实践网站、移动应用与 AI
                Agent。习惯把产品判断、界面表达、工程实现与发布验证连成完整的一段。
              </p>
            </div>
          </div>
        </div>
      </section>

      <AboutSection kicker="Position" number="立场">
        <div className="about-position">
          <p className="about-position-statement">
            关注技术如何被做成真正<em>可用、可维护</em>
            ，也值得长期留下来的东西。
          </p>
          <p className="about-position-copy">
            需求形成的过程通常更能解释应该做什么。技术选型、信息架构和交互方案，都应该说明当前约束下为什么这个顺序更重要。
          </p>
        </div>
      </AboutSection>

      <AboutSection kicker="How I work" number="方法" id="principles">
        <SectionHead
          kicker="点击展开工作原则"
          title="我如何做事"
          meta="03 principles"
        />
        <div className="principle-stack">
          <details className="principle" open>
            <summary>
              <span className="mono">01</span>
              <h3>先理解现场，再定义问题</h3>
            </summary>
            <p>
              先找出真正影响结果的人、数据和约束，再决定页面与功能应该解决什么。
            </p>
          </details>
          <details className="principle">
            <summary>
              <span className="mono">02</span>
              <h3>让取舍可以被解释</h3>
            </summary>
            <p>
              不只列技术优缺点，而是说明在当前约束下，为什么这个选择更合适。
            </p>
          </details>
          <details className="principle">
            <summary>
              <span className="mono">03</span>
              <h3>用可见结果校正判断</h3>
            </summary>
            <p>从浏览器检查、构建验证到真实反馈，尽早让方案接受现实。</p>
          </details>
        </div>
      </AboutSection>

      <AboutSection kicker="Now" number="最近">
        <SectionHead kicker="持续进行中的工作" title="最近在做" />
        <div className="now-grid">
          <div className="now-card">
            <span className="project-badge">Building</span>
            <h3>把个人内容网站做成可以长期维护的发布系统</h3>
          </div>
          <div className="now-card">
            <span className="project-badge">Exploring</span>
            <h3>Agent 记忆、控制流与评估如何形成可靠闭环</h3>
          </div>
          <div className="now-card">
            <span className="project-badge">Writing</span>
            <h3>记录软件、产品与学习中反复出现的问题</h3>
          </div>
        </div>
      </AboutSection>

      <AboutSection kicker="Keep in touch" number="联系">
        <div className="about-grid">
          <div>
            <p className="about-statement">
              如果你有一个值得认真解决的问题，可以告诉我它发生在哪里、现在卡在哪里。
            </p>
          </div>
          <ul className="contact-list">
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
        </div>
      </AboutSection>
    </InteriorShell>
  );
}

function AboutSection({
  kicker,
  number,
  id,
  children,
}: {
  kicker: string;
  number: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="interior-section" id={id}>
      <div className="motherduck-page-grid">
        <aside className="motherduck-rail section-rail">
          <span className="section-kicker">{kicker}</span>
          <span className="section-number">{number}</span>
        </aside>
        <div className="interior-section-main">{children}</div>
      </div>
    </section>
  );
}

function SectionHead({
  kicker,
  title,
  meta,
}: {
  kicker: string;
  title: string;
  meta?: string;
}) {
  return (
    <div className="interior-section-head">
      <div>
        <span className="section-kicker">{kicker}</span>
        <h2>{title}</h2>
      </div>
      {meta ? <span className="mono">{meta}</span> : null}
    </div>
  );
}
