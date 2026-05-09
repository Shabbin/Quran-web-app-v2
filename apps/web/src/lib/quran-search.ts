import type { ReaderPage, SearchResult, Surah } from "@quran-web-app/data";
import { ayahs, searchAyahs, surahs as allSurahs } from "@quran-web-app/data";

export type SurahSearchResult = {
  type: "surah";
  surah: Surah;
};

export type PageSearchResult = {
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

export function getSurahResults(
  surahs: Surah[],
  query: string
): SurahSearchResult[] {
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

export function getPageResults(
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

export function getAyahResults(query: string): SearchResult[] {
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