import { useRef, useState } from "react";
import { Button, FieldError, Label, Tooltip, cn } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useNotification } from "@refinedev/core";
import FormController from "@components/form/FormController";
import { useFormMode } from "@/contexts/FormModeContext";
import { uploadImage } from "@lib/uploadImage";
import { getFieldError } from "@utils/common";
import type { ISocialMedia } from "../interfaces";

interface MediaInputProps {
  fieldName: string;
  fieldLabel?: string;
  /** Shown under the label, e.g. the recommended size. */
  hint?: string;
  maxItems?: number;
}

/**
 * Ordered list of post images. Files go to the API's image upload (folder
 * `social`); the first image is the cover / first carousel slide.
 */
export function MediaInput({
  fieldName,
  fieldLabel = "Gambar",
  hint,
  maxItems = 20,
}: MediaInputProps) {
  const { isShow } = useFormMode();
  const { open } = useNotification();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(0);

  return (
    <FormController
      fieldName={fieldName}
      defaultValue={[]}
      render={({ errors, value, onChange }) => {
        const items = (Array.isArray(value) ? value : []) as ISocialMedia[];
        const fieldError = getFieldError(errors, fieldName);
        const canAdd = !isShow && items.length < maxItems;

        const move = (from: number, to: number) => {
          const next = [...items];
          const [item] = next.splice(from, 1);
          next.splice(to, 0, item);
          onChange(next);
        };

        const handleFiles = async (files: FileList | null) => {
          if (!files?.length) return;
          const picked = Array.from(files).slice(0, maxItems - items.length);
          setUploading(picked.length);
          const added: ISocialMedia[] = [];
          for (const file of picked) {
            try {
              added.push({ url: await uploadImage(file, "social") });
            } catch (error) {
              open?.({
                type: "error",
                message: `Gagal upload ${file.name}`,
                description: error instanceof Error ? error.message : undefined,
              });
            } finally {
              setUploading((n) => n - 1);
            }
          }
          if (added.length) onChange([...items, ...added]);
          if (fileInputRef.current) fileInputRef.current.value = "";
        };

        return (
          <div className="mt-4 flex w-full flex-col gap-2">
            <div className="flex items-baseline justify-between gap-2">
              <Label>{fieldLabel}</Label>
              <span className="text-xs text-muted-foreground">
                {items.length}/{maxItems}
              </span>
            </div>
            {hint && <span className="text-xs text-muted-foreground">{hint}</span>}

            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {items.map((item, i) => (
                <div
                  key={`${item.url}-${i}`}
                  className="group relative aspect-4/5 overflow-hidden rounded-lg border border-divider bg-default-100"
                >
                  <img src={item.url} alt={item.alt || `Slide ${i + 1}`} className="h-full w-full object-cover" />
                  <span className="absolute top-1.5 left-1.5 rounded-md bg-black/60 px-1.5 text-xs font-semibold text-white">
                    {i + 1}
                  </span>
                  {!isShow && (
                    <div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/60 p-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                      <button
                        type="button"
                        aria-label="Geser ke kiri"
                        disabled={i === 0}
                        onClick={() => move(i, i - 1)}
                        className="rounded p-0.5 text-white disabled:opacity-30"
                      >
                        <Icon icon="mdi:chevron-left" className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        aria-label="Hapus gambar"
                        onClick={() => onChange(items.filter((_, j) => j !== i))}
                        className="rounded p-0.5 text-white hover:text-danger"
                      >
                        <Icon icon="mdi:trash-can-outline" className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        aria-label="Geser ke kanan"
                        disabled={i === items.length - 1}
                        onClick={() => move(i, i + 1)}
                        className="rounded p-0.5 text-white disabled:opacity-30"
                      >
                        <Icon icon="mdi:chevron-right" className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {Array.from({ length: uploading }).map((_, i) => (
                <div
                  key={`uploading-${i}`}
                  className="flex aspect-4/5 items-center justify-center rounded-lg border border-dashed border-divider bg-default-50"
                >
                  <Icon icon="mdi:loading" className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ))}

              {canAdd && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading > 0}
                  className={cn(
                    "flex aspect-4/5 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-divider bg-surface text-muted-foreground transition-colors hover:border-accent hover:text-accent",
                    uploading > 0 && "cursor-wait opacity-60",
                  )}
                >
                  <Icon icon="mdi:image-plus-outline" className="h-6 w-6" />
                  <span className="text-xs font-medium">Tambah</span>
                </button>
              )}
            </div>

            {items.length === 0 && isShow && (
              <span className="text-sm text-muted-foreground">Belum ada gambar.</span>
            )}

            {!isShow && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  JPG, PNG, WebP, maks 5 MB per gambar. Urutan = urutan slide.
                </span>
                <Tooltip>
                  <Tooltip.Trigger>
                    <Button
                      size="sm"
                      variant="ghost"
                      isDisabled={!canAdd}
                      onPress={() => {
                        const url = window.prompt("Tempel link gambar (mis. hasil export Canva):");
                        if (url?.trim()) onChange([...items, { url: url.trim() }]);
                      }}
                    >
                      <Icon icon="mdi:link-variant" className="h-4 w-4" />
                      Pakai link
                    </Button>
                  </Tooltip.Trigger>
                  <Tooltip.Content>Tambah gambar dari URL tanpa upload</Tooltip.Content>
                </Tooltip>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
              disabled={isShow}
            />
            {fieldError && <FieldError>{fieldError}</FieldError>}
          </div>
        );
      }}
    />
  );
}
