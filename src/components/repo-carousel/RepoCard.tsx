import React from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";
import type { DeckItem } from "../deck/types";
import { clamp } from "./cardMath";
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
import { Star, GitFork, ArrowUpRight, Code2, ExternalLink } from "lucide-react";

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
  prefersReducedMotion: boolean;
  onSelect: () => void;
};

export const RepoCard = React.memo(function RepoCard({
  item,
  index,
  scroll,
  prefersReducedMotion,
  onSelect,
}: Props) {
  // Linear offset from current scroll position
  const rawOffset = useTransform(scroll, (s) => index - s);

  // Smooth 3D transform for elegant coverflow card sliding
  const transform = useTransform(rawOffset, (offset) => {
    const x = offset * 320;
    if (prefersReducedMotion) {
      return `translate3d(${x}px, 0, 0)`;
    }

    const absOffset = Math.abs(offset);
    const scale = Math.max(0.84, 1 - absOffset * 0.12);
    const z = -Math.min(absOffset * 85, 240);
    const rotY = clamp(offset * -14, -28, 28);

    return `translate3d(${x}px, 0, ${z}px) scale(${scale}) rotateY(${rotY}deg)`;
  });

  const opacity = useTransform(rawOffset, (offset) => {
    const absO = Math.abs(offset);
    if (absO > 2.6) return 0;
    if (absO > 1.8) return clamp(1 - (absO - 1.8) * 1.25, 0, 1);
    return clamp(1 - absO * 0.22, 0.45, 1);
  });

  const visibility = useTransform(rawOffset, (offset) => (Math.abs(offset) > 2.6 ? "hidden" : "visible"));
  const zIndex = useTransform(rawOffset, (offset) => Math.round(100 - Math.abs(offset) * 10));

  // Extract repo details
  const stars = item.stats.find((s) => s.label.toLowerCase().includes("star"))?.value ?? 0;
  const forks = item.stats.find((s) => s.label.toLowerCase().includes("fork"))?.value ?? 0;
  const langStat = item.stats.find((s) => s.label.toLowerCase().includes("language"))?.value;
  const mainLang = typeof langStat === "string" ? langStat : "Code";

  const svgPath = LANGUAGE_SVGS[mainLang];

  // Year of last push
  const yearMatch = item.meta.match(/\b(202\d)\b/) || ["2026"];
  const year = yearMatch[0] || "2026";

  const accentColor = item.accent || "#3b82f6";
  const tags = item.tags || [mainLang, "Open Source"];

  const primaryAction = item.actions.find((a) => a.variant === "primary") || item.actions[0];
  const liveAction = item.actions.find((a) => a.label.toLowerCase().includes("live"));

  return (
    <motion.div
      onClick={onSelect}
      style={{
        transform,
        transformOrigin: "center center",
        opacity,
        visibility,
        zIndex,
        backfaceVisibility: "visible",
        WebkitBackfaceVisibility: "visible",
      }}
      className="absolute top-1/2 left-1/2 -ml-[145px] -mt-[195px] sm:-ml-[165px] sm:-mt-[205px] h-[390px] w-[290px] sm:h-[410px] sm:w-[330px] cursor-pointer rounded-[28px] select-none transform-gpu"
    >
      {/* Card Face */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
        className="relative h-full w-full rounded-[28px] overflow-hidden flex flex-col justify-between p-6 sm:p-7 text-white border border-white/12 shadow-2xl"
        style={{
          background: `radial-gradient(circle at 18% 15%, rgba(255, 255, 255, 0.12) 0%, transparent 55%), linear-gradient(155deg, ${accentColor}24 0%, #0c1018 50%, #05070c 100%)`,
          boxShadow: "0 20px 45px -10px rgba(0, 0, 0, 0.8)",
        }}
      >
        {/* Subtle Background Watermark Logo */}
        {svgPath && (
          <div className="pointer-events-none absolute -right-4 -bottom-4 opacity-[0.05] transform rotate-12">
            <svg viewBox="0 0 24 24" className="h-[160px] w-[160px] text-white" fill="currentColor">
              <path d={svgPath} />
            </svg>
          </div>
        )}

        {/* Top Header: Prominent Heading & Language Tag */}
        <div className="relative z-10">
          <div className="flex items-start justify-between gap-3 mb-2.5">
            <h3 className="text-[26px] sm:text-[29px] font-black text-white tracking-tight leading-tight truncate">
              {item.title}
            </h3>
            <span
              className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full shadow-[0_0_8px_currentColor]"
              style={{ backgroundColor: accentColor, color: accentColor }}
            />
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border border-white/10 bg-white/5">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
            <span className="text-white/90">{mainLang}</span>
          </div>

          <p className="mt-3 text-[13px] sm:text-[13.5px] text-white/70 line-clamp-3 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Middle: Clean Tech Stack Pills */}
        <div className="relative z-10 my-auto py-2">
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-lg border border-white/10 bg-white/[0.04] text-[11px] sm:text-xs font-medium text-white/80"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom: Clean Metrics & Action Buttons */}
        <div className="relative z-10 flex flex-col gap-3 border-t border-white/10 pt-3">
          {/* Quick Metrics */}
          <div className="flex items-center justify-between text-xs font-medium text-white/55">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Star size={13} className="text-amber-400" />
                {stars}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <GitFork size={13} className="text-blue-400" />
                {forks}
              </span>
            </div>
            <span className="text-white/40 text-xs font-mono">{year}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <a
              href={primaryAction?.href || `https://github.com/nitinkumawat28/${item.title}`}
              target="_blank"
              rel="noopener noreferrer"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                const url = primaryAction?.href || `https://github.com/nitinkumawat28/${item.title}`;
                if (url) window.open(url, "_blank", "noopener,noreferrer");
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white text-black font-bold text-xs shadow-md transition-transform hover:scale-[1.03] active:scale-95 cursor-pointer z-20"
            >
              <Code2 size={14} />
              <span>View Code</span>
              <ArrowUpRight size={13} />
            </a>

            {liveAction?.href && (
              <a
                href={liveAction.href}
                target="_blank"
                rel="noopener noreferrer"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(liveAction.href, "_blank", "noopener,noreferrer");
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-white/20 bg-white/5 text-white font-semibold text-xs transition-colors hover:bg-white/15 active:scale-95 cursor-pointer z-20"
              >
                <ExternalLink size={13} />
                <span>Live Demo</span>
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});

export default RepoCard;
