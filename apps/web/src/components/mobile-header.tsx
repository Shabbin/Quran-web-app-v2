"use client";

import type {
  ReaderSettings,
  ReaderTheme,
} from "@/hooks/use-reader-settings";
import { Menu, Moon, Search, Settings, Sun } from "lucide-react";

type MobileHeaderProps = {
  settings: ReaderSettings;
  resolvedTheme: "light" | "dark" | "sepia";
  onChange: <K extends keyof ReaderSettings>(
    key: K,
    value: ReaderSettings[K]
  ) => void;
  onOpenMenu: () => void;
  onOpenSearch: () => void;
  onOpenSettings: () => void;
};

function getNextTheme(currentTheme: ReaderTheme): ReaderTheme {
  if (currentTheme === "light") return "dark";
  if (currentTheme === "dark") return "sepia";
  return "light";
}

export function MobileHeader({
  settings,
  resolvedTheme,
  onChange,
  onOpenMenu,
  onOpenSearch,
  onOpenSettings,
}: MobileHeaderProps) {
  const isDark = resolvedTheme === "dark";
  const isSepia = resolvedTheme === "sepia";

  const headerClass = isDark
    ? "border-[#222722] bg-[#090b09]"
    : isSepia
      ? "border-[#e8dcc9] bg-[#f6f1e7]"
      : "border-[#e7eee8] bg-white";

  const titleClass = isDark
    ? "text-zinc-100"
    : isSepia
      ? "text-[#4f3c28]"
      : "text-slate-900";

  const subtitleClass = isDark
    ? "text-zinc-500"
    : isSepia
      ? "text-[#907658]"
      : "text-slate-500";

  const iconButtonClass = isDark
    ? "bg-[#101510] text-emerald-400 hover:bg-[#182018]"
    : isSepia
      ? "bg-[#f1eadc] text-[#a07a50] hover:bg-[#eadcc6]"
      : "bg-[#f3f7f1] text-[#3d8738] hover:bg-emerald-100";

  const ThemeIcon = resolvedTheme === "dark" ? Moon : Sun;

  return (
    <header
      className={`sticky top-0 z-30 flex h-[64px] items-center justify-between border-b px-3 lg:hidden ${headerClass}`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onOpenMenu}
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition ${iconButtonClass}`}
          aria-label="Open surah menu"
        >
          <Menu size={18} />
        </button>

        <div className="min-w-0">
          <p className={`truncate text-[14px] font-bold leading-5 ${titleClass}`}>
            Quran Mazid
          </p>
          <p className={`truncate text-[9px] leading-3 ${subtitleClass}`}>
            Read, Study, and Learn The Quran
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={onOpenSearch}
          className={`flex h-9 w-9 items-center justify-center rounded-full transition ${iconButtonClass}`}
          aria-label="Search Quran"
        >
          <Search size={17} />
        </button>

        <button
          type="button"
          onClick={() => onChange("theme", getNextTheme(settings.theme))}
          className={`flex h-9 w-9 items-center justify-center rounded-full transition ${iconButtonClass}`}
          aria-label="Change theme"
        >
          <ThemeIcon size={17} />
        </button>

        <button
          type="button"
          onClick={onOpenSettings}
          className={`flex h-9 w-9 items-center justify-center rounded-full transition ${iconButtonClass}`}
          aria-label="Open settings"
        >
          <Settings size={17} />
        </button>
      </div>
    </header>
  );
}