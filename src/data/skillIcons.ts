import type { LucideIcon } from "lucide-react";
import {
  Cloud,
  Workflow,
  Database,
  ScanText,
  Sigma,
  Network,
  Search,
  BarChart3,
  FileSpreadsheet,
  Key,
  Activity,
  LineChart,
  MapPin,
  FileText,
  Sliders,
  Code2
} from "lucide-react";

import {
  siCplusplus,
  siPython,
  siC,
  siHtml5,
  siJavascript,
  siCss,
  siTailwindcss,
  siReact,
  siNodedotjs,
  siThreedotjs,
  siAstro,
  siDocker,
  siKubernetes,
  siGithubactions,
  siCloudflare,
  siGooglecloud,
  siMysql,
  siMongodb,
  siNeon,
  siSupabase,
  siGooglegemini,
  siHuggingface,
  siSemrush,
  siGoogleads,
  siGoogleanalytics,
  siGoogletagmanager,
  siGooglesheets,
  siFigma,
  siGithub,
  siGit,
  siPostman,
  siCloudinary,
  siJira,
  siTypescript,
  siVite,
  siWebgl,
  siFramer,
  siBlender
} from "simple-icons";

export type SimpleIconData = {
  title: string;
  slug: string;
  hex: string;
  path: string;
};

export type SkillIcon =
  | { kind: "brand"; icon: SimpleIconData; scale?: number }
  | { kind: "generic"; Icon: LucideIcon; scale?: number };

export const skillIcons: Record<string, SkillIcon> = {
  // Languages & Frameworks
  TypeScript: { kind: "brand", icon: siTypescript },
  "C++": { kind: "brand", icon: siCplusplus },
  Python: { kind: "brand", icon: siPython },
  C: { kind: "brand", icon: siC },
  HTML5: { kind: "brand", icon: siHtml5 },
  JavaScript: { kind: "brand", icon: siJavascript },
  CSS3: { kind: "brand", icon: siCss },
  CSS: { kind: "brand", icon: siCss },
  "Tailwind CSS": { kind: "brand", icon: siTailwindcss },
  "React.js": { kind: "brand", icon: siReact },
  React: { kind: "brand", icon: siReact },
  "Node.js": { kind: "brand", icon: siNodedotjs },
  "Three.js": { kind: "brand", icon: siThreedotjs, scale: 0.95 },
  Astro: { kind: "brand", icon: siAstro },
  Vite: { kind: "brand", icon: siVite },
  WebGL: { kind: "brand", icon: siWebgl },
  "Framer Motion": { kind: "brand", icon: siFramer },

  // Digital Marketing
  SEO: { kind: "generic", Icon: Search },
  Semrush: { kind: "brand", icon: siSemrush },
  "Google Ads (Search, Display)": { kind: "brand", icon: siGoogleads },
  "Google Ads": { kind: "brand", icon: siGoogleads },
  "Keyword Research & Optimization": { kind: "generic", Icon: Key },
  "Conversion Tracking (GA4, GTM)": { kind: "brand", icon: siGoogleanalytics },
  GA4: { kind: "brand", icon: siGoogleanalytics },
  GTM: { kind: "brand", icon: siGoogletagmanager },
  "CTR, CPC, CPA Analysis": { kind: "generic", Icon: Activity },
  "Campaign Optimization": { kind: "generic", Icon: Sliders },
  "On-Page SEO": { kind: "generic", Icon: FileText },
  "Local SEO": { kind: "generic", Icon: MapPin },
  "Data Analysis & Reporting": { kind: "generic", Icon: LineChart },
  "Microsoft Excel": { kind: "generic", Icon: FileSpreadsheet },
  "Google Sheets": { kind: "brand", icon: siGooglesheets },

  // Cloud & DevOps
  "AWS (EC2, S3, RDS, Lambda)": { kind: "generic", Icon: Cloud },
  "AWS S3": { kind: "generic", Icon: Cloud },
  AWS: { kind: "generic", Icon: Cloud },
  Docker: { kind: "brand", icon: siDocker },
  Kubernetes: { kind: "brand", icon: siKubernetes },
  "GitHub Actions": { kind: "brand", icon: siGithubactions },
  "CI/CD": { kind: "generic", Icon: Workflow },
  Cloudflare: { kind: "brand", icon: siCloudflare },
  "Google Cloud": { kind: "brand", icon: siGooglecloud },

  // Databases
  MySQL: { kind: "brand", icon: siMysql },
  Neon: { kind: "brand", icon: siNeon },
  NoSQL: { kind: "generic", Icon: Database },
  MongoDB: { kind: "brand", icon: siMongodb },

  // Tools
  "Power BI": { kind: "generic", Icon: BarChart3 },
  "MySQL Workbench": { kind: "brand", icon: siMysql },
  Git: { kind: "brand", icon: siGit },
  GitHub: { kind: "brand", icon: siGithub },
  "Git/GitHub": { kind: "brand", icon: siGithub },
  Postman: { kind: "brand", icon: siPostman },
  Cloudinary: { kind: "brand", icon: siCloudinary },
  Jira: { kind: "brand", icon: siJira },
  Supabase: { kind: "brand", icon: siSupabase },
  "Figma (UI/UX)": { kind: "brand", icon: siFigma },
  Figma: { kind: "brand", icon: siFigma },
  Blender: { kind: "brand", icon: siBlender },

  // Other references / Backwards compatibility
  "Gemini API": { kind: "brand", icon: siGooglegemini },
  "Hugging Face": { kind: "brand", icon: siHuggingface },
  "Fuzzy Set Theory": { kind: "generic", Icon: Sigma },
  ANNs: { kind: "generic", Icon: Network },
  "Cloud Vision OCR": { kind: "generic", Icon: ScanText }
};

export const defaultSkillIcon: SkillIcon = {
  kind: "generic",
  Icon: Code2
};
