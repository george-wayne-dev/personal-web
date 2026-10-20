"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { InteriorSiteConfig } from "@/components/desktop/interior-shell";

type MobileShellProps = {
  site: InteriorSiteConfig;
  current: string;
  statusLabel: string;
  statusText: string;
  statusHref: string;
  statusArrow?: string;
  menuMeta: string;
  footerMeta: string;
  footerSignoff: string;
  footerEnd: string;
  backHref?: string;
  backLabel?: string;
  className?: string;
  children: ReactNode;
};

export function MotherDuckMobileShell({
  site,
  current,
  statusLabel,
  statusText,
  statusHref,
  statusArrow = "→",
  menuMeta,
  footerMeta,
  footerSignoff,
  footerEnd,
  backHref = "/",
  backLabel = "← 返回首页",
  className = "",
  children,
}: MobileShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const previous =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    menuRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const media = window.matchMedia("(min-width: 61.25rem)");
    const closeOnDesktop = () => {
      if (media.matches) setMenuOpen(false);
    };
    media.addEventListener("change", closeOnDesktop);
    document.body.classList.toggle("motherduck-menu-open", menuOpen);
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      media.removeEventListener("change", closeOnDesktop);
      previous?.focus();
      document.body.classList.remove("motherduck-menu-open");
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  return (
    <div
      className={`mobile-only motherduck-mobile ${className}`.trim()}
      id="mobile-top"
    >
      <div className="mdm-page">
        <a className="skip-link" href="#mobile-main-content">
          跳到正文
        </a>
        <a className="mdm-status-strip" href={statusHref}>
          <strong>{statusLabel}</strong>
          <span>{statusText}</span>
          <span aria-hidden="true">{statusArrow}</span>
        </a>

        <header className="mdm-topbar">
          <Link
            className="mdm-identity"
            href="/"
            aria-label={`${site.name} 首页`}
          >
            <span className="mdm-identity-mark">{site.mark}</span>
            <span className="mdm-identity-copy">
              <span className="mdm-identity-name">{site.name}</span>
              <span className="mdm-identity-note">
                Software &amp; Field Notes
              </span>
            </span>
          </Link>
          <button
            className="mdm-menu-button"
            type="button"
            aria-controls="motherduck-mobile-menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <span>菜单</span>
            <span className="mdm-menu-icon" aria-hidden="true" />
          </button>
        </header>

        {menuOpen ? (
          <div
            className="mdm-menu-sheet"
            id="motherduck-mobile-menu"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="全站导航"
            onKeyDown={(event) => {
              if (event.key !== "Tab") return;
              const controls =
                menuRef.current?.querySelectorAll<HTMLElement>(
                  "button, a[href]",
                );
              if (!controls?.length) return;
              const first = controls[0],
                last = controls[controls.length - 1];
              if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
              } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
              }
            }}
          >
            <div className="mdm-sheet-head">
              <span className="mdm-mono">Site navigation</span>
              <button type="button" onClick={() => setMenuOpen(false)}>
                关闭
              </button>
            </div>
            <nav className="mdm-sheet-nav" aria-label="全站导航">
              <MobileMenuLink
                number="00"
                label="首页"
                href="/"
                current={current}
                close={() => setMenuOpen(false)}
              />
              {site.navigation.map((item, index) => (
                <MobileMenuLink
                  number={String(index + 1).padStart(2, "0")}
                  label={item.label}
                  href={item.href}
                  current={current}
                  close={() => setMenuOpen(false)}
                  key={item.href}
                />
              ))}
            </nav>
            <div className="mdm-sheet-foot">
              <span className="mdm-mono">Edition 2026</span>
              <span className="mdm-mono">{menuMeta}</span>
            </div>
          </div>
        ) : null}

        <main id="mobile-main-content" tabIndex={-1} inert={menuOpen}>
          {children}
        </main>

        <footer className="mdm-footer">
          <span className="mdm-footer-meta">{footerMeta}</span>
          <p>{footerSignoff}</p>
          <div className="mdm-footer-bottom">
            <Link className="mdm-footer-meta" href={backHref}>
              {backLabel}
            </Link>
            <span className="mdm-footer-meta">{footerEnd}</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

function MobileMenuLink({
  number,
  label,
  href,
  current,
  close,
}: {
  number: string;
  label: string;
  href: string;
  current: string;
  close: () => void;
}) {
  return (
    <Link
      href={href}
      aria-current={current === href ? "page" : undefined}
      onClick={close}
    >
      <span className="mdm-sheet-index">{number}</span>
      <span className="mdm-sheet-title">{label}</span>
      <span aria-hidden="true">↗</span>
    </Link>
  );
}
