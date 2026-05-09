"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type PageScrollbarProps = {
  resolvedTheme: "light" | "dark" | "sepia";
};

type ScrollThumbState = {
  isScrollable: boolean;
  height: number;
};

export function PageScrollbar({ resolvedTheme }: PageScrollbarProps) {
  const thumbRef = useRef<HTMLDivElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const isDraggingRef = useRef(false);
  const dragStartYRef = useRef(0);
  const dragStartScrollYRef = useRef(0);
  const thumbHeightRef = useRef(0);
  const previousScrollBehaviorRef = useRef("");

  const [thumb, setThumb] = useState<ScrollThumbState>({
    isScrollable: false,
    height: 0,
  });

  const thumbColor = resolvedTheme === "sepia" ? "#a07a50" : "#3d8738";

  const updateThumb = useCallback(() => {
    const documentElement = document.documentElement;

    const scrollTop = window.scrollY || documentElement.scrollTop;
    const scrollHeight = documentElement.scrollHeight;
    const clientHeight = window.innerHeight;

    const isScrollable = scrollHeight > clientHeight + 1;

    if (!isScrollable) {
      thumbHeightRef.current = 0;

      setThumb((previousThumb) => {
        if (!previousThumb.isScrollable && previousThumb.height === 0) {
          return previousThumb;
        }

        return {
          isScrollable: false,
          height: 0,
        };
      });

      return;
    }

    const minThumbHeight = 72;
    const calculatedHeight = (clientHeight / scrollHeight) * clientHeight;
    const height = Math.max(calculatedHeight, minThumbHeight);
    const maxTop = clientHeight - height;
    const top = (scrollTop / (scrollHeight - clientHeight)) * maxTop;

    thumbHeightRef.current = height;

    setThumb((previousThumb) => {
      if (
        previousThumb.isScrollable &&
        Math.abs(previousThumb.height - height) < 0.5
      ) {
        return previousThumb;
      }

      return {
        isScrollable: true,
        height,
      };
    });

    if (thumbRef.current) {
      thumbRef.current.style.transform = `translate3d(0, ${top}px, 0)`;
    }
  }, []);

  const scheduleThumbUpdate = useCallback(() => {
    if (animationFrameRef.current !== null) {
      return;
    }

    animationFrameRef.current = window.requestAnimationFrame(() => {
      animationFrameRef.current = null;
      updateThumb();
    });
  }, [updateThumb]);

  const handleThumbMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();

    isDraggingRef.current = true;
    dragStartYRef.current = event.clientY;
    dragStartScrollYRef.current = window.scrollY;

    previousScrollBehaviorRef.current =
      document.documentElement.style.scrollBehavior;

    document.documentElement.style.scrollBehavior = "auto";
    document.body.style.userSelect = "none";
  };

  const handleTrackMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) {
      return;
    }

    const documentElement = document.documentElement;
    const scrollHeight = documentElement.scrollHeight;
    const clientHeight = window.innerHeight;
    const maxScrollTop = scrollHeight - clientHeight;

    const clickedTop = event.clientY;
    const targetRatio = clickedTop / clientHeight;
    const targetScrollTop = targetRatio * maxScrollTop;

    window.scrollTo(0, targetScrollTop);
  };

  useEffect(() => {
    const handleScroll = () => {
      scheduleThumbUpdate();
    };

    const handleResize = () => {
      scheduleThumbUpdate();
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDraggingRef.current) {
        return;
      }

      event.preventDefault();

      const documentElement = document.documentElement;
      const scrollHeight = documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      const maxScrollTop = scrollHeight - clientHeight;
      const maxThumbTop = clientHeight - thumbHeightRef.current;

      if (maxThumbTop <= 0 || maxScrollTop <= 0) {
        return;
      }

      const deltaY = event.clientY - dragStartYRef.current;
      const scrollDelta = (deltaY / maxThumbTop) * maxScrollTop;
      const targetScrollTop = dragStartScrollYRef.current + scrollDelta;

      window.scrollTo(0, targetScrollTop);
      updateThumb();
    };

    const handleMouseUp = () => {
      if (!isDraggingRef.current) {
        return;
      }

      isDraggingRef.current = false;

      document.documentElement.style.scrollBehavior =
        previousScrollBehaviorRef.current;

      document.body.style.userSelect = "";
    };

    scheduleThumbUpdate();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove, { passive: false });
    window.addEventListener("mouseup", handleMouseUp);

    const resizeObserver = new ResizeObserver(() => {
      scheduleThumbUpdate();
    });

    resizeObserver.observe(document.body);
    resizeObserver.observe(document.documentElement);

    const timeoutId = window.setTimeout(scheduleThumbUpdate, 150);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);

      window.clearTimeout(timeoutId);
      resizeObserver.disconnect();

      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }

      document.documentElement.style.scrollBehavior =
        previousScrollBehaviorRef.current;

      document.body.style.userSelect = "";
    };
  }, [scheduleThumbUpdate, updateThumb]);

  if (!thumb.isScrollable) {
    return null;
  }

  return (
    <div
      onMouseDown={handleTrackMouseDown}
      className="fixed right-0 top-0 z-[9999] hidden h-screen w-[10px] bg-transparent lg:block"
      aria-hidden="true"
    >
      <div
        ref={thumbRef}
        onMouseDown={handleThumbMouseDown}
        className="absolute right-[2px] w-[6px] cursor-default rounded-full"
        style={{
          height: `${thumb.height}px`,
          transform: "translate3d(0, 0px, 0)",
          willChange: "transform",
          backgroundColor: thumbColor,
        }}
      />
    </div>
  );
}