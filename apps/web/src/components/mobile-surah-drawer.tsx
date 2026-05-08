"use client";

import type { Surah } from "@quran-web-app/data";
import { X } from "lucide-react";
import Link from "next/link";

type MobileSurahDrawerProps = {
  surahs: Surah[];
  activeSurahId: number;
  isOpen: boolean;
  onClose: () => void;
};

export function MobileSurahDrawer({
  surahs,
  activeSurahId,
  isOpen,
  onClose,
}: MobileSurahDrawerProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Close menu overlay"
      />

      <aside className="absolute left-0 top-0 h-full w-[88%] max-w-[360px] overflow-hidden bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-emerald-100 p-4">
          <div>
            <p className="text-lg font-bold text-slate-900">Quran Mazid</p>
            <p className="text-sm text-slate-500">Choose a surah</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <div className="h-[calc(100vh-82px)] overflow-y-auto p-3">
          {surahs.map((surah) => {
            const isActive = surah.id === activeSurahId;

            return (
              <Link
                key={surah.id}
                href={`/${surah.id}`}
                onClick={onClose}
                className={`mb-2 flex items-center gap-3 rounded-2xl p-3 transition ${
                  isActive
                    ? "bg-emerald-50 text-emerald-800"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-semibold ${
                    isActive
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {surah.id}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">
                    {surah.englishName}
                  </span>
                  <span className="block truncate text-xs text-slate-500">
                    {surah.englishNameTranslation}
                  </span>
                </span>

                <span className="arabic-text text-lg text-slate-700">
                  {surah.arabicName}
                </span>
              </Link>
            );
          })}
        </div>
      </aside>
    </div>
  );
}