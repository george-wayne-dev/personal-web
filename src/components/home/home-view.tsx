import Image from "next/image";
import Link from "next/link";
import type { HomeViewProps } from "@/components/home-view.types";
import { contentUrl } from "@/lib/content";
import { siteConfig } from "@/lib/site";
import { AnimatedSky } from "./animated-sky";
import {
  LandscapeHeader,
  LandscapeFooter,
} from "@/components/site/landscape-chrome";
import { ProjectCard } from "@/components/content/project-card";
import { ContactLinks } from "@/components/site/contact-links";

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true">{diagonal ? "↗" : "→"}</span>;
}

export function HomeView({ projects, essays, featured }: HomeViewProps) {
  const selected = featured
    ? [
        featured,
        ...projects.filter((item) => item.slug !== featured.slug),
      ].slice(0, 3)
    : projects.slice(0, 3);

  return (
    <div className="landscape-site landscape-home">
      <a className="skip-link" href="#main-content">
        跳到正文
      </a>
      <LandscapeHeader site={siteConfig} />

      <main id="main-content" tabIndex={-1}>
        <AnimatedSky>
          <section className="landscape-hero" aria-labelledby="hero-title">
            <p className="landscape-hello">欢迎来到我的一小片天地</p>
            <h1 id="hero-title">
              做点有用的东西，
              <br />
              写下沿途的想法。
            </h1>
            <p className="landscape-intro">
              关于软件、AI，还有生活里的观察与实践。
            </p>
            <div className="landscape-hero-actions">
              <a className="landscape-button" href="#projects">
                看看作品 <Arrow />
              </a>
              <a className="landscape-text-link" href="#essays">
                读点文章 <Arrow />
              </a>
            </div>
            <div className="landscape-hero-profile">
              <ContactLinks contacts={siteConfig.contacts} />
            </div>
          </section>
        </AnimatedSky>

        <section
          className="landscape-projects"
          id="projects"
          aria-labelledby="projects-title"
        >
          <div className="landscape-container">
            <div className="landscape-section-head">
              <h2 id="projects-title">做过的东西</h2>
              <Link className="landscape-text-link" href="/projects">
                全部作品 <Arrow />
              </Link>
            </div>
            {selected.length ? (
              <div className="landscape-project-grid">
                {selected.map((item, index) => (
                  <ProjectCard item={item} index={index} key={item.slug} />
                ))}
              </div>
            ) : (
              <div className="landscape-project-empty">
                <Image
                  className="railcode-original-art"
                  src="/railcode/human-and-robot.png"
                  alt=""
                  width={168}
                  height={120}
                  unoptimized
                />
                <div>
                  <h3>作品整理中</h3>
                  <p>完成的作品，会陆续放在这里。</p>
                </div>
              </div>
            )}
          </div>
        </section>

        <section
          className="landscape-essays"
          id="essays"
          aria-labelledby="essays-title"
        >
          <div className="landscape-container landscape-essay-layout">
            <div className="landscape-essay-heading">
              <h2 id="essays-title">最近写下的</h2>
              <Link className="landscape-text-link" href="/essays">
                全部文章 <Arrow />
              </Link>
            </div>
            {essays.length ? (
              <div className="landscape-essay-list">
                {essays.slice(0, 4).map((item) => (
                  <article className="landscape-essay" key={item.slug}>
                    <Link href={contentUrl(item)}>
                      <time dateTime={item.date}>
                        {item.date.replaceAll("-", ".")}
                      </time>
                      <h3>{item.title}</h3>
                      <Arrow diagonal />
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <p className="landscape-essay-empty">
                文章正在整理，稍后再来看看。
              </p>
            )}
          </div>
        </section>
      </main>

      <LandscapeFooter site={siteConfig} />
    </div>
  );
}
