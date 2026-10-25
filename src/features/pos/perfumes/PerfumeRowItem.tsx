import { Button, Label, Input, TextField, Switch, cn } from "@heroui/react";
import { Icon } from "@iconify/react";

export interface PerfumeRow {
  id: string;
  name: string;
  sortOrder: number;
  isActive: boolean;
}

export function PerfumeRowItem({
  row,
  index,
  total,
  nameError,
  onUpdate,
  onRemove,
}: {
  row: PerfumeRow;
  index: number;
  total: number;
  nameError?: string;
  onUpdate: (id: string, field: keyof PerfumeRow, value: string | number | boolean) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div
      className={cn(
        "group grid grid-cols-1 md:grid-cols-[2.5rem_1fr_7rem_5rem_2.5rem] gap-3 items-start md:items-center",
        "p-4 md:p-2 rounded-xl md:rounded-none",
        "bg-default-50 md:bg-transparent",
        "border border-divider/40 md:border-0",
        "transition-colors md:hover:bg-default-50/60",
      )}
    >
      {/* Row number badge */}
      <div className="hidden md:flex items-center justify-center">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-default-100 text-xs font-mono text-muted-foreground">
          {index + 1}
        </span>
      </div>

      {/* Name input */}
      <TextField
        fullWidth
        isInvalid={!!nameError}
        value={row.name}
        onChange={(val) => onUpdate(row.id, "name", val)}
        aria-label={`Nama parfum baris ${index + 1}`}
      >
        <Label className="md:sr-only text-xs font-medium text-muted-foreground">
          Nama Parfum
        </Label>
        <Input
          variant="secondary"
          placeholder="Masukkan nama parfum..."
          autoComplete="off"
        />
        {nameError && (
          <p className="text-xs text-danger mt-0.5 px-1">{nameError}</p>
        )}
      </TextField>

      {/* Sort order */}
      <TextField
        value={String(row.sortOrder)}
        onChange={(val) =>
          onUpdate(row.id, "sortOrder", isNaN(Number(val)) ? 0 : Number(val))
        }
        aria-label={`Urutan baris ${index + 1}`}
      >
        <Label className="md:sr-only text-xs font-medium text-muted-foreground">
          Urutan
        </Label>
        <Input variant="secondary" type="number" min={0} />
      </TextField>

      {/* Active switch */}
      <Switch
        isSelected={row.isActive}
        onChange={(val) => onUpdate(row.id, "isActive", val)}
        aria-label={`Status aktif baris ${index + 1}`}
        size="sm"
      >
        <Switch.Content>
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
          <span className="text-xs text-muted-foreground md:hidden">Aktif</span>
        </Switch.Content>
      </Switch>

      {/* Remove button */}
      <Button
        isIconOnly
        variant="ghost"
        size="sm"
        onPress={() => onRemove(row.id)}
        isDisabled={total === 1}
        aria-label={`Hapus baris ${index + 1}`}
        className={cn(
          "transition-opacity",
          total === 1
            ? "opacity-0 pointer-events-none"
            : "opacity-0 group-hover:opacity-100",
          "text-danger/60 hover:text-danger hover:bg-danger/10",
        )}
      >
        <Icon icon="mdi:close" className="h-4 w-4" />
      </Button>
    </div>
  );
}
