"use client";

import type { ReaderSettings } from "@/hooks/use-reader-settings";
import { SettingsPanelContent } from "./settings-panel-content";

type SettingsPanelProps = {
  settings: ReaderSettings;
  resolvedTheme: "light" | "dark" | "sepia";
  onChange: <K extends keyof ReaderSettings>(
    key: K,
    value: ReaderSettings[K]
  ) => void;
};

export function SettingsPanel({
  settings,
  resolvedTheme,
  onChange,
}: SettingsPanelProps) {
  const isDark = resolvedTheme === "dark";
  const isSepia = resolvedTheme === "sepia";

  const panelClass = isDark
    ? "border-[#222722] bg-[#101210]"
    : isSepia
      ? "border-[#e8dcc9] bg-[#f6f1e7]"
      : "border-[#e7eee8] bg-white";

  const tabWrapperClass = isDark
    ? "bg-[#181b18]"
    : isSepia
      ? "bg-[#f3ecdf]"
      : "bg-[#f3f5f3]";

  const activeTabClass = isDark
    ? "bg-[#101210] text-zinc-100"
    : isSepia
      ? "bg-[#fbf8f0] text-[#4f3c28]"
      : "bg-white text-slate-800";

  const inactiveTabClass = isDark
    ? "text-zinc-500"
    : isSepia
      ? "text-[#8f7a63]"
      : "text-slate-500";

  return (
    <aside
      className={`fixed right-0 top-[64px] z-40 hidden h-[calc(100vh-64px)] w-[330px] overflow-hidden border-l xl:block ${panelClass}`}
    >
      <div className="flex h-full flex-col px-6 py-5">
        <div className={`mb-6 shrink-0 rounded-[22px] p-1 ${tabWrapperClass}`}>
          <div className="grid grid-cols-2 text-[14px] font-semibold">
            <button
              type="button"
              className={`rounded-[18px] py-2.5 shadow-sm ${activeTabClass}`}
            >
              Translation
            </button>

            <button
              type="button"
              className={`rounded-[18px] py-2.5 ${inactiveTabClass}`}
            >
              Reading
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          <SettingsPanelContent
            settings={settings}
            resolvedTheme={resolvedTheme}
            onChange={onChange}
          />
        </div>
      </div>
    </aside>
  );
}