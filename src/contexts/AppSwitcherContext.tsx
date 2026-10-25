import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import {
  APP_STORAGE_KEY,
  APP_DEFAULT_STORAGE_KEY,
  DEFAULT_APP,
  isValidAppKey,
  type AppKey,
} from "@/config/apps";

interface AppSwitcherContextValue {
  /** The app whose menu/dashboard is currently shown. */
  activeApp: AppKey;
  /** Switch the active app and persist it as the last-used app. */
  setActiveApp: (app: AppKey) => void;
  /** The app that opens by default on a fresh session. */
  defaultApp: AppKey;
  /** Change the default app preference (used in Settings). */
  setDefaultApp: (app: AppKey) => void;
}

const AppSwitcherContext = createContext<AppSwitcherContextValue | null>(null);

export function AppSwitcherProvider({ children }: PropsWithChildren) {
  // Start from the constant on both server and first client render to avoid a
  // hydration mismatch; persisted values are applied in the effect below.
  const [activeApp, setActiveAppState] = useState<AppKey>(DEFAULT_APP);
  const [defaultApp, setDefaultAppState] = useState<AppKey>(DEFAULT_APP);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedDefault = window.localStorage.getItem(APP_DEFAULT_STORAGE_KEY);
    const savedActive = window.localStorage.getItem(APP_STORAGE_KEY);

    if (isValidAppKey(savedDefault)) setDefaultAppState(savedDefault);

    // Prefer the last-used app; otherwise fall back to the default preference.
    if (isValidAppKey(savedActive)) {
      setActiveAppState(savedActive);
    } else if (isValidAppKey(savedDefault)) {
      setActiveAppState(savedDefault);
    }
  }, []);

  const setActiveApp = useCallback((app: AppKey) => {
    setActiveAppState(app);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(APP_STORAGE_KEY, app);
    }
  }, []);

  const setDefaultApp = useCallback((app: AppKey) => {
    setDefaultAppState(app);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(APP_DEFAULT_STORAGE_KEY, app);
    }
  }, []);

  return (
    <AppSwitcherContext.Provider
      value={{ activeApp, setActiveApp, defaultApp, setDefaultApp }}
    >
      {children}
    </AppSwitcherContext.Provider>
  );
}

export function useAppSwitcher(): AppSwitcherContextValue {
  const ctx = useContext(AppSwitcherContext);
  if (!ctx) {
    throw new Error("useAppSwitcher must be used within AppSwitcherProvider");
  }
  return ctx;
}
