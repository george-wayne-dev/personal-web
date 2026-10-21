"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const homeChapters = [
  ["00", "现在", "#mobile-top"],
  ["01", "作品", "#mobile-projects"],
  ["02", "文章", "#mobile-essays"],
  ["03", "关于", "#mobile-about"],
] as const;

export function MobileHomeChapterBar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="mdm-chapter-bar" aria-label="首页章节导航">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span>当前：首页 / 现在</span>
        <span className="mdm-chapter-action">目录 {open ? "−" : "+"}</span>
      </button>
      {open ? (
        <div className="mdm-chapter-menu">
          {homeChapters.map(([number, label, href]) => (
            <a href={href} onClick={() => setOpen(false)} key={href}>
              <span>
                {number} · {label}
              </span>
              <span>↗</span>
            </a>
          ))}
        </div>
      ) : null}
    </nav>
  );
}

export function MobileDetailChapterBar({
  indexHref,
  headings,
}: {
  indexHref: string;
  headings: Array<{ id: string; label: string }>;
}) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const resolveHash = () => {
      if (
        window.innerWidth >= 1100 ||
        !/^#section-\d+$/.test(window.location.hash)
      )
        return;
      document
        .getElementById(`mobile-${window.location.hash.slice(1)}`)
        ?.scrollIntoView();
    };
    resolveHash();
    window.addEventListener("hashchange", resolveHash);
    return () => window.removeEventListener("hashchange", resolveHash);
  }, []);
  return (
    <nav className="mdm-detail-nav" aria-label="详情页导航">
      <Link href={indexHref}>← 索引</Link>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span>章节</span>
        <span>{open ? "−" : "＋"}</span>
      </button>
      {open ? (
        <div className="mdm-detail-chapter-menu">
          {headings.map((heading, index) => (
            <a
              href={`#${heading.id}`}
              onClick={() => setOpen(false)}
              key={heading.id}
            >
              <span>
                {String(index + 1).padStart(2, "0")} {heading.label}
              </span>
              <span>↓</span>
            </a>
          ))}
        </div>
      ) : null}
    </nav>
  );
}
