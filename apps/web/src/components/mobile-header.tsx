"use client";

import { Menu, Search, Settings } from "lucide-react";

type MobileHeaderProps = {
  onOpenMenu: () => void;
  onOpenSearch: () => void;
};

export function MobileHeader({ onOpenMenu, onOpenSearch }: MobileHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-emerald-100 bg-white/95 px-4 py-3 backdrop-blur dark:border-zinc-800 dark:bg-[#090b09]/95 lg:hidden">
      <button
        type="button"
        onClick={onOpenMenu}
        className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-zinc-900 dark:text-zinc-300"
        aria-label="Open surah menu"
      >
        <Menu size={20} />
      </button>

      <div className="text-center">
        <p className="text-base font-bold text-slate-900 dark:text-zinc-100">
          Quran Mazid
        </p>
        <p className="text-xs text-slate-500 dark:text-zinc-500">
          Al Quran Reader
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenSearch}
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-zinc-900 dark:text-zinc-300"
          aria-label="Search"
        >
          <Search size={18} />
        </button>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-zinc-900 dark:text-zinc-300"
          aria-label="Settings"
        >
          <Settings size={18} />
        </button>
      </div>
    </header>
  );
}