import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { GitFork, Globe, Rocket, ArrowUpRight } from "lucide-react";
import type { DeckItem } from "./types";
import { RepoCarousel } from "../repo-carousel/RepoCarousel";

/** GitHub credentials */
const GITHUB_USERNAME = "nitinkumawat28";
const LINKEDIN_URL = "https://www.linkedin.com/in/nitin-kumawat-25367a311/";
const PINNED: string[] = ["healthsaral", "portfolio", "hrms", "scented-aura"];
const MAX_REPOS = 12;
const CACHE_MINUTES = 60; // 1 hour cache

type Repo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
  default_branch?: string;
  topics?: string[];
  size?: number;
};

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3b82f6",
  JavaScript: "#facc15",
  Python: "#60a5fa",
  "C++": "#f472b6",
  C: "#94a3b8",
  HTML: "#fb923c",
  CSS: "#a78bfa",
  "Jupyter Notebook": "#fb923c",
  Astro: "#c084fc",
};
const DEFAULT_ACCENT = "#22c55e";

function LinkedinIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function GithubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

const STATS = [
  {
    id: "linkedin",
    value: "600+",
    label: "LinkedIn Connections",
    subtext: "Professional network",
    icon: LinkedinIcon,
    color: "#38bdf8",
    href: LINKEDIN_URL,
  },
  {
    id: "repos",
    value: "5",
    label: "Public Repos",
    subtext: "Open source projects",
    icon: GitFork,
    color: "#34d399",
    href: `https://github.com/${GITHUB_USERNAME}?tab=repositories`,
  },
  {
    id: "restaurants",
    value: "50+",
    label: "Restaurants Served",
    subtext: "Via Menuura Spring Boot APIs",
    icon: Globe,
    color: "#c084fc",
  },
  {
    id: "vercel",
    value: "3",
    label: "Apps Live on Vercel",
    subtext: "Production deployments",
    icon: Rocket,
    color: "#fbbf24",
  },
];

/** Pre-warmed initial repos for instantaneous (0ms) render with zero delay */
const INITIAL_REPOS: DeckItem[] = [
  {
    id: "repo-healthsaral",
    title: "HealthSaral",
    meta: "Astro & Gemini API, 2026",
    description: "AI-powered lab report analyzer that translates complex medical blood tests into clear, plain-language summaries using Gemini API, Cloudflare R2, and Supabase.",
    stats: [
      { value: 0, label: "Stars" },
      { value: 0, label: "Forks" },
      { value: "Astro", label: "Language" },
      { value: "main", label: "Branch" },
    ],
    accent: "#38bdf8",
    actions: [
      { label: "View Code", href: "https://github.com/nitinkumawat28/HealthSaral", variant: "primary" },
      { label: "Live Demo", href: "https://healthsaral.in/", variant: "ghost" },
    ],
    tags: ["Astro", "Gemini API", "Supabase", "Cloudflare R2", "Cloudflare Workers", "Tailwind CSS"],
  },
  {
    id: "repo-portfolio",
    title: "Portfolio",
    meta: "React 19 & TypeScript, 2026",
    description: "Interactive desktop operating system portfolio featuring draggable multi-window widgets, 3D WebGL ambient shaders, and live GitHub synchronization.",
    stats: [
      { value: 0, label: "Stars" },
      { value: 0, label: "Forks" },
      { value: "TypeScript", label: "Language" },
      { value: "main", label: "Branch" },
    ],
    accent: "#a855f7",
    actions: [
      { label: "View Code", href: "https://github.com/nitinkumawat28/portfolio", variant: "primary" },
      { label: "Live Demo", href: "https://nitinkumawat.me/", variant: "ghost" },
    ],
    tags: ["React 19", "TypeScript", "Tailwind CSS", "WebGL / OGL", "Vite"],
  },
  {
    id: "repo-hrms",
    title: "HRMS",
    meta: "React.js & Neon PostgreSQL, 2026",
    description: "Full-stack enterprise HR management system featuring Admin and Employee dashboards, Neon PostgreSQL, Gemini AI chatbot, OCR onboarding, and Docker CI/CD.",
    stats: [
      { value: 0, label: "Stars" },
      { value: 0, label: "Forks" },
      { value: "JavaScript", label: "Language" },
      { value: "main", label: "Branch" },
    ],
    accent: "#f59e0b",
    actions: [
      { label: "View Code", href: "https://github.com/nitinkumawat28/HRMS", variant: "primary" },
    ],
    tags: ["React.js", "Node.js", "Neon PostgreSQL", "Gemini API", "Cloud Vision OCR", "Docker"],
  },
  {
    id: "repo-scented-aura-boutique",
    title: "Scented Aura Boutique",
    meta: "TypeScript & React, 2026",
    description: "Luxury e-commerce storefront for artisanal fragrances, featuring dynamic catalog filtering, responsive product showcases, and a seamless shopping cart experience.",
    stats: [
      { value: 0, label: "Stars" },
      { value: 0, label: "Forks" },
      { value: "TypeScript", label: "Language" },
      { value: "main", label: "Branch" },
    ],
    accent: "#3b82f6",
    actions: [
      { label: "View Code", href: "https://github.com/nitinkumawat28/scented-aura-boutique", variant: "primary" },
    ],
    tags: ["TypeScript", "React", "Tailwind CSS", "Vite", "E-Commerce"],
  },
];

export function GitReposFolderView() {
  // Instant render with pre-warmed / cached data, zero waiting or skeleton flash
  const [items, setItems] = useState<DeckItem[]>(() => {
    try {
      const cached =
        localStorage.getItem(`gh-repos-v9:${GITHUB_USERNAME}`) ||
        sessionStorage.getItem(`gh-repos-v9:${GITHUB_USERNAME}`);
      if (cached) {
        const { data } = JSON.parse(cached);
        if (Array.isArray(data) && data.length > 0) {
          return pick(data).map(toItem);
        }
      }
    } catch {}
    return INITIAL_REPOS;
  });

  // Background silent revalidation without UI blocking or unnecessary re-renders
  useEffect(() => {
    if (GITHUB_USERNAME === "YOUR_GITHUB_USERNAME") return;

    const controller = new AbortController();
    loadRepos(GITHUB_USERNAME, controller.signal)
      .then((repos) => {
        const mapped = repos.map(toItem);
        if (mapped.length > 0) {
          setItems((prev) => {
            // Check if items changed to avoid unneeded re-renders
            const prevIds = prev.map((p) => p.id).join(",");
            const nextIds = mapped.map((m) => m.id).join(",");
            if (prevIds === nextIds) {
              const hasDiff = mapped.some((m, i) => {
                const p = prev[i];
                return (
                  p.stats[0]?.value !== m.stats[0]?.value ||
                  p.stats[1]?.value !== m.stats[1]?.value
                );
              });
              if (!hasDiff) return prev;
            }
            return mapped;
          });
        }
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        console.warn("GitHub background fetch check", err);
      });
    return () => controller.abort();
  }, []);

  const filteredItems = useMemo(() => {
    const list = items.filter((it) => {
      const titleLower = it.title.toLowerCase();
      return !EXCLUDED_PATTERNS.some((p) => titleLower.includes(p));
    });
    return list.length > 0 ? list : INITIAL_REPOS;
  }, [items]);

  return (
    <section className="relative w-full max-w-6xl mx-auto flex flex-col gap-3 py-1 select-none">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-emerald-400 text-base font-bold">&lt;</span>
          <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-white font-mono">
            GITHUB_REPOS
          </h2>
          <span className="font-mono text-emerald-400 text-base font-bold">&gt;</span>
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-0.5 text-[11px] font-mono text-emerald-400 shadow-sm self-start sm:self-auto">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>// Live data fetched from GitHub API</span>
        </div>
      </div>

      {/* 4 Stat Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 px-1">
        {STATS.map((stat, i) => {
          const Icon = stat.icon;
          const CardInner = (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: i * 0.04, ease: "easeOut" }}
              className="group relative flex items-center justify-between rounded-xl border border-white/10 bg-[#070a10]/85 p-3 sm:p-3.5 backdrop-blur-xl transition-all duration-200 hover:border-white/25 hover:bg-white/[0.05] shadow-lg overflow-hidden h-full"
            >
              <div
                className="pointer-events-none absolute -right-5 -top-5 h-16 w-16 rounded-full blur-xl opacity-20 transition-opacity duration-200 group-hover:opacity-35"
                style={{ backgroundColor: stat.color }}
              />

              <div className="flex items-center gap-3">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 transition-transform duration-200 group-hover:scale-105"
                  style={{ color: stat.color }}
                >
                  <Icon size={16} />
                </div>
                <div>
                  <div
                    className="text-xl sm:text-2xl font-black tracking-tight text-white font-sans leading-none"
                    style={{ textShadow: `0 0 20px ${stat.color}40` }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-[11px] sm:text-xs font-semibold text-white/90 truncate mt-1">
                    {stat.label}
                  </div>
                  <div className="text-[10px] text-white/45 truncate">
                    {stat.subtext}
                  </div>
                </div>
              </div>

              {stat.href && (
                <ArrowUpRight
                  size={14}
                  className="text-white/30 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white shrink-0 ml-1"
                />
              )}
            </motion.div>
          );

          return stat.href ? (
            <a
              key={stat.id}
              href={stat.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${stat.label}: ${stat.value}`}
              className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              {CardInner}
            </a>
          ) : (
            <div key={stat.id}>{CardInner}</div>
          );
        })}
      </div>

      {/* 3D Repos Carousel - Immediate Smooth Render */}
      <div className="w-full">
        <RepoCarousel items={filteredItems} />
      </div>

      {/* Button Below Repos: Show All Repositories on GitHub */}
      <div className="flex flex-col items-center justify-center gap-1.5 pt-1 pb-4 px-4">
        <a
          href={`https://github.com/${GITHUB_USERNAME}?tab=repositories`}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative inline-flex items-center gap-2.5 rounded-xl border border-white/20 bg-gradient-to-r from-white/10 via-white/5 to-white/10 px-7 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xl backdrop-blur-xl transition-all duration-200 hover:scale-[1.02] hover:border-white/40 hover:bg-white/15 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] active:scale-95 cursor-pointer"
        >
          <GithubIcon size={17} />
          <span>Show all repositories</span>
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-medium text-white/75 group-hover:bg-white/20 transition-colors">
            GitHub
          </span>
          <ArrowUpRight
            size={14}
            className="text-white/60 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
          />
        </a>
        <p className="text-[11px] text-white/40 font-mono text-center">
          Explore all public repositories, contributions &amp; code on GitHub
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

const EXCLUDED_PATTERNS = [
  "tablemate",
  "template-pos",
  "template_pos",
  "dbt_labs",
  "dbt-labs",
  "dbt",
];

async function loadRepos(user: string, signal: AbortSignal): Promise<Repo[]> {
  const cacheKey = `gh-repos-v9:${user}`;
  try {
    const cached = localStorage.getItem(cacheKey) || sessionStorage.getItem(cacheKey);
    if (cached) {
      const { at, data } = JSON.parse(cached) as { at: number; data: Repo[] };
      if (Date.now() - at < CACHE_MINUTES * 60_000) return pick(data);
    }
  } catch {
    /* storage can be unavailable, ignore */
  }

  const res = await fetch(`https://api.github.com/users/${user}/repos?sort=pushed&per_page=100`, {
    signal,
    headers: { Accept: "application/vnd.github+json" },
  });
  if (!res.ok) throw new Error(`GitHub responded ${res.status}`);
  const data = (await res.json()) as Repo[];

  try {
    const payload = JSON.stringify({ at: Date.now(), data });
    localStorage.setItem(cacheKey, payload);
    sessionStorage.setItem(cacheKey, payload);
  } catch {
    /* ignore */
  }
  return pick(data);
}

function pick(all: Repo[]): Repo[] {
  const usable = all.filter((r) => {
    if (r.fork || r.archived) return false;
    const nameLower = r.name.toLowerCase();
    for (const pat of EXCLUDED_PATTERNS) {
      if (nameLower.includes(pat)) return false;
    }
    return true;
  });
  const pinned = PINNED.map((pin) =>
    usable.find((r) => r.name.toLowerCase().includes(pin.toLowerCase()))
  ).filter((r): r is Repo => Boolean(r));

  const rest = usable
    .filter((r) => !PINNED.some((pin) => r.name.toLowerCase().includes(pin.toLowerCase())))
    .sort((a, b) => +new Date(b.pushed_at) - +new Date(a.pushed_at));

  return [...pinned, ...rest].slice(0, MAX_REPOS);
}

function toItem(r: Repo): DeckItem {
  const lang = r.language ?? "Code";
  const nameLower = r.name.toLowerCase();

  let title = r.name;
  if (nameLower === "portfolio") {
    title = "Portfolio";
  } else if (nameLower.includes("healthsaral")) {
    title = "HealthSaral";
  } else if (nameLower.includes("hrms")) {
    title = "HRMS";
  } else if (nameLower.includes("scented-aura") || nameLower.includes("scented")) {
    title = "Scented Aura Boutique";
  }

  const actions: DeckItem["actions"] = [
    { label: "View Code", href: r.html_url, variant: "primary" },
  ];
  if (r.homepage) {
    const href = nameLower.includes("healthsaral")
      ? "https://healthsaral.in/"
      : nameLower.includes("portfolio")
      ? "https://nitinkumawat.me/"
      : r.homepage.startsWith("http") ? r.homepage : `https://${r.homepage}`;
    actions.push({ label: "Live Demo", href, variant: "ghost" });
  } else if (nameLower.includes("healthsaral")) {
    actions.push({ label: "Live Demo", href: "https://healthsaral.in/", variant: "ghost" });
  } else if (nameLower.includes("portfolio")) {
    actions.push({ label: "Live Demo", href: "https://nitinkumawat.me/", variant: "ghost" });
  }

  let tags: string[] = [];
  let description = r.description?.trim() || "Open-source repository on GitHub.";

  if (nameLower.includes("healthsaral")) {
    description = "AI-powered lab report analyzer that translates complex medical blood tests into clear, plain-language summaries using Gemini API, Cloudflare R2, and Supabase.";
    tags = ["Astro", "Gemini API", "Supabase", "Cloudflare R2", "Cloudflare Workers", "Tailwind CSS"];
  } else if (nameLower.includes("portfolio")) {
    description = "Interactive desktop operating system portfolio featuring draggable multi-window widgets, 3D WebGL ambient shaders, and live GitHub synchronization.";
    tags = ["React 19", "TypeScript", "Tailwind CSS", "WebGL / OGL", "Vite"];
  } else if (nameLower.includes("hrms")) {
    description = "Full-stack enterprise HR management system featuring Admin and Employee dashboards, Neon PostgreSQL, Gemini AI chatbot, OCR onboarding, and Docker CI/CD.";
    tags = ["React.js", "Node.js", "Neon PostgreSQL", "Gemini API", "Cloud Vision OCR", "Docker"];
  } else if (nameLower.includes("scented-aura") || nameLower.includes("scented")) {
    description = "Luxury e-commerce storefront for artisanal fragrances, featuring dynamic catalog filtering, responsive product showcases, and a seamless shopping cart experience.";
    tags = ["TypeScript", "React", "Tailwind CSS", "Vite", "E-Commerce"];
  } else {
    tags = [lang, ...(r.topics?.slice(0, 3) || ["Open Source", "Full-Stack"])];
  }

  const stableId = `repo-${nameLower.replace(/[^a-z0-9]/g, "-")}`;

  return {
    id: stableId,
    title,
    meta: `${lang}, updated ${timeAgo(r.pushed_at)}`,
    description,
    stats: [
      { value: r.stargazers_count, label: "Stars" },
      { value: r.forks_count, label: "Forks" },
      { value: lang, label: "Language" },
      { value: r.default_branch || "main", label: "Branch" },
    ],
    accent: LANGUAGE_COLORS[lang] ?? DEFAULT_ACCENT,
    actions,
    tags,
  };
}

function timeAgo(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days < 1) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years > 1 ? "s" : ""} ago`;
}
