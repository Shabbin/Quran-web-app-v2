import type { Surah } from "@quran-web-app/data";
import Link from "next/link";

type SurahSidebarProps = {
  surahs: Surah[];
  activeSurahId: number;
};

export function SurahSidebar({ surahs, activeSurahId }: SurahSidebarProps) {
  return (
    <aside className="hidden h-screen w-[340px] shrink-0 border-r border-emerald-100 bg-white lg:block">
      <div className="border-b border-emerald-100 p-5">
        <h1 className="text-xl font-bold text-slate-900">Quran Mazid</h1>
        <p className="mt-1 text-sm text-slate-500">
          Read, listen, and search the Holy Quran
        </p>

        <div className="mt-5 rounded-2xl bg-slate-100 p-1">
          <div className="grid grid-cols-3 text-sm font-medium">
            <button className="rounded-xl bg-white py-2 text-emerald-700 shadow-sm">
              Surah
            </button>
            <button className="rounded-xl py-2 text-slate-500">Juz</button>
            <button className="rounded-xl py-2 text-slate-500">Page</button>
          </div>
        </div>
      </div>

      <div className="h-[calc(100vh-160px)] overflow-y-auto p-3">
        {surahs.map((surah) => {
          const isActive = surah.id === activeSurahId;

          return (
            <Link
              key={surah.id}
              href={`/${surah.id}`}
              className={`mb-2 flex items-center gap-3 rounded-2xl p-3 transition ${
                isActive
                  ? "bg-emerald-50 text-emerald-800"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-semibold ${
                  isActive
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {surah.id}
              </span>

              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">
                  {surah.englishName}
                </span>
                <span className="block truncate text-xs text-slate-500">
                  {surah.englishNameTranslation}
                </span>
              </span>

              <span className="arabic-text text-lg text-slate-700">
                {surah.arabicName}
              </span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}