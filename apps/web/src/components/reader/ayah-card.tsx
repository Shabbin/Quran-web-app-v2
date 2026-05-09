import type { Ayah } from "@quran-web-app/data";
import { Bookmark, Copy, MoreHorizontal } from "lucide-react";
import { AudioButton } from "./audio-button";

type AyahCardProps = {
  ayah: Ayah;
  resolvedTheme: "light" | "dark" | "sepia";
  arabicFontFamily: string;
  arabicFontSize: number;
  translationFontSize: number;
};

export function AyahCard({
  ayah,
  resolvedTheme,
  arabicFontFamily,
  arabicFontSize,
  translationFontSize,
}: AyahCardProps) {
  const isDark = resolvedTheme === "dark";
  const isSepia = resolvedTheme === "sepia";

  const accent = isSepia ? "#a07a50" : "#3d8738";

  const articleClass = isDark
    ? "bg-transparent border-[#222722]"
    : isSepia
      ? "bg-transparent border-[#e4d8bf]"
      : "bg-transparent border-[#e8eee8]";

  const arabicTextClass = isDark
    ? "text-zinc-100"
    : isSepia
      ? "text-[#3f3528]"
      : "text-slate-950";

  const labelClass = isDark
    ? "text-zinc-500"
    : isSepia
      ? "text-[#8b755f]"
      : "text-[#7f928d]";

  const translationClass = isDark
    ? "text-zinc-300"
    : isSepia
      ? "text-[#4b3d30]"
      : "text-slate-700";

  const actionButtonClass = isDark
    ? "flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 transition hover:bg-zinc-900 hover:text-emerald-400"
    : isSepia
      ? "flex h-8 w-8 items-center justify-center rounded-full text-[#a07a50] transition hover:bg-[#ead9be] hover:text-[#8f6d49]"
      : "flex h-8 w-8 items-center justify-center rounded-full text-[#8ca09a] transition hover:bg-[#f2f6f2] hover:text-[#3d8738]";

  return (
    <article
      id={`ayah-${ayah.numberInSurah}`}
      className={`scroll-mt-24 border-b px-4 py-7 sm:px-6 lg:scroll-mt-28 lg:px-8 ${articleClass}`}
    >
      <div className="mx-auto grid max-w-4xl gap-5 lg:grid-cols-[52px_minmax(0,1fr)] lg:gap-8">
        <div className="hidden lg:flex lg:flex-col lg:items-center lg:gap-3">
          <span
            className="mb-1 text-[14px] font-bold"
            style={{ color: accent }}
          >
            {ayah.surahId}:{ayah.numberInSurah}
          </span>

          <AudioButton
            surahId={ayah.surahId}
            ayahNumber={ayah.numberInSurah}
            resolvedTheme={resolvedTheme}
          />

          <button
            className={actionButtonClass}
            type="button"
            aria-label="Copy ayah"
          >
            <Copy size={17} />
          </button>

          <button
            className={actionButtonClass}
            type="button"
            aria-label="Bookmark ayah"
          >
            <Bookmark size={17} />
          </button>

          <button
            className={actionButtonClass}
            type="button"
            aria-label="More options"
          >
            <MoreHorizontal size={17} />
          </button>
        </div>

        <div className="min-w-0">
          <div className="mb-5 flex items-center justify-between lg:hidden">
            <div className="flex items-center gap-3">
              <span
                className="text-[13px] font-bold"
                style={{ color: accent }}
              >
                {ayah.surahId}:{ayah.numberInSurah}
              </span>

              <AudioButton
                surahId={ayah.surahId}
                ayahNumber={ayah.numberInSurah}
                resolvedTheme={resolvedTheme}
              />
            </div>

            <div className="flex items-center gap-1">
              <button
                className={actionButtonClass}
                type="button"
                aria-label="Copy ayah"
              >
                <Copy size={17} />
              </button>

              <button
                className={actionButtonClass}
                type="button"
                aria-label="Bookmark ayah"
              >
                <Bookmark size={17} />
              </button>

              <button
                className={actionButtonClass}
                type="button"
                aria-label="More options"
              >
                <MoreHorizontal size={17} />
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <p
              dir="rtl"
              className={`max-w-[820px] text-right ${arabicTextClass}`}
              style={{
                fontFamily: arabicFontFamily,
                fontSize: arabicFontSize,
                lineHeight: 2.08,
              }}
            >
              {ayah.arabic}
            </p>
          </div>

          <div className="mt-6 pt-1">
            <p
              className={`mb-2.5 text-[11px] font-bold uppercase tracking-[0.2em] ${labelClass}`}
            >
              Saheeh International
            </p>

            <p
              className={`max-w-[900px] ${translationClass}`}
              style={{
                fontSize: translationFontSize,
                lineHeight: 1.72,
              }}
            >
              {ayah.translation}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}