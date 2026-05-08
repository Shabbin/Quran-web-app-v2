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

function getInitialSettings(): ReaderSettings {
  if (typeof window === "undefined") {
    return defaultSettings;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return defaultSettings;
  }

  try {
    return {
      ...defaultSettings,
      ...JSON.parse(stored),
    };
  } catch {
    return defaultSettings;
  }
}

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function useReaderSettings() {
  const [settings, setSettings] = useState<ReaderSettings>(getInitialSettings);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const resolvedTheme = useMemo(() => {
    if (settings.theme === "system") {
      return getSystemTheme();
    }

    return settings.theme;
  }, [settings.theme]);

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