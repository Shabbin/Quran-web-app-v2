"use client";

import type { Ayah, Surah, SurahWithAyahs } from "@quran-web-app/data";
import { getReaderPages } from "@quran-web-app/data";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useReaderSettings } from "@/hooks/use-reader-settings";
import { AyahCard } from "./ayah-card";
import { BottomNav } from "./bottom-nav";
import { DesktopTopbar } from "./desktop-topbar";
import { IconSidebar } from "./icon-sidebar";
import { MobileHeader } from "./mobile-header";
import { MobileSettingsDrawer } from "./mobile-settings-drawer";
import { MobileSurahDrawer } from "./mobile-surah-drawer";
import { PageScrollbar } from "./page-scrollbar";
import { SearchModal } from "./search-modal";
import { SettingsPanel } from "./settings-panel";
import { SurahSidebar } from "./surah-sidebar";

type SidebarMode = "surah" | "juz" | "page";

type QuranAppShellProps = {
  surahs: Surah[];
  activeSurah: SurahWithAyahs;
};

function formatRevelationPlace(revelationType: Surah["revelationType"]) {
  return revelationType === "Meccan" ? "Makkah" : "Madinah";
}

function formatSurahTitle(name: string) {
  return name.replace("Al-", "Al ");
}

export function QuranAppShell({ surahs, activeSurah }: QuranAppShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSettingsOpen, setIsMobileSettingsOpen] = useState(false);
  const [activeSidebarMode, setActiveSidebarMode] =
    useState<SidebarMode>("surah");
  const [activeReaderPageNumber, setActiveReaderPageNumber] = useState<
    number | null
  >(null);

  const { settings, resolvedTheme, updateSettings } = useReaderSettings();

  const readerPages = useMemo(() => getReaderPages(), []);

  const activeReaderPage =
    activeSidebarMode === "page" && activeReaderPageNumber
      ? readerPages.find((page) => page.pageNumber === activeReaderPageNumber)
      : undefined;

  const activeReaderPageIndex = activeReaderPage
    ? readerPages.findIndex(
        (page) => page.pageNumber === activeReaderPage.pageNumber
      )
    : -1;

  const previousReaderPage =
    activeReaderPageIndex > 0 ? readerPages[activeReaderPageIndex - 1] : null;

  const nextReaderPage =
    activeReaderPageIndex >= 0 && activeReaderPageIndex < readerPages.length - 1
      ? readerPages[activeReaderPageIndex + 1]
      : null;

  const displayedSurah = activeReaderPage?.surah ?? activeSurah;
  const displayedAyahs = activeReaderPage?.ayahs ?? activeSurah.ayahs;

  const previousSurah =
    activeSurah.id > 1
      ? surahs.find((surah) => surah.id === activeSurah.id - 1)
      : null;

  const nextSurah =
    activeSurah.id < surahs.length
      ? surahs.find((surah) => surah.id === activeSurah.id + 1)
      : null;

  const revelationImage =
    displayedSurah.revelationType === "Meccan"
      ? "/makkah.png"
      : "/madinah.png";

  const revelationLabel = formatRevelationPlace(displayedSurah.revelationType);

  const arabicFontFamily =
    settings.arabicFont === "scheherazade"
      ? "var(--font-scheherazade), serif"
      : "var(--font-amiri), serif";

  const isDark = resolvedTheme === "dark";
  const isSepia = resolvedTheme === "sepia";

  const shellClass = isDark
    ? "dark bg-[#090b09] text-zinc-100"
    : isSepia
      ? "bg-[#f6f1e7] text-[#5f4a32]"
      : "bg-[#f6f8f5] text-slate-900";

  const readerBackgroundClass = isDark
    ? "bg-[#090b09]"
    : isSepia
      ? "bg-[#f6f1e7]"
      : "bg-white";

  const readerHeaderClass = isDark
    ? "bg-[#090b09]"
    : isSepia
      ? "bg-[#f6f1e7]"
      : "bg-white";

  const titleClass = isDark
    ? "text-zinc-100"
    : isSepia
      ? "text-[#4f3c28]"
      : "text-slate-800";

  const subtitleClass = isDark
    ? "text-zinc-500"
    : isSepia
      ? "text-[#907658]"
      : "text-[#78908a]";

  const makkahImageClass = isDark
    ? "object-contain invert opacity-[80] contrast-125 brightness-125"
    : "object-contain opacity-100";

  const pageButtonBaseClass =
    "rounded-full px-5 py-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-40";

  const pageButtonClass = isDark
    ? "bg-[#151a15] text-zinc-200 hover:bg-[#1d241d]"
    : isSepia
      ? "bg-[#f0e7d8] text-[#8f6d49] hover:bg-[#eadcc6]"
      : "bg-[#f1f8ef] text-[#3d8738] hover:bg-emerald-100";

  const pageInfoClass = isDark
    ? "text-zinc-500"
    : isSepia
      ? "text-[#907658]"
      : "text-[#78908a]";

  const disabledLinkClass = "pointer-events-none opacity-40";

  const handleSelectReaderPage = (pageNumber: number) => {
    setActiveSidebarMode("page");
    setActiveReaderPageNumber(pageNumber);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleChangeSidebarMode = (mode: SidebarMode) => {
    setActiveSidebarMode(mode);

    if (mode !== "page") {
      setActiveReaderPageNumber(null);
    }
  };

  return (
    <main className={`min-h-screen ${shellClass}`}>
      <DesktopTopbar
        settings={settings}
        resolvedTheme={resolvedTheme}
        onChange={updateSettings}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      <MobileHeader
        settings={settings}
        resolvedTheme={resolvedTheme}
        onChange={updateSettings}
        onOpenMenu={() => setIsMobileMenuOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenSettings={() => setIsMobileSettingsOpen(true)}
      />

      <IconSidebar resolvedTheme={resolvedTheme} />

      <SurahSidebar
        surahs={surahs}
        activeSurahId={activeSurah.id}
        resolvedTheme={resolvedTheme}
        readerPages={readerPages}
        activeSidebarMode={activeSidebarMode}
        activeReaderPageNumber={activeReaderPageNumber}
        onChangeSidebarMode={handleChangeSidebarMode}
        onSelectReaderPage={handleSelectReaderPage}
      />

      <SettingsPanel
        settings={settings}
        resolvedTheme={resolvedTheme}
        onChange={updateSettings}
      />

      <section
        className={`min-w-0 ${readerBackgroundClass} lg:ml-[412px] lg:pt-[64px] xl:mr-[330px]`}
      >
        <div className="pb-28 lg:pb-12">
          <header
            className={`relative px-4 py-10 text-center sm:px-6 lg:px-8 ${readerHeaderClass}`}
          >
            <div className="pointer-events-none absolute left-12 top-5 hidden h-[100px] w-[155px] md:block">
              <Image
                src={revelationImage}
                alt={revelationLabel}
                fill
                priority
                className={makkahImageClass}
                sizes="155px"
              />
            </div>

            <div className="mx-auto max-w-4xl">
              <h1 className={`text-[24px] font-bold ${titleClass}`}>
                Surah {formatSurahTitle(displayedSurah.englishName)}
              </h1>

              <p className={`mt-3 text-sm font-medium ${subtitleClass}`}>
                {activeReaderPage
                  ? `Page ${activeReaderPage.pageNumber}, Ayah-${activeReaderPage.startAyah}-${activeReaderPage.endAyah}, ${revelationLabel}`
                  : `Ayah-${displayedSurah.numberOfAyahs}, ${revelationLabel}`}
              </p>
            </div>
          </header>

          <div>
            {displayedAyahs.map((ayah: Ayah) => (
              <AyahCard
                key={ayah.id}
                ayah={ayah}
                resolvedTheme={resolvedTheme}
                arabicFontFamily={arabicFontFamily}
                arabicFontSize={settings.arabicFontSize}
                translationFontSize={settings.translationFontSize}
              />
            ))}
          </div>

          <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-8 sm:px-6 lg:px-8">
            {activeReaderPage ? (
              <>
                <button
                  type="button"
                  disabled={!previousReaderPage}
                  onClick={() => {
                    if (previousReaderPage) {
                      handleSelectReaderPage(previousReaderPage.pageNumber);
                    }
                  }}
                  className={`${pageButtonBaseClass} ${pageButtonClass}`}
                >
                  Previous
                </button>

                <p
                  className={`text-center text-sm font-semibold ${pageInfoClass}`}
                >
                  Page {activeReaderPage.pageNumber} of {readerPages.length}
                </p>

                <button
                  type="button"
                  disabled={!nextReaderPage}
                  onClick={() => {
                    if (nextReaderPage) {
                      handleSelectReaderPage(nextReaderPage.pageNumber);
                    }
                  }}
                  className={`${pageButtonBaseClass} ${pageButtonClass}`}
                >
                  Next
                </button>
              </>
            ) : (
              <>
                <Link
                  href={previousSurah ? `/${previousSurah.id}` : "#"}
                  aria-disabled={!previousSurah}
                  className={`${pageButtonBaseClass} ${pageButtonClass} ${
                    !previousSurah ? disabledLinkClass : ""
                  }`}
                >
                  Previous
                </Link>

                <p
                  className={`text-center text-sm font-semibold ${pageInfoClass}`}
                >
                  Surah {activeSurah.id} of {surahs.length}
                </p>

                <Link
                  href={nextSurah ? `/${nextSurah.id}` : "#"}
                  aria-disabled={!nextSurah}
                  className={`${pageButtonBaseClass} ${pageButtonClass} ${
                    !nextSurah ? disabledLinkClass : ""
                  }`}
                >
                  Next
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <MobileSurahDrawer
        surahs={surahs}
        activeSurahId={activeSurah.id}
        resolvedTheme={resolvedTheme}
        readerPages={readerPages}
        activeSidebarMode={activeSidebarMode}
        activeReaderPageNumber={activeReaderPageNumber}
        onChangeSidebarMode={handleChangeSidebarMode}
        onSelectReaderPage={(pageNumber) => {
          handleSelectReaderPage(pageNumber);
          setIsMobileMenuOpen(false);
        }}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <MobileSettingsDrawer
        isOpen={isMobileSettingsOpen}
        settings={settings}
        resolvedTheme={resolvedTheme}
        onChange={updateSettings}
        onClose={() => setIsMobileSettingsOpen(false)}
      />

      <BottomNav resolvedTheme={resolvedTheme} />

      <SearchModal
        isOpen={isSearchOpen}
        resolvedTheme={resolvedTheme}
        onClose={() => setIsSearchOpen(false)}
      />

      <PageScrollbar resolvedTheme={resolvedTheme} />
    </main>
  );
}