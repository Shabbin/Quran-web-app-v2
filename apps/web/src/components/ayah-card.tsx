import type { Ayah } from "@quran-web-app/data";
import { Bookmark, Copy, MoreHorizontal } from "lucide-react";
import { AudioButton } from "./audio-button";

type AyahCardProps = {
  ayah: Ayah;
  arabicFontFamily: string;
  arabicFontSize: number;
  translationFontSize: number;
};

export function AyahCard({
  ayah,
  arabicFontFamily,
  arabicFontSize,
  translationFontSize,
}: AyahCardProps) {
  return (
    <article
      id={`ayah-${ayah.numberInSurah}`}
      className="rounded-[28px] border border-emerald-100 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-[#101210]"
    >
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
            {ayah.surahId}:{ayah.numberInSurah}
          </span>

          <AudioButton surahId={ayah.surahId} ayahNumber={ayah.numberInSurah} />
        </div>

        <div className="flex items-center gap-2 text-slate-400 dark:text-zinc-500">
          <button
            className="rounded-full p-2 hover:bg-slate-50 dark:hover:bg-zinc-900"
            type="button"
            aria-label="Copy ayah"
          >
            <Copy size={17} />
          </button>

          <button
            className="rounded-full p-2 hover:bg-slate-50 dark:hover:bg-zinc-900"
            type="button"
            aria-label="Bookmark ayah"
          >
            <Bookmark size={17} />
          </button>

          <button
            className="rounded-full p-2 hover:bg-slate-50 dark:hover:bg-zinc-900"
            type="button"
            aria-label="More options"
          >
            <MoreHorizontal size={17} />
          </button>
        </div>
      </div>

      <p
        dir="rtl"
        className="mb-8 text-right text-slate-950 dark:text-zinc-100"
        style={{
          fontFamily: arabicFontFamily,
          fontSize: arabicFontSize,
          lineHeight: 2.25,
        }}
      >
        {ayah.arabic}
      </p>

      <div className="border-t border-emerald-50 pt-5 dark:border-zinc-800">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-emerald-600 dark:text-emerald-500">
          Saheeh International
        </p>

        <p
          className="text-slate-700 dark:text-zinc-300"
          style={{
            fontSize: translationFontSize,
            lineHeight: 1.75,
          }}
        >
          {ayah.translation}
        </p>
      </div>
    </article>
  );
}