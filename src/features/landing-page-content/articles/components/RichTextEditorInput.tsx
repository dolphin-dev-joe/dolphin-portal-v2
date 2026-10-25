import { Label, FieldError } from "@heroui/react";
import TextEditor from "@components/text-editor";
import FormController from "@components/form/FormController";
import { getFieldError } from "@utils/common";
import { useFormMode } from "@/contexts/FormModeContext";

interface RichTextEditorInputProps {
  fieldName: string;
  fieldLabel?: string;
  placeholder?: string;
  isRequired?: boolean;
  description?: React.ReactNode;
}

export const RichTextEditorInput: React.FC<RichTextEditorInputProps> = ({
  fieldName,
  fieldLabel,
  placeholder = "Start writing...",
  isRequired = false,
  description,
}) => {
  const { isShow } = useFormMode();

  return (
    <FormController
      isRequired={isRequired}
      fieldName={fieldName}
      fieldLabel={fieldLabel}
      render={({ errors, value, onChange }) => {
        const fieldError = getFieldError(errors, fieldName);
        const htmlValue = (value as string) ?? "";

        return (
          <div className="w-full mt-4">
            <div className="flex flex-col gap-2">
              <Label>
                {fieldLabel ?? fieldName}
                {isRequired && <span className="text-danger"> *</span>}
              </Label>

              {isShow ? (
                htmlValue ? (
                  <div
                    className="rich-content border border-divider rounded-lg bg-surface p-4"
                    dangerouslySetInnerHTML={{ __html: htmlValue }}
                  />
                ) : (
                  <div className="border border-divider rounded-lg bg-surface p-4 text-sm text-muted-foreground">
                    -
                  </div>
                )
              ) : (
                <TextEditor
                  value={htmlValue}
                  onChange={onChange}
                  placeholder={placeholder}
                />
              )}

              {description && (
                <p className="text-xs text-muted-foreground">{description}</p>
              )}
              {fieldError && <FieldError>{fieldError}</FieldError>}
            </div>
          </div>
        );
      }}
    />
  );
};
