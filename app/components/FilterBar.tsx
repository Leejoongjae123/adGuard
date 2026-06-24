"use client";

import { Search } from "lucide-react";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterField {
  name: string;
  label: string;
  type: "select" | "date";
  options?: FilterOption[];
  placeholder?: string;
}

interface FilterBarProps {
  searchPlaceholder?: string;
  filters?: FilterField[];
  onSearch?: () => void;
}

export default function FilterBar({
  searchPlaceholder = "검색어를 입력하세요",
  filters = [],
  onSearch,
}: FilterBarProps) {
  return (
    <div
      className="rounded-xl border p-4"
      style={{ background: "var(--color-card)", borderColor: "var(--color-border)" }}
    >
      <div className="flex flex-wrap items-end gap-3">
        {/* Search */}
        <div className="flex-1 min-w-[240px]">
          <label className="mb-1 block text-xs font-medium" style={{ color: "var(--color-text-secondary)" }}>
            키워드
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              className="h-9 w-full rounded-lg border pl-9 pr-3 text-sm outline-none transition-colors focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
              style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}
            />
          </div>
        </div>

        {/* Filter dropdowns */}
        {filters.map((filter) => (
          <div key={filter.name} className="min-w-[120px]">
            <label className="mb-1 block text-xs font-medium" style={{ color: "var(--color-text-secondary)" }}>
              {filter.label}
            </label>
            {filter.type === "select" ? (
              <select
                className="h-9 w-full rounded-lg border px-3 text-sm outline-none transition-colors focus:border-blue-400"
                style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}
              >
                <option value="">전체</option>
                {filter.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="date"
                className="h-9 w-full rounded-lg border px-3 text-sm outline-none transition-colors focus:border-blue-400"
                style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}
              />
            )}
          </div>
        ))}

        <button
          onClick={onSearch}
          className="h-9 rounded-lg px-5 text-sm font-medium text-white transition-colors hover:opacity-90"
          style={{ background: "var(--color-primary)" }}
        >
          <Search className="mr-1.5 inline h-3.5 w-3.5" />
          조회
        </button>
      </div>
    </div>
  );
}
