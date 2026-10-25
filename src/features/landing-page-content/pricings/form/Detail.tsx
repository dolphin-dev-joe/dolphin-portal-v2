import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { usePathname } from "@hooks/usePathname";

import { AutoCompleteInput } from "@components/inputs/AutoCompleteInput";
import { TextInput } from "@components/inputs/TextInput";
import { NumberInput } from "@components/inputs/NumberInput";
import { TextAreaInput } from "@components/inputs/TextareaInput";
import { usePricingCategoryOptions } from "@features/global/lookup/usePricingCategoryOptions";
import { useNextSortOrder } from "@/hooks/useNextSortOrder";
import SwitchInput from "@components/inputs/SwitchInput";

export default function PricingItemForm() {
  const { options: categoryOptions, isLoading } = usePricingCategoryOptions();

  const pathname = usePathname();
  const isCreate = pathname.includes("/create");
  const nextSortOrder = useNextSortOrder("pricings/next-sort-order");
  const { setValue } = useFormContext();

  useEffect(() => {
    if (isCreate && nextSortOrder !== null) {
      setValue("sortOrder", nextSortOrder);
    }
  }, [isCreate, nextSortOrder, setValue]);

  return (
    <>
      {/* Category ID - AutoComplete */}
      <AutoCompleteInput
        fieldName="categoryId"
        fieldLabel="Category"
        placeholder="Select a category..."
        options={categoryOptions}
        isDisabled={isLoading}
        isRequired
      />

      {/* Name (Indonesian) */}
      <TextInput
        fieldName="name"
        fieldLabel="Name (Indonesian)"
        placeholder="Enter item name in Indonesian"
        isRequired
      />

      {/* Name (English) */}
      <TextInput
        fieldName="nameEn"
        fieldLabel="Name (English)"
        placeholder="Enter item name in English"
      />

      {/* Price */}
      <NumberInput
        fieldName="price"
        fieldLabel="Price"
        isRequired
        step={0.01}
      />

      {/* Unit (Indonesian) */}
      <TextInput
        fieldName="unit"
        fieldLabel="Unit (Indonesian)"
        placeholder="e.g., kg, pcs, psg"
        isRequired
      />

      {/* Unit (English) */}
      <TextInput
        fieldName="unitEn"
        fieldLabel="Unit (English)"
        placeholder="e.g., pairs, pieces"
      />

      {/* Duration Text (Indonesian) */}
      <TextInput
        fieldName="durationText"
        fieldLabel="Duration Text (Indonesian)"
        placeholder="e.g., 2 hari, 24 jam"
      />

      {/* Duration Text (English) */}
      <TextInput
        fieldName="durationTextEn"
        fieldLabel="Duration Text (English)"
        placeholder="e.g., 2 days, 24 hours"
      />

      {/* Notes (Indonesian) */}
      <TextAreaInput
        fieldName="notes"
        fieldLabel="Notes (Indonesian)"
        placeholder="Enter notes in Indonesian"
        maxLength={500}
      />

      {/* Notes (English) */}
      <TextAreaInput
        fieldName="notesEn"
        fieldLabel="Notes (English)"
        placeholder="Enter notes in English"
        maxLength={500}
      />

      {/* Sort Order */}
      <NumberInput fieldName="sortOrder" fieldLabel="Sort Order" />

      {/* Active Status */}
      <SwitchInput
        fieldName="isActive"
        fieldLabel="Active Status"
        description="Enable or disable this item"
      />
    </>
  );
}
