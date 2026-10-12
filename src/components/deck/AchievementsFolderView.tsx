import { ExternalLink, Award, CheckCircle2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

type Certificate = {
  title: string;
  organization: string;
  date: string;
  category: string;
  certificateUrl: string;
  description: string;
  skills: string[];
  accentColor: string;
};

const CERTIFICATES: Certificate[] = [
  {
    title: "Deloitte Cyber Job Simulation",
    organization: "Deloitte • Forage",
    date: "2024",
    category: "Cybersecurity & Risk",
    certificateUrl: "https://drive.google.com/file/d/1DPQWwiEMWF1w9j1MbVTO6CH3d75SNOba/view?usp=sharing",
    description: "Practical simulation tackling real-world cybersecurity scenarios, enterprise vulnerability assessments, network forensic analysis, and security architectures.",
    skills: ["Cyber Defense", "Risk Assessment", "Network Forensics", "Security Best Practices"],
    accentColor: "#38bdf8",
  },
  {
    title: "Skyscanner Front-End Software Engineering",
    organization: "Skyscanner • Forage",
    date: "2024",
    category: "Software Engineering",
    certificateUrl: "https://drive.google.com/file/d/1VXrogIHqEqtRynTzt3BlNGDemikAKB2F/view?usp=sharing",
    description: "Built responsive user interface components, interactive date picker workflows, and practiced production-grade front-end code reviews following Skyscanner standards.",
    skills: ["React.js", "Front-End Architecture", "Design Systems", "Web Performance"],
    accentColor: "#34d399",
  },
  {
    title: "AI Search Operating System Certification",
    organization: "Semrush Academy",
    date: "2025",
    category: "AI & Search Systems",
    certificateUrl: "https://drive.google.com/file/d/1Xcm4d4B_ZkOzieNIk0rwETh2HmspC-zJ/view?usp=sharing",
    description: "Specialized certification in generative AI search algorithms, Search Generative Experience (SGE), semantic entity authority, and high-impact SEO discoverability.",
    skills: ["AI Search Engines", "Semrush", "SGE Optimization", "Semantic SEO"],
    accentColor: "#f59e0b",
  },
  {
    title: "AI Tool Workshop Certification",
    organization: "be10x",
    date: "2024",
    category: "Artificial Intelligence",
    certificateUrl: "https://drive.google.com/file/d/1j9JwBxuDwv4PqUqpXz2oRdQXcCnKH-vW/view?usp=sharing",
    description: "Intensive hands-on workshop focused on generative AI tools, prompt engineering methodologies, agentic workflows, and productivity automation systems.",
    skills: ["Generative AI", "Prompt Engineering", "Workflow Automation", "LLM APIs"],
    accentColor: "#c084fc",
  },
];

export function AchievementsFolderView() {
  return (
    <div className="mx-auto max-w-4xl py-6 pb-36 text-white select-none">
      {/* Header Bar */}
      <motion.div 
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-8 border-b border-white/10 pb-6"
      >
        <div className="flex items-center gap-2 mb-1.5">
          <span className="font-mono text-amber-400 text-sm font-bold">&lt;</span>
          <span className="font-mono text-amber-400 text-xs font-bold tracking-wider uppercase">CREDENTIALS</span>
          <span className="font-mono text-amber-400 text-sm font-bold">&gt;</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-white font-sans leading-none">
          Achievements &amp; Certificates
        </h2>
        <p className="mt-2 text-sm sm:text-base text-white/65 max-w-xl leading-relaxed">
          Professional job simulations, verified industry credentials, and engineering achievements.
        </p>
      </motion.div>

      {/* Featured Competitive Exam Achievement Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        whileHover={{ scale: 1.01 }}
        className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/15 via-[#131720]/80 to-amber-500/10 p-5 sm:p-6 mb-8 backdrop-blur-xl shadow-[0_10px_35px_-10px_rgba(245,158,11,0.2)]"
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-amber-400/15 blur-2xl" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-400/30 bg-amber-400/20 text-amber-300 shadow-inner">
              <Sparkles size={22} className="animate-spin" style={{ animationDuration: "12s" }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400">
                  National Competitive Achievement
                </span>
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                Admission to SVNIT Surat via JEE Main 2024
              </h3>
              <p className="text-xs sm:text-sm text-white/65 mt-1 leading-relaxed">
                Qualified India&apos;s premier national engineering examination (JEE Main 2024) among over 1.4 million aspirants to secure admission to the National Institute of Technology (SVNIT Surat).
              </p>
            </div>
          </div>
          <span className="self-start sm:self-center shrink-0 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 font-mono text-xs font-bold text-amber-300">
            2024
          </span>
        </div>
      </motion.div>

      {/* Grid of Verified Credentials */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {CERTIFICATES.map((cert, index) => (
          <motion.div
            key={cert.title}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38, delay: index * 0.08, ease: "easeOut" }}
            whileHover={{ y: -5 }}
            className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0d121a]/90 p-6 sm:p-7 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-white/30 hover:bg-[#121924] hover:shadow-[0_20px_45px_-15px_rgba(0,0,0,0.8)] overflow-hidden"
          >
            {/* Ambient Background Aura reacting to Certificate Accent */}
            <div
              className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full blur-3xl opacity-20 transition-opacity duration-300 group-hover:opacity-40"
              style={{ backgroundColor: cert.accentColor }}
            />

            {/* Top Row: Category Pill & Year */}
            <div className="relative z-10">
              <div className="flex items-center justify-between gap-3 mb-3">
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold tracking-wide border shadow-sm transition-transform duration-200 group-hover:scale-105"
                  style={{
                    backgroundColor: `${cert.accentColor}18`,
                    color: cert.accentColor,
                    borderColor: `${cert.accentColor}40`,
                  }}
                >
                  <Award size={13} />
                  <span>{cert.category}</span>
                </span>
                <span className="text-xs font-mono font-medium text-white/45">{cert.date}</span>
              </div>

              {/* Title & Organization */}
              <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-amber-200 transition-colors tracking-tight leading-snug mb-1">
                {cert.title}
              </h3>
              <p className="text-xs sm:text-sm font-medium text-white/55 mb-3 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>{cert.organization}</span>
              </p>

              {/* Description */}
              <p className="text-sm text-white/75 leading-relaxed mb-5">
                {cert.description}
              </p>
            </div>

            {/* Bottom Row: Skills Pill & Verified Certificate Link */}
            <div className="relative z-10 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex flex-wrap gap-1.5">
                {cert.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs px-2.5 py-1 rounded-lg bg-white/5 text-white/70 border border-white/10 font-medium transition-colors hover:border-white/25 hover:text-white"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {cert.certificateUrl && (
                <a
                  href={cert.certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-300 hover:text-white transition-all shrink-0 px-4 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/35 border border-amber-500/30 hover:border-amber-400/60 shadow-md active:scale-95 cursor-pointer ml-auto sm:ml-0"
                >
                  <CheckCircle2 size={14} className="text-emerald-400 transition-transform duration-200 group-hover/btn:scale-110" />
                  <span>View Certificate</span>
                  <ExternalLink size={13} className="transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default AchievementsFolderView;
