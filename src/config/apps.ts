// ─── App Switcher Config ──────────────────────────────────────────────────────
//
// The Dolphin Portal is split into separate "apps", each surfacing only its own
// slice of the sidebar. Users switch between them from the profile dropdown in
// the header. Each app maps to a top-level resource group declared in
// `src/routes/resources.tsx` (via `meta.parent`).

export type AppKey = "landing-page" | "portal" | "pos" | "content";

export interface AppConfig {
  key: AppKey;
  /** Short label shown in the switcher + sidebar header. */
  label: string;
  /** One-line helper text shown under the label in the switcher. */
  description: string;
  icon: string;
  /**
   * Name of the top-level resource group in `resources.tsx` whose children
   * make up this app's sidebar menu.
   */
  rootResource: string;
  /** Where to navigate when the user switches into this app. */
  defaultPath: string;
}

export const APPS: readonly AppConfig[] = [
  {
    key: "landing-page",
    label: "Landing Page",
    description: "Kelola konten website",
    icon: "mdi:web",
    rootResource: "landing-page-content",
    defaultPath: "/perfumes",
  },
  {
    key: "portal",
    label: "Portal Management",
    description: "Pengguna & akses portal",
    icon: "mdi:shield-account",
    rootResource: "portal-management",
    defaultPath: "/users",
  },
  {
    key: "pos",
    label: "POS Management",
    description: "Kasir & operasional POS",
    icon: "mdi:cash-register",
    rootResource: "pos-management",
    defaultPath: "/pos/service-categories",
  },
  {
    key: "content",
    label: "Content Studio",
    description: "Social media & blog",
    icon: "mdi:palette-swatch-variant",
    rootResource: "content-studio",
    defaultPath: "/social-posts",
  },
] as const;

export const DEFAULT_APP: AppKey = "pos";

export const APP_STORAGE_KEY = "dolphin_active_app";
export const APP_DEFAULT_STORAGE_KEY = "dolphin_default_app";

export function isValidAppKey(value: string | null | undefined): value is AppKey {
  return APPS.some((app) => app.key === value);
}

export function getAppConfig(key: AppKey): AppConfig {
  return APPS.find((app) => app.key === key) ?? APPS[0];
}
