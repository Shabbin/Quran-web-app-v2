"use client";

import type { Ayah, Surah, SurahWithAyahs } from "@quran-web-app/data";
import { Search, Settings } from "lucide-react";
import { useState } from "react";
import { useReaderSettings } from "@/hooks/use-reader-settings";
import { AyahCard } from "./ayah-card";
import { BottomNav } from "./bottom-nav";
import { IconSidebar } from "./icon-sidebar";
import { MobileHeader } from "./mobile-header";
import { MobileSurahDrawer } from "./mobile-surah-drawer";
import { SearchModal } from "./search-modal";
import { SettingsPanel } from "./settings-panel";
import { SurahSidebar } from "./surah-sidebar";

type QuranAppShellProps = {
  surahs: Surah[];
  activeSurah: SurahWithAyahs;
};

export function QuranAppShell({ surahs, activeSurah }: QuranAppShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { settings, resolvedTheme, updateSettings } = useReaderSettings();

  const arabicFontClass =
    settings.arabicFont === "scheherazade"
      ? "font-[var(--font-scheherazade)]"
      : "font-[var(--font-amiri)]";

  const isDark = resolvedTheme === "dark";
  const isSepia = resolvedTheme === "sepia";

  return (
    <main
      className={`min-h-screen ${
        isDark
          ? "dark bg-[#090b09] text-zinc-100"
          : isSepia
            ? "bg-[#f4ecd8] text-stone-900"
            : "bg-[#f6f8f5] text-slate-900"
      }`}
    >
      <MobileHeader
        onOpenMenu={() => setIsMobileMenuOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      <div className="flex min-h-screen">
        <IconSidebar />

        <SurahSidebar surahs={surahs} activeSurahId={activeSurah.id} />

        <section className="min-w-0 flex-1">
          <div className="sticky top-0 z-20 hidden border-b border-emerald-100 bg-white/85 px-8 py-4 backdrop-blur dark:border-zinc-800 dark:bg-[#090b09]/85 lg:block">
            <div className="mx-auto flex max-w-4xl items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-zinc-500">
                  Reading Surah
                </p>
                <h2 className="text-2xl font-bold text-slate-950 dark:text-zinc-100">
                  {activeSurah.englishName}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(true)}
                  className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-medium text-slate-600 shadow-sm transition hover:text-emerald-700 dark:bg-[#101210] dark:text-zinc-300"
                >
                  <Search size={18} />
                  Search
                </button>

                <button
                  type="button"
                  className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-medium text-slate-600 shadow-sm transition hover:text-emerald-700 dark:bg-[#101210] dark:text-zinc-300"
                >
                  <Settings size={18} />
                  Settings
                </button>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-4xl px-4 pb-28 pt-5 sm:px-6 lg:px-8 lg:pb-12 lg:pt-8">
            <header className="mb-6 overflow-hidden rounded-[32px] bg-emerald-700 p-6 text-white shadow-lg sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-emerald-100">
                    Surah {activeSurah.id}
                  </p>
                  <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
                    {activeSurah.englishName}
                  </h1>
                  <p className="mt-2 text-emerald-100">
                    {activeSurah.englishNameTranslation}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <p className={`${arabicFontClass} text-4xl leading-none`}>
                    {activeSurah.arabicName}
                  </p>
                  <p className="mt-3 text-sm text-emerald-100">
                    {activeSurah.numberOfAyahs} Ayahs •{" "}
                    {activeSurah.revelationType}
                  </p>
                </div>
              </div>
            </header>

            <div className="space-y-5">
              {activeSurah.ayahs.map((ayah: Ayah) => (
                <AyahCard
                  key={ayah.id}
                  ayah={ayah}
                  arabicFontClass={arabicFontClass}
                  arabicFontSize={settings.arabicFontSize}
                  translationFontSize={settings.translationFontSize}
                />
              ))}
            </div>
          </div>
        </section>

        <SettingsPanel settings={settings} onChange={updateSettings} />
      </div>

      <MobileSurahDrawer
        surahs={surahs}
        activeSurahId={activeSurah.id}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <BottomNav />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </main>
  );
}