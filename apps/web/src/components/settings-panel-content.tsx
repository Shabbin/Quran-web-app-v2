"use client";

import type {
  ArabicFont,
  ReaderSettings,
  ReaderTheme,
} from "@/hooks/use-reader-settings";
import {
  BookOpen,
  ChevronDown,
  Moon,
  Settings,
  SlidersHorizontal,
  Sun,
  Type,
} from "lucide-react";

type SettingsPanelContentProps = {
  settings: ReaderSettings;
  onChange: <K extends keyof ReaderSettings>(
    key: K,
    value: ReaderSettings[K]
  ) => void;
};

const themes: { label: string; value: ReaderTheme; icon: typeof Sun }[] = [
  { label: "Light", value: "light", icon: Sun },
  { label: "Dark", value: "dark", icon: Moon },
  { label: "Sepia", value: "sepia", icon: Sun },
  { label: "System", value: "system", icon: Settings },
];

const fonts: { label: string; value: ArabicFont }[] = [
  { label: "Amiri", value: "amiri" },
  { label: "Scheherazade", value: "scheherazade" },
];

export function SettingsPanelContent({
  settings,
  onChange,
}: SettingsPanelContentProps) {
  return (
    <div className="space-y-6">
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen size={19} className="text-slate-500 dark:text-zinc-400" />
            <h3 className="font-semibold text-slate-800 dark:text-zinc-100">
              Reading Settings
            </h3>
          </div>
          <ChevronDown size={18} className="text-slate-500" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          {themes.map((theme) => {
            const Icon = theme.icon;
            const isActive = settings.theme === theme.value;

            return (
              <button
                key={theme.value}
                type="button"
                onClick={() => onChange("theme", theme.value)}
                className={`flex items-center gap-2 rounded-2xl px-3 py-3 text-sm transition ${
                  isActive
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                }`}
              >
                <Icon size={16} />
                {theme.label}
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <Type size={15} />
          </span>
          <h3 className="font-semibold text-emerald-700 dark:text-emerald-500">
            Font Settings
          </h3>
        </div>

        <div className="space-y-6">
          <label className="block">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700 dark:text-zinc-200">
                Arabic Font Size
              </span>
              <span className="font-semibold text-emerald-700">
                {settings.arabicFontSize}
              </span>
            </div>
            <input
              type="range"
              min="24"
              max="52"
              value={settings.arabicFontSize}
              onChange={(event) =>
                onChange("arabicFontSize", Number(event.target.value))
              }
              className="w-full accent-emerald-700"
            />
          </label>

          <label className="block">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700 dark:text-zinc-200">
                Translation Font Size
              </span>
              <span className="font-semibold text-emerald-700">
                {settings.translationFontSize}
              </span>
            </div>
            <input
              type="range"
              min="14"
              max="24"
              value={settings.translationFontSize}
              onChange={(event) =>
                onChange("translationFontSize", Number(event.target.value))
              }
              className="w-full accent-emerald-700"
            />
          </label>

          <label className="block">
            <span className="mb-3 block text-sm font-medium text-slate-700 dark:text-zinc-200">
              Arabic Font Face
            </span>
            <select
              value={settings.arabicFont}
              onChange={(event) =>
                onChange("arabicFont", event.target.value as ArabicFont)
              }
              className="w-full rounded-2xl border-0 bg-slate-100 px-4 py-4 text-sm font-medium text-slate-700 outline-none ring-1 ring-transparent transition focus:ring-emerald-400 dark:bg-zinc-900 dark:text-zinc-200"
            >
              {fonts.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="rounded-[24px] border border-emerald-100 bg-emerald-50 p-5 dark:border-emerald-900/40 dark:bg-emerald-950/30">
        <div className="mb-3 flex items-center gap-2">
          <SlidersHorizontal size={18} className="text-emerald-700" />
          <h3 className="font-bold text-slate-800 dark:text-zinc-100">
            Help spread the knowledge of Islam
          </h3>
        </div>
        <p className="text-sm leading-7 text-slate-600 dark:text-zinc-400">
          Your regular support helps us reach our religious brothers and sisters
          with the message of Islam.
        </p>
        <button
          type="button"
          className="mt-4 w-full rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-800"
        >
          Support Us
        </button>
      </section>
    </div>
  );
}