import { useMemo, useState } from "react";
import { useList } from "@refinedev/core";
import { Icon } from "@iconify/react";

import { Heading } from "@components/heading";
import { Text } from "@components/text";
import { IPosServiceCategory } from "@features/pos/service-categories/interfaces";
import { IPosService } from "@features/pos/services/interfaces";

function formatIDR(value: string | number) {
  const num = Math.round(Number(value) || 0);
  return "Rp " + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/** Pilih ikon kategori berdasarkan kata kunci pada namanya. */
// ID sebagai tie-breaker. UUIDv7 urut sesuai waktu dibuat kalau dibandingkan
// sebagai teks; ID angka lama (bigint) dibandingkan sebagai angka.
function compareIds(a: string, b: string): number {
  if (/^\d+$/.test(a) && /^\d+$/.test(b)) return Number(a) - Number(b);
  return a < b ? -1 : a > b ? 1 : 0;
}

function categoryIcon(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("express")) return "mdi:lightning-bolt";
  if (
    n.includes("dry") ||
    n.includes("clean") ||
    n.includes("khusus") ||
    n.includes("special")
  )
    return "mdi:hanger";
  if (n.includes("satuan")) return "mdi:tshirt-crew";
  if (n.includes("reguler") || n.includes("laundry") || n.includes("kiloan"))
    return "mdi:washing-machine";
  return "mdi:tag";
}

export default function PosDisplayPreview() {
  const [showOrder, setShowOrder] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  const { result: catResult, query: catQuery } = useList<IPosServiceCategory>({
    resource: "pos-service-categories",
    pagination: { currentPage: 1, pageSize: 200, mode: "server" },
    sorters: [{ field: "sortOrder", order: "asc" }],
  });

  const { result: svcResult, query: svcQuery } = useList<IPosService>({
    resource: "pos-services",
    pagination: { currentPage: 1, pageSize: 1000, mode: "server" },
    sorters: [{ field: "sortOrder", order: "asc" }],
  });

  const catLoading = catQuery.isLoading;
  const svcLoading = svcQuery.isLoading;

  // Kategori aktif, diurutkan berdasarkan sortOrder (lalu id sebagai tie-breaker).
  const categories = useMemo(() => {
    const list = (catResult?.data ?? []).filter((c) => c.isActive);
    return [...list].sort(
      (a, b) => a.sortOrder - b.sortOrder || compareIds(a.id, b.id)
    );
  }, [catResult]);

  // Service aktif dikelompokkan per kategori, tiap grup diurutkan by sortOrder.
  const servicesByCategory = useMemo(() => {
    const map = new Map<string, IPosService[]>();
    for (const s of svcResult?.data ?? []) {
      if (!s.isActive) continue;
      const arr = map.get(s.categoryId) ?? [];
      arr.push(s);
      map.set(s.categoryId, arr);
    }
    for (const arr of map.values()) {
      arr.sort((a, b) => a.sortOrder - b.sortOrder || compareIds(a.id, b.id));
    }
    return map;
  }, [svcResult]);

  const effectiveActiveId = activeCategoryId ?? categories[0]?.id ?? null;
  const activeServices =
    effectiveActiveId != null
      ? servicesByCategory.get(effectiveActiveId) ?? []
      : [];

  const isLoading = catLoading || svcLoading;

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto">
      {/* Caption portal */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <Heading as="h1" size="2xl" weight="bold">
            Preview Display POS
          </Heading>
          <Text muted size="sm">
            Simulasi tampilan kasir Dolphin POS. Tab kategori &amp; urutan
            layanan mengikuti <span className="font-medium">sortOrder</span>.
          </Text>
        </div>

        <button
          type="button"
          onClick={() => setShowOrder((v) => !v)}
          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition border ${
            showOrder
              ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-600 dark:text-cyan-300"
              : "bg-transparent border-divider text-muted-foreground hover:bg-accent/10"
          }`}
        >
          <Icon
            icon={showOrder ? "mdi:eye" : "mdi:eye-off-outline"}
            width={16}
          />
          {showOrder ? "Sembunyikan sortOrder" : "Tampilkan sortOrder"}
        </button>
      </div>

      {/* Mockup layar POS — tema Ocean */}
      <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Icon icon="mdi:menu" width={22} className="text-white/70" />
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold tracking-wide">
                DOLPHIN LAUNDRY
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                POS SYSTEM
              </span>
            </div>
          </div>
          <Icon
            icon="mdi:waves"
            width={24}
            className="text-cyan-400/50 hidden sm:block"
          />
        </div>
        <div className="px-5 pt-3 text-xs text-white/40">
          Sistem Kasir · Mode Ocean
        </div>

        {/* Tabs kategori */}
        <div className="flex flex-wrap gap-2 px-5 py-4">
          {isLoading && categories.length === 0 ? (
            <div className="h-9 w-full animate-pulse rounded-xl bg-white/5" />
          ) : (
            categories.map((c) => {
              const active = c.id === effectiveActiveId;
              const count = servicesByCategory.get(c.id)?.length ?? 0;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActiveCategoryId(c.id)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30"
                      : "bg-white/5 text-white/60 hover:bg-white/10 border border-white/10"
                  }`}
                >
                  <Icon icon={categoryIcon(c.name)} width={16} />
                  {c.name}
                  <span className="text-[10px] opacity-70">({count})</span>
                  {showOrder && (
                    <span className="ml-1 rounded bg-black/30 px-1.5 py-0.5 text-[10px] font-mono">
                      #{c.sortOrder}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Grid layanan */}
        <div className="px-5 pb-6 min-h-72">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-28 animate-pulse rounded-xl border border-white/10 bg-white/5"
                />
              ))}
            </div>
          ) : activeServices.length === 0 ? (
            <div className="py-20 text-center text-sm text-white/40">
              {categories.length === 0
                ? "Belum ada kategori layanan."
                : "Tidak ada layanan aktif pada kategori ini."}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {activeServices.map((s) => (
                <div
                  key={s.id}
                  className="relative flex flex-col min-h-28 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur transition hover:border-cyan-400/40 hover:bg-white/10"
                >
                  {/* Baris atas: durasi + ikon / badge sortOrder */}
                  <div className="flex items-start justify-between">
                    {s.duration ? (
                      <span className="rounded-md border border-cyan-400/20 bg-cyan-400/15 px-2 py-0.5 text-[10px] font-medium text-cyan-200">
                        {s.duration}
                      </span>
                    ) : (
                      <span />
                    )}
                    {showOrder ? (
                      <span className="rounded bg-black/30 px-1.5 py-0.5 text-[10px] font-mono text-white/60">
                        #{s.sortOrder}
                      </span>
                    ) : (
                      <Icon
                        icon="mdi:hanger"
                        width={16}
                        className="text-white/30"
                      />
                    )}
                  </div>

                  {/* Nama + catatan layanan */}
                  <div className="mt-auto pt-4">
                    <div className="text-sm font-semibold leading-tight">
                      {s.name}
                    </div>
                    {s.notes && (
                      <div className="text-[11px] text-white/40 leading-tight">
                        {s.notes}
                      </div>
                    )}
                  </div>

                  {/* Baris bawah: harga + tombol tambah (dekoratif) */}
                  <div className="mt-2 flex items-end justify-between">
                    <div className="text-sm font-bold text-cyan-300">
                      {formatIDR(s.price)}
                      <span className="text-xs font-normal text-white/40">
                        /{s.unit}
                      </span>
                    </div>
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                      <Icon icon="mdi:plus" width={16} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
