import { getAllSurahs, getSurahById } from "@quran-web-app/data";
import { QuranAppShell } from "@/components/quran-app-shell";
import { notFound } from "next/navigation";

type SurahPageProps = {
  params: {
    surahId: string;
  };
};

export function generateStaticParams() {
  return getAllSurahs().map((surah) => ({
    surahId: String(surah.id),
  }));
}

export default function SurahPage({ params }: SurahPageProps) {
  const surahId = Number(params.surahId);
  const surah = getSurahById(surahId);

  if (!surah) {
    notFound();
  }

  return <QuranAppShell surahs={getAllSurahs()} activeSurah={surah} />;
}