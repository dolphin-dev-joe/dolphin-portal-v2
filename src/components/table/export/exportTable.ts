import type {
  ColumnExport,
  ColumnTable,
  DataTableExportOptions,
  ExportValue,
} from "../types";

export type ExportFormat = "xlsx" | "pdf";

type CellFormat = NonNullable<ColumnExport<unknown>["format"]>;

export interface ResolvedExportColumn<T> {
  title: string;
  format: CellFormat;
  width?: number;
  value: (item: T) => ExportValue;
}

function getByPath(item: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>(
    (acc, key) => (acc == null ? undefined : (acc as Record<string, unknown>)[key]),
    item,
  );
}

function rawValue(item: unknown, key: string): ExportValue {
  const v = getByPath(item, key);
  if (v == null) return v as null | undefined;
  if (v instanceof Date || ["string", "number", "boolean"].includes(typeof v)) {
    return v as ExportValue;
  }
  return JSON.stringify(v);
}

/** Table columns (minus `export: false`) followed by the export-only extras. */
export function resolveExportColumns<T>(
  columns: ColumnTable<T>[],
  options: DataTableExportOptions<T>,
): ResolvedExportColumn<T>[] {
  const fromTable = columns
    .filter((c) => c.export !== false)
    .map((c) => {
      const ex = (c.export || {}) as ColumnExport<T>;
      return {
        title: ex.title ?? c.title,
        format: ex.format ?? "text",
        width: ex.width,
        value: ex.value ?? ((item: T) => rawValue(item, c.key)),
      };
    });
  const extras = (options.extraColumns ?? []).map((c) => ({
    title: c.title,
    format: c.format ?? "text",
    width: c.width,
    value: c.value ?? ((item: T) => rawValue(item, c.key)),
  }));
  return [...fromTable, ...extras];
}

// ─── Value helpers ────────────────────────────────────────────────────────────

function toNumber(v: ExportValue): number | null {
  if (v == null || v === "") return null;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}

function toDate(v: ExportValue): Date | null {
  if (v == null || v === "") return null;
  const d = v instanceof Date ? v : new Date(String(v));
  return Number.isNaN(d.getTime()) ? null : d;
}

function toText(v: ExportValue): string {
  if (v == null) return "";
  if (typeof v === "boolean") return v ? "Ya" : "Tidak";
  if (v instanceof Date) return formatDateText(v, true);
  return String(v);
}

const pad = (n: number) => String(n).padStart(2, "0");

function formatDateText(d: Date, withTime: boolean) {
  const date = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
  return withTime ? `${date} ${pad(d.getHours())}:${pad(d.getMinutes())}` : date;
}

/** Text shown in a PDF cell. */
function pdfText(v: ExportValue, format: CellFormat): string {
  switch (format) {
    case "currency": {
      const n = toNumber(v);
      return n == null ? "-" : `Rp ${n.toLocaleString("id-ID")}`;
    }
    case "number": {
      const n = toNumber(v);
      return n == null ? "-" : n.toLocaleString("id-ID");
    }
    case "date":
    case "datetime": {
      const d = toDate(v);
      return d ? formatDateText(d, format === "datetime") : "-";
    }
    default:
      return toText(v) || "-";
  }
}

/** "transaksi-pos-2026-11-21" */
export function datedFileName(base: string) {
  const d = new Date();
  return `${base}-${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// ─── Excel ────────────────────────────────────────────────────────────────────

const EXCEL_FORMAT: Partial<Record<CellFormat, string>> = {
  currency: '"Rp" #,##0',
  number: "#,##0.##",
  date: "dd/mm/yyyy",
  datetime: "dd/mm/yyyy hh:mm",
};

// Excel dates have no time zone and the writer reads the UTC fields, so move
// the wall-clock time the admin sees into UTC (10:00 WIB stays 10:00).
function asExcelDate(d: Date) {
  return new Date(d.getTime() - d.getTimezoneOffset() * 60_000);
}

export async function exportExcel<T>(
  rows: T[],
  columns: ResolvedExportColumn<T>[],
  fileName: string,
  sheetName: string,
) {
  const { default: writeXlsxFile } = await import("write-excel-file/browser");

  const header = columns.map((c) => ({ value: c.title, fontWeight: "bold" as const }));
  const body = rows.map((row) =>
    columns.map((c) => {
      const v = c.value(row);
      switch (c.format) {
        case "currency":
        case "number": {
          const n = toNumber(v);
          return n == null ? null : { value: n, type: Number, format: EXCEL_FORMAT[c.format] };
        }
        case "date":
        case "datetime": {
          const d = toDate(v);
          return d ? { value: asExcelDate(d), type: Date, format: EXCEL_FORMAT[c.format] } : null;
        }
        default: {
          const text = toText(v);
          return text ? { value: text, type: String } : null;
        }
      }
    }),
  );

  const widths = columns.map((c, i) => {
    if (c.width) return { width: c.width };
    const longest = Math.max(
      c.title.length,
      ...body.slice(0, 200).map((r) => {
        const cell = r[i];
        return cell ? pdfText(cell.value as ExportValue, c.format).length : 0;
      }),
    );
    return { width: Math.min(Math.max(longest + 2, 10), 50) };
  });

  // Excel caps sheet names at 31 characters and bans a few symbols.
  const sheet = sheetName.replace(/[\\/?*[\]:]/g, " ").slice(0, 31) || "Data";

  await writeXlsxFile([header, ...body], {
    sheet,
    columns: widths,
    stickyRowsCount: 1,
  }).toFile(`${fileName}.xlsx`);
}

// ─── PDF ──────────────────────────────────────────────────────────────────────

export async function exportPdf<T>(
  rows: T[],
  columns: ResolvedExportColumn<T>[],
  fileName: string,
  title: string,
  subtitle: string,
) {
  const [{ jsPDF }, { autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);

  const doc = new jsPDF({
    orientation: columns.length > 5 ? "landscape" : "portrait",
    unit: "mm",
    format: "a4",
  });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(title, 14, 16);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(110);
  doc.text(subtitle, 14, 22);
  doc.setTextColor(0);

  const numeric = new Set(
    columns.flatMap((c, i) => (c.format === "currency" || c.format === "number" ? [i] : [])),
  );

  autoTable(doc, {
    startY: 27,
    head: [columns.map((c) => c.title)],
    body: rows.map((row) => columns.map((c) => pdfText(c.value(row), c.format))),
    styles: { fontSize: 8, cellPadding: 1.8, overflow: "linebreak" },
    headStyles: { fillColor: [30, 64, 175], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    margin: { left: 14, right: 14, bottom: 14 },
    didParseCell: (data) => {
      if (numeric.has(data.column.index)) data.cell.styles.halign = "right";
    },
    didDrawPage: (data) => {
      doc.setFontSize(8);
      doc.setTextColor(140);
      doc.text(`Dolphin Laundry Portal`, 14, pageHeight - 7);
      doc.text(`Hal. ${data.pageNumber}`, pageWidth - 14, pageHeight - 7, { align: "right" });
      doc.setTextColor(0);
    },
  });

  doc.save(`${fileName}.pdf`);
}
