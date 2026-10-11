import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  useMotionValue,
  useVelocity,
  useSpring,
  useMotionValueEvent,
  animate,
} from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { DeckItem } from "../deck/types";
import { RepoCard } from "./RepoCard";
import { RepoInfo } from "./RepoInfo";
import { wrapOffset } from "./cardMath";

type Props = {
  items: DeckItem[];
};

export function RepoCarousel({ items }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  // If list is small, double it to fill loop smoothly
  const displayItems = items.length <= 4 ? [...items, ...items, ...items] : items.length <= 7 ? [...items, ...items] : items;
  const total = displayItems.length;
  const realTotal = items.length;

  // Single MotionValue representing continuous scroll in card units
  const scroll = useMotionValue(0);
  const scrollVelocity = useVelocity(scroll);
  const smoothedVelocity = useSpring(scrollVelocity, {
    stiffness: 240,
    damping: 32,
  });

  // Track center index for HTML info overlay
  const [centerIndex, setCenterIndex] = useState(0);
  const currentCenterRef = useRef(0);

  // Drag interaction tracking
  const isPointerDownRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollRef = useRef(0);
  const hasMovedRef = useRef(false);
  const [isDraggingState, setIsDraggingState] = useState(false);

  // Reduced motion - initialized lazily without cascading render
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  // Update center index only when integer card shifts
  useMotionValueEvent(scroll, "change", (latest) => {
    const rounded = Math.round(latest);
    if (rounded !== currentCenterRef.current) {
      currentCenterRef.current = rounded;
      setCenterIndex(rounded);
    }
  });

  // Pointer drag events
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    isPointerDownRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartScrollRef.current = scroll.get();
    hasMovedRef.current = false;
    setIsDraggingState(true);

    if (containerRef.current) {
      containerRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) return;
    const deltaX = e.clientX - dragStartXRef.current;
    if (Math.abs(deltaX) > 6) {
      hasMovedRef.current = true;
    }
    // 330px drag moves 1 full card
    const deltaScroll = -deltaX / 330;
    scroll.set(dragStartScrollRef.current + deltaScroll);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;
    setIsDraggingState(false);

    try {
      if (containerRef.current && containerRef.current.hasPointerCapture(e.pointerId)) {
        containerRef.current.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore pointer capture errors
    }

    // Release snap with inertia
    const currentScroll = scroll.get();
    const vel = scrollVelocity.get();
    const target = Math.round(currentScroll + vel * 0.12);

    animate(scroll, target, {
      type: "spring",
      stiffness: 140,
      damping: 22,
      velocity: vel,
    });
  };

  // Next / Previous step helpers
  const handleStep = useCallback(
    (dir: number) => {
      const current = scroll.get();
      const target = Math.round(current) + dir;
      animate(scroll, target, {
        type: "spring",
        stiffness: 140,
        damping: 22,
      });
    },
    [scroll]
  );

  // Wheel handling with 500ms lock
  const lastWheelTimeRef = useRef(0);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = Date.now();
      if (now - lastWheelTimeRef.current < 450) return;
      lastWheelTimeRef.current = now;

      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const dir = Math.sign(delta);
      if (dir !== 0) {
        handleStep(dir);
      }
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    return () => container.removeEventListener("wheel", onWheel);
  }, [handleStep]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handleStep(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleStep(1);
      } else if (e.key === "Enter") {
        const normalizedIndex = ((centerIndex % realTotal) + realTotal) % realTotal;
        const currentRepo = items[normalizedIndex];
        const primaryLink = currentRepo?.actions.find((a) => a.variant === "primary")?.href;
        if (primaryLink) window.open(primaryLink, "_blank");
      }
    },
    [handleStep, centerIndex, items, realTotal]
  );

  // Card click: center card opens GitHub, side card snaps to center
  const handleCardClick = (i: number) => {
    if (hasMovedRef.current) return;
    const currentS = scroll.get();
    const offset = wrapOffset(i - currentS, total);

    if (Math.abs(offset) < 0.25) {
      const normalizedIndex = ((i % realTotal) + realTotal) % realTotal;
      const targetRepo = items[normalizedIndex];
      const link = targetRepo?.actions.find((a) => a.variant === "primary")?.href;
      if (link) window.open(link, "_blank");
    } else {
      const target = currentS + offset;
      animate(scroll, target, {
        type: "spring",
        stiffness: 140,
        damping: 22,
      });
    }
  };

  const normalizedIndex = ((centerIndex % realTotal) + realTotal) % realTotal;
  const currentCenterRepo = items[normalizedIndex] || items[0];

  return (
    <div
      ref={containerRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Git repositories"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{ touchAction: "pan-y" }}
      className={`relative flex min-h-[660px] sm:min-h-[720px] w-full flex-col justify-between overflow-hidden bg-[#050505] text-white rounded-2xl select-none outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
        isDraggingState ? "cursor-grabbing" : "cursor-grab"
      }`}
    >
      {/* Visually hidden list for screen readers */}
      <ul className="sr-only">
        {items.map((repo, i) => (
          <li key={`${repo.id}-${i}`}>
            <a href={repo.actions[0]?.href || "#"}>
              {repo.title}: {repo.description}
            </a>
          </li>
        ))}
      </ul>
      <p className="sr-only" aria-live="polite">
        {currentCenterRepo
          ? `Repository ${normalizedIndex + 1} of ${realTotal}: ${currentCenterRepo.title}`
          : ""}
      </p>

      {/* 3D Perspective Stage with Left/Right Nav Arrows */}
      <div
        className="relative h-[410px] sm:h-[450px] w-full mt-4"
        style={{
          perspective: 1400,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Navigation Arrows */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleStep(-1);
          }}
          aria-label="Previous repository"
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white/80 backdrop-blur-md transition-all hover:scale-110 hover:border-white/30 hover:bg-black/90 hover:text-white active:scale-95 shadow-xl"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleStep(1);
          }}
          aria-label="Next repository"
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white/80 backdrop-blur-md transition-all hover:scale-110 hover:border-white/30 hover:bg-black/90 hover:text-white active:scale-95 shadow-xl"
        >
          <ChevronRight size={20} />
        </button>

        {/* 3D Cards */}
        {displayItems.map((item, i) => (
          <RepoCard
            key={`${item.id}-${i}`}
            item={item}
            index={i}
            scroll={scroll}
            velocity={smoothedVelocity}
            total={total}
            prefersReducedMotion={prefersReducedMotion}
            onSelect={() => handleCardClick(i)}
          />
        ))}
      </div>

      {/* HTML Overlay: Center Repo Info Block */}
      <div className="relative z-30 w-full px-4 my-3">
        {currentCenterRepo && <RepoInfo item={currentCenterRepo} />}
      </div>

      {/* Bottom bar with Counter at bottom right */}
      <div className="relative z-30 flex w-full items-center justify-between px-6 pb-4">
        <span className="text-[11px] font-mono text-white/30">
          Drag horizontally or use ← / → keys
        </span>
        <div className="text-xs font-mono font-medium text-white/50 tracking-wider">
          {normalizedIndex + 1} / {realTotal}
        </div>
      </div>
    </div>
  );
}

export default RepoCarousel;
