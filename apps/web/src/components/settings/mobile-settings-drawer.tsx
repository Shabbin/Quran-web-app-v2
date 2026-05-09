"use client";

import type { ReaderSettings } from "@/hooks/use-reader-settings";
import { Settings, X } from "lucide-react";
import { SettingsPanelContent } from "./settings-panel-content";

type MobileSettingsDrawerProps = {
  isOpen: boolean;
  settings: ReaderSettings;
  resolvedTheme: "light" | "dark" | "sepia";
  onChange: <K extends keyof ReaderSettings>(
    key: K,
    value: ReaderSettings[K]
  ) => void;
  onClose: () => void;
};

export function MobileSettingsDrawer({
  isOpen,
  settings,
  resolvedTheme,
  onChange,
  onClose,
}: MobileSettingsDrawerProps) {
  if (!isOpen) {
    return null;
  }

  const isDark = resolvedTheme === "dark";
  const isSepia = resolvedTheme === "sepia";

  const accent = isSepia ? "#a07a50" : "#3d8738";

  const drawerClass = isDark
    ? "bg-[#090b09] text-zinc-100"
    : isSepia
      ? "bg-[#f6f1e7] text-[#4f3c28]"
      : "bg-white text-slate-900";

  const borderClass = isDark
    ? "border-[#222722]"
    : isSepia
      ? "border-[#e8dcc9]"
      : "border-[#e7eee8]";

  const titleClass = isDark
    ? "text-zinc-100"
    : isSepia
      ? "text-[#4f3c28]"
      : "text-slate-900";

  const closeClass = isDark
    ? "text-zinc-400 hover:bg-[#151a15]"
    : isSepia
      ? "text-[#8f7a63] hover:bg-[#f1eadc]"
      : "text-slate-500 hover:bg-slate-100";

  return (
    <div className="fixed inset-0 z-[75] lg:hidden">
      <section className={`h-full overflow-y-auto ${drawerClass}`}>
        <header
          className={`flex h-[58px] items-center justify-between border-b px-4 ${borderClass}`}
        >
          <div className="flex items-center gap-3">
            <Settings size={20} style={{ color: accent }} />

            <h2 className={`text-[16px] font-bold ${titleClass}`}>
              Settings
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition ${closeClass}`}
            aria-label="Close settings"
          >
            <X size={18} />
          </button>
        </header>

        <div className="px-4 pb-8 pt-5">
          <SettingsPanelContent
            settings={settings}
            resolvedTheme={resolvedTheme}
            onChange={onChange}
          />
        </div>
      </section>
    </div>
  );
}