import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ExternalLink,
  Star,
  GitFork,
  ArrowUpRight,
  GitBranch,
  Code2,
  Copy,
  Check,
  Calendar
} from "lucide-react";
import type { DeckItem } from "../deck/types";

type Props = {
  item: DeckItem;
};

export function RepoInfo({ item }: Props) {
  const [copied, setCopied] = useState(false);

  const primaryAction = item.actions.find((a) => a.variant === "primary") || item.actions[0];
  const liveAction = item.actions.find((a) => a.label.toLowerCase().includes("live"));

  const stars = item.stats.find((s) => s.label.toLowerCase().includes("star"))?.value ?? 0;
  const forks = item.stats.find((s) => s.label.toLowerCase().includes("fork"))?.value ?? 0;
  const branch = item.stats.find((s) => s.label.toLowerCase().includes("branch"))?.value ?? "main";
  const langStat = item.stats.find((s) => s.label.toLowerCase().includes("language"))?.value;
  const mainLang = typeof langStat === "string" ? langStat : "Code";

  const repoUrl = primaryAction?.href || `https://github.com/nitinkumawat28/${item.title}`;
  const cloneCmd = `git clone ${repoUrl}.git`;

  const handleCopyClone = () => {
    navigator.clipboard?.writeText(cloneCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative mx-auto flex max-w-2xl flex-col items-center text-center px-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
          className="flex flex-col items-center w-full"
        >
          {/* GitHub breadcrumb & repo title */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-white/40 tracking-wider">
              nitinkumawat28 /
            </span>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {item.title}
            </h3>
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: item.accent }}
            />
          </div>

          {/* Description */}
          <p className="mt-2 max-w-lg text-xs sm:text-sm leading-relaxed text-white/70">
            {item.description}
          </p>

          {/* Detailed Metadata Badges */}
          <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2 text-xs">
            {/* Stars */}
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-white/80">
              <Star size={12} className="text-amber-400" />
              <span className="font-semibold">{stars}</span> stars
            </span>

            {/* Forks */}
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-white/80">
              <GitFork size={12} className="text-blue-400" />
              <span className="font-semibold">{forks}</span> forks
            </span>

            {/* Branch */}
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-white/60 font-mono">
              <GitBranch size={12} />
              {branch}
            </span>

            {/* Language */}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-white/80">
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: item.accent }} />
              {mainLang}
            </span>

            {/* Update time */}
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-white/50">
              <Calendar size={11} />
              {item.meta.includes(",") ? item.meta.split(",")[1].trim() : item.meta}
            </span>
          </div>

          {/* Action Buttons & Clone Command */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            {/* View Code Primary Button */}
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-white px-5 py-2 text-xs font-bold text-black shadow-lg transition-transform hover:scale-105 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              <Code2 size={15} />
              <span>View Code</span>
              <ArrowUpRight size={14} />
            </a>

            {/* Live Demo Button (if available) */}
            {liveAction?.href && (
              <a
                href={liveAction.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              >
                <ExternalLink size={13} />
                <span>Live Demo</span>
              </a>
            )}

            {/* Quick Clone Button */}
            <button
              type="button"
              onClick={handleCopyClone}
              title="Copy git clone command"
              className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 font-mono text-[11px] text-white/80 transition-all hover:border-white/30 hover:bg-white/10 active:scale-95"
            >
              {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
              <span>{copied ? "Copied clone command!" : "git clone"}</span>
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
