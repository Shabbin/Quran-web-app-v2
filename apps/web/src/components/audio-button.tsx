"use client";

import { Pause, Play } from "lucide-react";
import { useRef, useState } from "react";
import { getAudioUrl } from "@quran-web-app/data";

type AudioButtonProps = {
  surahId: number;
  ayahNumber: number;
};

export function AudioButton({ surahId, ayahNumber }: AudioButtonProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

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
      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm transition hover:bg-emerald-700"
      aria-label={isPlaying ? "Pause ayah audio" : "Play ayah audio"}
    >
      {isPlaying ? <Pause size={16} /> : <Play size={16} />}
    </button>
  );
}