import React, { useEffect, useState } from "react";
import { type BaseRecord } from "@refinedev/core";
import {
  Button,
  cn,
  Dropdown,
  ListBox,
  SearchField,
  Select,
} from "@heroui/react";
import { Icon } from "@iconify/react";

import { Heading } from "@/components/heading";

import {
  ActionButton,
  type ActionButtonHandlerMap,
  type CustomActionButton,
  type CustomFilter,
} from "./types";

interface TableToolbarProps<T extends BaseRecord> {
  label?: string;
  description?: string;
  isCardMode: boolean;
  withSearch: boolean;
  searchValue: string;
  setSearchValue: (value: string) => void;
  actionColumns: ActionButton[];
  customActionButtons: CustomActionButton[];
  customFilters: CustomFilter<T>[];
  filterValues: Record<string, Set<string | boolean>>;
  setFilterValues: React.Dispatch<
    React.SetStateAction<Record<string, Set<string | boolean>>>
  >;
  onActionPress?: Partial<ActionButtonHandlerMap<T>>;
  computedRows: BaseRecord[];
  handleCreate: () => void;
  handleExport: () => Promise<void>;
  handleImport: () => Promise<void>;
}

export function TableToolbar<T extends BaseRecord>({
  label,
  description,
  isCardMode,
  withSearch,
  searchValue,
  setSearchValue,
  actionColumns,
  customActionButtons,
  customFilters,
  filterValues,
  setFilterValues,
  handleCreate,
  handleExport,
  handleImport,
}: TableToolbarProps<T>) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [inputValue, setInputValue] = useState(searchValue);

  // Sync when parent resets search to empty (e.g., navigating away, filter clear)
  useEffect(() => {
    if (searchValue === "") setInputValue("");
  }, [searchValue]);

  // Debounce: empty string propagates immediately, typing waits 500ms
  useEffect(() => {
    const delay = inputValue === "" ? 0 : 500;
    const timer = setTimeout(() => {
      setSearchValue(inputValue);
    }, delay);
    return () => clearTimeout(timer);
  }, [inputValue, setSearchValue]);

  const activeFiltersCount = customFilters.reduce((count, filter) => {
    const currentValues = filterValues[filter.key];
    const hasActiveFilter =
      currentValues && currentValues.size > 0 && !currentValues.has("all");
    return hasActiveFilter ? count + 1 : count;
  }, 0);

  return (
    <div className="mb-5 flex w-full flex-col gap-y-4">
      {label && (
        <div>
          <Heading className="my-auto text-xl font-semibold">{label}</Heading>
          {description && (
            <p className="mt-1 text-sm text-default-500">{description}</p>
          )}
        </div>
      )}
      {!label && description && (
        <p className="text-sm text-default-500">{description}</p>
      )}

      <div
        className={cn(
          "flex w-full items-center justify-between gap-4 flex-wrap",
          isCardMode ? "flex-col items-start" : "",
        )}
      >
        {/* Left Side - Create & Custom Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {actionColumns.includes(ActionButton.Create) && (
            <Button
              variant="primary"
              isIconOnly={isCardMode}
              onPress={handleCreate}
              aria-label="Create new item"
            >
              {isCardMode ? (
                <Icon icon="mdi:plus" className="h-4 w-4" />
              ) : (
                <>
                  <Icon icon="mdi:plus" className="h-4 w-4" />
                  Create
                </>
              )}
            </Button>
          )}

          {customActionButtons.map((customButton) =>
            customButton.render ? (
              <div key={customButton.key}>{customButton.render}</div>
            ) : (
              <Button
                key={customButton.key}
                variant={customButton.variant ?? "primary"}
                isPending={customButton.isLoading}
                isDisabled={customButton.isDisabled}
                onPress={customButton.onPress}
                aria-label={customButton.label}
              >
                {customButton.icon}
                {customButton.label}
              </Button>
            ),
          )}
        </div>

        {/* Right Side - Search, Filters Toggle, Export/Import */}
        <div
          className={cn(
            "flex items-center gap-3 flex-wrap",
            isCardMode ? "w-full flex-col items-stretch" : "",
          )}
        >
          {withSearch && (
            <SearchField
              aria-label="Search"
              value={inputValue}
              onChange={setInputValue}
              className={isCardMode ? "w-full" : "w-64 min-w-40"}
            >
              <SearchField.Group>
                <SearchField.SearchIcon />
                <SearchField.Input placeholder="Search..." />
                <SearchField.ClearButton />
              </SearchField.Group>
            </SearchField>
          )}

          <div
            className={cn(
              "flex items-center gap-3 flex-wrap",
              isCardMode ? "justify-end" : "",
            )}
          >
            {/* Toggle Filters Button */}
            {customFilters.length > 0 && (
              <Button
                variant="outline"
                onPress={() => setIsFilterOpen(!isFilterOpen)}
                aria-label="Toggle filters panel"
                className={cn(isFilterOpen && "bg-default-100")}
              >
                <Icon icon="mdi:filter-variant" className="h-4 w-4" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-white text-[10px] font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            )}

            {/* Export/Import Buttons */}
            {!isCardMode ? (
              <>
                {actionColumns.includes(ActionButton.Export) && (
                  <Button
                    variant="outline"
                    aria-label="Export data"
                    onPress={async () => {
                      await handleExport();
                    }}
                  >
                    <Icon icon="mdi:download" className="h-4 w-4" />
                    Export
                  </Button>
                )}

                {actionColumns.includes(ActionButton.Import) && (
                  <Button
                    variant="outline"
                    aria-label="Import data"
                    onPress={async () => {
                      await handleImport();
                    }}
                  >
                    <Icon icon="mdi:upload" className="h-4 w-4" />
                    Import
                  </Button>
                )}
              </>
            ) : (
              (actionColumns.includes(ActionButton.Export) ||
                actionColumns.includes(ActionButton.Import)) && (
                <Dropdown>
                  <Dropdown.Trigger>
                    <span
                      aria-label="More actions"
                      className="inline-flex items-center justify-center p-2 cursor-pointer rounded-lg border border-divider hover:bg-default-100"
                    >
                      <Icon icon="mdi:dots-horizontal" className="h-5 w-5" />
                    </span>
                  </Dropdown.Trigger>
                  <Dropdown.Popover>
                    <Dropdown.Menu aria-label="Export/Import">
                      {[
                        ...(actionColumns.includes(ActionButton.Export)
                          ? [
                              <Dropdown.Item
                                key="export"
                                id="export"
                                onPress={async () => {
                                  await handleExport();
                                }}
                                aria-label="Export"
                              >
                                <span className="flex items-center gap-2">
                                  <Icon icon="mdi:download" className="h-4 w-4" />
                                  Export
                                </span>
                              </Dropdown.Item>,
                            ]
                          : []),
                        ...(actionColumns.includes(ActionButton.Import)
                          ? [
                              <Dropdown.Item
                                key="import"
                                id="import"
                                onPress={async () => {
                                  await handleImport();
                                }}
                                aria-label="Import"
                              >
                                <span className="flex items-center gap-2">
                                  <Icon icon="mdi:upload" className="h-4 w-4" />
                                  Import
                                </span>
                              </Dropdown.Item>,
                            ]
                          : []),
                      ]}
                    </Dropdown.Menu>
                  </Dropdown.Popover>
                </Dropdown>
              )
            )}
          </div>
        </div>
      </div>

      {/* Collapsible Filter Panel */}
      {isFilterOpen && customFilters.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 rounded-xl border border-divider bg-default-50 p-5 mt-2 animate-in fade-in slide-in-from-top-2 duration-200">
          {customFilters.map((filter) => {
            const isMultiple = filter.type === "multiple";
            const currentValues = filterValues[filter.key];
            const hasActiveFilter =
              currentValues &&
              currentValues.size > 0 &&
              !currentValues.has("all");

            const selectedKeys = new Set(
              Array.from(filterValues[filter.key] ?? []).map(String),
            );

            return (
              <div key={filter.key} className="flex flex-col gap-1.5 w-full">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {filter.label}
                </span>
                <div className="flex items-center gap-2">
                  <Select
                    variant="secondary"
                    selectionMode={isMultiple ? "multiple" : "single"}
                    className="w-full"
                    placeholder={filter.placeholder ?? `Pilih ${filter.label}`}
                    value={
                      isMultiple
                        ? Array.from(selectedKeys)
                        : Array.from(selectedKeys)[0]
                    }
                    aria-label={`Filter ${filter.label}`}
                    onChange={(keys) => {
                      const selectedList = Array.isArray(keys)
                        ? keys.map(String)
                        : keys !== null && keys !== undefined
                          ? [String(keys)]
                          : [];
                      const selected = new Set<string | boolean>(selectedList);
                      if (isMultiple) {
                        if (selected.has("all")) {
                          if (selected.size > 1 && selectedKeys.has("all")) {
                            selected.delete("all");
                            setFilterValues((prev) => ({
                              ...prev,
                              [filter.key]: new Set(selected),
                            }));
                            return;
                          }
                          setFilterValues((prev) => ({
                            ...prev,
                            [filter.key]: new Set(["all"]),
                          }));
                        } else {
                          setFilterValues((prev) => ({
                            ...prev,
                            [filter.key]: selected,
                          }));
                        }
                      } else {
                        setFilterValues((prev) => ({
                          ...prev,
                          [filter.key]: selected,
                        }));
                      }
                    }}
                  >
                    <Select.Trigger aria-label={`Pilih ${filter.label}`}>
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox aria-label={`Daftar opsi ${filter.label}`}>
                        {filter.options.map((option) => (
                          <ListBox.Item
                            key={String(option.value)}
                            id={String(option.value)}
                            aria-label={option.label}
                          >
                            {option.label}
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>

                  {hasActiveFilter && (
                    <Button
                      isIconOnly
                      variant="ghost"
                      aria-label={`Reset filter ${filter.label}`}
                      onPress={() =>
                        setFilterValues((prev) => ({
                          ...prev,
                          [filter.key]: new Set(["all"]),
                        }))
                      }
                      className="text-muted-foreground hover:text-danger hover:bg-danger/10"
                    >
                      <Icon icon="mdi:close" className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
