"use client";

import { searchAyahs } from "@quran-web-app/data";
import { Search, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type SearchModalProps = {
  isOpen: boolean;
  resolvedTheme: "light" | "dark" | "sepia";
  onClose: () => void;
};

export function SearchModal({
  isOpen,
  resolvedTheme,
  onClose,
}: SearchModalProps) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    return searchAyahs(query).slice(0, 30);
  }, [query]);

  if (!isOpen) {
    return null;
  }

  const isDark = resolvedTheme === "dark";
  const isSepia = resolvedTheme === "sepia";

  const accent = isSepia ? "#a07a50" : "#3d8738";

  const overlayClass = isDark
    ? "bg-black/70"
    : isSepia
      ? "bg-[#4f3c28]/35"
      : "bg-black/45";

  const modalClass = isDark
    ? "bg-[#101210] text-zinc-100"
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
    ? "bg-[#151715] text-zinc-400 hover:bg-[#1d211d]"
    : isSepia
      ? "bg-[#f1eadc] text-[#8f7a63] hover:bg-[#eadcc6]"
      : "bg-slate-100 text-slate-600 hover:bg-slate-200";

  const inputWrapperClass = isDark
    ? "bg-[#151715] text-zinc-500 ring-[#222722] focus-within:ring-emerald-600"
    : isSepia
      ? "bg-[#fbf8f0] text-[#a07a50] ring-[#d9c6a8] focus-within:ring-[#a07a50]"
      : "bg-white text-slate-400 ring-emerald-500 focus-within:ring-emerald-500";

  const inputClass = isDark
    ? "text-zinc-100 placeholder:text-zinc-600"
    : isSepia
      ? "text-[#4f3c28] placeholder:text-[#a8947a]"
      : "text-slate-900 placeholder:text-slate-400";

  const chipClass = isDark
    ? "bg-[#151715] text-zinc-400 hover:bg-[#1d211d] hover:text-emerald-400"
    : isSepia
      ? "bg-[#f1eadc] text-[#8f7a63] hover:bg-[#eadcc6] hover:text-[#a07a50]"
      : "bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700";

  const emptyCardClass = isDark
    ? "border-zinc-800"
    : isSepia
      ? "border-[#e4d8bf]"
      : "border-slate-200";

  const resultCardClass = isDark
    ? "border-[#222722] bg-[#151815] hover:border-emerald-900 hover:bg-emerald-950/20"
    : isSepia
      ? "border-[#e4d8bf] bg-[#fbf8f0] hover:border-[#d0b894] hover:bg-[#f0e7d8]"
      : "border-emerald-100 bg-white hover:border-emerald-300 hover:bg-emerald-50";

  const resultTitleClass = isDark
    ? "text-emerald-500"
    : isSepia
      ? "text-[#a07a50]"
      : "text-emerald-700";

  const resultArabicNameClass = isDark
    ? "text-zinc-300"
    : isSepia
      ? "text-[#8f7a63]"
      : "text-slate-600";

  const resultArabicClass = isDark
    ? "text-zinc-100"
    : isSepia
      ? "text-[#4f3c28]"
      : "text-slate-900";

  const resultTranslationClass = isDark
    ? "text-zinc-400"
    : isSepia
      ? "text-[#6f5b49]"
      : "text-slate-600";

  return (
    <div
      className={`fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-6 ${overlayClass}`}
    >
      <button
        type="button"
        className="absolute inset-0"
        onClick={onClose}
        aria-label="Close search overlay"
      />

      <section
        className={`relative max-h-[88vh] w-full overflow-hidden rounded-t-[22px] shadow-2xl sm:max-w-2xl sm:rounded-[30px] ${modalClass}`}
      >
        <header className={`flex items-start justify-between border-b p-4 ${borderClass}`}>
          <div>
            <h2 className={`text-[15px] font-bold ${titleClass}`}>
              Find wisdom in the Quran
            </h2>
            <p className={`mt-1 text-[11px] ${subtitleClass}`}>
              Search Arabic text or English translation
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`flex h-9 w-9 items-center justify-center rounded-full transition ${closeClass}`}
            aria-label="Close search"
          >
            <X size={17} />
          </button>
        </header>

        <div className="p-4">
          <label
            className={`flex h-12 items-center gap-3 rounded-[14px] px-4 ring-1 transition focus-within:ring-1 ${inputWrapperClass}`}
          >
            <Search size={16} style={{ color: accent }} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search mercy, prayer, الحمد..."
              className={`w-full bg-transparent text-[13px] outline-none ${inputClass}`}
              autoFocus
            />
          </label>

          {!query.trim() ? (
            <div className="mt-5">
              <p className={`mb-3 text-[12px] font-medium ${subtitleClass}`}>
                Try to navigate
              </p>

              <div className="flex flex-wrap gap-2">
                {["Al-Fatihah", "Juz 30", "Surah Yasin", "Page 1"].map(
                  (item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setQuery(item)}
                      className={`rounded-[10px] px-3 py-2 text-[12px] font-medium transition ${chipClass}`}
                    >
                      {item}
                    </button>
                  )
                )}
              </div>

              <p className={`mt-7 text-[12px] font-medium ${subtitleClass}`}>
                Recent Navigation
              </p>

              <p
                className={`mt-8 text-center text-[12px] ${
                  isDark
                    ? "text-zinc-600"
                    : isSepia
                      ? "text-[#a8947a]"
                      : "text-slate-400"
                }`}
              >
                No recent navigation
              </p>
            </div>
          ) : (
            <div className="mt-5 max-h-[56vh] space-y-3 overflow-y-auto pr-1">
              {results.length === 0 ? (
                <div
                  className={`rounded-2xl border border-dashed p-8 text-center ${emptyCardClass}`}
                >
                  <p className={`font-semibold ${titleClass}`}>
                    No results found
                  </p>
                  <p className={`mt-1 text-sm ${subtitleClass}`}>
                    Try another Arabic or English word.
                  </p>
                </div>
              ) : (
                results.map(({ surah, ayah }) => (
                  <Link
                    key={`${surah.id}-${ayah.numberInSurah}`}
                    href={`/${surah.id}#ayah-${ayah.numberInSurah}`}
                    onClick={onClose}
                    className={`block rounded-2xl border p-4 transition ${resultCardClass}`}
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <p className={`text-sm font-bold ${resultTitleClass}`}>
                        {surah.englishName} {surah.id}:{ayah.numberInSurah}
                      </p>

                      <p
                        className={`arabic-text text-lg ${resultArabicNameClass}`}
                      >
                        {surah.arabicName}
                      </p>
                    </div>

                    <p
                      dir="rtl"
                      className={`arabic-text mb-3 line-clamp-2 text-right text-2xl leading-loose ${resultArabicClass}`}
                    >
                      {ayah.arabic}
                    </p>

                    <p
                      className={`line-clamp-2 text-sm leading-7 ${resultTranslationClass}`}
                    >
                      {ayah.translation}
                    </p>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}