import {
  Button,
  Label,
  Input,
  TextField,
  Switch,
  Select,
  ListBox,
  cn,
} from "@heroui/react";
import { Icon } from "@iconify/react";

export interface ServiceRow {
  id: string;
  name: string;
  price: string;
  unit: string;
  duration: string;
  durationHours: string;
  sortOrder: number;
  isActive: boolean;
}

const UNIT_OPTIONS = [
  { id: "kg", label: "kg" },
  { id: "pcs", label: "pcs" },
];

type RowValue = string | number | boolean;

export function ServiceRowItem({
  row,
  index,
  total,
  nameError,
  priceError,
  onUpdate,
  onRemove,
}: {
  row: ServiceRow;
  index: number;
  total: number;
  nameError?: string;
  priceError?: string;
  onUpdate: (id: string, field: keyof ServiceRow, value: RowValue) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="rounded-xl border border-divider/60 bg-default-50/60 p-4">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/10 text-xs font-mono text-accent">
            {index + 1}
          </span>
          Layanan
        </span>
        <Button
          isIconOnly
          variant="ghost"
          size="sm"
          onPress={() => onRemove(row.id)}
          isDisabled={total === 1}
          aria-label={`Hapus layanan baris ${index + 1}`}
          className={cn(
            total === 1 && "opacity-0 pointer-events-none",
            "text-danger/70 hover:text-danger hover:bg-danger/10",
          )}
        >
          <Icon icon="mdi:close" className="h-4 w-4" />
        </Button>
      </div>

      {/* Name (full width) */}
      <TextField
        fullWidth
        isInvalid={!!nameError}
        value={row.name}
        onChange={(val) => onUpdate(row.id, "name", val)}
        aria-label={`Nama layanan baris ${index + 1}`}
        className="mb-3"
      >
        <Label className="mb-1 text-xs font-medium text-muted-foreground">
          Nama Layanan
        </Label>
        <Input
          variant="secondary"
          placeholder="Contoh: Cuci Setrika Standard"
          autoComplete="off"
        />
        {nameError && <p className="mt-0.5 px-1 text-xs text-danger">{nameError}</p>}
      </TextField>

      {/* Detail grid */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {/* Price */}
        <TextField
          isInvalid={!!priceError}
          value={row.price}
          onChange={(val) => onUpdate(row.id, "price", val)}
          aria-label={`Harga baris ${index + 1}`}
        >
          <Label className="mb-1 text-xs font-medium text-muted-foreground">
            Harga (Rp)
          </Label>
          <Input variant="secondary" type="number" min={0} placeholder="0" />
          {priceError && (
            <p className="mt-0.5 px-1 text-xs text-danger">{priceError}</p>
          )}
        </TextField>

        {/* Unit */}
        <div className="flex flex-col">
          <Label className="mb-1 text-xs font-medium text-muted-foreground">
            Satuan
          </Label>
          <Select
            variant="secondary"
            value={row.unit}
            onChange={(val) => onUpdate(row.id, "unit", val ? String(val) : "pcs")}
            aria-label={`Satuan baris ${index + 1}`}
          >
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox aria-label="Pilihan satuan">
                {UNIT_OPTIONS.map((opt) => (
                  <ListBox.Item key={opt.id} id={opt.id} textValue={opt.label}>
                    {opt.label}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        </div>

        {/* Duration label */}
        <TextField
          value={row.duration}
          onChange={(val) => onUpdate(row.id, "duration", val)}
          aria-label={`Durasi tampilan baris ${index + 1}`}
        >
          <Label className="mb-1 text-xs font-medium text-muted-foreground">
            Durasi
          </Label>
          <Input variant="secondary" placeholder="Contoh: 2 Hari" autoComplete="off" />
        </TextField>

        {/* Duration hours */}
        <TextField
          value={row.durationHours}
          onChange={(val) => onUpdate(row.id, "durationHours", val)}
          aria-label={`Durasi jam baris ${index + 1}`}
        >
          <Label className="mb-1 text-xs font-medium text-muted-foreground">
            Durasi (jam)
          </Label>
          <Input variant="secondary" type="number" min={0} placeholder="24" />
        </TextField>

        {/* Sort order */}
        <TextField
          value={String(row.sortOrder)}
          onChange={(val) =>
            onUpdate(row.id, "sortOrder", isNaN(Number(val)) ? 0 : Number(val))
          }
          aria-label={`Urutan baris ${index + 1}`}
        >
          <Label className="mb-1 text-xs font-medium text-muted-foreground">
            Urutan
          </Label>
          <Input variant="secondary" type="number" min={0} />
        </TextField>
      </div>

      {/* Active switch */}
      <div className="mt-3">
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
            <span className="text-xs text-muted-foreground">Aktif</span>
          </Switch.Content>
        </Switch>
      </div>
    </div>
  );
}
