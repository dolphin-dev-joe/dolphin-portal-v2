import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { usePathname } from "@hooks/usePathname";

import SwitchInput from "@components/inputs/SwitchInput";
import { NumberInput } from "@components/inputs/NumberInput";
import { TextInput } from "@components/inputs/TextInput";
import { AutoCompleteInput } from "@components/inputs/AutoCompleteInput";
import { usePerfumeCategoryOptions } from "@features/global/lookup/usePerfumeCategoryOptions";
import { useNextSortOrder } from "@/hooks/useNextSortOrder";

export default function PerfumeForm() {
  const { options: categoryOptions, isLoading: isCategoriesLoading } =
    usePerfumeCategoryOptions();

  const pathname = usePathname();
  const isCreate = pathname.includes("/create");
  const nextSortOrder = useNextSortOrder("perfumes/next-sort-order");
  const { setValue } = useFormContext();

  useEffect(() => {
    if (isCreate && nextSortOrder !== null) {
      setValue("sortOrder", nextSortOrder);
    }
  }, [isCreate, nextSortOrder, setValue]);

  return (
    <>
      <AutoCompleteInput
        fieldName="categoryId"
        fieldLabel="Category"
        placeholder="Select a category..."
        options={categoryOptions}
        isDisabled={isCategoriesLoading}
        isRequired
      />

      {/* Name (Indonesian) */}
      {/* <TextInput
        fieldName="categoryId"
        fieldLabel="Name (Indonesian)"
        placeholder="Enter perfume name in Indonesian"
        isRequired
      /> */}
      <TextInput
        fieldName="name"
        fieldLabel="Name (Indonesian)"
        placeholder="Enter perfume name in Indonesian"
        isRequired
      />

      {/* Name (English) */}
      <TextInput
        fieldName="nameEn"
        fieldLabel="Name (English)"
        placeholder="Enter perfume name in English"
      />

      {/* Sort Order */}
      <NumberInput fieldName="sortOrder" fieldLabel="Sort Order" />

      {/* Active Status */}
      <SwitchInput
        fieldName="isActive"
        fieldLabel="Active Status"
        description="Enable or disable this perfume"
      />
    </>
  );
}
