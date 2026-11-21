import { Button, Dropdown, Label } from "@heroui/react";
import { Icon } from "@iconify/react";

import type { ExportFormat } from "./exportTable";

interface ExportMenuProps {
  exporting: ExportFormat | null;
  onExport: (format: ExportFormat) => void;
  isIconOnly?: boolean;
}

/** "Export" button with an Excel / PDF choice. */
export function ExportMenu({ exporting, onExport, isIconOnly }: ExportMenuProps) {
  return (
    <Dropdown>
      <Button
        variant="outline"
        isIconOnly={isIconOnly}
        isPending={exporting !== null}
        aria-label="Export data"
      >
        <Icon icon="mdi:download" className="h-4 w-4" />
        {!isIconOnly && "Export"}
      </Button>
      <Dropdown.Popover placement="bottom end" className="min-w-48">
        <Dropdown.Menu
          aria-label="Pilih format export"
          onAction={(key) => onExport(key as ExportFormat)}
        >
          <Dropdown.Item id="xlsx" textValue="Excel (.xlsx)">
            <Icon icon="mdi:microsoft-excel" className="h-4 w-4 text-success" />
            <Label>Excel (.xlsx)</Label>
          </Dropdown.Item>
          <Dropdown.Item id="pdf" textValue="PDF">
            <Icon icon="mdi:file-pdf-box" className="h-4 w-4 text-danger" />
            <Label>PDF</Label>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
