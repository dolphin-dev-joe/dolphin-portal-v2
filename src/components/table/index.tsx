import { useState } from "react";
import type { BaseRecord } from "@refinedev/core";
import { Pagination, Select, ListBox } from "@heroui/react";
import { Icon } from "@iconify/react";

import {
  ActionButton,
  type ActionButtonHandlerMap,
  type ColumnTable,
  type CustomActionButton,
  type CustomFilter,
  type CustomRowActionButton,
} from "./types";
import { TableToolbar } from "./TableToolbar";
import { CardView, TableView } from "./views";
import { useDataTableData } from "./hooks/useDataTableData";
import { useDataTableActions } from "./hooks/useDataTableActions";
import { CardViewSkeleton, TableViewSkeleton } from "./views/Skeletonloaders";
import LoadingScreen from "@components/loading/LoadingScreen";
// import { CardViewSkeleton, TableViewSkeleton } from "./SkeletonLoaders";

/** Returns page numbers to render, with null representing an ellipsis. */
function buildPageItems(current: number, total: number): (number | null)[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const items: (number | null)[] = [1];
  if (current > 3) items.push(null);
  for (
    let p = Math.max(2, current - 1);
    p <= Math.min(total - 1, current + 1);
    p++
  ) {
    items.push(p);
  }
  if (current < total - 2) items.push(null);
  items.push(total);
  return items;
}

interface DataTableProps<T extends BaseRecord> {
  resource: string;
  resourceDelete?: string;
  columns: ColumnTable<T>[];
  actionColumns?: ActionButton[];
  label?: string;
  description?: string;
  pageSize?: number;
  /**
   * Whether the API supports pagination (?page=1&limit=10).
   * Set to `false` for endpoints that return all results at once.
   * @default true
   */
  withPagination?: boolean;
  withSearch?: boolean;
  customActionButtons?: CustomActionButton[];
  customRowActionButtons?: CustomRowActionButton<T>[];
  customFilters?: CustomFilter<T>[];
  /** Filters yang selalu dikirim & dikunci (mis. status=cancelled). */
  permanentFilters?: { field: string; value: string | boolean }[];
  onActionPress?: Partial<ActionButtonHandlerMap<T>>;
}

const ROW_ACTION_BUTTONS: ActionButton[] = [
  ActionButton.Edit,
  ActionButton.Show,
  ActionButton.Delete,
  ActionButton.Review,
  ActionButton.Copy,
];

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export default function DataTable<T extends BaseRecord>({
  resource,
  resourceDelete = undefined,
  columns,
  actionColumns = [],
  label,
  description,
  pageSize: initialPageSize = 10,
  withPagination = true,
  withSearch = false,
  customActionButtons = [],
  customRowActionButtons = [],
  customFilters = [],
  permanentFilters = [],
  onActionPress,
}: DataTableProps<T>) {
  const [searchValue, setSearchValue] = useState("");
  const [filterValues, setFilterValues] = useState<
    Record<string, Set<string | boolean>>
  >({});
  const [pageSize, setPageSize] = useState(initialPageSize);

  const {
    rows,
    total,
    totalPages,
    page,
    pageSize: ps,
    setPage,
    isLoading,
    isError,
  } = useDataTableData<T>({
    resource,
    pageSize,
    withPagination,
    searchValue,
    filterValues,
    permanentFilters,
  });

  const { handleCreate, handleEdit, handleShow, handleDelete } =
    useDataTableActions({ resource, resourceDelete });

  const hasRowActions =
    actionColumns.some((a) => ROW_ACTION_BUTTONS.includes(a)) ||
    customRowActionButtons.length > 0;

  const handleExport = async () => {
    await onActionPress?.[ActionButton.Export]?.(rows as T[]);
  };
  const handleImport = async () => {
    await onActionPress?.[ActionButton.Import]?.(rows as T[]);
  };

  const handleConfirmDelete = async (row: T) => {
    if (onActionPress?.[ActionButton.Delete]) {
      await onActionPress[ActionButton.Delete](row as T);
      return;
    }
    await handleDelete(row.id as string | number);
  };

  return (
    <div className="flex flex-col gap-4">
      <TableToolbar<T>
        label={label}
        description={description}
        isCardMode={false}
        withSearch={withSearch}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        actionColumns={actionColumns}
        customActionButtons={customActionButtons}
        customFilters={customFilters}
        filterValues={filterValues}
        setFilterValues={setFilterValues}
        onActionPress={onActionPress}
        computedRows={rows}
        handleCreate={handleCreate}
        handleExport={handleExport}
        handleImport={handleImport}
      />

      {isError ? (
        <div className="py-6 text-center text-danger">Failed to load data.</div>
      ) : isLoading ? (
        <>
        <LoadingScreen isLoading={isLoading}/>
          {/* ── Card skeleton (mobile / tablet) ── */}
          <CardViewSkeleton<T>
            columns={columns}
            hasActions={hasRowActions}
            count={pageSize}
          />

          {/* ── Table skeleton (desktop) ── */}
          <TableViewSkeleton<T>
            columns={columns}
            hasActions={hasRowActions}
            count={pageSize}
          />
        </>
      ) : (
        <>
          {/* Card View for mobile/tablet */}
          <CardView
            rows={rows}
            columns={columns}
            actionColumns={actionColumns}
            customRowActionButtons={customRowActionButtons}
            onEdit={handleEdit}
            onShow={handleShow}
            onDelete={handleConfirmDelete}
          />

          {/* Table View for desktop */}
          <TableView
            rows={rows}
            columns={columns}
            actionColumns={actionColumns}
            customRowActionButtons={customRowActionButtons}
            onEdit={handleEdit}
            onShow={handleShow}
            onDelete={handleConfirmDelete}
          />

          {/* Footer: page-size selector + pagination */}
          {withPagination && total > 0 && (
            <div className="mt-2 flex flex-col-reverse items-center justify-between gap-4 border-t border-divider pt-4 sm:flex-row">
              {/* Left: result count + page-size selector */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <div className="flex items-center gap-1.5 rounded-lg bg-default-100 px-3 py-1.5 text-sm text-muted-foreground">
                  <Icon icon="mdi:database-outline" className="h-4 w-4 shrink-0" />
                  <span>
                    <span className="font-semibold text-foreground">
                      {Math.min((page - 1) * ps + 1, total)}
                    </span>
                    {"–"}
                    <span className="font-semibold text-foreground">
                      {Math.min(page * ps, total)}
                    </span>
                    {" dari "}
                    <span className="font-semibold text-foreground">{total}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="hidden sm:inline">Baris per halaman</span>
                  <Select
                    aria-label="Jumlah data per halaman"
                    variant="secondary"
                    value={String(ps)}
                    onChange={(value) => {
                      if (value != null) setPageSize(Number(value));
                    }}
                    className="w-[5.5rem]"
                  >
                    <Select.Trigger>
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover className="min-w-[5.5rem]">
                      <ListBox aria-label="Opsi jumlah data">
                        {PAGE_SIZE_OPTIONS.map((size) => (
                          <ListBox.Item
                            key={size}
                            id={String(size)}
                            textValue={String(size)}
                          >
                            {size}
                            <ListBox.ItemIndicator />
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>
                </div>
              </div>

              {/* Right: pagination nav */}
              {totalPages > 1 && (
                <Pagination className="w-auto justify-end">
                  <Pagination.Content>
                    <Pagination.Item>
                      <Pagination.Previous
                        isDisabled={page === 1}
                        onPress={() => setPage(Math.max(1, page - 1))}
                      >
                        <Pagination.PreviousIcon />
                        <span className="hidden sm:inline">Previous</span>
                      </Pagination.Previous>
                    </Pagination.Item>

                    {buildPageItems(page, totalPages).map((item, idx) =>
                      item === null ? (
                        <Pagination.Item key={`ellipsis-${idx}`}>
                          <Pagination.Ellipsis />
                        </Pagination.Item>
                      ) : (
                        <Pagination.Item key={item}>
                          <Pagination.Link
                            isActive={item === page}
                            onPress={() => setPage(item)}
                          >
                            {String(item)}
                          </Pagination.Link>
                        </Pagination.Item>
                      ),
                    )}

                    <Pagination.Item>
                      <Pagination.Next
                        isDisabled={page === totalPages}
                        onPress={() => setPage(Math.min(totalPages, page + 1))}
                      >
                        <span className="hidden sm:inline">Next</span>
                        <Pagination.NextIcon />
                      </Pagination.Next>
                    </Pagination.Item>
                  </Pagination.Content>
                </Pagination>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
