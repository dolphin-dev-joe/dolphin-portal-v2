import type { CustomFilter } from "@components/table/types";
import type { ISocialPost } from "./interfaces";
import { FORMAT_OPTIONS, STATUS_OPTIONS } from "./constants";

export const socialPostFilters: CustomFilter<ISocialPost>[] = [
  {
    key: "status",
    label: "Status",
    placeholder: "Semua status",
    type: "single",
    options: [
      { label: "Semua status", value: "all" },
      ...STATUS_OPTIONS.map((o) => ({ label: o.label, value: o.id })),
    ],
  },
  {
    key: "format",
    label: "Format",
    placeholder: "Semua format",
    type: "single",
    options: [
      { label: "Semua format", value: "all" },
      ...FORMAT_OPTIONS.map((o) => ({ label: o.label, value: o.id })),
    ],
  },
];
