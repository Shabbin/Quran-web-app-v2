"use client";

import type { ReaderPage, Surah } from "@quran-web-app/data";
import { Search, X } from "lucide-react";
import Image from "next/image";
import { MobilePageList } from "./mobile-page-list";
import { MobileSurahList } from "./mobile-surah-list";

type SidebarMode = "surah" | "juz" | "page";

type MobileSurahDrawerProps = {
  surahs: Surah[];
  activeSurahId: number;
  resolvedTheme: "light" | "dark" | "sepia";
  readerPages: ReaderPage[];
  activeSidebarMode: SidebarMode;
  activeReaderPageNumber: number | null;
  onChangeSidebarMode: (mode: SidebarMode) => void;
  onSelectReaderPage: (pageNumber: number) => void;
  isOpen: boolean;
  onClose: () => void;
};

export function MobileSurahDrawer({
  surahs,
  activeSurahId,
  resolvedTheme,
  readerPages,
  activeSidebarMode,
  activeReaderPageNumber,
  onChangeSidebarMode,
  onSelectReaderPage,
  isOpen,
  onClose,
}: MobileSurahDrawerProps) {
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

  const subtitleClass = isDark
    ? "text-zinc-500"
    : isSepia
      ? "text-[#907658]"
      : "text-slate-500";

  const closeClass = isDark
    ? "text-zinc-400 hover:bg-[#151a15]"
    : isSepia
      ? "text-[#8f7a63] hover:bg-[#f1eadc]"
      : "text-slate-500 hover:bg-slate-100";

  const tabBgClass = isDark
    ? "bg-[#111411]"
    : isSepia
      ? "bg-[#f1eadc]"
      : "bg-[#f3f5f3]";

  const activeTabClass = isDark
    ? "bg-[#090b09] text-zinc-100"
    : isSepia
      ? "bg-[#fbf8f0] text-[#4f3c28]"
      : "bg-white text-[#3d8738]";

  const inactiveTabClass = isDark
    ? "text-zinc-500"
    : isSepia
      ? "text-[#8f7a63]"
      : "text-slate-500";

  const searchClass = isDark
    ? "bg-[#111411] text-zinc-500"
    : isSepia
      ? "bg-[#f1eadc] text-[#9b7550] ring-1 ring-[#e6d8c0]"
      : "bg-[#f3f5f3] text-slate-400";

  const searchInputClass = isDark
    ? "text-zinc-200 placeholder:text-zinc-600"
    : isSepia
      ? "text-[#4f3c28] placeholder:text-[#a8947a]"
      : "text-slate-700 placeholder:text-slate-400";

  const emptyTextClass = isDark
    ? "text-zinc-500"
    : isSepia
      ? "text-[#907658]"
      : "text-slate-500";

  const getTabClass = (mode: SidebarMode) =>
    activeSidebarMode === mode ? activeTabClass : inactiveTabClass;

  const getCardClass = (isActive: boolean) =>
    isActive
      ? isDark
        ? "bg-emerald-950/30 text-zinc-100 ring-1 ring-emerald-900/60"
        : isSepia
          ? "bg-[#f0e7d8] text-[#3f3528] ring-1 ring-[#d9c6a8]"
          : "bg-[#f1f8ef] text-slate-900 ring-1 ring-emerald-200"
      : isDark
        ? "text-zinc-300 ring-1 ring-[#222722] hover:bg-[#151a15]"
        : isSepia
          ? "text-[#4f3c28] ring-1 ring-[#e7dcc8] hover:bg-[#f0e7d8]"
          : "text-slate-700 ring-1 ring-[#edf1ed] hover:bg-[#f6f8f5]";

  const getDiamondClass = (isActive: boolean) =>
    isActive
      ? ""
      : isDark
        ? "bg-[#151815]"
        : isSepia
          ? "bg-[#fbf7ef]"
          : "bg-[#f1f3f1]";

  const getNumberClass = (isActive: boolean) =>
    isActive
      ? "text-white"
      : isDark
        ? "text-zinc-500"
        : isSepia
          ? "text-[#9a8268]"
          : "text-slate-500";

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <aside className={`h-full overflow-hidden ${drawerClass}`}>
        <div
          className={`flex h-[56px] items-center justify-between border-b px-4 ${borderClass}`}
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-[9px] shadow-sm">
              <Image
                src="/QuranIcon.svg"
                alt="Quran Mazid"
                fill
                priority
                sizes="32px"
                className={
                  isSepia
                    ? "object-cover sepia saturate-[0.85]"
                    : "object-cover"
                }
              />
            </div>

            <div className="min-w-0">
              <p
                className={`truncate text-[16px] font-bold leading-5 ${titleClass}`}
              >
                Quran Mazid
              </p>
              <p className={`truncate text-[9px] leading-3 ${subtitleClass}`}>
                Read, Study, and Learn The Quran
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition ${closeClass}`}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-3 pb-3 pt-4">
          <div className={`rounded-[22px] p-1 ${tabBgClass}`}>
            <div className="grid grid-cols-3 text-[12px] font-semibold">
              <button
                type="button"
                onClick={() => onChangeSidebarMode("surah")}
                className={`rounded-[18px] py-2.5 ${
                  activeSidebarMode === "surah" ? "shadow-sm" : ""
                } ${getTabClass("surah")}`}
              >
                Surah
              </button>

              <button
                type="button"
                onClick={() => onChangeSidebarMode("juz")}
                className={`rounded-[18px] py-2.5 ${
                  activeSidebarMode === "juz" ? "shadow-sm" : ""
                } ${getTabClass("juz")}`}
              >
                Juz
              </button>

              <button
                type="button"
                onClick={() => onChangeSidebarMode("page")}
                className={`rounded-[18px] py-2.5 ${
                  activeSidebarMode === "page" ? "shadow-sm" : ""
                } ${getTabClass("page")}`}
              >
                Page
              </button>
            </div>
          </div>

          <label
            className={`mt-4 flex h-11 items-center gap-3 rounded-[18px] px-4 ${searchClass}`}
          >
            <Search size={16} />
            <input
              type="text"
              placeholder={
                activeSidebarMode === "page" ? "Search Page" : "Search Surah"
              }
              className={`w-full bg-transparent text-[13px] outline-none ${searchInputClass}`}
            />
          </label>
        </div>

        <div className="h-[calc(100vh-178px)] overflow-y-auto px-3 pb-5">
          {activeSidebarMode === "surah" ? (
            <MobileSurahList
              surahs={surahs}
              activeSurahId={activeSurahId}
              accent={accent}
              subtitleClass={subtitleClass}
              getCardClass={getCardClass}
              getDiamondClass={getDiamondClass}
              getNumberClass={getNumberClass}
              onChangeSidebarMode={onChangeSidebarMode}
              onClose={onClose}
            />
          ) : activeSidebarMode === "page" ? (
            <MobilePageList
              readerPages={readerPages}
              activeReaderPageNumber={activeReaderPageNumber}
              accent={accent}
              subtitleClass={subtitleClass}
              getCardClass={getCardClass}
              getDiamondClass={getDiamondClass}
              getNumberClass={getNumberClass}
              onSelectReaderPage={onSelectReaderPage}
            />
          ) : (
            <div className={`px-3 py-8 text-center text-sm ${emptyTextClass}`}>
              Juz navigation can be added later.
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}