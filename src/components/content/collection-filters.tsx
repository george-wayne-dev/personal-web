import type {
  CollectionDeviceViewProps,
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
}: CollectionDeviceViewProps) {
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
      label: collection === "projects" ? "技术与标签" : "标签",
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
  return (
    <div className="collection-filter-controls">
      <div className="collection-filter-fields">
        {fields.map(({ key, label, options }) => (
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
      <div className="collection-filter-summary">
        <p role="status" aria-live="polite">
          显示 {filteredItems.length} / {items.length} 条
        </p>
        {Object.values(filters).some(Boolean) ? (
          <button type="button" onClick={onReset}>
            清除筛选
          </button>
        ) : null}
      </div>
    </div>
  );
}
