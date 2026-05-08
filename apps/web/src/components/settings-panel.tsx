"use client";

import type { ReaderSettings } from "@/hooks/use-reader-settings";
import { SettingsPanelContent } from "./settings-panel-content";

type SettingsPanelProps = {
  settings: ReaderSettings;
  onChange: <K extends keyof ReaderSettings>(
    key: K,
    value: ReaderSettings[K]
  ) => void;
};

export function SettingsPanel({ settings, onChange }: SettingsPanelProps) {
  return (
    <aside className="hidden h-screen w-[330px] shrink-0 border-l border-emerald-100 bg-white p-5 dark:border-zinc-800 dark:bg-[#101210] xl:block">
      <div className="mb-7 rounded-[26px] bg-slate-100 p-1 dark:bg-zinc-900">
        <div className="grid grid-cols-2 text-sm font-semibold">
          <button
            type="button"
            className="rounded-2xl bg-white py-3 text-slate-800 shadow-sm dark:bg-[#171a17] dark:text-zinc-100"
          >
            Translation
          </button>
          <button
            type="button"
            className="rounded-2xl py-3 text-slate-500 dark:text-zinc-500"
          >
            Reading
          </button>
        </div>
      </div>

      <SettingsPanelContent settings={settings} onChange={onChange} />
    </aside>
  );
}