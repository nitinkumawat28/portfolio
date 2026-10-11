import { useState } from "react";
import { SkillIcon } from "./SkillIcon";


type SkillItem = {
  name: string;
  category: string;
  // Projects where this skill is used, e.g. 'pos', 'healthsaral', 'hrms'
  projects?: string[];
};

type SkillCategory = {
  title: string;
  skills: SkillItem[];
};

const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "Languages",
    skills: [
      { name: "C++", category: "Languages", projects: [] },
      { name: "Python", category: "Languages", projects: ["hrms"] },
      { name: "C", category: "Languages", projects: [] },
      { name: "HTML5", category: "Languages", projects: ["pos", "healthsaral", "hrms"] },
      { name: "JavaScript", category: "Languages", projects: ["pos", "hrms"] },
      { name: "CSS3", category: "Languages", projects: ["pos", "healthsaral", "hrms"] },
      { name: "Tailwind CSS", category: "Languages", projects: ["pos", "healthsaral", "hrms"] },
    ],
  },
  {
    title: "Digital Marketing",
    skills: [
      { name: "SEO", category: "Marketing", projects: ["healthsaral"] },
      { name: "Semrush", category: "Marketing", projects: [] },
      { name: "Google Ads (Search, Display)", category: "Marketing", projects: [] },
      { name: "Keyword Research & Optimization", category: "Marketing", projects: [] },
      { name: "Conversion Tracking (GA4, GTM)", category: "Marketing", projects: ["healthsaral"] },
      { name: "CTR, CPC, CPA Analysis", category: "Marketing", projects: [] },
      { name: "Campaign Optimization", category: "Marketing", projects: [] },
      { name: "On-Page SEO", category: "Marketing", projects: ["healthsaral"] },
      { name: "Local SEO", category: "Marketing", projects: [] },
      { name: "Data Analysis & Reporting", category: "Marketing", projects: ["healthsaral"] },
      { name: "Microsoft Excel", category: "Marketing", projects: [] },
      { name: "Google Sheets", category: "Marketing", projects: [] },
    ],
  },
  {
    title: "Databases",
    skills: [
      { name: "MySQL", category: "Databases", projects: [] },
      { name: "Neon", category: "Databases", projects: ["hrms"] },
      { name: "NoSQL", category: "Databases", projects: [] },
      { name: "MongoDB", category: "Databases", projects: [] },
    ],
  },
  {
    title: "Cloud & DevOps",
    skills: [
      { name: "AWS (EC2, S3, RDS, Lambda)", category: "Cloud", projects: ["pos"] },
      { name: "Docker", category: "DevOps", projects: ["hrms"] },
      { name: "Kubernetes", category: "DevOps", projects: [] },
      { name: "GitHub Actions", category: "DevOps", projects: ["hrms"] },
      { name: "CI/CD", category: "DevOps", projects: ["hrms"] },
      { name: "Cloudflare", category: "Cloud", projects: ["healthsaral"] },
    ],
  },
  {
    title: "Tools",
    skills: [
      { name: "Power BI", category: "Tools", projects: [] },
      { name: "MySQL Workbench", category: "Tools", projects: [] },
      { name: "Git", category: "Tools", projects: ["pos", "healthsaral", "hrms"] },
      { name: "GitHub", category: "Tools", projects: ["pos", "healthsaral", "hrms"] },
      { name: "Postman", category: "Tools", projects: ["pos", "hrms"] },
      { name: "Cloudinary", category: "Tools", projects: [] },
      { name: "Jira", category: "Tools", projects: [] },
      { name: "Supabase", category: "Tools", projects: ["healthsaral"] },
      { name: "Figma (UI/UX)", category: "Tools", projects: ["pos", "healthsaral", "hrms"] },
    ],
  },
];

const FILTER_PROJECTS = [
  { id: "all", label: "All Skills", accent: "#ffffff" },
  { id: "pos", label: "3D AR POS", accent: "#22c55e" },
  { id: "healthsaral", label: "HealthSaral", accent: "#38bdf8" },
  { id: "hrms", label: "HRMS", accent: "#f59e0b" },
];

export function SkillsFolderView() {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const currentProject = FILTER_PROJECTS.find((p) => p.id === activeFilter);
  const activeAccent = currentProject && currentProject.id !== "all" ? currentProject.accent : null;

  return (
    <div className="mx-auto max-w-4xl py-6 text-white">
      {/* Project Filter Bar */}
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">Technical Skills</h2>
          <p className="mt-1 text-sm text-white/60">
            Real tools, frameworks, and APIs I work with daily — tagged with production projects.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 p-1">
          {FILTER_PROJECTS.map((proj) => {
            const isSelected = activeFilter === proj.id;
            return (
              <button
                key={proj.id}
                type="button"
                onClick={() => setActiveFilter(proj.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  isSelected
                    ? "bg-white/15 text-white shadow-sm"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
                style={isSelected && proj.accent !== "#ffffff" ? { borderLeft: `3px solid ${proj.accent}` } : undefined}
              >
                {proj.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5 Skill Sections: Languages, Digital Marketing, Databases, Cloud & DevOps, Tools */}
      <div className="space-y-10">
        {SKILL_CATEGORIES.map((cat) => (
          <section key={cat.title}>
            <h3 className="mb-4 text-xs font-mono font-semibold uppercase tracking-wider text-white/50">
              {cat.title}
            </h3>

            <div className="flex flex-wrap gap-3">
              {cat.skills.map((skill) => {
                const isHighlighted =
                  activeFilter === "all" || (skill.projects && skill.projects.includes(activeFilter));
                const isDimmed = activeFilter !== "all" && !isHighlighted;

                return (
                  <div
                    key={skill.name}
                    tabIndex={0}
                    className={`group relative flex min-h-[44px] items-center gap-[10px] rounded-xl border px-3 py-2 transition-[border-color,background-color,opacity] duration-150 outline-none focus-visible:ring-2 focus-visible:ring-white/50 select-none ${
                      isDimmed
                        ? "opacity-40 border-white/5 bg-[#121720]/60"
                        : "opacity-100 border-white/10 bg-[#161c24] hover:border-white/25 hover:bg-[#1a222c]"
                    }`}
                    style={
                      isHighlighted && activeAccent
                        ? { borderColor: `color-mix(in srgb, ${activeAccent} 40%, transparent)` }
                        : undefined
                    }
                  >
                    {/* Badge: 28x28px, border-radius 8px, background #1d2733, centered 18px icon */}
                    <div
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-[#1d2733] transition-colors duration-150 group-hover:bg-[#253242]"
                      style={
                        isHighlighted && activeAccent
                          ? { borderColor: activeAccent, borderWidth: 1 }
                          : undefined
                      }
                    >
                      <span className="text-[#c9d3df] transition-colors duration-150 group-hover:text-white group-focus-visible:text-white flex items-center justify-center">
                        <SkillIcon name={skill.name} size={18} />
                      </span>
                    </div>

                    {/* Skill Label */}
                    <span className="text-sm font-medium text-white/90 group-hover:text-white">
                      {skill.name}
                    </span>

                    {/* Project dots indicator */}
                    {skill.projects && skill.projects.length > 0 && (
                      <div className="ml-1 flex items-center gap-1">
                        {skill.projects.map((p) => {
                          const dotColor =
                            p === "pos" ? "#22c55e" : p === "healthsaral" ? "#38bdf8" : "#f59e0b";
                          return (
                            <span
                              key={p}
                              className="h-1.5 w-1.5 rounded-full"
                              style={{ backgroundColor: dotColor }}
                              title={`Used in ${p.toUpperCase()}`}
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* Trademark Legal Note */}
      <footer className="mt-14 border-t border-white/10 pt-6">
        <p className="text-xs text-[#6b7686]">
          Logos are trademarks of their respective owners.
        </p>
      </footer>
    </div>
  );
}
