/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the Dolphin API, e.g. http://localhost:3000/api */
  readonly VITE_API_URL?: string;
  /** Supabase project for Realtime signals (defaults to the POS project). */
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
