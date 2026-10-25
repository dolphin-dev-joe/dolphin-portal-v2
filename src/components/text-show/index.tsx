import React from "react";
import { Description, Label } from "@heroui/react";
import FormController from "../form/FormController";
import type { BaseInputProps } from "../inputs/types";
import { toEachCapitalize } from "@/utils/common";

interface TextShowProps extends BaseInputProps {
  formatValue?: (value: string) => string;
}

export default function TextShow({
  fieldName,
  fieldLabel,
  description,
  descriptionClassName,
  hideLabel = false,
  formatValue,
}: TextShowProps) {
  const labelText = fieldLabel ?? toEachCapitalize(fieldName);

  return (
    <FormController
      fieldName={fieldName}
      fieldLabel={labelText}
      defaultValue=""
      render={({ value }) => {
        const displayValue = formatValue
          ? formatValue(value)
          : value !== undefined && value !== null && value !== ""
          ? String(value)
          : "-";

        return (
          <div className="w-full mt-4 flex flex-col gap-1.5">
            {!hideLabel && <Label className="text-foreground-500">{labelText}</Label>}
            <div className="text-base font-medium text-foreground">
              {displayValue}
            </div>
            {description && (
              <Description className={descriptionClassName}>
                {description}
              </Description>
            )}
          </div>
        );
      }}
    />
  );
}
