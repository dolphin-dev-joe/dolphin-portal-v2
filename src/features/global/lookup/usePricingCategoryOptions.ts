import { createSelectHook } from "@hooks/createSelectHook";

export const usePricingCategoryOptions = createSelectHook({
  key: "pricing-categories",
  resource: "pricing-categories",
  optionLabel: "name",
  optionValue: "id",
});
