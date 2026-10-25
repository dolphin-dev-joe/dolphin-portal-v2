import { NumberInput } from "@components/inputs/NumberInput";
import SwitchInput from "@components/inputs/SwitchInput";
import { TextAreaInput } from "@components/inputs/TextareaInput";
import { TextInput } from "@components/inputs/TextInput";
import { useNextSortOrder } from "@/hooks/useNextSortOrder";
import { useFormContext } from "react-hook-form";
import { usePathname } from "@hooks/usePathname";
import React, { useEffect } from "react";

export default function PricingCategoryForm() {
  const pathname = usePathname();
  const isCreate = pathname.includes("/create");
  const nextSortOrder = useNextSortOrder("pricing-categories/next-sort-order");
  const { setValue } = useFormContext();

  useEffect(() => {
    if (isCreate && nextSortOrder !== null) {
      setValue("sortOrder", nextSortOrder);
    }
  }, [isCreate, nextSortOrder, setValue]);

  return (
    <>
      {/* Name (Indonesian) */}
      <TextInput
        fieldName="name"
        fieldLabel="Name (Indonesian)"
        placeholder="Enter category name in Indonesian"
        isRequired
      />

      {/* Name (English) */}
      <TextInput
        fieldName="nameEn"
        fieldLabel="Name (English)"
        placeholder="Enter category name in English"
      />

      {/* Description (Indonesian) */}
      <TextAreaInput
        fieldName="description"
        fieldLabel="Description (Indonesian)"
        placeholder="Enter description in Indonesian"
        maxLength={500}
      />

      {/* Description (English) */}
      <TextAreaInput
        fieldName="descriptionEn"
        fieldLabel="Description (English)"
        placeholder="Enter description in English"
        maxLength={500}
      />

      {/* Sort Order */}
      <NumberInput fieldName="sortOrder" fieldLabel="Sort Order" />

      {/* Active Status */}
      <SwitchInput
        fieldName="isActive"
        fieldLabel="Active Status"
        description="Enable or disable this category"
      />
    </>
  );
}
