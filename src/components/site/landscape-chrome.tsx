import Link from "next/link";
import type { ReactNode } from "react";
import { RailcodeForest } from "./railcode-forest";
import { SiteLogo } from "./site-logo";
import { ContactLinks, type SiteContacts } from "./contact-links";

export type LandscapeSiteConfig = {
  name: string;
  navigation: ReadonlyArray<{ href: string; label: string }>;
  contacts?: SiteContacts & { rss?: string };
};

export function LandscapeHeader({
  site,
  current,
}: {
  site: LandscapeSiteConfig;
  current?: string;
}) {
  return (
    <header className="landscape-header">
      <Link
        className="landscape-identity"
        href="/"
        aria-label={`${site.name} 首页`}
      >
        <SiteLogo />
      </Link>
      <nav aria-label="主导航">
        {site.navigation.map((item) => (
          <Link
            href={item.href}
            aria-current={current === item.href ? "page" : undefined}
            key={item.href}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

export function LandscapeFooter({ site }: { site: LandscapeSiteConfig }) {
  return (
    <footer className="landscape-footer">
      <RailcodeForest />
      <div className="landscape-footer-copy">
        <Link className="landscape-footer-name" href="/about">
          {site.name} <span aria-hidden="true">↗</span>
        </Link>
        <ContactLinks contacts={site.contacts} />
        <nav className="landscape-footer-navigation" aria-label="页脚导航">
          <Link href="/about">关于</Link>
          <a href={site.contacts?.rss || "/rss.xml"}>
            订阅 RSS <span aria-hidden="true">↗</span>
          </a>
          <a href="#top">回到顶部 ↑</a>
        </nav>
        <small>
          © {new Date().getFullYear()} {site.name}
        </small>
      </div>
    </footer>
  );
}

export function LandscapeShell({
  site,
  current,
  reading = false,
  children,
}: {
  site: LandscapeSiteConfig;
  current: string;
  reading?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`landscape-site landscape-interior${reading ? " landscape-reading" : ""}`}
    >
      <a className="skip-link" href="#main-content">
        跳到正文
      </a>
      <LandscapeHeader site={site} current={current} />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <LandscapeFooter site={site} />
    </div>
  );
}
