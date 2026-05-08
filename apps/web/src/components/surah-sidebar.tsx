"use client";

import type { ReaderPage, Surah } from "@quran-web-app/data";
import { Search } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type SidebarMode = "surah" | "juz" | "page";

type SurahSidebarProps = {
  surahs: Surah[];
  activeSurahId: number;
  resolvedTheme: "light" | "dark" | "sepia";
  readerPages: ReaderPage[];
  activeSidebarMode: SidebarMode;
  activeReaderPageNumber: number | null;
  onChangeSidebarMode: (mode: SidebarMode) => void;
  onSelectReaderPage: (pageNumber: number) => void;
};

type ScrollThumbState = {
  isScrollable: boolean;
  height: number;
  top: number;
};

function normalizeSearchValue(value: string) {
  return value
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
    .replace(/[إأآٱا]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/[^a-z0-9\u0600-\u06ff]/g, "")
    .trim();
}

function matchesSearch(searchableValues: Array<string | number>, query: string) {
  const normalizedQuery = normalizeSearchValue(query);

  if (!normalizedQuery) {
    return true;
  }

  return searchableValues.some((value) =>
    normalizeSearchValue(String(value)).includes(normalizedQuery)
  );
}

export function SurahSidebar({
  surahs,
  activeSurahId,
  resolvedTheme,
  readerPages,
  activeSidebarMode,
  activeReaderPageNumber,
  onChangeSidebarMode,
  onSelectReaderPage,
}: SurahSidebarProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);
  const dragStartYRef = useRef(0);
  const dragStartScrollTopRef = useRef(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [thumb, setThumb] = useState<ScrollThumbState>({
    isScrollable: false,
    height: 0,
    top: 0,
  });

  const isDark = resolvedTheme === "dark";
  const isSepia = resolvedTheme === "sepia";

  const accent = isSepia ? "#a07a50" : "#3d8738";

  const filteredSurahs = useMemo(() => {
    return surahs.filter((surah) =>
      matchesSearch(
        [
          surah.id,
          String(surah.id).padStart(2, "0"),
          surah.englishName,
          surah.englishName.replace("Al-", ""),
          surah.englishNameTranslation,
          surah.arabicName,
          `surah ${surah.id}`,
          `chapter ${surah.id}`,
        ],
        searchQuery
      )
    );
  }, [surahs, searchQuery]);

  const filteredReaderPages = useMemo(() => {
    return readerPages.filter((readerPage) =>
      matchesSearch(
        [
          readerPage.pageNumber,
          String(readerPage.pageNumber).padStart(2, "0"),
          `page ${readerPage.pageNumber}`,
          readerPage.surah.id,
          readerPage.surah.englishName,
          readerPage.surah.englishName.replace("Al-", ""),
          readerPage.surah.englishNameTranslation,
          readerPage.surah.arabicName,
          readerPage.startAyah,
          readerPage.endAyah,
          `ayah ${readerPage.startAyah}`,
          `ayah ${readerPage.endAyah}`,
          `ayah ${readerPage.startAyah}-${readerPage.endAyah}`,
          `${readerPage.startAyah}-${readerPage.endAyah}`,
        ],
        searchQuery
      )
    );
  }, [readerPages, searchQuery]);

  const sidebarClass = isDark
    ? "bg-[#101210]"
    : isSepia
      ? "bg-[#f6f1e7]"
      : "bg-white";

  const controlBgClass = isDark
    ? "bg-[#181b18]"
    : isSepia
      ? "bg-[#f1eadc]"
      : "bg-[#f3f5f3]";

  const activeTabClass = isDark
    ? "bg-[#101210] text-emerald-400"
    : isSepia
      ? "bg-[#fbf7ef] text-[#8f6d49]"
      : "bg-white text-[#3d8738]";

  const mutedTextClass = isDark
    ? "text-zinc-500"
    : isSepia
      ? "text-[#8f7a63]"
      : "text-slate-500";

  const searchClass = isDark
    ? "bg-[#181b18] text-zinc-500"
    : isSepia
      ? "bg-[#f1eadc] text-[#9b7550] ring-1 ring-[#e6d8c0]"
      : "bg-[#f3f5f3] text-slate-400";

  const searchInputClass = isDark
    ? "text-zinc-200 placeholder:text-zinc-600"
    : isSepia
      ? "text-[#4f3c28] placeholder:text-[#a8947a]"
      : "text-slate-700 placeholder:text-slate-400";

  const cardInactiveClass = isDark
    ? "text-zinc-300 hover:bg-[#181d18]"
    : isSepia
      ? "text-[#4f3c28] hover:bg-[#f0e7d8]"
      : "text-slate-700 hover:bg-[#f1f8ef]";

  const cardActiveClass = isDark
    ? "bg-emerald-950/30 text-zinc-100"
    : isSepia
      ? "bg-[#f0e7d8] text-[#3f3528] ring-1 ring-[#d9c6a8]"
      : "bg-[#f1f8ef] text-slate-900";

  const noResultsClass = isDark
    ? "text-zinc-500"
    : isSepia
      ? "text-[#907658]"
      : "text-slate-500";

  const updateThumb = useCallback(() => {
    const element = scrollRef.current;

    if (!element) return;

    const { scrollTop, scrollHeight, clientHeight } = element;
    const isScrollable = scrollHeight > clientHeight;

    if (!isScrollable) {
      setThumb({ isScrollable: false, height: 0, top: 0 });
      return;
    }

    const minThumbHeight = 42;
    const calculatedHeight = (clientHeight / scrollHeight) * clientHeight;
    const height = Math.max(calculatedHeight, minThumbHeight);
    const maxTop = clientHeight - height;
    const top = (scrollTop / (scrollHeight - clientHeight)) * maxTop;

    setThumb({ isScrollable: true, height, top });
  }, []);

  const handleThumbMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    const element = scrollRef.current;

    if (!element) return;

    event.preventDefault();

    isDraggingRef.current = true;
    dragStartYRef.current = event.clientY;
    dragStartScrollTopRef.current = element.scrollTop;

    document.body.style.userSelect = "none";
  };

  const handleChangeMode = (mode: SidebarMode) => {
    setSearchQuery("");
    onChangeSidebarMode(mode);
  };

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const element = scrollRef.current;

      if (!element || !isDraggingRef.current) return;

      const { scrollHeight, clientHeight } = element;
      const maxScrollTop = scrollHeight - clientHeight;
      const maxThumbTop = clientHeight - thumb.height;

      if (maxThumbTop <= 0) return;

      const deltaY = event.clientY - dragStartYRef.current;
      const scrollDelta = (deltaY / maxThumbTop) * maxScrollTop;

      element.scrollTop = dragStartScrollTopRef.current + scrollDelta;
      updateThumb();
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      document.body.style.userSelect = "";
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "";
    };
  }, [thumb.height, updateThumb]);

  useEffect(() => {
    updateThumb();

    window.addEventListener("resize", updateThumb);

    const timeoutId = window.setTimeout(updateThumb, 100);

    return () => {
      window.removeEventListener("resize", updateThumb);
      window.clearTimeout(timeoutId);
    };
  }, [
    updateThumb,
    surahs.length,
    activeSurahId,
    readerPages.length,
    activeSidebarMode,
    searchQuery,
  ]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }

    updateThumb();
  }, [activeSidebarMode, searchQuery, updateThumb]);

  const getTabClass = (mode: SidebarMode) =>
    activeSidebarMode === mode ? activeTabClass : mutedTextClass;

  return (
    <aside
      className={`fixed left-[72px] top-[64px] z-40 hidden h-[calc(100vh-64px)] w-[340px] lg:block ${sidebarClass}`}
    >
      <div className="px-5 pb-4 pt-5">
        <div className={`rounded-[22px] p-1 ${controlBgClass}`}>
          <div className="grid grid-cols-3 text-[14px] font-semibold">
            <button
              type="button"
              onClick={() => handleChangeMode("surah")}
              className={`rounded-[18px] py-2.5 ${
                activeSidebarMode === "surah" ? "shadow-sm" : ""
              } ${getTabClass("surah")}`}
            >
              Surah
            </button>

            <button
              type="button"
              onClick={() => handleChangeMode("juz")}
              className={`rounded-[18px] py-2.5 ${
                activeSidebarMode === "juz" ? "shadow-sm" : ""
              } ${getTabClass("juz")}`}
            >
              Juz
            </button>

            <button
              type="button"
              onClick={() => handleChangeMode("page")}
              className={`rounded-[18px] py-2.5 ${
                activeSidebarMode === "page" ? "shadow-sm" : ""
              } ${getTabClass("page")}`}
            >
              Page
            </button>
          </div>
        </div>

        <label
          className={`mt-4 flex h-12 items-center gap-3 rounded-[18px] px-4 ${searchClass}`}
        >
          <Search size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={
              activeSidebarMode === "page"
                ? "Search Page"
                : activeSidebarMode === "juz"
                  ? "Search Juz"
                  : "Search Surah"
            }
            className={`w-full bg-transparent text-[14px] outline-none ${searchInputClass}`}
          />
        </label>
      </div>

      <div className="relative h-[calc(100vh-205px)]">
        <div
          ref={scrollRef}
          onScroll={updateThumb}
          className="surah-sidebar-scroll h-full overflow-y-auto px-4 py-3 pr-6"
        >
          {activeSidebarMode === "surah" ? (
            filteredSurahs.length > 0 ? (
              <div className="space-y-1.5">
                {filteredSurahs.map((surah) => {
                  const isActive = surah.id === activeSurahId;

                  const diamondClass = isActive
                    ? ""
                    : isDark
                      ? "bg-[#191d19] group-hover:bg-[#3d8738]"
                      : isSepia
                        ? "bg-[#fbf6ee] group-hover:bg-[#a07a50]"
                        : "bg-[#f1f3f1] group-hover:bg-[#3d8738]";

                  const numberClass = isActive
                    ? "text-white"
                    : isDark
                      ? "text-zinc-500 group-hover:text-white"
                      : isSepia
                        ? "text-[#9a8268] group-hover:text-white"
                        : "text-slate-500 group-hover:text-white";

                  const englishNameClass = isDark
                    ? "text-zinc-200"
                    : isSepia
                      ? "text-[#4f3c28]"
                      : "text-slate-700";

                  const translationNameClass = isActive
                    ? isSepia
                      ? "text-[#8f6d49]"
                      : "text-[#3d8738]"
                    : isDark
                      ? "text-zinc-500"
                      : isSepia
                        ? "text-[#8f7a63]"
                        : "text-slate-500";

                  const arabicNameClass = isDark
                    ? "text-zinc-400"
                    : isSepia
                      ? "text-[#8f7a63]"
                      : "text-slate-500";

                  return (
                    <Link
                      key={surah.id}
                      href={`/${surah.id}`}
                      onClick={() => handleChangeMode("surah")}
                      className={`group flex items-center gap-3 rounded-[18px] px-3 py-2.5 transition ${
                        isActive ? cardActiveClass : cardInactiveClass
                      }`}
                    >
                      <span className="relative flex h-10 w-10 shrink-0 items-center justify-center">
                        <span
                          className={`absolute h-8 w-8 rotate-45 rounded-[10px] transition ${diamondClass}`}
                          style={{
                            backgroundColor: isActive ? accent : undefined,
                          }}
                        />

                        <span
                          className={`relative text-[13px] font-bold transition ${numberClass}`}
                        >
                          {surah.id}
                        </span>
                      </span>

                      <span className="min-w-0 flex-1">
                        <span
                          className={`block truncate text-[14px] font-semibold leading-5 transition ${englishNameClass}`}
                        >
                          {surah.englishName}
                        </span>

                        <span
                          className={`block truncate text-[12px] leading-4 transition ${translationNameClass}`}
                        >
                          {surah.englishNameTranslation}
                        </span>
                      </span>

                      <span
                        className={`arabic-text shrink-0 text-right text-[20px] leading-none transition ${arabicNameClass}`}
                      >
                        {surah.arabicName}
                      </span>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div
                className={`flex h-full items-center justify-center text-sm font-medium ${noResultsClass}`}
              >
                No results found
              </div>
            )
          ) : activeSidebarMode === "page" ? (
            filteredReaderPages.length > 0 ? (
              <div className="space-y-1.5">
                {filteredReaderPages.map((readerPage) => {
                  const isActive =
                    readerPage.pageNumber === activeReaderPageNumber;

                  const diamondClass = isActive
                    ? ""
                    : isDark
                      ? "bg-[#191d19] group-hover:bg-[#3d8738]"
                      : isSepia
                        ? "bg-[#fbf6ee] group-hover:bg-[#a07a50]"
                        : "bg-[#f1f3f1] group-hover:bg-[#3d8738]";

                  const numberClass = isActive
                    ? "text-white"
                    : isDark
                      ? "text-zinc-500 group-hover:text-white"
                      : isSepia
                        ? "text-[#9a8268] group-hover:text-white"
                        : "text-slate-500 group-hover:text-white";

                  const titleClass = isDark
                    ? "text-zinc-200"
                    : isSepia
                      ? "text-[#4f3c28]"
                      : "text-slate-700";

                  const subTextClass = isActive
                    ? isSepia
                      ? "text-[#8f6d49]"
                      : "text-[#3d8738]"
                    : isDark
                      ? "text-zinc-500"
                      : isSepia
                        ? "text-[#8f7a63]"
                        : "text-slate-500";

                  const arabicNameClass = isDark
                    ? "text-zinc-400"
                    : isSepia
                      ? "text-[#8f7a63]"
                      : "text-slate-500";

                  return (
                    <button
                      key={readerPage.pageNumber}
                      type="button"
                      onClick={() => onSelectReaderPage(readerPage.pageNumber)}
                      className={`group flex w-full items-center gap-3 rounded-[18px] px-3 py-2.5 text-left transition ${
                        isActive ? cardActiveClass : cardInactiveClass
                      }`}
                    >
                      <span className="relative flex h-10 w-10 shrink-0 items-center justify-center">
                        <span
                          className={`absolute h-8 w-8 rotate-45 rounded-[10px] transition ${diamondClass}`}
                          style={{
                            backgroundColor: isActive ? accent : undefined,
                          }}
                        />

                        <span
                          className={`relative text-[11px] font-bold transition ${numberClass}`}
                        >
                          {readerPage.pageNumber}
                        </span>
                      </span>

                      <span className="min-w-0 flex-1">
                        <span
                          className={`block truncate text-[14px] font-semibold leading-5 transition ${titleClass}`}
                        >
                          Page {readerPage.pageNumber}
                        </span>

                        <span
                          className={`block truncate text-[12px] leading-4 transition ${subTextClass}`}
                        >
                          {readerPage.surah.englishName} · Ayah{" "}
                          {readerPage.startAyah}-{readerPage.endAyah}
                        </span>
                      </span>

                      <span
                        className={`arabic-text shrink-0 text-right text-[20px] leading-none transition ${arabicNameClass}`}
                      >
                        {readerPage.surah.arabicName}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div
                className={`flex h-full items-center justify-center text-sm font-medium ${noResultsClass}`}
              >
                No results found
              </div>
            )
          ) : (
            <div className={`px-3 py-8 text-center text-sm ${mutedTextClass}`}>
              Juz navigation can be added later.
            </div>
          )}
        </div>

        {thumb.isScrollable ? (
          <div className="absolute bottom-3 right-1 top-3 w-[6px] rounded-full bg-transparent">
            <div
              role="presentation"
              onMouseDown={handleThumbMouseDown}
              className="absolute right-0 w-[5px] cursor-default rounded-full"
              style={{
                height: `${thumb.height}px`,
                transform: `translateY(${thumb.top}px)`,
                backgroundColor: accent,
              }}
            />
          </div>
        ) : null}
      </div>
    </aside>
  );
}