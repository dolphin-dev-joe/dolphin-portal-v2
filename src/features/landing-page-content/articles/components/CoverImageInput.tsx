import { useRef, useState } from "react";
import { Label, FieldError } from "@heroui/react";
import { Icon } from "@iconify/react";
import FormController from "@components/form/FormController";
import { getFieldError } from "@utils/common";
import { useFormMode } from "@/contexts/FormModeContext";
import { uploadImage } from "@lib/uploadImage";

interface CoverImageInputProps {
  fieldName: string;
  fieldLabel?: string;
  placeholder?: string;
}

export const CoverImageInput: React.FC<CoverImageInputProps> = ({
  fieldName,
  fieldLabel = "Cover Image",
  placeholder = "Paste an image URL or upload a file",
}) => {
  const { isShow } = useFormMode();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  return (
    <FormController
      fieldName={fieldName}
      render={({ errors, value, onChange }) => {
        const fieldError = getFieldError(errors, fieldName);
        const imageUrl = (value as string) ?? "";

        const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files?.[0];
          if (!file) return;
          try {
            setIsUploading(true);
            const url = await uploadImage(file, "articles");
            onChange(url);
          } catch (error) {
            console.error("Cover image upload failed", error);
            alert("Failed to upload cover image");
          } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
          }
        };

        return (
          <div className="w-full mt-4">
            <div className="flex flex-col gap-2">
              <Label>{fieldLabel}</Label>

              {imageUrl ? (
                <div className="flex flex-col gap-2">
                  <img
                    src={imageUrl}
                    alt="Cover preview"
                    className="w-full max-h-48 object-cover rounded-lg border border-divider"
                  />
                  {!isShow && (
                    <button
                      type="button"
                      onClick={() => onChange("")}
                      className="self-start text-xs text-danger hover:underline"
                    >
                      Remove image
                    </button>
                  )}
                </div>
              ) : (
                <div
                  className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-divider rounded-lg bg-surface p-6 text-center cursor-pointer hover:border-accent transition-colors"
                  onClick={() => !isShow && fileInputRef.current?.click()}
                >
                  <Icon
                    icon={isUploading ? "mdi:loading" : "mdi:image-outline"}
                    className="text-2xl text-muted-foreground"
                  />
                  <span className="text-sm text-muted-foreground">
                    {isUploading ? "Uploading..." : placeholder}
                  </span>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="hidden"
                disabled={isShow}
              />

              {!isShow && (
                <p className="text-xs text-muted-foreground">
                  Recommended size 1200×630. Max 5 MB.
                </p>
              )}
              {fieldError && <FieldError>{fieldError}</FieldError>}
            </div>
          </div>
        );
      }}
    />
  );
};
