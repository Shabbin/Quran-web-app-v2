import { ayahs } from "./quran";
import { surahs } from "./surahs";
import type { Ayah, Surah } from "./types";

const DEFAULT_AYAHS_PER_PAGE = 10;

export type ReaderPage = {
  pageNumber: number;
  surah: Surah;
  ayahs: Ayah[];
  startAyah: number;
  endAyah: number;
};

export function getReaderPages(ayahsPerPage = DEFAULT_AYAHS_PER_PAGE) {
  const pages: ReaderPage[] = [];

  for (const surah of surahs) {
    const surahAyahs = ayahs.filter((ayah) => ayah.surahId === surah.id);

    for (let index = 0; index < surahAyahs.length; index += ayahsPerPage) {
      const chunk = surahAyahs.slice(index, index + ayahsPerPage);

      pages.push({
        pageNumber: pages.length + 1,
        surah,
        ayahs: chunk,
        startAyah: chunk[0].numberInSurah,
        endAyah: chunk[chunk.length - 1].numberInSurah,
      });
    }
  }

  return pages;
}

export function getReaderPageByNumber(pageNumber: number) {
  return getReaderPages().find((page) => page.pageNumber === pageNumber);
}