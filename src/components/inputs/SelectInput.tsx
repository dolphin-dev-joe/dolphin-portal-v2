import React, { useMemo } from "react";
import { Select, Label, Description, FieldError, ListBox } from "@heroui/react";
import type { Key } from "react";

import FormController from "@/components/form/FormController";
import type { BaseInputProps } from "./types";
import { toEachCapitalize, getFieldError } from "@/utils/common";
import { useFormMode } from "@/contexts/FormModeContext";
import type { SelectItemType } from "@/interfaces/common";

type OptionItem = SelectItemType | { id: string; label: string };

interface SelectInputProps extends BaseInputProps {
  options: OptionItem[];
  placeholder?: string;
  selectionMode?: "single" | "multiple";
}

function getOptionId(opt: OptionItem): string {
  return (opt as { id?: string }).id ?? (opt as SelectItemType).key ?? "";
}

function getOptionLabel(opt: OptionItem): string {
  return opt.label ?? "";
}

export const SelectInput: React.FC<SelectInputProps> = ({
  fieldName,
  fieldLabel,
  requiredMessage,
  isDisabled = false,
  isRequired = false,
  description,
  descriptionClassName,
  hideLabel = false,
  placeholder,
  bottomContent,
  options,
  selectionMode = "single",
}) => {
  const { isShow } = useFormMode();
  const labelText = fieldLabel ?? toEachCapitalize(fieldName);

  return (
    <FormController
      isRequired={isRequired}
      fieldName={fieldName}
      fieldLabel={labelText}
      requiredMessage={requiredMessage}
      defaultValue={null}
      render={({ errors, value, onChange }) => {
        const fieldError = getFieldError(errors, fieldName);

        return (
          <div className="w-full mt-4">
            <Select
              value={value}
              // value={(value as Key) ?? null}
              onChange={(selected) => {
                const next = Array.isArray(selected)
                  ? (selected[0] as string) ?? null
                  : (selected as string) ?? null;
                onChange(next);
              }}
              selectionMode={selectionMode}
              aria-label={labelText}
              isDisabled={isDisabled || isShow}
              isInvalid={!!fieldError}
              isRequired={isRequired}
              variant="primary"
              fullWidth
            >
              {!hideLabel && <Label>{labelText}</Label>}

              <Select.Trigger>
                <Select.Value
                  aria-placeholder={
                    placeholder ?? `Select ${labelText.toLowerCase()}`
                  }
                />
                <Select.Indicator />
              </Select.Trigger>

              {description && (
                <Description className={descriptionClassName}>
                  {description}
                </Description>
              )}

              <FieldError>{fieldError}</FieldError>

              <Select.Popover>
                <ListBox aria-label={`${labelText} options`}>
                  {options.map((opt) => {
                    const optionId = getOptionId(opt);
                    const optionLabel = getOptionLabel(opt);
                    return (
                      <ListBox.Item
                        id={optionId}
                        key={optionId}
                        textValue={optionLabel}
                      >
                        <Label>{optionLabel}</Label>
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    );
                  })}
                </ListBox>
              </Select.Popover>
            </Select>

            {bottomContent}
          </div>
        );
      }}
    />
  );
};
