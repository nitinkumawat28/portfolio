import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { CSSProperties, KeyboardEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCountUp } from "./useCountUp";
import { useTypewriter } from "./useTypewriter";
import type { DeckAction, DeckItem, DeckStat } from "./types";

/* ------------------------------------------------------------------ */
/* Tuning knobs. Change these to make the animation faster or slower.  */
/* ------------------------------------------------------------------ */
const TIMING = {
  exit: 0.18, // seconds, old card fades out
  enter: 0.32, // seconds, new card fades in
  titleSpeed: 26, // ms per character
  descDelay: 260, // ms before the description starts typing
  descSpeed: 8, // ms per character
  statsDelay: 380, // ms before numbers start counting
  wheelLock: 750, // ms between wheel-triggered changes
};

const LAYER_STEP_X = 14; // px each card behind sticks out to the right
const LAYER_STEP_Y = 12; // px each card behind sticks out at the top

type Props = {
  items: DeckItem[];
  /** Accessible name for the whole deck, e.g. "Projects". */
  label: string;
  className?: string;
};

export function ProjectDeck({ items, label, className = "" }: Props) {
  const reduced = useReducedMotion() ?? false;
  const [[index, dir], setPage] = useState<[number, number]>([0, 0]);
  const rootRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);
  const lockUntil = useRef(0);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  const go = useCallback(
    (delta: number) => {
      setPage(([i]) => {
        const next = i + delta;
        if (next < 0 || next >= items.length) return [i, 0];
        return [next, delta];
      });
    },
    [items.length]
  );

  const jump = useCallback((target: number) => {
    setPage(([i]) => (target === i ? [i, 0] : [target, target > i ? 1 : -1]));
  }, []);

  /* Wheel: change card, but let the page scroll once we hit the first/last card. */
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 18) return;
      const step = e.deltaY > 0 ? 1 : -1;
      const next = indexRef.current + step;
      if (next < 0 || next >= items.length) return;
      e.preventDefault();
      const now = performance.now();
      if (now < lockUntil.current) return;
      lockUntil.current = now + TIMING.wheelLock;
      go(step);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [go, items.length]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    } else if (e.key === "Home") {
      e.preventDefault();
      jump(0);
    } else if (e.key === "End") {
      e.preventDefault();
      jump(items.length - 1);
    }
  };

  if (items.length === 0) return null;
  const item = items[index];

  const variants = {
    enter: (d: number) => ({
      opacity: 0,
      y: reduced ? 0 : d >= 0 ? 18 : -18,
      scale: reduced ? 1 : 0.985,
    }),
    center: { opacity: 1, y: 0, scale: 1 },
    exit: (d: number) => ({
      opacity: 0,
      y: reduced ? 0 : d >= 0 ? -18 : 18,
      scale: reduced ? 1 : 0.985,
    }),
  };

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      tabIndex={0}
      onKeyDown={onKeyDown}
      className={`relative mx-auto w-[min(92vw,960px)] outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-lg ${className}`}
      style={{ paddingTop: LAYER_STEP_Y * 2 + 2, paddingRight: LAYER_STEP_X * 2 + 2 }}
    >
      <p className="sr-only" aria-live="polite">
        {`${label}: ${index + 1} of ${items.length}, ${item.title}`}
      </p>

      {/* Cards waiting behind the front card with glassmorphism preview */}
      {[2, 1].map((depth) => {
        const peek = items[index + depth];
        return (
          <motion.div
            key={depth}
            aria-hidden
            className="absolute left-0 bottom-0 rounded-2xl border border-white/10 backdrop-blur-md"
            style={{
              top: LAYER_STEP_Y * 2 + 2,
              right: LAYER_STEP_X * 2 + 2,
              background: peek
                ? `color-mix(in srgb, ${peek.accent} 12%, rgba(20, 26, 35, 0.45))`
                : "rgba(15, 20, 28, 0.35)",
              boxShadow: "0 10px 30px -10px rgba(0,0,0,0.5)",
              zIndex: 3 - depth,
            }}
            initial={false}
            animate={{
              x: peek ? depth * LAYER_STEP_X : 0,
              y: peek ? -depth * LAYER_STEP_Y : 0,
              opacity: peek ? 1 - depth * 0.15 : 0,
            }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
          />
        );
      })}

      {/* Front glass card */}
      <div
        className="relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-2xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.15)]"
        style={{ zIndex: 3, touchAction: "pan-y" }}
      >
        {/* Light sweep that plays when the card changes. Transform only. */}
        {!reduced && (
          <motion.div
            key={`sweep-${item.id}`}
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            initial={{ x: "-120%" }}
            animate={{ x: "420%" }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          />
        )}

        <AnimatePresence mode="wait" initial={false} custom={dir}>
          <motion.div
            key={item.id}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: TIMING.enter, ease: [0.22, 1, 0.36, 1] }}
            onPanEnd={(_, info) => {
              if (info.offset.x < -50) go(1);
              else if (info.offset.x > 50) go(-1);
            }}
          >
            <CardBody
              item={item}
              reduced={reduced}
              position={index}
              total={items.length}
              onPrev={() => go(-1)}
              onNext={() => go(1)}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Position rail on the right edge */}
      <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 flex-col gap-2 md:flex" style={{ zIndex: 4 }}>
        {items.map((it, i) => (
          <button
            key={it.id}
            type="button"
            aria-label={`Show ${it.title}`}
            aria-current={i === index}
            onClick={() => jump(i)}
            className="group flex h-5 w-3 items-center justify-center focus-visible:outline-none"
          >
            <span
              className="block w-[3px] rounded-full bg-white/25 transition-all duration-300 group-hover:bg-white/60 group-focus-visible:bg-white"
              style={{
                height: i === index ? 22 : 10,
                background: i === index ? item.accent : undefined,
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

type BodyProps = {
  item: DeckItem;
  reduced: boolean;
  position: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
};

function CardBody({ item, reduced, position, total, onPrev, onNext }: BodyProps) {
  const title = useTypewriter(item.title, { speed: TIMING.titleSpeed, delay: 120, instant: reduced });
  const desc = useTypewriter(item.description, {
    speed: TIMING.descSpeed,
    delay: TIMING.descDelay,
    instant: reduced,
  });

  const caret = (
    <span
      aria-hidden
      className="ml-0.5 inline-block h-[0.95em] w-[0.5ch] translate-y-[0.12em] animate-pulse"
      style={{ background: item.accent }}
    />
  );

  return (
    <div
      className="grid gap-6 p-5 items-start md:min-h-[380px] md:grid-cols-[400px_1fr] md:gap-8 md:p-8 md:items-center"
      style={{ "--accent": item.accent } as CSSProperties}
    >
      <Visual item={item} reduced={reduced} />

      <div className="flex min-w-0 flex-col">
        <h1 className="text-2xl font-semibold leading-tight tracking-tight text-white md:text-3xl">
          <span className="sr-only">{item.title}</span>
          <span aria-hidden>
            {title.text}
            {!title.done && caret}
          </span>
        </h1>
        <p className="mt-1 text-sm text-white/55">{item.meta}</p>

        <p className="mt-4 max-w-[62ch] text-[15px] leading-relaxed text-white/75 min-h-[4.5rem] sm:min-h-[3.75rem]">
          <span className="sr-only">{item.description}</span>
          <span aria-hidden>
            {desc.text}
            {title.done && !desc.done && caret}
          </span>
        </p>

        <div className="mt-5 grid grid-cols-3 gap-4 border-t border-white/10 pt-4">
          {item.stats.slice(0, 3).map((s) => (
            <Stat key={s.label} stat={s} accent={item.accent} reduced={reduced} />
          ))}
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-3 pt-6">
          {item.actions.map((a) => (
            <ActionButton key={a.label} action={a} accent={item.accent} />
          ))}

          <div className="ml-auto flex items-center gap-2 text-xs text-white/50">
            <button
              type="button"
              onClick={onPrev}
              disabled={position === 0}
              aria-label="Previous"
              className="grid h-8 w-8 place-items-center rounded-full border border-white/15 transition hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60"
            >
              <Chevron dir="left" />
            </button>
            <span className="tabular-nums" aria-hidden>
              {position + 1} / {total}
            </span>
            <button
              type="button"
              onClick={onNext}
              disabled={position === total - 1}
              aria-label="Next"
              className="grid h-8 w-8 place-items-center rounded-full border border-white/15 transition hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60"
            >
              <Chevron dir="right" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Visual({ item, reduced }: { item: DeckItem; reduced: boolean }) {
  const initials = item.title
    .split(/[\s:_-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  return (
    <motion.div
      className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-white/10 bg-[#080c11] md:aspect-auto md:h-full md:min-h-[260px] shadow-inner flex items-center justify-center p-2"
      style={{
        backgroundImage: `radial-gradient(circle at 50% 50%, color-mix(in srgb, ${item.accent} 15%, transparent), transparent 75%)`,
      }}
      initial={reduced ? false : { opacity: 0, rotate: -2, y: 16 }}
      animate={{ opacity: 1, rotate: 0, y: 0 }}
      transition={{ type: "spring", stiffness: 180, damping: 22, delay: 0.08 }}
    >
      {item.image ? (
        <div className="relative h-full w-full flex items-center justify-center">
          <img
            src={item.image}
            alt={item.imageAlt ?? item.title}
            loading="lazy"
            decoding="async"
            className="max-h-full max-w-full w-auto h-auto rounded-lg object-contain drop-shadow-2xl transition-transform duration-300 hover:scale-[1.02]"
          />
        </div>
      ) : (
        <div className="absolute inset-0 grid place-items-center">
          <div
            aria-hidden
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
          <span className="relative text-5xl font-bold tracking-tight" style={{ color: item.accent }}>
            {initials}
          </span>
        </div>
      )}
    </motion.div>
  );
}

function Stat({ stat, accent, reduced }: { stat: DeckStat; accent: string; reduced: boolean }) {
  const isNumber = typeof stat.value === "number";
  const n = useCountUp(isNumber ? (stat.value as number) : 0, {
    duration: 900,
    delay: TIMING.statsDelay,
    instant: reduced || !isNumber,
  });
  const decimals = stat.decimals ?? 0;
  const shown = isNumber
    ? n.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    : String(stat.value);

  return (
    <div className="min-w-0 border-l-2 pl-3" style={{ borderColor: accent }}>
      <div className="truncate text-xl font-semibold tabular-nums text-white md:text-2xl">
        {stat.prefix}
        {shown}
        {stat.suffix}
      </div>
      <div className="mt-0.5 text-xs leading-snug text-white/50">{stat.label}</div>
    </div>
  );
}

function ActionButton({ action, accent }: { action: DeckAction; accent: string }) {
  const primary = (action.variant ?? "primary") === "primary";
  const base =
    "inline-flex items-center rounded-md px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70";
  const look = primary
    ? "text-black shadow-[3px_3px_0_0_rgba(0,0,0,0.65)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_0_rgba(0,0,0,0.65)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
    : "border border-white/20 text-white/85 hover:bg-white/10";
  const style = primary ? { background: accent } : undefined;

  if (action.href) {
    return (
      <a href={action.href} target="_blank" rel="noopener noreferrer" className={`${base} ${look}`} style={style}>
        {action.label}
      </a>
    );
  }
  return (
    <button type="button" onClick={action.onClick} className={`${base} ${look}`} style={style}>
      {action.label}
    </button>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
      <path d={dir === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
