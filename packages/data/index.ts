import { ayahs } from "./quran";
import { surahs } from "./surahs";
import type { Ayah, SearchResult, Surah, SurahWithAyahs } from "./types";

export { ayahs, surahs };
export type { Ayah, SearchResult, Surah, SurahWithAyahs };

export function getAllSurahs(): Surah[] {
  return surahs;
}

export function getSurahById(id: number): SurahWithAyahs | undefined {
  const surah = surahs.find((item) => item.id === id);

  if (!surah) {
    return undefined;
  }

  return {
    ...surah,
    ayahs: ayahs.filter((ayah) => ayah.surahId === id),
  };
}

export function getAyahsBySurahId(surahId: number): Ayah[] {
  return ayahs.filter((ayah) => ayah.surahId === surahId);
}

function normalizeArabicText(value: string): string {
  return value
    // Remove Arabic/Quranic marks, harakat, small signs, tatweel
    .replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, "")
    // Normalize different alif forms, including alif wasla: ٱ
    .replace(/[إأآٱا]/g, "ا")
    // Normalize common Uthmani spellings:
    // الصلوة -> الصلاة, الزكوة -> الزكاة, الحيوة -> الحياة
    .replace(/وة/g, "اة")
    // Normalize ya/alif maqsura
    .replace(/ى/g, "ي")
    // Normalize hamza forms
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    // Normalize ta marbuta
    .replace(/ة/g, "ه")
    // Remove extra spaces
    .replace(/\s+/g, " ")
    .trim();
}

export function searchAyahs(query: string): SearchResult[] {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return [];
  }

  const normalizedEnglishQuery = trimmedQuery.toLowerCase();
  const normalizedArabicQuery = normalizeArabicText(trimmedQuery);

  return ayahs
    .filter((ayah) => {
      const normalizedArabicAyah = normalizeArabicText(ayah.arabic);
      const normalizedTranslation = ayah.translation.toLowerCase();

      return (
        normalizedArabicAyah.includes(normalizedArabicQuery) ||
        normalizedTranslation.includes(normalizedEnglishQuery)
      );
    })
    .map((ayah) => {
      const surah = surahs.find((item) => item.id === ayah.surahId);

      if (!surah) {
        return null;
      }

      return {
        surah,
        ayah,
      };
    })
    .filter((item): item is SearchResult => Boolean(item));
}

export function getAudioUrl(surahId: number, ayahNumber: number): string {
  const surah = String(surahId).padStart(3, "0");
  const ayah = String(ayahNumber).padStart(3, "0");

  return `https://everyayah.com/data/Alafasy_128kbps/${surah}${ayah}.mp3`;
}
export {
  getReaderPages,
  getReaderPageByNumber,
  type ReaderPage,
} from "./reader-pages";