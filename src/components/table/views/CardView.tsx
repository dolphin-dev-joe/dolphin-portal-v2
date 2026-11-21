import { Button, Card, Dropdown, Typography } from "@heroui/react";
// import {
//   PencilIcon,
//   EyeIcon,
//   TrashIcon,
//   EllipsisVerticalIcon,
// } from "@heroicons/react/24/outline";
import { Icon } from "@iconify/react";
import type { BaseRecord } from "@refinedev/core";
import { ActionButton } from "../types";
import type { ColumnTable, CustomRowActionButton } from "../types";
import { AlertDialog } from "@/components/alert-dialog";
import { ColumnTitle, HintTooltip } from "../TableTooltip";

interface CardViewProps<T extends BaseRecord> {
  rows: T[];
  columns: ColumnTable<T>[];
  actionColumns: ActionButton[];
  customRowActionButtons?: CustomRowActionButton<T>[];
  onEdit: (id: string | number) => void;
  onShow: (id: string | number) => void;
  onDelete: (row: T) => void;
}

export function CardView<T extends BaseRecord>({
  rows,
  columns,
  actionColumns,
  customRowActionButtons = [],
  onEdit,
  onShow,
  onDelete,
}: CardViewProps<T>) {
  const hasRowActions =
    actionColumns.some((a) =>
      [ActionButton.Edit, ActionButton.Show, ActionButton.Delete].includes(a),
    ) || customRowActionButtons.length > 0;

  const getColumnValue = (row: T, column: ColumnTable<T>) => {
    if (column.render) return column.render(row);
    if (column.valueGetter) return column.valueGetter(row);
    return String(row[column.key] ?? "-");
  };

  const rowsArray = Array.isArray(rows) ? rows : [];

  if (rowsArray.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-separator py-12 text-center lg:hidden">
        <span className="flex size-12 items-center justify-center rounded-full bg-accent-soft text-accent">
          <Icon icon="heroicons:inbox" className="size-6" />
        </span>
        <Typography type="body-sm" className="font-medium">
          Belum ada data
        </Typography>
        <Typography type="body-xs" color="muted">
          Data yang cocok akan muncul di sini.
        </Typography>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
      {rowsArray.map((row) => {
        const firstColumn = columns[0];
        const otherColumns = columns.filter(
          (col) => col.key !== firstColumn?.key && col.key !== "actions",
        );

        return (
          <Card
            key={String(row.id)}
            className="overflow-hidden transition-shadow hover:shadow-lg"
          >
            <Card.Content className="gap-0 p-0">
              {/* Header - first column as title on a soft accent gradient */}
              <div className="flex items-center gap-3 bg-linear-to-r from-accent/15 via-accent/5 to-transparent px-4 py-3.5">
                <span className="size-2 shrink-0 rounded-full bg-accent" />
                <Typography
                  type="body"
                  className="min-w-0 truncate font-semibold text-foreground"
                >
                  {firstColumn ? getColumnValue(row, firstColumn) : String(row.id)}
                </Typography>
              </div>

              {/* Other columns - label above value in a 2-column grid */}
              {otherColumns.length > 0 && (
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 px-4 py-3.5">
                  {otherColumns.map((column) => (
                    <div key={column.key} className="flex min-w-0 flex-col gap-0.5">
                      <span className="text-xs text-accent/80">
                        <ColumnTitle title={column.title} tooltip={column.tooltip} />
                      </span>
                      <span className="min-w-0 wrap-break-word text-sm font-medium text-foreground">
                        {getColumnValue(row, column)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              {hasRowActions && (
                <div className="flex items-center justify-end gap-1 border-t border-accent/10 px-3 py-2">
                  {actionColumns.includes(ActionButton.Edit) && (
                    <Button
                      variant="ghost"
                      isIconOnly
                      size="sm"
                      aria-label="Edit"
                      className="text-accent hover:bg-accent-soft"
                      onPress={() => onEdit(row.id as string | number)}
                    >
                      <Icon icon="heroicons:pencil-square" className="size-4" />
                    </Button>
                  )}
                  {actionColumns.includes(ActionButton.Show) && (
                    <Button
                      variant="ghost"
                      isIconOnly
                      size="sm"
                      aria-label="View"
                      className="text-accent hover:bg-accent-soft"
                      onPress={() => onShow(row.id as string | number)}
                    >
                      <Icon icon="heroicons:eye" className="size-4" />
                    </Button>
                  )}
                  {actionColumns.includes(ActionButton.Delete) && (
                    <AlertDialog
                      triggerLabel="Delete"
                      triggerContent={<Icon icon="heroicons:trash" className="size-4" />}
                      triggerVariant="danger-soft"
                      triggerIsIconOnly
                      triggerAriaLabel="Delete"
                      title="Delete confirmation"
                      description="Are you sure you want to delete this data?"
                      confirmLabel="Delete"
                      cancelLabel="Cancel"
                      confirmVariant="danger"
                      onConfirm={() => onDelete(row as T)}
                    />
                  )}
                  {customRowActionButtons.map((btn) => {
                    if (btn.isVisible && !btn.isVisible(row)) return null;
                    const disabled = btn.isDisabled?.(row) ?? false;
                    if (btn.isVertical) {
                      const items = (btn.menuItems ?? []).filter(Boolean);
                      if (items.length === 0) return null;
                      return (
                        <Dropdown key={btn.key}>
                          <Dropdown.Trigger>
                            <Button
                              variant={btn.variant ?? "ghost"}
                              isIconOnly
                              size="sm"
                              isDisabled={disabled}
                              aria-label={
                                btn.ariaLabel ?? btn.label ?? "More actions"
                              }
                            >
                              {btn.icon ?? (
                                <Icon icon="heroicons:ellipsis-vertical" className="h-4 w-4" />
                              )}
                            </Button>
                          </Dropdown.Trigger>
                          <Dropdown.Popover>
                            <Dropdown.Menu
                              aria-label={btn.label ?? "Row actions"}
                            >
                              {items.map((item) => (
                                <Dropdown.Item
                                  key={item.key}
                                  id={item.key}
                                  isDisabled={item.isDisabled}
                                  onPress={() => {
                                    void item.onPress?.(row);
                                  }}
                                >
                                  <span className="flex items-center gap-2">
                                    {item.icon}
                                    {item.label}
                                  </span>
                                </Dropdown.Item>
                              ))}
                            </Dropdown.Menu>
                          </Dropdown.Popover>
                        </Dropdown>
                      );
                    }
                    const hint =
                      typeof btn.tooltip === "function" ? btn.tooltip(row) : btn.tooltip;
                    return (
                      <HintTooltip key={btn.key} content={hint}>
                        <Button
                          variant={btn.variant ?? "outline"}
                          isIconOnly={!btn.label}
                          size="sm"
                          isDisabled={disabled}
                          aria-label={btn.ariaLabel ?? btn.label ?? btn.key}
                          onPress={() => {
                            void btn.onPress?.(row);
                          }}
                        >
                          {btn.icon}
                          {btn.label}
                        </Button>
                      </HintTooltip>
                    );
                  })}
                </div>
              )}
            </Card.Content>
          </Card>
        );
      })}
    </div>
  );
}
