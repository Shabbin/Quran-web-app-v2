"use client";

import type {
  ReaderSettings,
  ReaderTheme,
} from "@/hooks/use-reader-settings";
import {
  Heart,
  Moon,
  Search,
  Settings,
  Sun,
} from "lucide-react";
import { useMemo, useState } from "react";

type DesktopTopbarProps = {
  settings: ReaderSettings;
  resolvedTheme: "light" | "dark" | "sepia";
  onChange: <K extends keyof ReaderSettings>(
    key: K,
    value: ReaderSettings[K]
  ) => void;
  onOpenSearch: () => void;
};

const themes: { label: string; value: ReaderTheme; icon: typeof Sun }[] = [
  { label: "Light", value: "light", icon: Sun },
  { label: "Dark", value: "dark", icon: Moon },
  { label: "Sepia", value: "sepia", icon: Sun },
  { label: "System", value: "system", icon: Settings },
];

export function DesktopTopbar({
  settings,
  resolvedTheme,
  onChange,
  onOpenSearch,
}: DesktopTopbarProps) {
  const [isThemeOpen, setIsThemeOpen] = useState(false);

  const isDark = resolvedTheme === "dark";
  const isSepia = resolvedTheme === "sepia";

  const CurrentThemeIcon = useMemo(() => {
    if (settings.theme === "system") return Settings;
    if (resolvedTheme === "dark") return Moon;
    return Sun;
  }, [settings.theme, resolvedTheme]);

  const headerClass = isDark
    ? "border-zinc-800 bg-[#050705]"
    : isSepia
      ? "border-[#e8dcc9] bg-[#f7f2e8]"
      : "border-[#e7eee8] bg-white";

  const titleClass = isDark
    ? "text-zinc-50"
    : isSepia
      ? "text-[#5a452d]"
      : "text-slate-950";

  const subtitleClass = isDark
    ? "text-zinc-500"
    : isSepia
      ? "text-[#9b7f60]"
      : "text-slate-500";

  const circleButtonClass = isDark
    ? "bg-[#0c120c] text-[#69b35f] hover:bg-[#101710]"
    : isSepia
      ? "bg-[#f3ebdd] text-[#a07a50] hover:bg-[#ede2d0]"
      : "bg-[#f3f7f1] text-[#3d8738] hover:bg-emerald-100";

  const supportButtonClass = isDark
    ? "bg-[#4a8f3e] text-white hover:bg-[#3f7f35]"
    : isSepia
      ? "bg-[#a67c52] text-white hover:bg-[#956d45]"
      : "bg-[#3d8738] text-white hover:bg-[#347730]";

  const dropdownClass = isDark
    ? "border-zinc-800 bg-[#101210]"
    : isSepia
      ? "border-[#e2d5c3] bg-[#fbf6ee]"
      : "border-[#e7eee8] bg-white";

  const optionActiveClass = isDark
    ? "bg-[#4a8f3e] text-white"
    : isSepia
      ? "bg-[#a67c52] text-white"
      : "bg-[#3d8738] text-white";

  const optionInactiveClass = isDark
    ? "text-zinc-300 hover:bg-zinc-900"
    : isSepia
      ? "text-[#7a6248] hover:bg-[#f2e9db] hover:text-[#a07a50]"
      : "text-slate-600 hover:bg-[#f3f7f1] hover:text-[#3d8738]";

  return (
    <header
      className={`fixed left-[72px] right-0 top-0 z-[80] hidden h-[64px] items-center border-b px-0 lg:flex ${headerClass}`}
    >
      <div className="flex h-full min-w-[340px] items-center px-6">
        <div>
          <h1 className={`text-[22px] font-bold leading-none ${titleClass}`}>
            Quran Mazid
          </h1>
          <p className={`mt-1 text-[11px] ${subtitleClass}`}>
            Read, Study, and Learn The Quran
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-end gap-4 px-6">
        <button
          type="button"
          onClick={onOpenSearch}
          aria-label="Search Quran"
          className={`flex h-10 w-10 items-center justify-center rounded-full transition ${circleButtonClass}`}
        >
          <Search size={19} />
        </button>

        <div className="relative">
          <button
            type="button"
            aria-label="Theme"
            onClick={() => setIsThemeOpen((current) => !current)}
            className={`flex h-10 w-10 items-center justify-center rounded-full transition ${circleButtonClass}`}
          >
            <CurrentThemeIcon size={18} />
          </button>

          {isThemeOpen ? (
            <div
              className={`absolute right-0 top-12 z-[100] w-44 rounded-2xl border p-2 shadow-xl ${dropdownClass}`}
            >
              {themes.map((theme) => {
                const Icon = theme.icon;
                const isActive = settings.theme === theme.value;

                return (
                  <button
                    key={theme.value}
                    type="button"
                    onClick={() => {
                      onChange("theme", theme.value);
                      setIsThemeOpen(false);
                    }}
                    className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                      isActive ? optionActiveClass : optionInactiveClass
                    }`}
                  >
                    <Icon size={15} />
                    {theme.label}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>

        <button
          type="button"
          className={`flex h-10 items-center gap-2 rounded-full px-5 text-sm font-bold transition ${supportButtonClass}`}
        >
          Support Us
          <Heart size={15} fill="currentColor" />
        </button>
      </div>
    </header>
  );
}