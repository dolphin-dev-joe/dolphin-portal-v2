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
  cn,
} from "@heroui/react";
import type { Key } from "@heroui/react";
import { Icon } from "@iconify/react";
import { usePosPerfumeCategoryOptions } from "@/hooks/pos/usePosPerfumeCategoryOptions";
import { usePosPerfumeNextSortOrder } from "@/hooks/pos/usePosPerfumeNextSortOrder";
import { PerfumeRowItem } from "@features/pos/perfumes/PerfumeRowItem";
import type { PerfumeRow } from "@features/pos/perfumes/PerfumeRowItem";

export default function PosPerfumeCreatePage() {
  const { list } = useNavigation();
  const back = useBack();
  const { options: categoryOptions, isLoading: categoryLoading } =
    usePosPerfumeCategoryOptions();
  const nextSortOrder = usePosPerfumeNextSortOrder();
  const { mutate: createPerfumes, mutation } = useCreateMany();
  const isSubmitting = mutation.isPending;

  const [selectedCategory, setSelectedCategory] = useState<Key | null>(null);
  const [rows, setRows] = useState<PerfumeRow[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (nextSortOrder !== null && rows.length === 0) {
      setRows([{ id: crypto.randomUUID(), name: "", sortOrder: nextSortOrder, isActive: true }]);
    }
  }, [nextSortOrder]);

  const addRow = useCallback(() => {
    setRows((prev) => {
      const maxOrder =
        prev.length > 0
          ? Math.max(...prev.map((r) => r.sortOrder)) + 1
          : (nextSortOrder ?? 0);
      return [...prev, { id: crypto.randomUUID(), name: "", sortOrder: maxOrder, isActive: true }];
    });
  }, [nextSortOrder]);

  const removeRow = useCallback((id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const updateRow = useCallback(
    (id: string, field: keyof PerfumeRow, value: string | number | boolean) => {
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
      setErrors((prev) => {
        const next = { ...prev };
        delete next[`${id}-name`];
        delete next.global;
        return next;
      });
    },
    [],
  );

  const validate = () => {
    const next: Record<string, string> = {};
    if (!selectedCategory) next.category = "Pilih kategori parfum terlebih dahulu";
    rows.forEach((row) => {
      if (!row.name.trim()) next[`${row.id}-name`] = "Nama wajib diisi";
    });
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    createPerfumes(
      {
        resource: "pos-perfumes",
        values: rows.map((row) => ({
          categoryId: selectedCategory ? Number(selectedCategory) : null,
          name: row.name.trim(),
          sortOrder: row.sortOrder,
          isActive: row.isActive,
        })),
      },
      {
        onSuccess: () => {
          setSubmitSuccess(true);
          setTimeout(() => list("pos-perfumes"), 800);
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
          aria-label="Kembali ke daftar parfum"
        >
          <Icon icon="mdi:arrow-left" className="h-5 w-5" />
        </Button>
        <div>
          <Typography type="h5">Tambah Parfum</Typography>
          <Typography type="body-sm" color="muted">
            Isi satu atau beberapa parfum sekaligus per kategori
          </Typography>
        </div>
      </div>

      {/* Category card */}
      <Card>
        <Card.Header>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <Icon icon="carbon:category-new-each" className="h-4 w-4" />
            </div>
            <div>
              <Card.Title>Kategori Parfum</Card.Title>
              <Card.Description>Semua parfum di bawah masuk ke kategori ini</Card.Description>
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
            placeholder={categoryLoading ? "Memuat kategori..." : "Pilih kategori parfum"}
            aria-label="Kategori parfum"
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
                <Icon icon="tabler:perfume" className="h-4 w-4" />
              </div>
              <div>
                <Card.Title>Daftar Parfum</Card.Title>
                <Card.Description>
                  {filledCount > 0 ? (
                    <>
                      <span className="font-medium text-foreground">{filledCount}</span>
                      {" dari "}
                      <span className="font-medium text-foreground">{rows.length}</span>
                      {" parfum terisi"}
                      {selectedCategoryName && (
                        <>
                          {" · "}
                          <span className="text-accent font-medium">{selectedCategoryName}</span>
                        </>
                      )}
                    </>
                  ) : (
                    "Mulai isi nama parfum di bawah"
                  )}
                </Card.Description>
              </div>
            </div>
            <Button variant="secondary" size="sm" onPress={addRow}>
              <Icon icon="mdi:plus" className="h-4 w-4 mr-1" />
              Tambah Baris
            </Button>
          </div>
        </Card.Header>
        <Card.Content className="px-4 pb-4">
          {/* Desktop column headers */}
          <div className="mb-2 hidden md:grid md:grid-cols-[2.5rem_1fr_7rem_5rem_2.5rem] gap-3 px-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <span>#</span>
            <span>Nama Parfum</span>
            <span>Urutan</span>
            <span>Aktif</span>
            <span />
          </div>
          <div className="hidden md:block h-px bg-divider/50 mb-2" />

          {rows.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-muted-foreground">
              <Icon icon="tabler:perfume" className="mb-3 h-12 w-12 opacity-20" />
              <p className="text-sm">
                Belum ada parfum. Klik &ldquo;Tambah Baris&rdquo; untuk mulai.
              </p>
            </div>
          ) : (
            <div className="space-y-2 md:space-y-1">
              {rows.map((row, idx) => (
                <PerfumeRowItem
                  key={row.id}
                  row={row}
                  index={idx}
                  total={rows.length}
                  nameError={errors[`${row.id}-name`]}
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
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-divider py-2.5 text-sm text-muted-foreground transition-colors hover:border-accent/50 hover:text-accent hover:bg-accent/5"
            >
              <Icon icon="mdi:plus" className="h-4 w-4" />
              Tambah parfum lagi
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
                Simpan{rows.length > 1 ? ` ${rows.length} Parfum` : " Parfum"}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
