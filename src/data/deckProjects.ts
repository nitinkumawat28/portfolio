import type { DeckAction, DeckItem } from "../components/deck/types";

export type ProjectEntry = Omit<DeckItem, "actions"> & {
  /** Extra buttons next to "View case study". */
  links: DeckAction[];
};

/**
 * All facts come from the resume. Replace the [PLACEHOLDER] values with real links and screenshots.
 * `id` must match the case study slug, so the "View case study" button opens the right page.
 */
export const deckProjects: ProjectEntry[] = [
  {
    id: "ar-restaurant-pos",
    title: "3D AR Restaurant POS",
    meta: "Frontend developer, 2026",
    description:
      "An AR-enabled restaurant point-of-sale system featuring interactive 3D food models designed in Blender and rendered in the browser, digital menu ordering, and real-time billing.",
    stats: [
      { value: 50, suffix: "+", label: "Cafes & restaurants pitched" },
      { value: "Blender", label: "3D Asset Modeling" },
      { value: "AWS S3", label: "Asset storage" },
    ],
    accent: "#22c55e",
    image: "/projects/pos.jpg",
    imageAlt: "3D AR Restaurant POS mobile ordering system with interactive food preview and table view",
    links: [{ label: "GitHub", href: "https://github.com/nitinkumawat28/tablemate-pos", variant: "ghost" }],
  },
  {
    id: "healthsaral",
    title: "HealthSaral",
    meta: "AI health report analyzer, live, 2026",
    description:
      "A live web app that turns complex medical reports into easy-to-understand language, using the Gemini API and secure storage on Cloudflare R2.",
    stats: [
      { value: 20, label: "Daily active users" },
      { value: 15, prefix: "~", label: "Users a day on AI summaries" },
      { value: "Astro", label: "Frontend" },
    ],
    accent: "#38bdf8",
    image: "/projects/healthsaral.png",
    imageAlt: "HealthSaral report analyzer",
    links: [
      { label: "Live site", href: "https://healthsaral.in/", variant: "ghost" },
      { label: "GitHub", href: "https://github.com/nitinkumawat28/HealthSaral", variant: "ghost" },
    ],
  },
  {
    id: "hrms",
    title: "HRMS",
    meta: "AI-powered HR system, full-stack",
    description:
      "A full-stack HR platform with Admin and Employee dashboards for attendance, leave and payroll, plus a Gemini chatbot and OCR-based onboarding.",
    stats: [
      { value: 2, label: "Role-based dashboards" },
      { value: 2, label: "AI integrations" },
      { value: "Neon", label: "Database" },
    ],
    accent: "#f59e0b",
    image: "/projects/hrms.png",
    imageAlt: "HRMS admin dashboard with employee analytics",
    links: [{ label: "GitHub", href: "https://github.com/nitinkumawat28/HRMS", variant: "ghost" }],
  },
];
