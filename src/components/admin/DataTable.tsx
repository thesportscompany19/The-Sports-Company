"use client";

import { useState, useMemo, useEffect } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface TableColumn<T> {
  key: string;
  label: string;
  sortable?: boolean;
  /** Return the comparable value used for sorting */
  getValue?: (item: T) => string | number;
  render: (item: T, index: number) => React.ReactNode;
  /** Extra className on <td> */
  className?: string;
  /** Extra className on <th>; defaults to "text-left" */
  headerClassName?: string;
}

interface DataTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
  defaultPageSize?: number;
}

const PAGE_SIZES = [10, 25, 50];

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = "No records found.",
  defaultPageSize = 10,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  useEffect(() => {
    setPage(1);
  }, [data.length]);

  const sorted = useMemo(() => {
    if (!sortKey) return data;
    const col = columns.find((c) => c.key === sortKey);
    if (!col?.getValue) return data;
    return [...data].sort((a, b) => {
      const av = col.getValue!(a);
      const bv = col.getValue!(b);
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [data, sortKey, sortDir, columns]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

  function handleSort(key: string) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  }

  // Build a compact page list: always show first, last, and ±1 around current
  const pageList = useMemo<(number | "…")[]>(() => {
    const pages: (number | "…")[] = [];
    for (let p = 1; p <= totalPages; p++) {
      if (p === 1 || p === totalPages || Math.abs(p - safePage) <= 1) {
        if (pages.length > 0 && typeof pages[pages.length - 1] === "number" && (p - (pages[pages.length - 1] as number)) > 1) {
          pages.push("…");
        }
        pages.push(p);
      }
    }
    return pages;
  }, [totalPages, safePage]);

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/70">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                  className={cn(
                    "px-4 py-3 font-medium text-xs uppercase tracking-wide text-gray-500",
                    col.sortable && "cursor-pointer select-none hover:text-[#0B1C2D] hover:bg-gray-100/60 transition-colors",
                    col.headerClassName ?? "text-left",
                  )}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {col.sortable && (
                      sortKey === col.key ? (
                        sortDir === "asc"
                          ? <ChevronUp className="size-3 text-[#C62828]" />
                          : <ChevronDown className="size-3 text-[#C62828]" />
                      ) : (
                        <ChevronsUpDown className="size-3 opacity-30" />
                      )
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-14 text-gray-400 text-sm">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paged.map((item, i) => (
                <tr key={keyExtractor(item)} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className={cn("px-4 py-3", col.className)}>
                      {col.render(item, (safePage - 1) * pageSize + i + 1)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {sorted.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-gray-100 bg-gray-50/40">
          {/* Rows per page */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Rows per page:</span>
            <Select
              value={String(pageSize)}
              onValueChange={(v) => { setPageSize(Number(v)); setPage(1); }}
            >
              <SelectTrigger className="h-7 w-16 text-xs px-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZES.map((s) => (
                  <SelectItem key={s} value={String(s)} className="text-xs">{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="hidden sm:inline text-gray-400">
              {(safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, sorted.length)} of {sorted.length}
            </span>
          </div>

          {/* Page numbers */}
          <div className="flex items-center gap-1">
            <button
              disabled={safePage <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-1 rounded hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="size-4" />
            </button>

            {pageList.map((item, idx) =>
              item === "…" ? (
                <span key={`ellipsis-${idx}`} className="px-1 text-xs text-gray-400 select-none">…</span>
              ) : (
                <button
                  key={item}
                  onClick={() => setPage(item as number)}
                  className={cn(
                    "min-w-7 h-7 rounded text-xs font-medium transition-colors",
                    safePage === item
                      ? "bg-[#C62828] text-white shadow-sm"
                      : "hover:bg-gray-200 text-gray-600",
                  )}
                >
                  {item}
                </button>
              )
            )}

            <button
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-1 rounded hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
