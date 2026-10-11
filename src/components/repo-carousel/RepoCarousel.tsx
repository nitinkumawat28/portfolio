import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useVelocity,
  useMotionValueEvent,
  animate,
} from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { DeckItem } from "../deck/types";
import { RepoCard } from "./RepoCard";

type Props = {
  items: DeckItem[];
};

export function RepoCarousel({ items }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const total = items.length;

  // MotionValue tracking continuous card index
  const scroll = useMotionValue(0);
  const scrollVelocity = useVelocity(scroll);

  // Active center index
  const [centerIndex, setCenterIndex] = useState(0);
  const currentCenterRef = useRef(0);

  // Pointer drag state
  const isPointerDownRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollRef = useRef(0);
  const hasMovedRef = useRef(false);
  const [isDraggingState, setIsDraggingState] = useState(false);

  // Reduced motion support
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

  // Update center index on shift
  useMotionValueEvent(scroll, "change", (latest) => {
    const clamped = Math.max(0, Math.min(total - 1, Math.round(latest)));
    if (clamped !== currentCenterRef.current) {
      currentCenterRef.current = clamped;
      setCenterIndex(clamped);
    }
  });

  // Pointer drag interactions
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    const target = e.target as HTMLElement | null;
    if (target?.closest("a, button")) {
      return;
    }
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
    if (Math.abs(deltaX) > 5) {
      hasMovedRef.current = true;
    }
    // 300px drag equals 1 full card slide
    let target = dragStartScrollRef.current - deltaX / 300;
    // Boundary resistance
    if (target < 0) {
      target = target * 0.35;
    } else if (target > total - 1) {
      const over = target - (total - 1);
      target = total - 1 + over * 0.35;
    }
    scroll.set(target);
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

    const currentScroll = scroll.get();
    const vel = scrollVelocity.get();
    let target = Math.round(currentScroll + vel * 0.12);
    target = Math.max(0, Math.min(total - 1, target));

    animate(scroll, target, {
      type: "spring",
      stiffness: 240,
      damping: 27,
      mass: 0.75,
      velocity: vel,
    });
  };

  // Step left/right
  const handleStep = useCallback(
    (dir: number) => {
      const current = scroll.get();
      const currentIdx = Math.round(current);
      const target = Math.max(0, Math.min(total - 1, currentIdx + dir));
      animate(scroll, target, {
        type: "spring",
        stiffness: 240,
        damping: 27,
        mass: 0.75,
      });
    },
    [scroll, total]
  );

  // Wheel handling with smooth horizontal card slide
  const lastWheelTimeRef = useRef(0);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      // Only capture horizontal or deliberate wheel on container
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        const now = Date.now();
        if (now - lastWheelTimeRef.current < 350) return;
        lastWheelTimeRef.current = now;
        handleStep(Math.sign(e.deltaX));
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
      } else if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        const scrollContainer = containerRef.current?.closest(".overflow-y-auto");
        if (scrollContainer) {
          scrollContainer.scrollBy({ top: 220, behavior: "smooth" });
        }
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        const scrollContainer = containerRef.current?.closest(".overflow-y-auto");
        if (scrollContainer) {
          scrollContainer.scrollBy({ top: -220, behavior: "smooth" });
        }
      } else if (e.key === "Enter") {
        const currentRepo = items[centerIndex];
        const primaryLink = currentRepo?.actions.find((a) => a.variant === "primary")?.href;
        if (primaryLink) window.open(primaryLink, "_blank");
      }
    },
    [handleStep, centerIndex, items]
  );

  // Card click: side cards smoothly slide to center, center card opens GitHub
  const handleCardClick = (i: number) => {
    if (hasMovedRef.current) return;
    const currentS = scroll.get();
    const offset = i - currentS;

    if (Math.abs(offset) < 0.25) {
      const targetRepo = items[i];
      const link = targetRepo?.actions.find((a) => a.variant === "primary")?.href;
      if (link) window.open(link, "_blank");
    } else {
      animate(scroll, i, {
        type: "spring",
        stiffness: 240,
        damping: 27,
        mass: 0.75,
      });
    }
  };

  const currentCenterRepo = items[centerIndex] || items[0];

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <motion.div
      ref={containerRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Git repositories"
      tabIndex={0}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{ touchAction: "pan-y" }}
      className={`relative flex h-[460px] sm:h-[490px] w-full flex-col justify-between overflow-hidden bg-[#050505]/70 backdrop-blur-md text-white rounded-2xl select-none outline-none focus-visible:ring-2 focus-visible:ring-white/40 border border-white/5 ${
        isDraggingState ? "cursor-grabbing" : "cursor-grab"
      }`}
    >
      {/* Screen reader announcements */}
      <p className="sr-only" aria-live="polite">
        {currentCenterRepo
          ? `Repository ${centerIndex + 1} of ${total}: ${currentCenterRepo.title}`
          : ""}
      </p>

      {/* 3D Perspective Stage with Left/Right Navigation Arrows */}
      <div
        className="relative h-[410px] sm:h-[440px] w-full"
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
          disabled={centerIndex <= 0}
          aria-label="Previous repository"
          className={`absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white/80 backdrop-blur-md shadow-xl transition-all ${
            centerIndex <= 0
              ? "opacity-20 cursor-not-allowed pointer-events-none"
              : "hover:scale-110 hover:border-white/30 hover:bg-black/90 hover:text-white active:scale-95 cursor-pointer"
          }`}
        >
          <ChevronLeft size={20} />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleStep(1);
          }}
          disabled={centerIndex >= total - 1}
          aria-label="Next repository"
          className={`absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white/80 backdrop-blur-md shadow-xl transition-all ${
            centerIndex >= total - 1
              ? "opacity-20 cursor-not-allowed pointer-events-none"
              : "hover:scale-110 hover:border-white/30 hover:bg-black/90 hover:text-white active:scale-95 cursor-pointer"
          }`}
        >
          <ChevronRight size={20} />
        </button>

        {/* 3D Cards */}
        {items.map((item, i) => (
          <RepoCard
            key={item.id}
            item={item}
            index={i}
            scroll={scroll}
            prefersReducedMotion={prefersReducedMotion}
            onSelect={() => handleCardClick(i)}
          />
        ))}
      </div>

      {/* Bottom Bar: Instructions, Dots, and Counter */}
      <div className="relative z-30 flex w-full items-center justify-between px-6 pb-3 pt-1 border-t border-white/5">
        <span className="text-[11px] font-mono text-white/40 hidden sm:inline">
          Use ← / → to slide cards · Scroll or ↓ to explore below
        </span>

        {/* Pagination Dots */}
        {total > 1 && (
          <div className="flex items-center gap-1.5 mx-auto sm:mx-0">
            {items.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  animate(scroll, idx, {
                    type: "spring",
                    stiffness: 220,
                    damping: 26,
                    mass: 0.8,
                  });
                }}
                aria-label={`Go to repository ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  centerIndex === idx
                    ? "w-6 bg-white"
                    : "w-1.5 bg-white/25 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        )}

        <div className="text-xs font-mono font-medium text-white/50 tracking-wider">
          {centerIndex + 1} / {total}
        </div>
      </div>
    </motion.div>
  );
}

export default RepoCarousel;
