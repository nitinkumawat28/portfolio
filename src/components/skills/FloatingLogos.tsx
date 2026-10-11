import React, { useEffect, useMemo, useRef, useState } from "react";
import { skillIcons } from "../../data/skillIcons";
import { mulberry32 } from "../../lib/seededRandom";

type LayerType = "far" | "mid" | "near";

export type FloatingLogoItem = {
  id: string;
  name: string;
  svgPath: string;
  projects?: string[];
  left: number;
  top: number;
  size: number;
  baseOpacity: number;
  layer: LayerType;
  floatDistance: number;
  driftDistance: number;
  duration: number;
  delay: number;
  rotation: number;
  responsiveTier: "mobile" | "tablet" | "desktop";
};

// Skills that exist on the skills page with project associations
const PAGE_SKILLS: Array<{ name: string; projects?: string[] }> = [
  { name: "C++", projects: [] },
  { name: "Python", projects: ["hrms"] },
  { name: "C", projects: [] },
  { name: "HTML5", projects: ["pos", "healthsaral", "hrms"] },
  { name: "JavaScript", projects: ["pos", "hrms"] },
  { name: "CSS3", projects: ["pos", "healthsaral", "hrms"] },
  { name: "Tailwind CSS", projects: ["pos", "healthsaral", "hrms"] },
  { name: "Semrush", projects: [] },
  { name: "Google Ads (Search, Display)", projects: [] },
  { name: "Conversion Tracking (GA4, GTM)", projects: ["healthsaral"] },
  { name: "Google Sheets", projects: [] },
  { name: "MySQL", projects: [] },
  { name: "Neon", projects: ["hrms"] },
  { name: "MongoDB", projects: [] },
  { name: "Docker", projects: ["hrms"] },
  { name: "Kubernetes", projects: [] },
  { name: "GitHub Actions", projects: ["hrms"] },
  { name: "Cloudflare", projects: ["healthsaral"] },
  { name: "Git", projects: ["pos", "healthsaral", "hrms"] },
  { name: "GitHub", projects: ["pos", "healthsaral", "hrms"] },
  { name: "Postman", projects: ["pos", "hrms"] },
  { name: "Cloudinary", projects: [] },
  { name: "Jira", projects: [] },
  { name: "Supabase", projects: ["healthsaral"] },
  { name: "Figma (UI/UX)", projects: ["pos", "healthsaral", "hrms"] },
];

function generateFloatingLogos(): FloatingLogoItem[] {
  const rnd = mulberry32(42069);

  // 1. Gather all unique brand logos that exist in skillIcons
  const candidates: Array<{ name: string; path: string; projects?: string[] }> = [];
  const seenPaths = new Set<string>();

  for (const s of PAGE_SKILLS) {
    const iconDef = skillIcons[s.name];
    if (iconDef && iconDef.kind === "brand" && iconDef.icon.path) {
      if (!seenPaths.has(iconDef.icon.path)) {
        seenPaths.add(iconDef.icon.path);
        candidates.push({
          name: s.name,
          path: iconDef.icon.path,
          projects: s.projects,
        });
      }
    }
  }

  // 2. 6 cols x 4 rows jittered grid on desktop = 24 cells.
  // Leave cells behind the top-left heading empty: (0,0), (1,0), (0,1), (1,1)
  const emptyCells = new Set(["0,0", "1,0", "0,1", "1,1"]);
  const availableCells: Array<{ col: number; row: number }> = [];

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 6; c++) {
      if (!emptyCells.has(`${c},${r}`)) {
        availableCells.push({ col: c, row: r });
      }
    }
  }

  // Shuffle cells deterministically with seeded random
  for (let i = availableCells.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    const temp = availableCells[i];
    availableCells[i] = availableCells[j];
    availableCells[j] = temp;
  }

  // Exactly 20 desktop cells
  const total = 20;

  // Layer distribution: 45% far (9), 35% mid (7), 20% near (4)
  const layers: LayerType[] = [
    "far", "far", "far", "far", "far", "far", "far", "far", "far",
    "mid", "mid", "mid", "mid", "mid", "mid", "mid",
    "near", "near", "near", "near",
  ];

  // Shuffle layers across the cells
  for (let i = layers.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    const temp = layers[i];
    layers[i] = layers[j];
    layers[j] = temp;
  }

  const items: FloatingLogoItem[] = [];

  for (let i = 0; i < total; i++) {
    const logoData = candidates[i % candidates.length];
    const cell = availableCells[i];
    const layer = layers[i];

    // Jittered position within the cell with 15% margin
    const cellWidth = 100 / 6;
    const cellHeight = 100 / 4;
    const xPct = cell.col * cellWidth + (0.15 + rnd() * 0.7) * cellWidth;
    const yPct = cell.row * cellHeight + (0.15 + rnd() * 0.7) * cellHeight;

    let size: number;
    let baseOpacity: number;
    let floatDistance: number;
    let duration: number;

    if (layer === "far") {
      size = Math.round(28 + rnd() * 8); // 28-36 px
      baseOpacity = Number((0.05 + rnd() * 0.02).toFixed(3)); // 0.05-0.07
      floatDistance = Math.round(8 + rnd() * 4); // 8-12 px
      duration = Number((16 + rnd() * 8).toFixed(1)); // 16-24 s
    } else if (layer === "mid") {
      size = Math.round(38 + rnd() * 10); // 38-48 px
      baseOpacity = Number((0.07 + rnd() * 0.02).toFixed(3)); // 0.07-0.09
      floatDistance = Math.round(12 + rnd() * 6); // 12-18 px
      duration = Number((12 + rnd() * 6).toFixed(1)); // 12-18 s
    } else {
      size = Math.round(52 + rnd() * 12); // 52-64 px
      baseOpacity = Number((0.09 + rnd() * 0.02).toFixed(3)); // 0.09-0.11
      floatDistance = Math.round(16 + rnd() * 8); // 16-24 px
      duration = Number((9 + rnd() * 5).toFixed(1)); // 9-14 s
    }

    const driftDistance = Math.round(floatDistance * (0.4 + rnd() * 0.2));
    const delay = -Number((rnd() * duration).toFixed(1));
    const rotation = Math.round(-12 + rnd() * 24); // -12° to 12°

    // Responsive tier: 8 on mobile, 12 on tablet, 20 on desktop
    const responsiveTier: "mobile" | "tablet" | "desktop" =
      i < 8 ? "mobile" : i < 12 ? "tablet" : "desktop";

    items.push({
      id: `logo-${logoData.name}-${i}`,
      name: logoData.name,
      svgPath: logoData.path,
      projects: logoData.projects,
      left: Number(xPct.toFixed(2)),
      top: Number(yPct.toFixed(2)),
      size,
      baseOpacity,
      layer,
      floatDistance,
      driftDistance,
      duration,
      delay,
      rotation,
      responsiveTier,
    });
  }

  return items;
}

type Props = {
  activeProject?: string;
};

export const FloatingLogos = React.memo(function FloatingLogos({
  activeProject = "all",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTabHidden, setIsTabHidden] = useState(false);

  // Memoize deterministic logo generation (computed only once)
  const logos = useMemo(() => generateFloatingLogos(), []);

  // Pause animation when document tab is hidden
  useEffect(() => {
    const handleVisibility = () => {
      setIsTabHidden(document.hidden);
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // Desktop-only pointer parallax (up to 10px opposite shift throttled with rAF)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (typeof window === "undefined" || !window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    let rafId: number | null = null;
    let targetX = 0;
    let targetY = 0;

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      targetX = -nx * 10;
      targetY = -ny * 10;

      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          if (container) {
            container.style.setProperty("--mx", `${targetX.toFixed(2)}px`);
            container.style.setProperty("--my", `${targetY.toFixed(2)}px`);
          }
          rafId = null;
        });
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  const isProjectActive = activeProject && activeProject !== "all";

  // Group logos by depth layer for optimized wrapper transforms
  const farLogos = useMemo(() => logos.filter((l) => l.layer === "far"), [logos]);
  const midLogos = useMemo(() => logos.filter((l) => l.layer === "mid"), [logos]);
  const nearLogos = useMemo(() => logos.filter((l) => l.layer === "near"), [logos]);

  const renderLogo = (logo: FloatingLogoItem) => {
    const matches = isProjectActive && logo.projects?.includes(activeProject);
    const opacity = isProjectActive ? (matches ? 0.16 : 0.03) : logo.baseOpacity;

    const responsiveClass =
      logo.responsiveTier === "mobile"
        ? "block"
        : logo.responsiveTier === "tablet"
        ? "hidden sm:block"
        : "hidden lg:block";

    return (
      <div
        key={logo.id}
        className={`floating-logo absolute -translate-x-1/2 -translate-y-1/2 ${responsiveClass}`}
        style={
          {
            left: `${logo.left}%`,
            top: `${logo.top}%`,
            width: `${logo.size}px`,
            height: `${logo.size}px`,
            opacity,
            "--dur": `${logo.duration}s`,
            "--delay": `${logo.delay}s`,
            "--dy": `${logo.floatDistance}px`,
            "--dx": `${logo.driftDistance}px`,
            "--rot": `${logo.rotation}deg`,
          } as React.CSSProperties
        }
      >
        <svg
          viewBox="0 0 24 24"
          width="100%"
          height="100%"
          className="text-white select-none pointer-events-none"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d={logo.svgPath} />
        </svg>
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`absolute inset-0 z-0 pointer-events-none overflow-hidden select-none ${
        isTabHidden ? "tab-paused" : ""
      }`}
      style={{ contain: "layout style paint" }}
    >
      {/* Top and Bottom soft vignette fades */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#070a10] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#070a10] to-transparent z-10" />

      {/* Far Layer (depth factor 0.4) */}
      <div
        className="floating-layer absolute inset-0 pointer-events-none"
        style={{ "--depth-factor": "0.4" } as React.CSSProperties}
      >
        {farLogos.map(renderLogo)}
      </div>

      {/* Mid Layer (depth factor 0.7) */}
      <div
        className="floating-layer absolute inset-0 pointer-events-none"
        style={{ "--depth-factor": "0.7" } as React.CSSProperties}
      >
        {midLogos.map(renderLogo)}
      </div>

      {/* Near Layer (depth factor 1.0) */}
      <div
        className="floating-layer absolute inset-0 pointer-events-none"
        style={{ "--depth-factor": "1.0" } as React.CSSProperties}
      >
        {nearLogos.map(renderLogo)}
      </div>
    </div>
  );
});

export default FloatingLogos;
