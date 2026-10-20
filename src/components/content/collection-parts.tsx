import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ContentCollection, ContentPreview } from "@/lib/content/schema";
import {
  displayCategory,
  displayDate,
  groupBy,
  kindLabels,
  monthKey,
} from "@/lib/content/presentation";
import { cn } from "@/lib/utils";

const filterOptions: Record<ContentCollection, string[]> = {
  projects: ["all", "ai", "web", "mobile", "other"],
  essays: ["all", "ai", "engineering", "product", "learning"],
  notes: ["all", "ai", "engineering", "design", "learning"],
};

export function FilterBar({
  collection,
  active,
  count,
  onChange,
}: {
  collection: ContentCollection;
  active: string;
  count: number;
  onChange: (value: string) => void;
}) {
  return (
    <div className="filter-row">
      <div className="filter-buttons" aria-label="内容筛选">
        {filterOptions[collection].map((filter) => (
          <button
            className={cn(active === filter && "is-active")}
            onClick={() => onChange(filter)}
            type="button"
            key={filter}
          >
            {kindLabels[filter]}
          </button>
        ))}
      </div>
      <p>{String(count).padStart(2, "0")} entries</p>
    </div>
  );
}

export function contentUrl(item: ContentPreview) {
  return `/${item.collection}/${item.slug}`;
}

function ProjectCards({ items }: { items: ContentPreview[] }) {
  return (
    <div className="project-index-grid">
      {items.map((item) => (
        <Link
          className="project-index-card"
          href={contentUrl(item)}
          key={item.slug}
        >
          <div className="project-index-meta">
            <code>{item.code ?? "P / --"}</code>
            <span>{item.status ?? "记录中"}</span>
          </div>
          <h2>{item.title}</h2>
          <p>{item.summary}</p>
          <div className="project-index-foot">
            <span>{displayCategory(item)}</span>
            <ArrowUpRight aria-hidden="true" size={18} />
          </div>
        </Link>
      ))}
    </div>
  );
}

function EssayDirectory({ items }: { items: ContentPreview[] }) {
  const groups = groupBy(items, (item) => item.date.slice(0, 4));
  return (
    <div className="year-directory">
      {Object.entries(groups).map(([year, entries]) => (
        <section className="year-group" key={year}>
          <p className="year-label">{year}</p>
          <div className="essay-rows">
            {entries.map((item) => (
              <Link
                href={contentUrl(item)}
                className="essay-row"
                key={item.slug}
              >
                <code>{item.code ?? displayDate(item.date).slice(5)}</code>
                <div>
                  <h2>{item.title}</h2>
                  <p>{item.summary}</p>
                </div>
                <span>
                  {item.readingMinutes
                    ? `${item.readingMinutes} min`
                    : displayCategory(item)}
                </span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function NotesLedger({ items }: { items: ContentPreview[] }) {
  const groups = groupBy(items, (item) => monthKey(item.date));
  return (
    <div className="notes-ledger">
      {Object.entries(groups).map(([month, entries]) => (
        <section className="month-group" key={month}>
          <div className="month-stamp">
            <strong>{month.slice(5)}</strong>
            <span>{month.slice(0, 4)}</span>
          </div>
          <div className="note-rows">
            {entries.map((item) => (
              <Link
                href={contentUrl(item)}
                className="note-row"
                key={item.slug}
              >
                <code>{item.code ?? "N.--"}</code>
                <div>
                  <h2>{item.title}</h2>
                  <p>{item.summary}</p>
                </div>
                <span>{item.status ?? "Growing"}</span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export function Listing({
  collection,
  items,
}: {
  collection: ContentCollection;
  items: ContentPreview[];
}) {
  if (collection === "projects") return <ProjectCards items={items} />;
  if (collection === "essays") return <EssayDirectory items={items} />;
  return <NotesLedger items={items} />;
}
