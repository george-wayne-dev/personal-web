"use client";

import { useEffect, useRef, useState } from "react";
import type { MarkdownHeading } from "@/lib/content";

export function ArticleToc({ headings }: { headings: MarkdownHeading[] }) {
  const ref = useRef<HTMLDetailsElement>(null);
  const [active, setActive] = useState(headings[0]?.id ?? "");

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1240px)");
    const sync = () => {
      if (ref.current) ref.current.open = wide.matches;
    };
    sync();
    wide.addEventListener("change", sync);
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries.find((item) => item.isIntersecting);
        if (entry) setActive(entry.target.id);
      },
      { rootMargin: "0px 0px -65% 0px" },
    );
    for (const heading of headings) {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    }
    return () => {
      wide.removeEventListener("change", sync);
      observer.disconnect();
    };
  }, [headings]);

  return (
    <aside className="landscape-reader-aside">
      <details ref={ref} className="landscape-toc">
        <summary>
          文章目录 <span aria-hidden="true">＋</span>
        </summary>
        <nav aria-label="文章目录">
          {headings.map((heading) => (
            <a
              href={`#${heading.id}`}
              key={heading.id}
              aria-current={active === heading.id ? "location" : undefined}
              onClick={() => setActive(heading.id)}
            >
              {heading.label}
            </a>
          ))}
        </nav>
      </details>
    </aside>
  );
}
