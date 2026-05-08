import type { Ayah } from "@quran-web-app/data";
import { Bookmark, Copy, MoreHorizontal } from "lucide-react";
import { AudioButton } from "./audio-button";

type AyahCardProps = {
  ayah: Ayah;
};

export function AyahCard({ ayah }: AyahCardProps) {
  return (
    <article
      id={`ayah-${ayah.numberInSurah}`}
      className="rounded-[28px] border border-emerald-100 bg-white p-5 shadow-sm"
    >
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
            {ayah.surahId}:{ayah.numberInSurah}
          </span>
          <AudioButton surahId={ayah.surahId} ayahNumber={ayah.numberInSurah} />
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <button className="rounded-full p-2 hover:bg-slate-50" type="button">
            <Copy size={17} />
          </button>
          <button className="rounded-full p-2 hover:bg-slate-50" type="button">
            <Bookmark size={17} />
          </button>
          <button className="rounded-full p-2 hover:bg-slate-50" type="button">
            <MoreHorizontal size={17} />
          </button>
        </div>
      </div>

      <p
        dir="rtl"
        className="arabic-text mb-8 text-right text-4xl leading-[2.4] text-slate-950"
      >
        {ayah.arabic}
      </p>

      <div className="border-t border-emerald-50 pt-5">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-emerald-600">
          Saheeh International
        </p>
        <p className="text-base leading-8 text-slate-700">
          {ayah.translation}
        </p>
      </div>
    </article>
  );
}