"use client";

import type {
  ArabicFont,
  ReaderSettings,
} from "@/hooks/use-reader-settings";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Type,
} from "lucide-react";
import { useState } from "react";

type SettingsPanelContentProps = {
  settings: ReaderSettings;
  resolvedTheme: "light" | "dark" | "sepia";
  onChange: <K extends keyof ReaderSettings>(
    key: K,
    value: ReaderSettings[K]
  ) => void;
};

const fonts: { label: string; value: ArabicFont }[] = [
  { label: "Amiri Quran", value: "amiri" },
  { label: "Scheherazade", value: "scheherazade" },
];

export function SettingsPanelContent({
  settings,
  resolvedTheme,
  onChange,
}: SettingsPanelContentProps) {
  const [isReadingOpen, setIsReadingOpen] = useState(true);
  const [isFontOpen, setIsFontOpen] = useState(true);

  const isDark = resolvedTheme === "dark";
  const isSepia = resolvedTheme === "sepia";

  const accent = isSepia ? "#a07a50" : "#3d8738";

  const headingTextClass = isDark
    ? "text-zinc-100"
    : isSepia
      ? "text-[#4f3c28]"
      : "text-slate-800";

  const bodyTextClass = isDark
    ? "text-zinc-500"
    : isSepia
      ? "text-[#8f7a63]"
      : "text-slate-500";

  const labelTextClass = isDark
    ? "text-zinc-200"
    : isSepia
      ? "text-[#4f3c28]"
      : "text-slate-700";

  const selectClass = isDark
    ? "bg-[#151715] text-zinc-200"
    : isSepia
      ? "bg-[#f1eadc] text-[#4f3c28]"
      : "bg-[#f3f5f3] text-slate-700";

  const supportCardClass = isDark
    ? "border-emerald-900/30 bg-emerald-950/20"
    : isSepia
      ? "border-[#dfcfb3] bg-[#eee3d1]"
      : "border-emerald-100 bg-[#f1f8ef]";

  const supportButtonClass = isSepia
    ? "bg-[#a07a50] hover:bg-[#8f6d49]"
    : "bg-[#3d8738] hover:bg-[#347730]";

  const readingIconClass = isDark
    ? "text-zinc-400"
    : isSepia
      ? "text-[#a07a50]"
      : "text-[#7d918b]";

  const sliderClass =
    "w-full cursor-pointer transition active:scale-[0.99]";

  return (
    <div className="space-y-6">
      <section>
        <button
          type="button"
          onClick={() => setIsReadingOpen((current) => !current)}
          className="flex w-full items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <BookOpen size={20} className={readingIconClass} />

            <h3 className={`text-[15px] font-semibold ${headingTextClass}`}>
              Reading Settings
            </h3>
          </div>

          {isReadingOpen ? (
            <ChevronUp size={18} style={{ color: accent }} />
          ) : (
            <ChevronDown size={18} style={{ color: accent }} />
          )}
        </button>

        {isReadingOpen ? (
          <p className={`mt-4 text-[13px] leading-6 ${bodyTextClass}`}>
            Translation view is active. Use the font controls below to adjust
            your reading experience.
          </p>
        ) : null}
      </section>

      <section>
        <button
          type="button"
          onClick={() => setIsFontOpen((current) => !current)}
          className="mb-5 flex w-full items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <span
              className="flex h-6 w-6 items-center justify-center rounded-md text-white"
              style={{ backgroundColor: accent }}
            >
              <Type size={15} />
            </span>

            <h3
              className="text-[15px] font-semibold"
              style={{ color: accent }}
            >
              Font Settings
            </h3>
          </div>

          {isFontOpen ? (
            <ChevronUp size={18} style={{ color: accent }} />
          ) : (
            <ChevronDown size={18} style={{ color: accent }} />
          )}
        </button>

        {isFontOpen ? (
          <div className="space-y-6">
            <label className="block">
              <div className="mb-2.5 flex items-center justify-between">
                <span className={`text-[14px] font-medium ${labelTextClass}`}>
                  Arabic Font Size
                </span>
                <span
                  className="text-[13px] font-bold"
                  style={{ color: accent }}
                >
                  {settings.arabicFontSize}
                </span>
              </div>

              <input
                type="range"
                min="24"
                max="48"
                step="1"
                value={settings.arabicFontSize}
                onChange={(event) =>
                  onChange("arabicFontSize", Number(event.target.value))
                }
                style={{ accentColor: accent }}
                className={sliderClass}
              />
            </label>

            <label className="block">
              <div className="mb-2.5 flex items-center justify-between">
                <span className={`text-[14px] font-medium ${labelTextClass}`}>
                  Translation Font Size
                </span>
                <span
                  className="text-[13px] font-bold"
                  style={{ color: accent }}
                >
                  {settings.translationFontSize}
                </span>
              </div>

              <input
                type="range"
                min="14"
                max="32"
                step="1"
                value={settings.translationFontSize}
                onChange={(event) =>
                  onChange("translationFontSize", Number(event.target.value))
                }
                style={{ accentColor: accent }}
                className={sliderClass}
              />
            </label>

            <label className="block">
              <span
                className={`mb-2.5 block text-[14px] font-medium ${labelTextClass}`}
              >
                Arabic Font Face
              </span>

              <select
                value={settings.arabicFont}
                onChange={(event) =>
                  onChange("arabicFont", event.target.value as ArabicFont)
                }
                className={`w-full rounded-xl border-0 px-4 py-3.5 text-[14px] font-medium outline-none ring-1 ring-transparent transition focus:ring-emerald-300 ${selectClass}`}
              >
                {fonts.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ) : null}
      </section>

      <section className={`rounded-[18px] border p-4 ${supportCardClass}`}>
        <div className="mb-2.5 flex items-start gap-2">
          <SlidersHorizontal
            size={18}
            className="mt-1 shrink-0"
            style={{ color: accent }}
          />

          <h3 className={`text-[15px] font-bold leading-6 ${headingTextClass}`}>
            Help spread the knowledge of Islam
          </h3>
        </div>

        <p className={`text-[13px] leading-6 ${bodyTextClass}`}>
          Your regular support helps us reach our religious brothers and sisters
          with the message of Islam.
        </p>

        <button
          type="button"
          className={`mt-4 w-full rounded-lg px-4 py-3 text-[13px] font-bold text-white transition ${supportButtonClass}`}
        >
          Support Us
        </button>
      </section>
    </div>
  );
}