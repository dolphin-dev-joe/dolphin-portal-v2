import { useState, useEffect, memo } from "react";
import { Button, Input, Label, TextField } from "@heroui/react";
import { Icon } from "@iconify/react";

interface InsertLinkModalProps {
  isOpen: boolean;
  initialLabel?: string;
  onConfirm: (url: string, label: string) => void;
  onClose: () => void;
}

function InsertLinkModalComponent({
  isOpen,
  initialLabel = "",
  onConfirm,
  onClose,
}: InsertLinkModalProps) {
  const [url, setUrl] = useState("https://");
  const [label, setLabel] = useState(initialLabel);

  useEffect(() => {
    if (isOpen) {
      setUrl("https://");
      setLabel(initialLabel);
    }
  }, [isOpen, initialLabel]);

  if (!isOpen) return null;

  const isUrlValid = url.trim().length > 0 && url.trim() !== "https://";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isUrlValid) return;
    onConfirm(url.trim(), label.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <form
        onSubmit={handleSubmit}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        className="relative bg-surface border border-divider shadow-2xl rounded-2xl p-5 w-full max-w-sm mx-4 flex flex-col gap-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon icon="mdi:link-variant" className="text-accent" />
            <span className="font-semibold text-sm text-foreground">Insert Hyperlink</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded"
          >
            <Icon icon="mdi:close" />
          </button>
        </div>

        <TextField value={url} onChange={setUrl} aria-label="URL" autoFocus>
          <Label>URL</Label>
          <Input placeholder="https://example.com" type="url" />
        </TextField>

        <TextField value={label} onChange={setLabel} aria-label="Label">
          <Label>
            Label{" "}
            <span className="text-muted-foreground/70 font-normal text-xs">(optional — defaults to URL)</span>
          </Label>
          <Input placeholder="Display text for the link" />
        </TextField>

        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="ghost" onPress={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isDisabled={!isUrlValid}>
            Insert
          </Button>
        </div>
      </form>
    </div>
  );
}

export const InsertLinkModal = memo(InsertLinkModalComponent);
