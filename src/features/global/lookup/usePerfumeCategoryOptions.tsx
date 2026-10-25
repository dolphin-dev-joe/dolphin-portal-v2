import { createSelectHook } from "@hooks/createSelectHook";

export const usePerfumeCategoryOptions = createSelectHook({
  key: "perfume-categories",
  resource: "perfume-categories",
  optionLabel: "name",
  optionValue: "id",
});
