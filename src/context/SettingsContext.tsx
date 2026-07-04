"use client";

import { createContext, useContext, ReactNode } from "react";
import { SiteSettings } from "@/lib/settings";

const SettingsContext = createContext<SiteSettings | null>(null);

export function SettingsProvider({
  children,
  settings,
}: {
  children: ReactNode;
  settings: SiteSettings;
}) {
  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
