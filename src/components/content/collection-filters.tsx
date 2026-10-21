import type {
  CollectionFilterProps,
  CollectionFilters,
} from "./collection-view.types";
import { kindLabels } from "@/lib/content/presentation";

export function CollectionFilterControls({
  items,
  filteredItems,
  filters,
  onFilterChange,
  onReset,
  collection,
}: CollectionFilterProps) {
  const fields: Array<{
    key: keyof CollectionFilters;
    label: string;
    options: string[];
  }> = [
    ...(collection === "projects"
      ? [
          {
            key: "kind" as const,
            label: "作品类型",
            options: [
              ...new Set(
                items.flatMap((item) => (item.kind ? [item.kind] : [])),
              ),
            ],
          },
        ]
      : []),
    {
      key: "category",
      label: "分类",
      options: [...new Set(items.map((item) => item.category))],
    },
    {
      key: "tag",
      label: "标签",
      options: [...new Set(items.flatMap((item) => item.tags))],
    },
    {
      key: "year",
      label: "年份",
      options: [...new Set(items.map((item) => item.date.slice(0, 4)))]
        .sort()
        .reverse(),
    },
  ];
  const active = Object.values(filters).filter(Boolean).length;
  const meaningfulFields = fields.filter(
    ({ key, options }) =>
      filters[key] ||
      (options.length &&
        !(
          key === "category" &&
          options.length === 1 &&
          options[0] === "未分类"
        )),
  );

  return (
    <div className="landscape-filter-bar">
      <details className="landscape-filters" open={active > 0 || undefined}>
        <summary>
          筛选 <span>{active ? `已选 ${active} 项` : "+"}</span>
        </summary>
        <div className="landscape-filter-fields">
          {meaningfulFields.map(({ key, label, options }) => (
            <label key={key}>
              <span>{label}</span>
              <select
                value={filters[key]}
                onChange={(event) => onFilterChange(key, event.target.value)}
              >
                <option value="">全部</option>
                {filters[key] && !options.includes(filters[key]) ? (
                  <option value={filters[key]}>{filters[key]}</option>
                ) : null}
                {options.map((option) => (
                  <option key={option} value={option}>
                    {key === "kind" ? (kindLabels[option] ?? option) : option}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      </details>
      <div className="landscape-filter-results">
        <p role="status" aria-live="polite">
          {filteredItems.length} 条{active ? ` / 共 ${items.length} 条` : ""}
        </p>
        {active ? (
          <button type="button" onClick={onReset}>
            清除筛选
          </button>
        ) : null}
      </div>
    </div>
  );
}
