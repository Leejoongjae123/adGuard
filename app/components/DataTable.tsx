"use client";

import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";

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
        <Table className="table-fixed">
          <TableHeader>
            <TableRow style={{ background: "var(--color-bg)", borderColor: "var(--color-border)" }}>
              {checkbox && (
                <TableHead className="w-10 px-4 text-center">
                  <Checkbox />
                </TableHead>
              )}
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className="text-center"
                  style={{ color: "var(--color-text-secondary)", width: col.width }}
                >
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (checkbox ? 1 : 0)}
                  className="py-16 text-center text-sm"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, i) => (
                <TableRow
                  key={i}
                  onClick={() => onRowClick?.(row)}
                  className={clsx(onRowClick && "cursor-pointer")}
                  style={{ borderColor: "var(--color-border)" }}
                >
                  {checkbox && (
                    <TableCell className="w-10 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <Checkbox />
                    </TableCell>
                  )}
                  {columns.map((col) => (
                    <TableCell key={col.key} className="text-center" style={{ color: "var(--color-text)" }}>
                      {col.render ? col.render(row, i) : String(row[col.key] ?? "")}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
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
            <Button
              variant="ghost"
              size="icon-sm"
              disabled={currentPage <= 1}
              onClick={() => onPageChange?.(currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-3 text-xs font-medium" style={{ color: "var(--color-text-secondary)" }}>
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="ghost"
              size="icon-sm"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange?.(currentPage + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
