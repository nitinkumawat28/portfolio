import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import type { DeckItem } from "./types";

const RepoCarousel = lazy(() => import("../repo-carousel/RepoCarousel"));

/** 1. Put your GitHub username here. */
const GITHUB_USERNAME = "nitinkumawat28";
/** 2. Optional: repo names to show first, in this order. */
const PINNED: string[] = [];
const MAX_REPOS = 12;
const CACHE_MINUTES = 10;

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

/** Shown while loading fails or no username is set. Replace with your own repos. */
const FALLBACK: DeckItem[] = [
  {
    id: "fallback-1",
    title: "[repo-name]",
    meta: "[Language], updated [when]",
    description: "Set GITHUB_USERNAME in GitReposFolderView.tsx and your latest public repos will appear here automatically.",
    stats: [
      { value: 0, label: "Stars" },
      { value: 0, label: "Forks" },
      { value: "[Language]", label: "Main language" },
    ],
    accent: DEFAULT_ACCENT,
    actions: [],
  },
];

export function GitReposFolderView() {
  const [items, setItems] = useState<DeckItem[] | null>(() => 
    GITHUB_USERNAME === "YOUR_GITHUB_USERNAME" ? FALLBACK : null
  );
  const [note, setNote] = useState<string | null>(() =>
    GITHUB_USERNAME === "YOUR_GITHUB_USERNAME" ? "Add your GitHub username to show live repositories." : null
  );

  useEffect(() => {
    if (GITHUB_USERNAME === "YOUR_GITHUB_USERNAME") {
      return;
    }
    const controller = new AbortController();
    loadRepos(GITHUB_USERNAME, controller.signal)
      .then((repos) => {
        const mapped = repos.map(toItem);
        if (mapped.length === 0) {
          setItems(FALLBACK);
          setNote("No public repositories found yet.");
        } else {
          setItems(mapped);
        }
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        console.warn("GitHub fetch failed", err);
        setItems(FALLBACK);
        setNote("Could not reach GitHub right now. Showing a placeholder.");
      });
    return () => controller.abort();
  }, []);

  const content = useMemo(() => {
    if (!items) return <Skeleton />;
    const filtered = items.filter((it) => {
      const titleLower = it.title.toLowerCase();
      return !EXCLUDED_PATTERNS.some((p) => titleLower.includes(p));
    });
    return (
      <Suspense fallback={<Skeleton />}>
        <RepoCarousel items={filtered} />
      </Suspense>
    );
  }, [items]);

  return (
    <section className="relative w-full py-2">
      <div className="w-full">
        {content}
        {note && <p className="mt-4 text-center text-sm text-white/45">{note}</p>}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

const EXCLUDED_PATTERNS = [
  "tablemate",
  "template-pos",
  "template_pos",
  "portfolio",
  "dbt_labs",
  "dbt-labs",
  "dbt",
];

async function loadRepos(user: string, signal: AbortSignal): Promise<Repo[]> {
  const cacheKey = `gh-repos-v5:${user}`;
  try {
    const cached = sessionStorage.getItem(cacheKey);
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
    sessionStorage.setItem(cacheKey, JSON.stringify({ at: Date.now(), data }));
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
  const pinned = PINNED.map((n) => usable.find((r) => r.name === n)).filter((r): r is Repo => Boolean(r));
  const rest = usable
    .filter((r) => !PINNED.includes(r.name))
    .sort((a, b) => +new Date(b.pushed_at) - +new Date(a.pushed_at));
  return [...pinned, ...rest].slice(0, MAX_REPOS);
}

function toItem(r: Repo): DeckItem {
  const lang = r.language ?? "Code";
  const actions: DeckItem["actions"] = [
    { label: "View Code", href: r.html_url, variant: "primary" },
  ];
  if (r.homepage) {
    const href = r.homepage.startsWith("http") ? r.homepage : `https://${r.homepage}`;
    actions.push({ label: "Live Demo", href, variant: "ghost" });
  }
  return {
    id: String(r.id),
    title: r.name,
    meta: `${lang}, updated ${timeAgo(r.pushed_at)}`,
    description: r.description?.trim() || "Open-source repository on GitHub.",
    stats: [
      { value: r.stargazers_count, label: "Stars" },
      { value: r.forks_count, label: "Forks" },
      { value: lang, label: "Language" },
      { value: r.default_branch || "main", label: "Branch" },
    ],
    accent: LANGUAGE_COLORS[lang] ?? DEFAULT_ACCENT,
    actions,
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

function Skeleton() {
  return (
    <div
      className="mx-auto h-[340px] w-[min(92vw,960px)] animate-pulse rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl"
      role="status"
      aria-label="Loading repositories"
    />
  );
}
