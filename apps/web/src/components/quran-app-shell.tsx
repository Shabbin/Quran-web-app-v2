"use client";

import type { Surah, SurahWithAyahs } from "@quran-web-app/data";
import { Search, Settings } from "lucide-react";
import { useState } from "react";
import { AyahCard } from "./ayah-card";
import { BottomNav } from "./bottom-nav";
import { IconSidebar } from "./icon-sidebar";
import { MobileHeader } from "./mobile-header";
import { MobileSurahDrawer } from "./mobile-surah-drawer";
import { SurahSidebar } from "./surah-sidebar";

type QuranAppShellProps = {
  surahs: Surah[];
  activeSurah: SurahWithAyahs;
};

export function QuranAppShell({ surahs, activeSurah }: QuranAppShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#f6f8f5] text-slate-900">
      <MobileHeader onOpenMenu={() => setIsMobileMenuOpen(true)} />

      <div className="flex min-h-screen">
        <IconSidebar />

        <SurahSidebar surahs={surahs} activeSurahId={activeSurah.id} />

        <section className="min-w-0 flex-1">
          <div className="sticky top-0 z-20 hidden border-b border-emerald-100 bg-[#f6f8f5]/90 px-8 py-4 backdrop-blur lg:block">
            <div className="mx-auto flex max-w-4xl items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Reading Surah</p>
                <h2 className="text-2xl font-bold text-slate-950">
                  {activeSurah.englishName}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-medium text-slate-600 shadow-sm transition hover:text-emerald-700"
                >
                  <Search size={18} />
                  Search
                </button>

                <button
                  type="button"
                  className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-medium text-slate-600 shadow-sm transition hover:text-emerald-700"
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
                  <p className="arabic-text text-4xl leading-none">
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
              {activeSurah.ayahs.map((ayah) => (
                <AyahCard key={ayah.id} ayah={ayah} />
              ))}
            </div>
          </div>
        </section>
      </div>

      <MobileSurahDrawer
        surahs={surahs}
        activeSurahId={activeSurah.id}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <BottomNav />
    </main>
  );
}