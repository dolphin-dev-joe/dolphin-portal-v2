import { useState } from "react";
import {
  useDataProvider,
  useNotification,
  type BaseRecord,
  type CrudFilters,
  type CrudSort,
} from "@refinedev/core";

import type { ColumnTable, DataTableExportOptions } from "../types";
import {
  datedFileName,
  exportExcel,
  exportPdf,
  resolveExportColumns,
  type ExportFormat,
} from "./exportTable";

// The API serves at most 1000 rows per page.
const PAGE_SIZE = 1000;
// Guards the browser against a runaway export; a PDF this long is unusable anyway.
const MAX_ROWS = 20_000;

interface UseTableExportOptions<T> {
  resource: string;
  label?: string;
  columns: ColumnTable<T>[];
  filters: CrudFilters;
  sorters?: CrudSort[];
  options?: DataTableExportOptions<T>;
}

/**
 * Exports every row matching the table's current search and filters (not
 * only the visible page) to Excel or PDF.
 */
export function useTableExport<T extends BaseRecord>({
  resource,
  label,
  columns,
  filters,
  sorters,
  options,
}: UseTableExportOptions<T>) {
  const getDataProvider = useDataProvider();
  const { open: notify } = useNotification();
  const [exporting, setExporting] = useState<ExportFormat | null>(null);

  const fetchAll = async () => {
    const rows: T[] = [];
    let total = 0;
    for (let page = 1; rows.length < MAX_ROWS; page++) {
      const res = await getDataProvider().getList<T>({
        resource,
        filters,
        sorters,
        pagination: { currentPage: page, pageSize: PAGE_SIZE },
      });
      rows.push(...res.data);
      total = res.total;
      if (res.data.length < PAGE_SIZE || rows.length >= total) break;
    }
    return { rows: rows.slice(0, MAX_ROWS), total };
  };

  const exportAs = async (format: ExportFormat) => {
    if (!options || exporting) return;
    setExporting(format);
    try {
      const { rows, total } = await fetchAll();
      if (rows.length === 0) {
        notify?.({ type: "error", message: "Tidak ada data untuk diekspor." });
        return;
      }
      const cols = resolveExportColumns(columns, options);
      const fileName = datedFileName(options.fileName);
      const title = options.title ?? label ?? options.fileName;

      if (format === "xlsx") {
        await exportExcel(rows, cols, fileName, title);
      } else {
        const printedAt = new Date().toLocaleString("id-ID", {
          dateStyle: "long",
          timeStyle: "short",
        });
        await exportPdf(rows, cols, fileName, title, `${rows.length} data · dicetak ${printedAt}`);
      }

      notify?.({
        type: "success",
        message:
          total > rows.length
            ? `Diekspor ${rows.length} dari ${total} data (batas ${MAX_ROWS}). Persempit filter untuk sisanya.`
            : `${rows.length} data diekspor ke ${format === "xlsx" ? "Excel" : "PDF"}.`,
      });
    } catch (e) {
      console.error("[export]", e);
      notify?.({ type: "error", message: "Gagal mengekspor data. Coba lagi." });
    } finally {
      setExporting(null);
    }
  };

  return { exportAs, exporting };
}
