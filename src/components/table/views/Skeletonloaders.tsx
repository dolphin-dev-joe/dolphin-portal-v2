import { Skeleton } from "@heroui/react";
import { cn } from "@heroui/react";
import type { BaseRecord } from "@refinedev/core";
import { ColumnTable } from "../types";
// import type { ColumnTable } from "./types";

// ─── Deterministic-varied widths so bones look like real data ───────────────
const COL_WIDTHS = ["w-1/2", "w-2/3", "w-1/3", "w-3/5", "w-2/5", "w-4/5", "w-1/4"];
function boneWidth(colIdx: number, rowIdx: number) {
  return COL_WIDTHS[(colIdx * 3 + rowIdx) % COL_WIDTHS.length];
}

// ─── Card View Skeleton ──────────────────────────────────────────────────────

interface CardViewSkeletonProps<T extends BaseRecord> {
  columns: ColumnTable<T>[];
  hasActions: boolean;
  count?: number;
}

export function CardViewSkeleton<T extends BaseRecord>({
  columns,
  hasActions,
  count = 6,
}: CardViewSkeletonProps<T>) {
  const fieldCount = Math.max(
    0,
    columns.filter((c) => c.key !== "actions").length - 1,
  );

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
      {Array.from({ length: count }).map((_, cardIdx) => (
        <div
          key={cardIdx}
          className="overflow-hidden rounded-3xl border border-separator bg-surface"
        >
          {/* Title row */}
          <div className="border-l-4 border-accent/40 bg-accent-soft px-4 py-3.5">
            <Skeleton className="h-5 w-2/3 rounded-md" />
          </div>

          {/* Key-value field rows — one per extra column */}
          <div className="divide-y divide-separator px-4">
            {Array.from({ length: fieldCount }).map((_, fieldIdx) => (
              <div key={fieldIdx} className="flex items-center justify-between py-3">
                <Skeleton className="h-3.5 w-1/4 rounded-md" />
                <Skeleton
                  className={cn("h-3.5 rounded-md", boneWidth(1, fieldIdx))}
                />
              </div>
            ))}
          </div>

          {/* Action buttons */}
          {hasActions && (
            <div className="flex items-center justify-end gap-2 border-t border-separator bg-surface-secondary px-4 py-2">
              <Skeleton className="size-8 rounded-lg" />
              <Skeleton className="size-8 rounded-lg" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Table View Skeleton ─────────────────────────────────────────────────────

interface TableViewSkeletonProps<T extends BaseRecord> {
  columns: ColumnTable<T>[];
  hasActions: boolean;
  count?: number;
}

export function TableViewSkeleton<T extends BaseRecord>({
  columns,
  hasActions,
  count = 8,
}: TableViewSkeletonProps<T>) {
  const visibleCols = columns.filter((c) => c.key !== "actions");

  return (
    <div className="hidden p-2 lg:block">
      <div className="overflow-x-auto">
        <table className="w-full min-w-150 table-auto border-separate border-spacing-0">
          {/* Header */}
          <thead>
            <tr>
              {visibleCols.map((col, idx) => (
                <th
                  key={col.key}
                  className={cn(
                    "bg-accent-soft py-3.5 first:rounded-s-2xl last:rounded-e-2xl",
                    idx === 0 ? "pl-6 pr-4" : "px-4",
                    col.align === "center" && "text-center",
                    col.align === "end" && "text-end",
                  )}
                >
                  <Skeleton
                    className={cn(
                      "h-3.5 w-20 rounded-md",
                      col.align === "center" && "mx-auto",
                      col.align === "end" && "ml-auto",
                    )}
                  />
                </th>
              ))}
              {hasActions && (
                <th className="rounded-e-2xl bg-accent-soft py-3.5 pl-4 pr-6 text-end">
                  <Skeleton className="ml-auto h-3.5 w-14 rounded-md" />
                </th>
              )}
            </tr>
          </thead>

          {/* Body rows */}
          <tbody>
            {Array.from({ length: count }).map((_, rowIdx) => (
              <tr
                key={rowIdx}
                className="even:bg-surface-secondary"
              >
                {visibleCols.map((col, colIdx) => (
                  <td
                    key={col.key}
                    className={cn(
                      "py-3.5",
                      colIdx === 0 ? "pl-6 pr-4" : "px-4",
                      col.align === "center" && "text-center",
                      col.align === "end" && "text-end",
                    )}
                  >
                    <Skeleton
                      className={cn(
                        "h-4 rounded-md",
                        boneWidth(colIdx, rowIdx),
                        col.align === "center" && "mx-auto",
                        col.align === "end" && "ml-auto",
                      )}
                    />
                  </td>
                ))}
                {hasActions && (
                  <td className="py-3.5 pl-4 pr-6">
                    <div className="flex items-center justify-end gap-1.5">
                      <Skeleton className="size-8 rounded-lg" />
                      <Skeleton className="size-8 rounded-lg" />
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}