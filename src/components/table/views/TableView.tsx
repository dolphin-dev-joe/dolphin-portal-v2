import { useMemo } from "react";
import type { BaseRecord } from "@refinedev/core";
import {
  Button,
  cn,
  Dropdown,
  EmptyState,
  Table,
  Typography,
} from "@heroui/react";
// import {
//   PencilIcon,
//   EyeIcon,
//   TrashIcon,
//   InboxIcon,
//   EllipsisVerticalIcon,
// } from "@heroicons/react/24/outline";
import { ActionButton } from "../types";
import type { ColumnTable, CustomRowActionButton } from "../types";
import { AlertDialog } from "@/components/alert-dialog";
import { Icon } from "@iconify/react";

const ROW_ACTION_BUTTONS: ActionButton[] = [
  ActionButton.Edit,
  ActionButton.Show,
  ActionButton.Delete,
  ActionButton.Review,
  ActionButton.Copy,
];

interface TableViewProps<T extends BaseRecord> {
  rows: T[];
  columns: ColumnTable<T>[];
  actionColumns: ActionButton[];
  customRowActionButtons?: CustomRowActionButton<T>[];
  onEdit: (id: string | number) => void;
  onShow: (id: string | number) => void;
  onDelete: (row: T) => void;
}

export function TableView<T extends BaseRecord>({
  rows,
  columns,
  actionColumns,
  customRowActionButtons = [],
  onEdit,
  onShow,
  onDelete,
}: TableViewProps<T>) {
  const rowsArray = Array.isArray(rows) ? rows : [];
  const hasRowActions =
    actionColumns.some((a) => ROW_ACTION_BUTTONS.includes(a)) ||
    customRowActionButtons.length > 0;

  const columnsTable = useMemo<ColumnTable<T>[]>(() => {
    return [
      ...columns,
      ...(hasRowActions
        ? ([
            { key: "actions", title: "Actions", align: "end" },
          ] as ColumnTable<T>[])
        : []),
    ];
  }, [columns, actionColumns]);

  const getColumnContent = (row: T, column: ColumnTable<T>) => {
    if (column.key === "actions") return null;
    if (column.render) return column.render(row);
    if (column.valueGetter) return column.valueGetter(row);
    return String(row[column.key] ?? "-");
  };

  return (
    <div className="hidden p-2 lg:block">
      <Table variant="secondary">
        <Table.ScrollContainer>
          <Table.Content aria-label="Data table" className="min-w-150">
            <Table.Header>
              {columnsTable.map((column, idx) => (
                <Table.Column
                  key={column.key}
                  className={cn(
                    column.align === "center" && "text-center",
                    column.align === "end" && "text-end",
                    column.key === "actions" && "pr-6",
                    idx === 0 && "pl-6",
                  )}
                  isRowHeader={
                    column.isRowHeader ??
                    (columnsTable[0]?.key === "actions" ? idx === 1 : idx === 0)
                  }
                >
                  {column.title}
                </Table.Column>
              ))}
            </Table.Header>

            <Table.Body
              items={rowsArray}
              renderEmptyState={() => (
                <EmptyState className="flex h-full w-full flex-col items-center justify-center gap-3 py-12 text-center">
                  <span className="flex size-12 items-center justify-center rounded-full bg-accent-soft text-accent">
                    <Icon icon="heroicons:inbox" className="size-6" />
                  </span>
                  <Typography type="body-sm" className="font-medium">
                    Belum ada data
                  </Typography>
                  <Typography type="body-xs" color="muted">
                    Data yang cocok akan muncul di sini.
                  </Typography>
                </EmptyState>
              )}
            >
              {(row) => (
                <Table.Row key={String(row.id)}>
                  {columnsTable.map((column, idx) => (
                    <Table.Cell
                      key={`${String(row.id)}-${column.key}`}
                      className={cn(
                        column.align === "center" && "text-center",
                        column.align === "end" && "text-end",
                        column.key === "actions" && "pr-6",
                        idx === 0 && "pl-6 font-medium",
                      )}
                    >
                      {column.key === "actions" ? (
                        <div className="flex items-center justify-end gap-1">
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
                              className="text-muted hover:bg-default hover:text-foreground"
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
                            if (btn.isVisible && !btn.isVisible(row))
                              return null;
                            const disabled = btn.isDisabled?.(row) ?? false;
                            if (btn.isVertical) {
                              const items = (btn.menuItems ?? []).filter(
                                Boolean,
                              );
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
                                        btn.ariaLabel ??
                                        btn.label ??
                                        "More actions"
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
                                          onPress={() =>
                                            void item.onPress?.(row)
                                          }
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
                            return (
                              <Button
                                key={btn.key}
                                variant={btn.variant ?? "outline"}
                                isIconOnly={!btn.label}
                                size="sm"
                                isDisabled={disabled}
                                aria-label={
                                  btn.ariaLabel ?? btn.label ?? btn.key
                                }
                                onPress={() => void btn.onPress?.(row)}
                              >
                                {btn.icon}
                                {btn.label}
                              </Button>
                            );
                          })}
                        </div>
                      ) : (
                        getColumnContent(row, column)
                      )}
                    </Table.Cell>
                  ))}
                </Table.Row>
              )}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
    </div>
  );
}
