import Link from "next/link";
import { DesktopHeader } from "@/components/desktop/site-header";
import { MobileHeader } from "@/components/mobile/site-header";
import type { HeaderProps } from "@/components/site/header-types";
import styles from "@/components/site/status-strip.module.css";

export function StatusStrip() {
  return (
    <div className={styles.strip} data-site-status>
      <span className={styles.dot} aria-hidden="true" />
      <span>目前在做：把零散上下文整理成可以继续工作的系统</span>
      <span className={styles.place}>Shanghai · 2026</span>
    </div>
  );
}

export function ResponsiveHeader(props: HeaderProps) {
  return (
    <>
      <div className="desktop-only">
        <DesktopHeader {...props} />
      </div>
      <div className="mobile-only">
        <MobileHeader {...props} />
      </div>
    </>
  );
}

export function SiteFooter({ name }: { name: string }) {
  return (
    <footer className="site-footer">
      <p>{name}</p>
      <p>Built from Markdown · Static by design</p>
      <Link href="#top">返回顶部 ↑</Link>
    </footer>
  );
}
