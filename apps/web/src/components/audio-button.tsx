"use client";

import { Pause, Play } from "lucide-react";
import { useRef, useState } from "react";
import { getAudioUrl } from "@quran-web-app/data";

type AudioButtonProps = {
  surahId: number;
  ayahNumber: number;
  resolvedTheme: "light" | "dark" | "sepia";
};

export function AudioButton({
  surahId,
  ayahNumber,
  resolvedTheme,
}: AudioButtonProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const isDark = resolvedTheme === "dark";
  const isSepia = resolvedTheme === "sepia";

  const buttonClass = isDark
    ? "text-zinc-400 hover:bg-zinc-900 hover:text-emerald-400"
    : isSepia
      ? "text-[#9b7550] hover:bg-[#ead9be] hover:text-[#8a6542]"
      : "text-[#7f928d] hover:bg-[#f2f6f2] hover:text-[#3d8738]";

  const iconClass = isPlaying
    ? isDark
      ? "text-emerald-400"
      : isSepia
        ? "text-[#8a6542]"
        : "text-[#3d8738]"
    : "";

  const handleToggle = async () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(getAudioUrl(surahId, ayahNumber));
      audioRef.current.addEventListener("ended", () => setIsPlaying(false));
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    await audioRef.current.play();
    setIsPlaying(true);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-full transition ${buttonClass}`}
      aria-label={isPlaying ? "Pause ayah audio" : "Play ayah audio"}
    >
      {isPlaying ? (
        <Pause size={17} className={iconClass} />
      ) : (
        <Play size={17} className={iconClass} />
      )}
    </button>
  );
}