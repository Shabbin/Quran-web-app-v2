"use client";

import { searchAyahs } from "@quran-web-app/data";
import { Search, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type SearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    return searchAyahs(query).slice(0, 30);
  }, [query]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-6">
      <button
        type="button"
        className="absolute inset-0"
        onClick={onClose}
        aria-label="Close search overlay"
      />

      <section className="relative max-h-[88vh] w-full overflow-hidden rounded-t-[30px] bg-white shadow-2xl dark:bg-[#101210] sm:max-w-2xl sm:rounded-[30px]">
        <header className="flex items-center justify-between border-b border-emerald-100 p-5 dark:border-zinc-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-100">
              Find wisdom in the Quran
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-zinc-500">
              Search Arabic text or English translation
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 transition hover:bg-slate-200 dark:bg-zinc-900 dark:text-zinc-300"
            aria-label="Close search"
          >
            <X size={18} />
          </button>
        </header>

        <div className="p-5">
          <label className="flex items-center gap-3 rounded-2xl bg-slate-100 px-4 py-3 ring-1 ring-transparent transition focus-within:ring-emerald-500 dark:bg-zinc-900">
            <Search size={18} className="text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search mercy, prayer, الحمد..."
              className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-zinc-100"
              autoFocus
            />
          </label>

          {!query.trim() ? (
            <div className="mt-6">
              <p className="mb-3 text-sm font-semibold text-slate-500 dark:text-zinc-500">
                Try to navigate
              </p>

              <div className="flex flex-wrap gap-2">
                {["Al-Fatihah", "mercy", "guidance", "worlds"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setQuery(item)}
                    className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-700 dark:bg-zinc-900 dark:text-zinc-300"
                  >
                    {item}
                  </button>
                ))}
              </div>

              <p className="mt-8 text-center text-sm text-slate-400 dark:text-zinc-600">
                Start typing to search across available Quran ayahs.
              </p>
            </div>
          ) : (
            <div className="mt-5 max-h-[56vh] space-y-3 overflow-y-auto pr-1">
              {results.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center dark:border-zinc-800">
                  <p className="font-semibold text-slate-700 dark:text-zinc-200">
                    No results found
                  </p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-zinc-500">
                    Try another Arabic or English word.
                  </p>
                </div>
              ) : (
                results.map(({ surah, ayah }) => (
                  <Link
                    key={`${surah.id}-${ayah.numberInSurah}`}
                    href={`/${surah.id}#ayah-${ayah.numberInSurah}`}
                    onClick={onClose}
                    className="block rounded-2xl border border-emerald-100 bg-white p-4 transition hover:border-emerald-300 hover:bg-emerald-50 dark:border-zinc-800 dark:bg-[#151815] dark:hover:border-emerald-900 dark:hover:bg-emerald-950/20"
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <p className="text-sm font-bold text-emerald-700 dark:text-emerald-500">
                        {surah.englishName} {surah.id}:{ayah.numberInSurah}
                      </p>
                      <p className="arabic-text text-lg text-slate-600 dark:text-zinc-300">
                        {surah.arabicName}
                      </p>
                    </div>

                    <p
                      dir="rtl"
                      className="arabic-text mb-3 line-clamp-2 text-right text-2xl leading-loose text-slate-900 dark:text-zinc-100"
                    >
                      {ayah.arabic}
                    </p>

                    <p className="line-clamp-2 text-sm leading-7 text-slate-600 dark:text-zinc-400">
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