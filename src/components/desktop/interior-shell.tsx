import Link from "next/link";
import type { ReactNode } from "react";
import { InteriorChapterBar } from "@/components/desktop/interior-interactions";

export type InteriorSiteConfig = {
  mark: string;
  name: string;
  location: string;
  navigation: ReadonlyArray<{ href: string; label: string }>;
};

type InteriorShellProps = {
  site: InteriorSiteConfig;
  current: string;
  statusLabel: string;
  statusText: string;
  statusHref: string;
  footerRail: ReactNode;
  footerSignoff: string;
  footerMeta: string;
  notes?: boolean;
  children: ReactNode;
};

export function InteriorShell({
  site,
  current,
  statusLabel,
  statusText,
  statusHref,
  footerRail,
  footerSignoff,
  footerMeta,
  notes = false,
  children,
}: InteriorShellProps) {
  return (
    <div
      className={`desktop-only motherduck-home motherduck-interior${notes ? " motherduck-interior-notes" : ""}`}
      id="top"
    >
      <div className="motherduck-site-shell">
        <a className="skip-link" href="#main-content">
          跳到正文
        </a>
        <a className="motherduck-status-strip" href={statusHref}>
          <strong>{statusLabel}</strong>
          <span>{statusText}</span>
          <span className="status-arrow" aria-hidden="true">
            →
          </span>
        </a>

        <header className="motherduck-site-header">
          <Link className="motherduck-identity" href="/" aria-label="返回首页">
            <span className="identity-mark">{site.mark}</span>
            <span className="identity-copy">
              <span className="identity-name">{site.name}</span>
              <span className="identity-note">Software &amp; Field Notes</span>
            </span>
          </Link>
          <span className="edition">Edition 2026 · {site.location}</span>
          <nav className="motherduck-site-nav" aria-label="主导航">
            {site.navigation.map((item) => (
              <Link
                className="motherduck-nav-link"
                href={item.href}
                aria-current={current === item.href ? "page" : undefined}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>

        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <InteriorChapterBar current={current} />

        <footer className="motherduck-footer">
          <div className="footer-rail">
            <span className="footer-meta">{footerRail}</span>
          </div>
          <div className="footer-main">
            <p className="footer-signoff">{footerSignoff}</p>
            <span className="footer-meta">{footerMeta}</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
