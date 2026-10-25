import { NumberInput } from "@components/inputs/NumberInput";
import SwitchInput from "@components/inputs/SwitchInput";
import { TextAreaInput } from "@components/inputs/TextareaInput";
import { TextInput } from "@components/inputs/TextInput";
import { useNextSortOrder } from "@/hooks/useNextSortOrder";
import { useFormContext } from "react-hook-form";
import { usePathname } from "@hooks/usePathname";
import React, { useEffect } from "react";

export default function FaqForm() {
  const pathname = usePathname();
  const isCreate = pathname.includes("/create");
  const nextSortOrder = useNextSortOrder("faqs/next-sort-order");
  const { setValue } = useFormContext();

  useEffect(() => {
    if (isCreate && nextSortOrder !== null) {
      setValue("sortOrder", nextSortOrder);
    }
  }, [isCreate, nextSortOrder, setValue]);

  return (
    <>
      <TextInput
        fieldName="question"
        fieldLabel="Question (Indonesian)"
        placeholder="Enter question in Indonesian"
        isRequired
      />
      <TextInput
        fieldName="questionEn"
        fieldLabel="Question (English)"
        placeholder="Enter question in English"
      />
      <TextAreaInput
        fieldName="answer"
        fieldLabel="Answer (Indonesian)"
        placeholder="Enter answer in Indonesian"
        isRequired
        maxLength={1000}
      />
      <TextAreaInput
        fieldName="answerEn"
        fieldLabel="Answer (English)"
        placeholder="Enter answer in English"
        maxLength={1000}
      />
      <NumberInput fieldName="sortOrder" fieldLabel="Sort Order" />
      <SwitchInput
        fieldName="isActive"
        fieldLabel="Active Status"
        description="Enable or disable this FAQ"
      />
    </>
  );
}
