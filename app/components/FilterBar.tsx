"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { DatePicker } from "./ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

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
  const [values, setValues] = useState<Record<string, string>>({});
  const [dates, setDates] = useState<Record<string, Date | undefined>>({});

  return (
    <div
      className="rounded-xl border p-4"
      style={{ background: "var(--color-card)", borderColor: "var(--color-border)" }}
    >
      {/* Labels row */}
      <div className="flex flex-wrap gap-3 mb-1.5">
        <div className="flex-1 min-w-[220px]">
          <Label className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>
            키워드
          </Label>
        </div>
        {filters.map((filter) => (
          <div key={filter.name} className="min-w-[140px]">
            <Label className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>
              {filter.label}
            </Label>
          </div>
        ))}
        {/* spacer matching button width */}
        <div className="w-[78px]" />
      </div>

      {/* Controls row — all items same height, items-center guarantees vertical alignment */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search
            className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 pointer-events-none"
            style={{ color: "var(--color-text-muted)" }}
          />
          <Input
            type="text"
            placeholder={searchPlaceholder}
            className="pl-9 h-9 text-sm"
          />
        </div>

        {filters.map((filter) => (
          <div key={filter.name} className="min-w-[140px]">
            {filter.type === "select" ? (
              <Select
                value={values[filter.name] ?? ""}
                onValueChange={(v) =>
                  setValues((prev) => ({ ...prev, [filter.name]: v ?? "" }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={filter.placeholder ?? "전체"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  {filter.options?.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <DatePicker
                value={dates[filter.name]}
                onChange={(date) =>
                  setDates((prev) => ({ ...prev, [filter.name]: date }))
                }
                placeholder={filter.placeholder ?? "날짜 선택"}
              />
            )}
          </div>
        ))}

        <Button
          onClick={onSearch}
          size="sm"
          className="h-9 px-5"
          style={{ background: "var(--color-primary)" }}
        >
          <Search className="h-3.5 w-3.5 mr-1.5" />
          조회
        </Button>
      </div>
    </div>
  );
}
