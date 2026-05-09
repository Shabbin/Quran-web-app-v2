"use client";

import type { ReaderPage, SearchResult, Surah } from "@quran-web-app/data";
import { ayahs, searchAyahs, surahs as allSurahs } from "@quran-web-app/data";
import { BookOpen, FileText, Search, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type SearchModalProps = {
  isOpen: boolean;
  resolvedTheme: "light" | "dark" | "sepia";
  surahs: Surah[];
  readerPages: ReaderPage[];
  onSelectReaderPage: (pageNumber: number) => void;
  onClose: () => void;
};

type SurahSearchResult = {
  type: "surah";
  surah: Surah;
};

type PageSearchResult = {
  type: "page";
  page: ReaderPage;
};

function normalizeArabicText(value: string) {
  return value
    .replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, "")
    .replace(/[إأآٱا]/g, "ا")
    .replace(/وة/g, "اة")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeSearchValue(value: string) {
  return normalizeArabicText(value)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\u0600-\u06ff]/g, "");
}

function removeNavigationWords(value: string) {
  return value
    .toLowerCase()
    .replace(/\bsurah\b/g, "")
    .replace(/\bsura\b/g, "")
    .replace(/\bchapter\b/g, "")
    .replace(/\bpage\b/g, "")
    .replace(/\bpg\b/g, "")
    .replace(/\bayah\b/g, "")
    .replace(/\bverse\b/g, "")
    .replace(/\bno\b/g, "")
    .replace(/\bnumber\b/g, "")
    .trim();
}

function getQueryNumber(query: string) {
  const match = query.match(/\d+/);
  return match ? Number(match[0]) : null;
}

function matchesLoose(values: Array<string | number>, query: string) {
  const cleanedQuery = removeNavigationWords(query);
  const normalizedQuery = normalizeSearchValue(cleanedQuery);

  if (!normalizedQuery) {
    return false;
  }

  return values.some((value) => {
    const normalizedValue = normalizeSearchValue(String(value));

    return (
      normalizedValue.includes(normalizedQuery) ||
      normalizedQuery.includes(normalizedValue)
    );
  });
}

function isPageQuery(query: string) {
  return /\b(page|pg)\b/i.test(query);
}

function isSurahQuery(query: string) {
  return /\b(surah|sura|chapter)\b/i.test(query);
}

function getSurahResults(surahs: Surah[], query: string): SurahSearchResult[] {
  const trimmedQuery = query.trim();
  const queryNumber = getQueryNumber(trimmedQuery);
  const explicitlySurah = isSurahQuery(trimmedQuery);

  if (!trimmedQuery) {
    return [];
  }

  return surahs
    .map((surah) => {
      let score = 0;

      const searchableValues = [
        surah.id,
        String(surah.id).padStart(2, "0"),
        `surah ${surah.id}`,
        `chapter ${surah.id}`,
        surah.englishName,
        surah.englishName.replace(/^Al-/i, ""),
        surah.englishName.replace(/-/g, " "),
        surah.englishNameTranslation,
        surah.arabicName,
      ];

      if (queryNumber === surah.id) {
        score += explicitlySurah ? 120 : 80;
      }

      if (matchesLoose(searchableValues, trimmedQuery)) {
        score += 60;
      }

      const normalizedQuery = normalizeSearchValue(
        removeNavigationWords(trimmedQuery)
      );
      const normalizedEnglishName = normalizeSearchValue(surah.englishName);
      const normalizedEnglishNameWithoutAl = normalizeSearchValue(
        surah.englishName.replace(/^Al-/i, "")
      );

      if (
        normalizedQuery === normalizedEnglishName ||
        normalizedQuery === normalizedEnglishNameWithoutAl
      ) {
        score += 80;
      }

      return {
        result: {
          type: "surah" as const,
          surah,
        },
        score,
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.result.surah.id - b.result.surah.id)
    .slice(0, 8)
    .map((item) => item.result);
}

function getPageResults(
  readerPages: ReaderPage[],
  query: string
): PageSearchResult[] {
  const trimmedQuery = query.trim();
  const queryNumber = getQueryNumber(trimmedQuery);
  const explicitlyPage = isPageQuery(trimmedQuery);

  if (!trimmedQuery) {
    return [];
  }

  return readerPages
    .map((page) => {
      let score = 0;

      const searchableValues = [
        page.pageNumber,
        String(page.pageNumber).padStart(2, "0"),
        `page ${page.pageNumber}`,
        `pg ${page.pageNumber}`,
        page.surah.id,
        page.surah.englishName,
        page.surah.englishName.replace(/^Al-/i, ""),
        page.surah.englishName.replace(/-/g, " "),
        page.surah.englishNameTranslation,
        page.surah.arabicName,
        page.startAyah,
        page.endAyah,
        `ayah ${page.startAyah}`,
        `ayah ${page.endAyah}`,
        `ayah ${page.startAyah}-${page.endAyah}`,
        `${page.startAyah}-${page.endAyah}`,
      ];

      if (queryNumber === page.pageNumber) {
        score += explicitlyPage ? 120 : 55;
      }

      if (matchesLoose(searchableValues, trimmedQuery)) {
        score += 45;
      }

      return {
        result: {
          type: "page" as const,
          page,
        },
        score,
      };
    })
    .filter((item) => item.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score || a.result.page.pageNumber - b.result.page.pageNumber
    )
    .slice(0, 8)
    .map((item) => item.result);
}

function getDirectAyahReference(query: string): SearchResult | null {
  const trimmedQuery = query.trim();

  const referenceMatch =
    trimmedQuery.match(/^(\d{1,3})\s*[:.-]\s*(\d{1,3})$/) ||
    trimmedQuery.match(/^(\d{1,3})\s+(\d{1,3})$/) ||
    trimmedQuery.match(
      /\b(?:surah|sura|chapter)\s*(\d{1,3})\D+(?:ayah|aya|verse)\s*(\d{1,3})\b/i
    );

  if (!referenceMatch) {
    return null;
  }

  const surahId = Number(referenceMatch[1]);
  const ayahNumber = Number(referenceMatch[2]);

  const ayah = ayahs.find(
    (item) => item.surahId === surahId && item.numberInSurah === ayahNumber
  );

  const surah = allSurahs.find((item) => item.id === surahId);

  if (!ayah || !surah) {
    return null;
  }

  return {
    surah,
    ayah,
  };
}

function getAyahResults(query: string): SearchResult[] {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return [];
  }

  const directReference = getDirectAyahReference(trimmedQuery);
  const textResults = searchAyahs(trimmedQuery);

  if (!directReference) {
    return textResults.slice(0, 30);
  }

  const remainingResults = textResults.filter(
    ({ ayah }) =>
      !(
        ayah.surahId === directReference.ayah.surahId &&
        ayah.numberInSurah === directReference.ayah.numberInSurah
      )
  );

  return [directReference, ...remainingResults].slice(0, 30);
}

export function SearchModal({
  isOpen,
  resolvedTheme,
  surahs,
  readerPages,
  onSelectReaderPage,
  onClose,
}: SearchModalProps) {
  const [query, setQuery] = useState("");

  const surahResults = useMemo(() => {
    return getSurahResults(surahs, query);
  }, [surahs, query]);

  const pageResults = useMemo(() => {
    return getPageResults(readerPages, query);
  }, [readerPages, query]);

  const ayahResults = useMemo(() => {
    return getAyahResults(query);
  }, [query]);

  if (!isOpen) {
    return null;
  }

  const hasQuery = Boolean(query.trim());
  const hasResults =
    surahResults.length > 0 || pageResults.length > 0 || ayahResults.length > 0;

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

  const badgeClass = isDark
    ? "bg-[#0d120d] text-zinc-400"
    : isSepia
      ? "bg-[#f1eadc] text-[#8f7a63]"
      : "bg-emerald-50 text-emerald-700";

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
        <header
          className={`flex items-start justify-between border-b p-4 ${borderClass}`}
        >
          <div>
            <h2 className={`text-[15px] font-bold ${titleClass}`}>
              Find wisdom in the Quran
            </h2>
            <p className={`mt-1 text-[11px] ${subtitleClass}`}>
              Search Surah, Page, Ayah reference, Arabic text, or English
              translation
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
              placeholder="Search 2:245, Baqarah, page 2, mercy, الحمد..."
              className={`w-full bg-transparent text-[13px] outline-none ${inputClass}`}
              autoFocus
            />
          </label>

          {!hasQuery ? (
            <div className="mt-5">
              <p className={`mb-3 text-[12px] font-medium ${subtitleClass}`}>
                Try to navigate
              </p>

              <div className="flex flex-wrap gap-2">
                {[
                  "Al-Fatihah",
                  "Surah Yasin",
                  "Page 2",
                  "2:245",
                  "الحمد",
                ].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setQuery(item)}
                    className={`rounded-[10px] px-3 py-2 text-[12px] font-medium transition ${chipClass}`}
                  >
                    {item}
                  </button>
                ))}
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
              {!hasResults ? (
                <div
                  className={`rounded-2xl border border-dashed p-8 text-center ${emptyCardClass}`}
                >
                  <p className={`font-semibold ${titleClass}`}>
                    No results found
                  </p>
                  <p className={`mt-1 text-sm ${subtitleClass}`}>
                    Try a Surah name, page number, ayah reference, Arabic word,
                    or English word.
                  </p>
                </div>
              ) : (
                <>
                  {surahResults.map(({ surah }) => (
                    <Link
                      key={`surah-${surah.id}`}
                      href={`/${surah.id}`}
                      onClick={onClose}
                      className={`block rounded-2xl border p-4 transition ${resultCardClass}`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="mb-2 flex items-center gap-2">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${badgeClass}`}
                            >
                              <BookOpen size={12} />
                              Surah {surah.id}
                            </span>
                          </div>

                          <p
                            className={`text-sm font-bold ${resultTitleClass}`}
                          >
                            {surah.englishName}
                          </p>

                          <p className={`mt-1 text-xs ${subtitleClass}`}>
                            {surah.englishNameTranslation} ·{" "}
                            {surah.numberOfAyahs} Ayahs
                          </p>
                        </div>

                        <p
                          className={`arabic-text shrink-0 text-xl ${resultArabicNameClass}`}
                        >
                          {surah.arabicName}
                        </p>
                      </div>
                    </Link>
                  ))}

                  {pageResults.map(({ page }) => (
                    <button
                      key={`page-${page.pageNumber}`}
                      type="button"
                      onClick={() => {
                        onSelectReaderPage(page.pageNumber);
                        onClose();
                      }}
                      className={`block w-full rounded-2xl border p-4 text-left transition ${resultCardClass}`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="mb-2 flex items-center gap-2">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${badgeClass}`}
                            >
                              <FileText size={12} />
                              Page {page.pageNumber}
                            </span>
                          </div>

                          <p
                            className={`text-sm font-bold ${resultTitleClass}`}
                          >
                            {page.surah.englishName}
                          </p>

                          <p className={`mt-1 text-xs ${subtitleClass}`}>
                            Ayah {page.startAyah}-{page.endAyah} ·{" "}
                            {page.surah.englishNameTranslation}
                          </p>
                        </div>

                        <p
                          className={`arabic-text shrink-0 text-xl ${resultArabicNameClass}`}
                        >
                          {page.surah.arabicName}
                        </p>
                      </div>
                    </button>
                  ))}

                  {ayahResults.map(({ surah, ayah }) => (
                    <Link
                      key={`ayah-${surah.id}-${ayah.numberInSurah}`}
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
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}