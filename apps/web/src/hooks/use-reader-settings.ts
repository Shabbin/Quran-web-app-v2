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
  arabicFontSize: 32,
  translationFontSize: 17,
};

function clampNumber(value: unknown, min: number, max: number, fallback: number) {
  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) {
    return fallback;
  }

  return Math.min(Math.max(numberValue, min), max);
}

function isValidTheme(value: unknown): value is ReaderTheme {
  return value === "light" || value === "dark" || value === "sepia" || value === "system";
}

function isValidArabicFont(value: unknown): value is ArabicFont {
  return value === "amiri" || value === "scheherazade";
}

function sanitizeSettings(value: Partial<ReaderSettings>): ReaderSettings {
  return {
    theme: isValidTheme(value.theme) ? value.theme : defaultSettings.theme,
    arabicFont: isValidArabicFont(value.arabicFont)
      ? value.arabicFont
      : defaultSettings.arabicFont,
    arabicFontSize: clampNumber(
      value.arabicFontSize,
      26,
      42,
      defaultSettings.arabicFontSize
    ),
    translationFontSize: clampNumber(
      value.translationFontSize,
      14,
      20,
      defaultSettings.translationFontSize
    ),
  };
}

function getInitialSettings(): ReaderSettings {
  if (typeof window === "undefined") {
    return defaultSettings;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return defaultSettings;
  }

  try {
    return sanitizeSettings(JSON.parse(stored));
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
    setSettings((current) => {
      const nextSettings = {
        ...current,
        [key]: value,
      };

      return sanitizeSettings(nextSettings);
    });
  };

  return {
    settings,
    resolvedTheme,
    updateSettings,
  };
}