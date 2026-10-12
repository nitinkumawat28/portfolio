import { ArrowLeft, ExternalLink, Sparkles, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

function GithubIcon({ size = 14 }: { size?: number }) {
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

export type CaseStudySlug = "ar-restaurant-pos" | "healthsaral" | "hrms" | "portfolio";

type CaseStudyData = {
  id: CaseStudySlug;
  title: string;
  subtitle: string;
  period: string;
  role: string;
  accent: string;
  tech: string[];
  overview: string;
  stats: { value: string | number; label: string }[];
  problem?: string;
  solution?: string;
  highlights: string[];
  links: { label: string; href: string; icon?: "github" | "external" }[];
};

const CASE_STUDIES: Record<CaseStudySlug, CaseStudyData> = {
  "ar-restaurant-pos": {
    id: "ar-restaurant-pos",
    title: "3D AR Restaurant POS System",
    subtitle: "Interactive 3D food visualization & point-of-sale platform",
    period: "2026",
    role: "Frontend Developer",
    accent: "#22c55e",
    tech: ["React.js", "Three.js", "Node.js", "Express.js", "AWS S3", "Tailwind CSS"],
    overview:
      "An AR-enabled restaurant point-of-sale system featuring interactive 3D food visualization in the browser (with 3D food assets modeled in Blender and rendered in real-time), digital menu exploration, table ordering, and automated billing workflows built for modern dining establishments.",
    stats: [
      { value: "50+", label: "Cafes & Restaurants Pitched" },
      { value: "Blender", label: "3D Asset Modeling" },
      { value: "AWS S3", label: "Asset Cloud Storage" },
    ],
    problem:
      "Traditional static menus fail to convey dish proportions, ingredients, and presentation, resulting in order hesitation, miscommunicated preferences, and lower average spend per table.",
    solution:
      "Empowered diners to inspect photorealistic 3D food models and augmented reality visualizations directly on their smartphones or table devices before placing synchronized orders.",
    highlights: [
      "Built an AR-enabled restaurant POS system with interactive 3D food visualization, digital menu, ordering, and billing workflows.",
      "Developed RESTful backend APIs using Node.js, Express.js, and AWS S3 for menu, order, and restaurant data management.",
      "Integrated Three.js and Blender 3D assets to enable interactive 3D food visualization within a responsive React.js frontend.",
      "Pitched the solution to 50+ cafes and restaurants, conducting client outreach, gathering market feedback, and validating real-world business requirements.",
    ],
    links: [
      { label: "GitHub Repo", href: "https://github.com/nitinkumawat28/tablemate-pos", icon: "github" },
    ],
  },
  healthsaral: {
    id: "healthsaral",
    title: "HealthSaral",
    subtitle: "AI-Powered Medical Lab Report Analyzer",
    period: "Live • 2026",
    role: "AI-Assisted Developer",
    accent: "#38bdf8",
    tech: ["Astro", "Cloudflare Workers & R2", "Supabase", "Gemini API", "Tailwind CSS"],
    overview:
      "A live, privacy-first healthcare web application that translates complex medical laboratory reports and blood tests into clear, plain-language summaries and actionable wellness insights.",
    stats: [
      { value: "20", label: "Daily Active Users" },
      { value: "~15", label: "Daily AI Summaries" },
      { value: "Astro", label: "Modern Frontend" },
    ],
    problem:
      "Patients frequently receive pathology reports dense with medical jargon, reference ranges, and abbreviations that cause undue anxiety before they can schedule a physician follow-up.",
    solution:
      "Designed a secure pipeline where users upload lab documents (PDFs or photos) and receive instant, layman-friendly breakdowns of biomarkers, flagged anomalies, and guided doctor discussion points.",
    highlights: [
      "Achieved 20 daily active users through consistent organic traffic, converting complex medical reports into easy-to-understand language.",
      "Integrated the Gemini API for document processing, medical information extraction, and structured JSON generation.",
      "Implemented secure medical report storage using Cloudflare R2, presigned URLs, and role-based access control to protect sensitive health data.",
      "Improved frontend performance through lazy loading, caching, responsive UI design, and optimized API interactions.",
    ],
    links: [
      { label: "Live Website", href: "https://healthsaral.in/", icon: "external" },
      { label: "GitHub Repo", href: "https://github.com/nitinkumawat28/HealthSaral", icon: "github" },
    ],
  },
  hrms: {
    id: "hrms",
    title: "Human Resource Management System",
    subtitle: "Full-Stack Enterprise HR Platform with AI Automation",
    period: "2026",
    role: "Full-Stack Developer",
    accent: "#f59e0b",
    tech: ["React.js", "Python", "Neon PostgreSQL", "Gemini API", "Cloud Vision OCR", "Docker"],
    overview:
      "A unified HR management ecosystem featuring role-tailored Admin and Employee dashboards for tracking attendance, managing leaves, computing payroll, and automating document onboarding via OCR.",
    stats: [
      { value: "2", label: "Role-Based Dashboards" },
      { value: "2", label: "AI & OCR Integrations" },
      { value: "Neon", label: "Serverless Database" },
    ],
    problem:
      "Growing companies frequently suffer from fragmented employee record systems, manual identity verification bottlenecks, and unnoticed payroll anomalies.",
    solution:
      "Built an integrated platform unifying real-time attendance tracking, intelligent OCR-based ID ingestion, and a conversational HR assistant to answer employee policy questions.",
    highlights: [
      "Developed a full-stack HR management platform with role-based Admin and Employee dashboards for attendance, leave, and payroll.",
      "Integrated Google Gemini-powered HR chatbot and Google Cloud Vision API (OCR) for intelligent employee onboarding and automated data extraction.",
      "Implemented payroll anomaly detection, attendance analysis, and automated notifications to improve HR operational efficiency.",
    ],
    links: [
      { label: "GitHub Repo", href: "https://github.com/nitinkumawat28/HRMS", icon: "github" },
    ],
  },
  portfolio: {
    id: "portfolio",
    title: "Portfolio Project",
    subtitle: "Web Operating System Experience with Draggable Windows & 3D Shaders",
    period: "2026",
    role: "Creative & Full-Stack Developer",
    accent: "#a855f7",
    tech: ["React 19", "TypeScript", "Tailwind CSS v4", "WebGL / OGL", "Framer Motion", "Vite"],
    overview:
      "A personal portfolio engineered as an interactive desktop environment. Features interactive draggable windows, custom WebGL mathematical background shaders, live GitHub API repository synchronization, real-time IST clock, and immersive case study presentations.",
    stats: [
      { value: "React 19", label: "Component Engine" },
      { value: "60 FPS", label: "WebGL Shader Performance" },
      { value: "Zero Delay", label: "Instant GitHub Cache" },
    ],
    highlights: [
      "Engineered an interactive desktop OS experience featuring draggable windows, custom icon positioning, persistent local state, and smooth folder animations.",
      "Implemented a customized WebGL shader background using OGL for fluid, mathematical ambient animations running at a locked 60 FPS.",
      "Integrated real-time GitHub REST API fetching with intelligent client-side caching and pre-warmed instant rendering.",
      "Designed an interactive skills showcase with categorized technology stacks and project-based live filter highlighting.",
      "Optimized bundle size and asset loading via modern Vite bundling, responsive asset loading, and Tailwind CSS v4 performance enhancements.",
    ],
    links: [
      { label: "Live Website", href: "https://nitinkumawat.me/", icon: "external" },
      { label: "GitHub Repo", href: "https://github.com/nitinkumawat28/portfolio", icon: "github" },
    ],
  },
};

type Props = {
  slug: string;
  onBack?: () => void;
};

export function CaseStudyView({ slug, onBack }: Props) {
  const data = CASE_STUDIES[slug as CaseStudySlug] || CASE_STUDIES["ar-restaurant-pos"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25 }}
      className="mx-auto max-w-4xl py-6 px-4 md:px-0 text-white"
    >
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="group mb-8 inline-flex items-center gap-2 text-sm font-medium text-white/60 transition-colors hover:text-white"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          <span>Back to Projects Deck</span>
        </button>
      )}

      {/* Header Banner */}
      <div
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#18202b] to-[#0f141b] p-6 md:p-10 shadow-2xl"
        style={{
          boxShadow: `0 20px 50px -20px color-mix(in srgb, ${data.accent} 25%, transparent)`,
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
              style={{
                background: `color-mix(in srgb, ${data.accent} 20%, transparent)`,
                color: data.accent,
                border: `1px solid color-mix(in srgb, ${data.accent} 40%, transparent)`,
              }}
            >
              <Sparkles size={12} />
              {data.role}
            </span>
            <span className="text-xs text-white/50">{data.period}</span>
          </div>

          <div className="flex items-center gap-3">
            {data.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-white/90 transition-all hover:bg-white/15 hover:text-white"
              >
                {link.icon === "github" ? <GithubIcon size={14} /> : <ExternalLink size={14} />}
                <span>{link.label}</span>
              </a>
            ))}
          </div>
        </div>

        <h2 className="mt-6 text-3xl font-bold tracking-tight text-white md:text-5xl">{data.title}</h2>
        <p className="mt-2 text-base text-white/70 md:text-lg">{data.subtitle}</p>

        {/* Tech tags */}
        <div className="mt-6 flex flex-wrap gap-2">
          {data.tech.map((t) => (
            <span
              key={t}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/80"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Key Stats */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-white/10 pt-6">
          {data.stats.map((stat) => (
            <div key={stat.label} className="border-l-2 pl-3" style={{ borderColor: data.accent }}>
              <div className="text-2xl font-bold text-white md:text-3xl">{stat.value}</div>
              <div className="text-xs text-white/55 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Narrative */}
      <div className="mt-10 space-y-8">
        {/* Overview */}
        <div className="rounded-2xl border border-white/10 bg-[#14181f]/80 p-6 md:p-8 backdrop-blur-sm">
          <h3 className="text-lg font-bold text-white mb-3">Project Overview</h3>
          <p className="text-sm md:text-base leading-relaxed text-white/75">{data.overview}</p>
        </div>

        {/* Problem & Solution */}
        {data.problem && data.solution && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-white/10 bg-[#14181f]/80 p-6 backdrop-blur-sm">
              <h4 className="text-sm font-bold uppercase tracking-wider text-rose-400 mb-2">The Challenge</h4>
              <p className="text-sm leading-relaxed text-white/70">{data.problem}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#14181f]/80 p-6 backdrop-blur-sm">
              <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-2">The Solution</h4>
              <p className="text-sm leading-relaxed text-white/70">{data.solution}</p>
            </div>
          </div>
        )}

        {/* Key Deliverables & Highlights */}
        <div className="rounded-2xl border border-white/10 bg-[#14181f]/80 p-6 md:p-8 backdrop-blur-sm">
          <h3 className="text-lg font-bold text-white mb-4">Key Achievements & Architecture</h3>
          <ul className="space-y-3.5">
            {data.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-3 text-sm md:text-[15px] leading-relaxed text-white/80">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0" style={{ color: data.accent }} />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
