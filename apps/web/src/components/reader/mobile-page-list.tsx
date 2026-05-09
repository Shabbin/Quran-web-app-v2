"use client";

import type { ReaderPage } from "@quran-web-app/data";

type MobilePageListProps = {
  readerPages: ReaderPage[];
  activeReaderPageNumber: number | null;
  accent: string;
  subtitleClass: string;
  getCardClass: (isActive: boolean) => string;
  getDiamondClass: (isActive: boolean) => string;
  getNumberClass: (isActive: boolean) => string;
  onSelectReaderPage: (pageNumber: number) => void;
};

export function MobilePageList({
  readerPages,
  activeReaderPageNumber,
  accent,
  subtitleClass,
  getCardClass,
  getDiamondClass,
  getNumberClass,
  onSelectReaderPage,
}: MobilePageListProps) {
  return (
    <div className="space-y-2">
      {readerPages.map((readerPage) => {
        const isActive = readerPage.pageNumber === activeReaderPageNumber;

        return (
          <button
            key={readerPage.pageNumber}
            type="button"
            onClick={() => onSelectReaderPage(readerPage.pageNumber)}
            className={`flex w-full items-center gap-3 rounded-[14px] px-3 py-2.5 text-left transition ${getCardClass(
              isActive
            )}`}
          >
            <span className="relative flex h-10 w-10 shrink-0 items-center justify-center">
              <span
                className={`absolute h-8 w-8 rotate-45 rounded-[10px] ${getDiamondClass(
                  isActive
                )}`}
                style={{
                  backgroundColor: isActive ? accent : undefined,
                }}
              />

              <span
                className={`relative text-[11px] font-bold ${getNumberClass(
                  isActive
                )}`}
              >
                {readerPage.pageNumber}
              </span>
            </span>

            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-bold leading-5">
                Page {readerPage.pageNumber}
              </span>

              <span
                className={`block truncate text-[11px] leading-4 ${subtitleClass}`}
              >
                {readerPage.surah.englishName} · Ayah {readerPage.startAyah}-
                {readerPage.endAyah}
              </span>
            </span>

            <span
              className={`arabic-text shrink-0 text-right text-[18px] leading-none ${subtitleClass}`}
            >
              {readerPage.surah.arabicName}
            </span>
          </button>
        );
      })}
    </div>
  );
}