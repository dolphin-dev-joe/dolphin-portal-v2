import { Description, FieldError, Input, Label, TextField } from "@heroui/react";
import FormController from "../form/FormController";
import type { BaseInputProps } from "./types";
import { toEachCapitalize, getFieldError } from "@/utils/common";
import { useFormMode } from "@/contexts/FormModeContext";

const pad = (n: number) => String(n).padStart(2, "0");

function isoToLocal(iso: unknown): string {
  if (typeof iso !== "string" || !iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function localToIso(value: string): string | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

/**
 * Date + time picker (browser native). The form value is an ISO string in
 * UTC, or null when empty, which is what the API expects for timestamps.
 */
export const DateTimeInput: React.FC<BaseInputProps> = ({
  fieldName,
  fieldLabel,
  requiredMessage,
  isDisabled = false,
  isRequired = false,
  description,
  descriptionClassName,
  hideLabel = false,
  bottomContent,
  additionalRules,
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
      additionalRules={additionalRules}
      render={({ errors, value, ref, onChange, onBlur, name }) => {
        const fieldError = getFieldError(errors, fieldName);
        return (
          <div className="w-full mt-4">
            <TextField
              name={name}
              type="datetime-local"
              value={isoToLocal(value)}
              onChange={(v) => onChange(localToIso(v))}
              isRequired={isRequired}
              isDisabled={isDisabled || isShow}
              isInvalid={!!fieldError}
              className="w-full"
            >
              {!hideLabel && <Label>{labelText}</Label>}
              <Input ref={ref} onBlur={onBlur} fullWidth />
              {description && (
                <Description className={descriptionClassName}>{description}</Description>
              )}
              <FieldError>{fieldError}</FieldError>
            </TextField>
            {bottomContent}
          </div>
        );
      }}
    />
  );
};
