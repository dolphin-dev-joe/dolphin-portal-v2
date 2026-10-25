import { useState, useEffect, useCallback } from "react";
import { useCreateMany, useNavigation, useBack } from "@refinedev/core";
import {
  Button,
  Card,
  Select,
  Label,
  ListBox,
  Spinner,
  Typography,
} from "@heroui/react";
import type { Key } from "@heroui/react";
import { Icon } from "@iconify/react";
import { usePosServiceCategoryOptions } from "@/hooks/pos/usePosServiceCategoryOptions";
import { useNextSortOrder } from "@/hooks/useNextSortOrder";
import { ServiceRowItem } from "@features/pos/services/ServiceRowItem";
import type { ServiceRow } from "@features/pos/services/ServiceRowItem";

function makeRow(sortOrder: number): ServiceRow {
  return {
    id: crypto.randomUUID(),
    name: "",
    price: "",
    unit: "kg",
    duration: "",
    durationHours: "24",
    sortOrder,
    isActive: true,
  };
}

export default function PosServiceCreatePage() {
  const { list } = useNavigation();
  const back = useBack();
  const { options: categoryOptions, isLoading: categoryLoading } =
    usePosServiceCategoryOptions();
  const nextSortOrder = useNextSortOrder("pos/services/next-sort-order");
  const { mutate: createServices, mutation } = useCreateMany();
  const isSubmitting = mutation.isPending;

  const [selectedCategory, setSelectedCategory] = useState<Key | null>(null);
  const [rows, setRows] = useState<ServiceRow[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (nextSortOrder !== null && rows.length === 0) {
      setRows([makeRow(nextSortOrder)]);
    }
  }, [nextSortOrder]);

  const addRow = useCallback(() => {
    setRows((prev) => {
      const maxOrder =
        prev.length > 0
          ? Math.max(...prev.map((r) => r.sortOrder)) + 1
          : (nextSortOrder ?? 0);
      return [...prev, makeRow(maxOrder)];
    });
  }, [nextSortOrder]);

  const removeRow = useCallback((id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const updateRow = useCallback(
    (id: string, field: keyof ServiceRow, value: string | number | boolean) => {
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
      setErrors((prev) => {
        const next = { ...prev };
        delete next[`${id}-name`];
        delete next[`${id}-price`];
        delete next.global;
        return next;
      });
    },
    [],
  );

  const validate = () => {
    const next: Record<string, string> = {};
    if (!selectedCategory) next.category = "Pilih kategori layanan terlebih dahulu";
    rows.forEach((row) => {
      if (!row.name.trim()) next[`${row.id}-name`] = "Nama wajib diisi";
      if (!row.price || Number(row.price) <= 0)
        next[`${row.id}-price`] = "Harga harus > 0";
    });
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    createServices(
      {
        resource: "pos-services",
        values: rows.map((row) => ({
          categoryId: selectedCategory ? Number(selectedCategory) : null,
          name: row.name.trim(),
          price: row.price || "0",
          unit: row.unit,
          duration: row.duration.trim() || null,
          durationHours: row.durationHours || "24",
          sortOrder: row.sortOrder,
          isActive: row.isActive,
        })),
      },
      {
        onSuccess: () => {
          setSubmitSuccess(true);
          setTimeout(() => list("pos-services"), 800);
        },
        onError: () => {
          setErrors({ global: "Gagal menyimpan, silakan coba lagi." });
        },
      },
    );
  };

  const selectedCategoryName = categoryOptions.find(
    (o) => o.id === String(selectedCategory),
  )?.label;

  const filledCount = rows.filter((r) => r.name.trim()).length;

  return (
    <div className="mx-auto max-w-full space-y-5 p-4 pb-10">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          isIconOnly
          variant="ghost"
          size="sm"
          onPress={() => back()}
          aria-label="Kembali ke daftar layanan"
        >
          <Icon icon="mdi:arrow-left" className="h-5 w-5" />
        </Button>
        <div>
          <Typography type="h5">Tambah Layanan</Typography>
          <Typography type="body-sm" color="muted">
            Isi satu atau beberapa layanan sekaligus per kategori
          </Typography>
        </div>
      </div>

      {/* Category card */}
      <Card>
        <Card.Header>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <Icon icon="mdi:shape" className="h-4 w-4" />
            </div>
            <div>
              <Card.Title>Kategori Layanan</Card.Title>
              <Card.Description>
                Semua layanan di bawah masuk ke kategori ini
              </Card.Description>
            </div>
          </div>
        </Card.Header>
        <Card.Content>
          <Select
            fullWidth
            isRequired
            isDisabled={categoryLoading}
            isInvalid={!!errors.category}
            value={selectedCategory}
            onChange={(val) => {
              setSelectedCategory(val);
              setErrors((prev) => {
                const n = { ...prev };
                delete n.category;
                return n;
              });
            }}
            placeholder={categoryLoading ? "Memuat kategori..." : "Pilih kategori layanan"}
            aria-label="Kategori layanan"
          >
            <Label>Kategori</Label>
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {categoryOptions.map((opt) => (
                  <ListBox.Item key={opt.id} id={opt.id} textValue={opt.label}>
                    {opt.label}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
          {errors.category && (
            <p className="mt-1 px-1 text-sm text-danger">{errors.category}</p>
          )}
        </Card.Content>
      </Card>

      {/* Rows card */}
      <Card>
        <Card.Header>
          <div className="flex w-full items-start justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Icon icon="mdi:washing-machine" className="h-4 w-4" />
              </div>
              <div>
                <Card.Title>Daftar Layanan</Card.Title>
                <Card.Description>
                  {filledCount > 0 ? (
                    <>
                      <span className="font-medium text-foreground">{filledCount}</span>
                      {" dari "}
                      <span className="font-medium text-foreground">{rows.length}</span>
                      {" layanan terisi"}
                      {selectedCategoryName && (
                        <>
                          {" · "}
                          <span className="font-medium text-accent">{selectedCategoryName}</span>
                        </>
                      )}
                    </>
                  ) : (
                    "Mulai isi data layanan di bawah"
                  )}
                </Card.Description>
              </div>
            </div>
            <Button variant="secondary" size="sm" onPress={addRow}>
              <Icon icon="mdi:plus" className="mr-1 h-4 w-4" />
              Tambah Baris
            </Button>
          </div>
        </Card.Header>
        <Card.Content className="px-4 pb-4">
          {rows.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-muted-foreground">
              <Icon icon="mdi:washing-machine" className="mb-3 h-12 w-12 opacity-20" />
              <p className="text-sm">
                Belum ada layanan. Klik &ldquo;Tambah Baris&rdquo; untuk mulai.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {rows.map((row, idx) => (
                <ServiceRowItem
                  key={row.id}
                  row={row}
                  index={idx}
                  total={rows.length}
                  nameError={errors[`${row.id}-name`]}
                  priceError={errors[`${row.id}-price`]}
                  onUpdate={updateRow}
                  onRemove={removeRow}
                />
              ))}
            </div>
          )}

          {rows.length > 0 && (
            <button
              type="button"
              onClick={addRow}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-divider py-2.5 text-sm text-muted-foreground transition-colors hover:border-accent/50 hover:bg-accent/5 hover:text-accent"
            >
              <Icon icon="mdi:plus" className="h-4 w-4" />
              Tambah layanan lagi
            </button>
          )}
        </Card.Content>
      </Card>

      {/* Global error */}
      {errors.global && (
        <div className="flex items-center gap-2 rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">
          <Icon icon="mdi:alert-circle-outline" className="h-4 w-4 shrink-0" />
          {errors.global}
        </div>
      )}

      {/* Footer actions */}
      <div className="flex items-center justify-between gap-4 pt-1">
        <div className="text-sm text-muted-foreground">
          {submitSuccess && (
            <span className="flex items-center gap-1.5 text-success">
              <Icon icon="mdi:check-circle" className="h-4 w-4" />
              Tersimpan! Mengalihkan...
            </span>
          )}
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" onPress={() => back()} isDisabled={isSubmitting}>
            Batal
          </Button>
          <Button
            onPress={handleSubmit}
            isDisabled={isSubmitting || rows.length === 0 || submitSuccess}
            className="min-w-36"
          >
            {isSubmitting ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Menyimpan...
              </>
            ) : (
              <>
                <Icon icon="mdi:content-save-all-outline" className="mr-1.5 h-4 w-4" />
                Simpan{rows.length > 1 ? ` ${rows.length} Layanan` : " Layanan"}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
