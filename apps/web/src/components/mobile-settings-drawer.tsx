"use client";

import type { ReaderSettings } from "@/hooks/use-reader-settings";
import { X } from "lucide-react";
import { SettingsPanelContent } from "./settings-panel-content";

type MobileSettingsDrawerProps = {
  isOpen: boolean;
  settings: ReaderSettings;
  onChange: <K extends keyof ReaderSettings>(
    key: K,
    value: ReaderSettings[K]
  ) => void;
  onClose: () => void;
};

export function MobileSettingsDrawer({
  isOpen,
  settings,
  onChange,
  onClose,
}: MobileSettingsDrawerProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[75] lg:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-black/45"
        onClick={onClose}
        aria-label="Close settings overlay"
      />

      <section className="absolute bottom-0 left-0 right-0 max-h-[88vh] overflow-y-auto rounded-t-[30px] bg-white p-5 shadow-2xl dark:bg-[#101210]">
        <header className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-100">
              Reading Settings
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-zinc-500">
              Customize theme, Arabic font, and text size
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 dark:bg-zinc-900 dark:text-zinc-300"
            aria-label="Close settings"
          >
            <X size={18} />
          </button>
        </header>

        <SettingsPanelContent settings={settings} onChange={onChange} />
      </section>
    </div>
  );
}