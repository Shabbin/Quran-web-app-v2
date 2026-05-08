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

export function searchAyahs(query: string): SearchResult[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return [];
  }

  return ayahs
    .filter((ayah) => {
      return (
        ayah.arabic.includes(query.trim()) ||
        ayah.translation.toLowerCase().includes(normalizedQuery)
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