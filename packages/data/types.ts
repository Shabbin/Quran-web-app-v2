export type RevelationType = "Meccan" | "Medinan";

export type Ayah = {
  id: number;
  surahId: number;
  numberInSurah: number;
  juz: number;
  page: number;
  arabic: string;
  translation: string;
};

export type Surah = {
  id: number;
  arabicName: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: RevelationType;
  numberOfAyahs: number;
};

export type SurahWithAyahs = Surah & {
  ayahs: Ayah[];
};

export type SearchResult = {
  surah: Surah;
  ayah: Ayah;
};