"use client";

import { createContext, useContext, useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import type { Language } from "./portfolio-data";

type Settings = { language: Language; setLanguage: (language: Language) => void; paused: boolean; toggleMotion: () => void };
const Preferences = createContext<Settings | null>(null);

function subscribeMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [motionPaused, setMotionPaused] = useState(false);
  const reduced = useSyncExternalStore(subscribeMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, () => false);
  useEffect(() => { document.documentElement.lang = language === "en" ? "en" : "zh-CN"; }, [language]);
  return <Preferences.Provider value={{ language, setLanguage, paused: reduced || motionPaused,
    toggleMotion: () => setMotionPaused((value) => !value) }}>{children}</Preferences.Provider>;
}

export function usePreferences() {
  return useContext(Preferences)!;
}
