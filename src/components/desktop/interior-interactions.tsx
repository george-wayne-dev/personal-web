"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const chapters = [
  ["01", "作品", "/projects"],
  ["02", "文章", "/essays"],
  ["03", "关于", "/about"],
] as const;

export function InteriorChapterBar({ current }: { current: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const trigger = document.querySelector<HTMLElement>(
      "[data-interior-sticky-trigger]",
    );
    if (!trigger) return;

    const update = () =>
      setVisible(trigger.getBoundingClientRect().bottom <= 52);
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <nav
      className={`desktop-chapter-bar interior-chapter-bar${visible ? " is-visible" : ""}`}
      aria-label="快捷栏目导航"
    >
      <div className="desktop-chapter-inner">
        <Link className="desktop-back-top" href="/">
          <span aria-hidden="true">←</span>
          <span>返回首页</span>
        </Link>
        <div className="desktop-chapter-links">
          {chapters.map(([number, label, href]) => (
            <Link
              className="desktop-chapter-link"
              href={href}
              aria-current={current === href ? "page" : undefined}
              key={href}
            >
              <span>{number}</span>
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

export type InteriorFilterOption = {
  value: string;
  label: string;
  total: string;
};

export function InteriorFilterDock({
  options,
  active,
  visible,
  unit,
  onChange,
  label,
}: {
  options: InteriorFilterOption[];
  active: string;
  visible: number;
  unit: string;
  onChange: (value: string) => void;
  label: string;
}) {
  return (
    <div className="interior-filter-dock">
      <div className="interior-filters" aria-label={label}>
        {options.map((option) => (
          <button
            className="interior-filter-button"
            type="button"
            aria-pressed={active === option.value}
            onClick={() => onChange(option.value)}
            key={option.value}
          >
            {option.label} / {option.total}
          </button>
        ))}
      </div>
      <div className="interior-result-summary">
        <span className="mono">显示</span>
        <span className="mono">
          {String(visible).padStart(2, "0")} {unit}
        </span>
      </div>
    </div>
  );
}
