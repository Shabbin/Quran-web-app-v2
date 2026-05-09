"use client";

import type { Surah } from "@quran-web-app/data";
import Link from "next/link";

type SidebarMode = "surah" | "juz" | "page";

type MobileSurahListProps = {
  surahs: Surah[];
  activeSurahId: number;
  accent: string;
  subtitleClass: string;
  getCardClass: (isActive: boolean) => string;
  getDiamondClass: (isActive: boolean) => string;
  getNumberClass: (isActive: boolean) => string;
  onChangeSidebarMode: (mode: SidebarMode) => void;
  onClose: () => void;
};

export function MobileSurahList({
  surahs,
  activeSurahId,
  accent,
  subtitleClass,
  getCardClass,
  getDiamondClass,
  getNumberClass,
  onChangeSidebarMode,
  onClose,
}: MobileSurahListProps) {
  return (
    <div className="space-y-2">
      {surahs.map((surah) => {
        const isActive = surah.id === activeSurahId;

        return (
          <Link
            key={surah.id}
            href={`/${surah.id}`}
            onClick={() => {
              onChangeSidebarMode("surah");
              onClose();
            }}
            className={`flex items-center gap-3 rounded-[14px] px-3 py-2.5 transition ${getCardClass(
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
                className={`relative text-[13px] font-bold ${getNumberClass(
                  isActive
                )}`}
              >
                {surah.id}
              </span>
            </span>

            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-bold leading-5">
                {surah.englishName}
              </span>

              <span
                className={`block truncate text-[11px] leading-4 ${subtitleClass}`}
              >
                {surah.englishNameTranslation}
              </span>
            </span>

            <span
              className={`arabic-text shrink-0 text-right text-[18px] leading-none ${subtitleClass}`}
            >
              {surah.arabicName}
            </span>
          </Link>
        );
      })}
    </div>
  );
}