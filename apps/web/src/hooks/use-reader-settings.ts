"use client";

import { useEffect, useMemo, useState } from "react";

export type ReaderTheme = "light" | "dark" | "sepia" | "system";
export type ArabicFont = "amiri" | "scheherazade";

export type ReaderSettings = {
  theme: ReaderTheme;
  arabicFont: ArabicFont;
  arabicFontSize: number;
  translationFontSize: number;
};

const STORAGE_KEY = "quran-reader-settings";

const defaultSettings: ReaderSettings = {
  theme: "light",
  arabicFont: "amiri",
  arabicFontSize: 34,
  translationFontSize: 17,
};

export function useReaderSettings() {
  const [settings, setSettings] = useState<ReaderSettings>(defaultSettings);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (stored) {
      try {
        setSettings({
          ...defaultSettings,
          ...JSON.parse(stored),
        });
      } catch {
        setSettings(defaultSettings);
      }
    }

    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [mounted, settings]);

  const resolvedTheme = useMemo(() => {
    if (settings.theme !== "system") {
      return settings.theme;
    }

    if (!mounted) {
      return "light";
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }, [mounted, settings.theme]);

  const updateSettings = <K extends keyof ReaderSettings>(
    key: K,
    value: ReaderSettings[K]
  ) => {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
  };

  return {
    settings,
    resolvedTheme,
    updateSettings,
  };
}