import { getAllSurahs, getSurahById } from "@quran-web-app/data";
import { QuranAppShell } from "@/components/quran-app-shell";
import { notFound } from "next/navigation";

type SurahPageProps = {
  params: Promise<{
    surahId: string;
  }>;
};

export function generateStaticParams() {
  return getAllSurahs().map((surah) => ({
    surahId: String(surah.id),
  }));
}

export async function generateMetadata({ params }: SurahPageProps) {
  const { surahId } = await params;
  const surah = getSurahById(Number(surahId));

  if (!surah) {
    return {
      title: "Surah Not Found",
    };
  }

  return {
    title: `${surah.englishName} - Quran Web App`,
    description: `Read ${surah.englishName} with Arabic text, translation, and audio playback.`,
  };
}

export default async function SurahPage({ params }: SurahPageProps) {
  const { surahId } = await params;
  const surah = getSurahById(Number(surahId));

  if (!surah) {
    notFound();
  }

  return <QuranAppShell surahs={getAllSurahs()} activeSurah={surah} />;
}