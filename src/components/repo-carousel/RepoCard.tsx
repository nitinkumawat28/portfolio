import React from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";
import type { DeckItem } from "../deck/types";
import { clamp, smoothstep, wrapOffset } from "./cardMath";
import {
  siTypescript,
  siJavascript,
  siPython,
  siCplusplus,
  siC,
  siHtml5,
  siCss,
  siAstro,
  siReact,
  siRust,
  siGo,
  siPhp,
  siRuby,
  siSwift
} from "simple-icons";
import { Star, GitFork, GitBranch } from "lucide-react";

const LANGUAGE_SVGS: Record<string, string> = {
  TypeScript: siTypescript.path,
  JavaScript: siJavascript.path,
  Python: siPython.path,
  "C++": siCplusplus.path,
  C: siC.path,
  HTML: siHtml5.path,
  HTML5: siHtml5.path,
  CSS: siCss.path,
  CSS3: siCss.path,
  Astro: siAstro.path,
  React: siReact.path,
  Rust: siRust.path,
  Go: siGo.path,
  PHP: siPhp.path,
  Ruby: siRuby.path,
  Swift: siSwift.path,
};

type Props = {
  item: DeckItem;
  index: number;
  scroll: MotionValue<number>;
  velocity: MotionValue<number>;
  total: number;
  prefersReducedMotion: boolean;
  onSelect: () => void;
};

export const RepoCard = React.memo(function RepoCard({
  item,
  index,
  scroll,
  velocity,
  total,
  prefersReducedMotion,
  onSelect,
}: Props) {
  // Continuous offset wrapped into [-N/2, N/2]
  const rawOffset = useTransform(scroll, (s) => wrapOffset(index - s, total));

  // Single unified transform calculation for maximum 60fps GPU compositor performance
  const transform = useTransform([rawOffset, velocity], ([o, v]) => {
    const offset = o as number;
    const vel = v as number;

    const x = offset * 330;
    if (prefersReducedMotion) {
      return `translate3d(${x}px, 0, 0)`;
    }

    const scale = 1 - 0.14 * Math.min(Math.abs(offset), 2);
    const z = -120 * Math.min(Math.abs(offset), 2);
    const rotY = clamp(offset * 8 - vel * 35, -75, 75);

    const t = smoothstep(1.4, 2.8, Math.abs(offset));
    const scaleX = 1 + 0.35 * t * t;
    const skewY = Math.sign(offset) * 5 * t;

    return `translate3d(${x}px, 0, ${z}px) scale(${scale}) scaleX(${scaleX}) rotateY(${rotY}deg) skewY(${skewY}deg)`;
  });

  const transformOrigin = useTransform(rawOffset, (o) => (o < 0 ? "right center" : "left center"));

  const opacity = useTransform(rawOffset, (o) => {
    const absO = Math.abs(o);
    if (absO > 3.4) return 0;
    if (absO > 2.4) return clamp(1 - (absO - 2.4), 0, 1);
    return 1;
  });

  const visibility = useTransform(rawOffset, (o) => (Math.abs(o) > 3.4 ? "hidden" : "visible"));
  const zIndex = useTransform(rawOffset, (o) => Math.round(100 - Math.abs(o) * 10));

  // Subtle rim glow opacity on outer stretched cards
  const rimOpacity = useTransform(rawOffset, (o) => {
    if (prefersReducedMotion) return 0;
    return smoothstep(1.4, 2.8, Math.abs(o));
  });

  // Extract repo details
  const stars = item.stats.find((s) => s.label.toLowerCase().includes("star"))?.value ?? 0;
  const forks = item.stats.find((s) => s.label.toLowerCase().includes("fork"))?.value ?? 0;
  const branch = item.stats.find((s) => s.label.toLowerCase().includes("branch"))?.value ?? "main";
  const langStat = item.stats.find((s) => s.label.toLowerCase().includes("language"))?.value;
  const mainLang = typeof langStat === "string" ? langStat : "Code";

  const svgPath = LANGUAGE_SVGS[mainLang];

  // Year of last push
  const yearMatch = item.meta.match(/\b(202\d)\b/) || ["2026"];
  const year = yearMatch[0] || "2026";

  const accentColor = item.accent || "#3b82f6";

  return (
    <motion.div
      onClick={onSelect}
      style={{
        transform,
        transformOrigin,
        opacity,
        visibility,
        zIndex,
        backfaceVisibility: "visible",
        WebkitBackfaceVisibility: "visible",
      }}
      className="absolute top-1/2 left-1/2 -ml-[135px] -mt-[195px] sm:-ml-[155px] sm:-mt-[205px] h-[390px] w-[270px] sm:h-[410px] sm:w-[310px] cursor-pointer rounded-[28px] select-none transform-gpu"
    >
      {/* Outer Rim Glow (fades in when stretched) */}
      <motion.div
        style={{ opacity: rimOpacity }}
        className="pointer-events-none absolute inset-0 rounded-[28px] overflow-hidden z-20 border-2 border-cyan-400/50 shadow-[0_0_20px_rgba(56,189,248,0.4)]"
      />

      {/* Card Face */}
      <div
        className="relative h-full w-full rounded-[28px] overflow-hidden flex flex-col justify-between p-6 sm:p-7 text-white border border-white/10"
        style={{
          background: `radial-gradient(circle at 18% 15%, rgba(255, 255, 255, 0.12) 0%, transparent 55%), linear-gradient(155deg, ${accentColor}33 0%, #0d121a 50%, #05070a 100%)`,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.85)",
        }}
      >
        {/* Top Header: Title & Description */}
        <div className="relative z-10">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-[18px] sm:text-[20px] font-bold text-white tracking-tight truncate leading-snug">
              {item.title}
            </h3>
            <span
              className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: accentColor }}
            />
          </div>
          <p className="mt-2 text-[13px] text-white/75 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Center: Language Logo */}
        <div className="relative z-10 flex flex-1 items-center justify-center my-3 pointer-events-none">
          {svgPath ? (
            <svg
              viewBox="0 0 24 24"
              className="h-[75px] w-[75px] sm:h-[88px] sm:w-[88px] text-white/30 drop-shadow-[0_2px_10px_rgba(255,255,255,0.1)]"
              fill="currentColor"
            >
              <path d={svgPath} />
            </svg>
          ) : (
            <div className="flex h-[75px] w-[75px] sm:h-[88px] sm:w-[88px] items-center justify-center text-5xl font-bold text-white/30">
              {(item.title[0] || "G").toUpperCase()}
            </div>
          )}
        </div>

        {/* Bottom Details & Metrics */}
        <div className="relative z-10 flex flex-col gap-2.5">
          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-3 text-[12px] font-medium text-white/60">
            <span className="flex items-center gap-1">
              <Star size={13} className="text-amber-400" />
              {stars}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <GitFork size={13} className="text-blue-400" />
              {forks}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1 text-white/45">
              <GitBranch size={12} />
              {branch}
            </span>
          </div>

          {/* Bottom Row */}
          <div className="flex items-center justify-between text-[13px] font-medium text-white/80 border-t border-white/10 pt-2.5">
            <span className="flex items-center gap-1.5 font-semibold">
              <span
                className="h-2 w-2 rounded-full inline-block"
                style={{ backgroundColor: accentColor }}
              />
              {mainLang}
            </span>
            <span className="text-white/50 text-xs">{year}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
});
