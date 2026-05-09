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

let hasCompletedFirstThemeMount = false;

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
  return (
    value === "light" ||
    value === "dark" ||
    value === "sepia" ||
    value === "system"
  );
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
      24,
      48,
      defaultSettings.arabicFontSize
    ),
    translationFontSize: clampNumber(
      value.translationFontSize,
      14,
      32,
      defaultSettings.translationFontSize
    ),
  };
}

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function resolveTheme(theme: ReaderTheme, systemTheme: "light" | "dark") {
  return theme === "system" ? systemTheme : theme;
}

function applyTheme(theme: "light" | "dark" | "sepia") {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.dataset.readerTheme = theme;
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme =
    theme === "dark" ? "dark" : "light";
}

function saveSettings(settings: ReaderSettings) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
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

export function useReaderSettings() {
  const [isThemeReady, setIsThemeReady] = useState(
    hasCompletedFirstThemeMount
  );

  const [settings, setSettings] = useState<ReaderSettings>(getInitialSettings);
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">(
    getSystemTheme
  );

  const resolvedTheme = useMemo(() => {
    return resolveTheme(settings.theme, systemTheme);
  }, [settings.theme, systemTheme]);

  useEffect(() => {
    applyTheme(resolvedTheme);
    saveSettings(settings);

    if (hasCompletedFirstThemeMount) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      hasCompletedFirstThemeMount = true;
      setIsThemeReady(true);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [resolvedTheme, settings]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      const nextSystemTheme = mediaQuery.matches ? "dark" : "light";

      setSystemTheme(nextSystemTheme);

      setSettings((currentSettings) => {
        if (currentSettings.theme === "system") {
          applyTheme(nextSystemTheme);
        }

        return currentSettings;
      });
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  const updateSettings = <K extends keyof ReaderSettings>(
    key: K,
    value: ReaderSettings[K]
  ) => {
    setSettings((current) => {
      const nextSettings = sanitizeSettings({
        ...current,
        [key]: value,
      });

      const nextResolvedTheme = resolveTheme(
        nextSettings.theme,
        getSystemTheme()
      );

      applyTheme(nextResolvedTheme);
      saveSettings(nextSettings);

      hasCompletedFirstThemeMount = true;

      return nextSettings;
    });
  };

  return {
    settings,
    resolvedTheme,
    updateSettings,
    isThemeReady,
  };
}