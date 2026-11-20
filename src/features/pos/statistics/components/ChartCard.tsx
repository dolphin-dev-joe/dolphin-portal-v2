import { Button, Card, cn } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useState, type ReactNode } from "react";

interface ChartCardProps {
  title: string;
  description?: ReactNode;
  /** Table view of the same data: every chart can be read without hovering. */
  table?: ReactNode;
  className?: string;
  children: ReactNode;
}

export default function ChartCard({ title, description, table, className, children }: ChartCardProps) {
  const [showTable, setShowTable] = useState(false);

  return (
    <Card className={cn("flex min-w-0 flex-col", className)}>
      <Card.Header className="flex flex-row items-start justify-between gap-3">
        <div className="min-w-0 space-y-0.5">
          <Card.Title>{title}</Card.Title>
          {description && <Card.Description>{description}</Card.Description>}
        </div>
        {table && (
          <Button
            isIconOnly
            size="sm"
            variant="ghost"
            aria-label={showTable ? `Tampilkan grafik ${title}` : `Tampilkan tabel ${title}`}
            aria-pressed={showTable}
            onPress={() => setShowTable((v) => !v)}
          >
            <Icon icon={showTable ? "mdi:chart-box-outline" : "mdi:table"} className="size-4.5" />
          </Button>
        )}
      </Card.Header>
      <Card.Content className="flex min-w-0 flex-1 flex-col">
        {showTable && table ? table : children}
      </Card.Content>
    </Card>
  );
}

/** Compact table used as the accessible twin of each chart. */
export function DataTableView({
  headers,
  rows,
  align,
}: {
  headers: string[];
  rows: ReactNode[][];
  /** "end" for numeric columns. */
  align?: ("start" | "end")[];
}) {
  return (
    <div className="max-h-80 overflow-auto rounded-lg border border-(--chart-grid)">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-surface-secondary">
          <tr>
            {headers.map((h, i) => (
              <th
                key={h}
                scope="col"
                className={cn(
                  "px-3 py-2 font-medium whitespace-nowrap text-muted",
                  align?.[i] === "end" ? "text-right" : "text-left"
                )}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r} className="border-t border-(--chart-grid)">
              {row.map((cell, i) => (
                <td
                  key={i}
                  className={cn(
                    "px-3 py-1.5 whitespace-nowrap",
                    align?.[i] === "end" && "text-right tabular-nums"
                  )}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
