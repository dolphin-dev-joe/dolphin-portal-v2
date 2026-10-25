import { memo } from "react";
import { Icon } from "@iconify/react";

interface ImageControlsProps {
  top: number;
  left: number;
  onResize: (size: string) => void;
  onDelete: () => void;
  onClose: () => void;
}

function ImageControlsComponent({
  top,
  left,
  onResize,
  onDelete,
  onClose,
}: ImageControlsProps) {
  return (
    <div
      id="editor-image-controls"
      style={{
        position: "absolute",
        top,
        left,
        zIndex: 9999,
      }}
      className="flex items-center gap-1.5 p-1 bg-default text-default-foreground rounded border border-divider shadow-lg text-xs"
    >
      <span className="px-1 text-muted select-none">Ukuran:</span>
      <button
        type="button"
        onClick={() => onResize("25%")}
        className="px-1.5 py-0.5 rounded hover:bg-default-200 transition-colors font-medium cursor-pointer"
      >
        25%
      </button>
      <button
        type="button"
        onClick={() => onResize("50%")}
        className="px-1.5 py-0.5 rounded hover:bg-default-200 transition-colors font-medium cursor-pointer"
      >
        50%
      </button>
      <button
        type="button"
        onClick={() => onResize("100%")}
        className="px-1.5 py-0.5 rounded hover:bg-default-200 transition-colors font-medium cursor-pointer"
      >
        100%
      </button>
      <button
        type="button"
        onClick={() => onResize("")}
        className="px-1.5 py-0.5 rounded hover:bg-default-200 transition-colors font-medium cursor-pointer"
      >
        Ori
      </button>
      <div className="w-px h-4 bg-divider mx-1" />
      <button
        type="button"
        onClick={onDelete}
        className="px-2 py-0.5 rounded bg-danger hover:bg-danger/80 text-danger-foreground flex items-center gap-1 transition-colors cursor-pointer"
        title="Hapus gambar"
      >
        <Icon icon="mdi:trash-can-outline" />
        Hapus
      </button>
      <button
        type="button"
        onClick={onClose}
        className="px-1 py-0.5 rounded hover:bg-default-200 cursor-pointer"
        title="Tutup"
      >
        <Icon icon="mdi:close" />
      </button>
    </div>
  );
}

export const ImageControls = memo(ImageControlsComponent);
