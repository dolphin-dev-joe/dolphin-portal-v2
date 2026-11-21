import type React from "react";

export enum ActionButton {
    Show = "show",
    Review = "review",
    Edit = "edit",
    Delete = "delete",
    Copy = "copy",
    Create = "create",
    Export = "export",
    Import = "import",
    Custom = "custom",
}

// Recursive type untuk generate semua dot-notation paths
type DotNotation<T, Prefix extends string = ""> = {
    [K in keyof T & string]: T[K] extends object
    ? `${Prefix}${K}` | DotNotation<T[K], `${Prefix}${K}.`>
    : `${Prefix}${K}`;
}[keyof T & string];

export type ActionButtonHandlerMap<T> = {
    [ActionButton.Create]: (rows: T[]) => Promise<void>;
    [ActionButton.Edit]: (item: T) => Promise<void>;
    [ActionButton.Show]: (item: T) => Promise<void>;
    [ActionButton.Delete]: (item: T) => Promise<void>;
    [ActionButton.Review]: (item: T) => Promise<void>;
    [ActionButton.Copy]: (item: T) => Promise<void>;
    [ActionButton.Export]: (rows: T[]) => Promise<void>;
    [ActionButton.Import]: (rows: T[]) => Promise<void>;
    [ActionButton.Custom]: (item: T, rows: T[]) => Promise<void>;
};

export interface ColumnTable<T> {
    key: DotNotation<T>;
    title: string;
    align?: "start" | "center" | "end";
    allowsSorting?: boolean;
    hideHeader?: boolean;
    isRowHeader?: boolean;
    maxWidth?: number;
    minWidth?: number;
    width?: number;
    render?: (item: T) => React.ReactNode;
    valueGetter?: (item: T) => React.ReactNode;
    /** Explanation shown in an ⓘ tooltip next to the column title. */
    tooltip?: React.ReactNode;
    /**
     * How this column goes into Excel / PDF. Without it the raw value at
     * `key` is written as text. `false` leaves the column out.
     */
    export?: ColumnExport<T> | false;
}

/** Plain value written to an export cell; `null`/`undefined` → empty / "-". */
export type ExportValue = string | number | Date | boolean | null | undefined;

export interface ColumnExport<T> {
    /** Header in the file; defaults to the column title. */
    title?: string;
    /** Plain value for the cell; defaults to the value at the column key. */
    value?: (item: T) => ExportValue;
    /**
     * `currency` / `number` stay numbers in Excel (summable), `date` /
     * `datetime` stay dates. Text otherwise.
     */
    format?: "text" | "number" | "currency" | "date" | "datetime";
    /** Excel column width in characters. */
    width?: number;
}

/** Enables the built-in Export menu (Excel / PDF) on a DataTable. */
export interface DataTableExportOptions<T> {
    /** File name without extension or date, e.g. "transaksi-pos". */
    fileName: string;
    /** Title printed on top of the PDF; defaults to the table label. */
    title?: string;
    /** Extra columns that only go into the file (e.g. phone, payment date). */
    extraColumns?: (ColumnExport<T> & { key: string; title: string })[];
}

export interface CustomActionButton {
    key: string;
    label?: string;
    icon?: React.ReactNode;
    variant?: "primary" | "secondary" | "tertiary" | "outline" | "ghost" | "danger";
    onPress?: () => void;
    isLoading?: boolean;
    isDisabled?: boolean;
    render?: React.ReactNode;
}

export interface CustomRowActionMenuItem<T> {
    key: string;
    label: string;
    icon?: React.ReactNode;
    onPress?: (item: T) => void | Promise<void>;
    isDisabled?: boolean;
}

export interface CustomRowActionButton<T> {
    key: string;
    /**
     * When true, renders as a vertical dots dropdown trigger and uses `menuItems`.
     * When false (default), renders as a standalone icon button next to Edit/Show/Delete.
     */
    isVertical?: boolean;
    label?: string;
    icon?: React.ReactNode;
    ariaLabel?: string;
    variant?: "primary" | "secondary" | "tertiary" | "outline" | "ghost" | "danger";
    onPress?: (item: T) => void | Promise<void>;
    menuItems?: CustomRowActionMenuItem<T>[];
    isVisible?: (item: T) => boolean;
    isDisabled?: (item: T) => boolean;
    /** Hint on hover, e.g. what the button does or why it is disabled. */
    tooltip?: React.ReactNode | ((item: T) => React.ReactNode);
}

export interface CustomFilterOption {
    label: string;
    value: string | boolean;
}

export interface CustomFilter<T> {
    key: string;
    label: string;
    placeholder?: string;
    type: "single" | "multiple";
    defaultOption?: string;
    options: CustomFilterOption[];
    filterFn?: (item: T, values: Set<string | boolean>) => boolean;
}

export interface PaginationModel {
    page: number;
    pageSize: number;
    total: number;
}