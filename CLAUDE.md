# CLAUDE.md

Guidance for Claude Code when working in this repository.

**Dolphin Portal v2** — admin portal SPA (Vite + React 19 + Refine v5 + HeroUI v3 + Tailwind v4 + React Router 7).
Frontend only. All data comes from the separate Dolphin API at `VITE_API_URL`; there is no database code here.
See `README.MD` for the API contract.

## Commands

```bash
npm run dev         # Refine CLI + Vite dev server (http://localhost:5173)
npm run typecheck   # tsc --noEmit — use this to verify changes
npm run build       # typecheck + production build
npm run lint
```

Verify TypeScript changes with `npm run typecheck`. Only run `build`/`lint` when the user asks.

---

## Data Fetching — WAJIB pakai Refine hooks

**Jangan pernah pakai `fetch()` atau `axiosInstance` langsung di dalam komponen/page.** Semua operasi data lewat Refine hooks (cache, invalidation, notification, loading state otomatis).

```tsx
import { useCreateMany, useNavigation, useBack } from "@refinedev/core";

const { mutate: createPerfumes, mutation } = useCreateMany();
const isSubmitting = mutation.isPending; // tanstack v5 → isPending, BUKAN isLoading
const { list } = useNavigation();
createPerfumes(
  { resource: "pos-perfumes", values: [...] },
  { onSuccess: () => list("pos-perfumes") },
);
```

Hook mapping ke data provider (`src/providers/data-provider/index.ts`):
- `useList` / `useTable` → `getList`, `useOne` → `getOne`
- `useCreate` → `create`, `useCreateMany` → `createMany` (POST `/{endpoint}/bulk`)
- `useUpdate` → `update`, `useDelete` → `deleteOne`
- `useCustom` / `useCustomMutation` → `custom` — `url` is **relative to the API base** (e.g. `"faqs/next-sort-order"`, never `"/api/..."`)

Resource `pos-*` otomatis di-resolve ke path `pos/*` oleh `resolveEndpoint()`.

## Routing

- React Router 7 + `@refinedev/react-router`. Routes live in `src/routes/AppRoutes.tsx` (lazy-loaded pages);
  sidebar/breadcrumb come from `src/routes/resources.tsx`. Adding a page = add it to both.
- Use `react-router` APIs: `useParams`, `useNavigate`, `<Link to>`. For the pathname use `usePathname()` from `@hooks/usePathname`.
- HeroUI links (`href` on `Dropdown.Item`, `Link`, …) navigate client-side via the `RouterProvider` in `App.tsx`.
- Plain `<img>` for images (no `next/image`).

## Auth

Token-based (`src/providers/auth-provider`). Token + user are stored by `src/lib/authStorage.ts`; axios sends
`Authorization: Bearer`. Read the user with `useGetIdentity<AuthUser>()`, log out with `useLogout()`.

## Feature Organization

- `src/features/<area>/<resource>/` — `columns.tsx`, `interfaces.ts`, `tabs.tsx`, `form/Detail.tsx`
- `src/pages/<area>/<resource>/{list,create,edit,show}.tsx` — thin shells composing feature components
- List pages render `<DataTable>`; create/edit/show render `<CreateOrEditWrapper methods={useForm(...)} tabs={...} />`
- Form fields: `src/components/inputs/` (`TextInput`, `SelectInput`, `NumberInput`, `SwitchInput`, …) via `fieldName`
- Customers and transactions are read-only (created by the Flutter POS app) — no create/edit/delete.

Path aliases (`vite.config.ts` + `tsconfig.json`, keep in sync): `@/*`, `@components/*`, `@features/*`, `@pages/*`,
`@providers/*`, `@hooks/*`, `@contexts/*`, `@lib/*`, `@utils/*`, `@routes/*`, `@config/*`, `@constants/*`, `@interfaces/*`, `@styles/*`.

---

## HeroUI v3 Component Rules

**WAJIB: Sebelum menggunakan komponen HeroUI apa pun, fetch API props-nya lewat MCP `mcp__heroui-react__get_component_docs`. Jangan menebak props dari memory.**

### Typography — BUKAN tag HTML biasa

**Jangan pernah pakai `<h1>`, `<h2>`, `<p>`, dsb. langsung di JSX. Selalu gunakan `<Typography>`.**

```tsx
// ✅ Benar
import { Typography } from "@heroui/react";
<Typography type="h5">Judul Halaman</Typography>
<Typography type="body-sm" color="muted">Deskripsi</Typography>

// ❌ Salah
<h1 className="text-xl font-bold">Judul Halaman</h1>
<p className="text-sm text-muted-foreground">Deskripsi</p>
```

**Type yang tersedia:** `h1` | `h2` | `h3` | `h4` | `h5` | `h6` | `body` | `body-sm` | `body-xs` | `code`

**Color yang tersedia:** `default` | `muted`

**Primitives shorthand:** `Typography.Heading` (level 1–6), `Typography.Paragraph` (size: base/sm/xs), `Typography.Code`

### Switch — Anatomy yang Benar

`Switch.Control` HARUS berada di dalam `Switch.Content`, bukan sebagai sibling.

```tsx
// ✅ Benar
<Switch isSelected={val} onChange={(v) => set(v)}>
  <Switch.Content>
    <Switch.Control>
      <Switch.Thumb />
    </Switch.Control>
    <span>Label</span>   {/* pakai <span>, BUKAN <Label> — Switch.Content sudah <label> */}
  </Switch.Content>
</Switch>

// ❌ Salah — Control di luar Content
<Switch>
  <Switch.Control><Switch.Thumb /></Switch.Control>
  <Switch.Content><Label>Aktif</Label></Switch.Content>
</Switch>
```

`onChange` menerima `(isSelected: boolean) => void`.

---

## Tailwind CSS v4 — Gunakan Canonical Classes

Project ini pakai **Tailwind CSS v4**. Spacing/sizing scale-nya dinamis (`n × 0.25rem`), jadi **hindari arbitrary value `[...]` kalau sudah ada padanan canonical-nya.** Linter akan menyarankan (`suggestCanonicalClasses`), jadi tulis langsung yang benar.

```
// ❌ Hindari arbitrary value
w-[480px]   h-[64px]   p-[12px]   gap-[8px]   text-[14px]   rounded-[12px]   min-w-[160px]

// ✅ Canonical (n × 0.25rem = px; mis. 120 × 4px = 480px)
w-120       h-16       p-3        gap-2        text-sm        rounded-xl       min-w-40
```

Aturan praktis:
- **Spacing/size** (`w`, `h`, `p`, `m`, `gap`, `min-w`, `top`, dll): `px ÷ 4 = angka`. Contoh `w-[88px]` → `w-22`, `h-[40px]` → `h-10`, `mt-[2px]` → `mt-0.5`.
- **Font size / radius / shadow**: pakai token (`text-sm`, `text-xs`, `rounded-xl`, `shadow-md`) bukan `text-[14px]`/`rounded-[12px]`.
- **Warna**: pakai token tema (`bg-surface`, `text-muted-foreground`, `border-divider`, `bg-accent/10`), bukan `bg-[#fff]` atau warna hardcoded `gray`/`white`.
- Arbitrary value **boleh** hanya kalau memang tidak ada padanan (nilai ganjil yang tidak kelipatan 4px, atau ekspresi khusus seperti `h-[calc(100vh-4rem)]`).

---

