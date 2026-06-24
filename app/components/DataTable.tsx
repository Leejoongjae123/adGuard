"use client";

import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface Column<T> {
  key: string;
  header: string;
  width?: string;
  render?: (row: T, index: number) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  totalCount?: number;
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onRowClick?: (row: T) => void;
  checkbox?: boolean;
  emptyMessage?: string;
}

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  totalCount,
  currentPage = 1,
  pageSize = 10,
  onPageChange,
  onRowClick,
  checkbox = false,
  emptyMessage = "데이터가 없습니다.",
}: DataTableProps<T>) {
  const totalPages = totalCount ? Math.ceil(totalCount / pageSize) : 1;

  return (
    <div
      className="overflow-hidden rounded-xl border"
      style={{ background: "var(--color-card)", borderColor: "var(--color-border)" }}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "var(--color-bg)", borderBottom: "1px solid var(--color-border)" }}>
              {checkbox && (
                <th className="w-10 px-4 py-3">
                  <input type="checkbox" className="rounded" />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-xs font-semibold"
                  style={{ color: "var(--color-text-secondary)", width: col.width }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (checkbox ? 1 : 0)}
                  className="px-4 py-16 text-center text-sm"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr
                  key={i}
                  onClick={() => onRowClick?.(row)}
                  className={clsx(
                    "border-t transition-colors",
                    onRowClick && "cursor-pointer hover:bg-slate-50"
                  )}
                  style={{ borderColor: "var(--color-border)" }}
                >
                  {checkbox && (
                    <td className="w-10 px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" className="rounded" />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-sm" style={{ color: "var(--color-text)" }}>
                      {col.render ? col.render(row, i) : String(row[col.key] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalCount !== undefined && (
        <div
          className="flex items-center justify-between border-t px-4 py-3"
          style={{ borderColor: "var(--color-border)" }}
        >
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            총 {totalCount}건
          </p>
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage <= 1}
              onClick={() => onPageChange?.(currentPage - 1)}
              className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-3 text-xs font-medium" style={{ color: "var(--color-text-secondary)" }}>
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange?.(currentPage + 1)}
              className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
