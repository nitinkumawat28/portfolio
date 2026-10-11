import { ArrowLeft, GraduationCap, Code2, Cloud, TrendingUp, Sparkles, Send, FileText, Mail, Phone, MapPin } from 'lucide-react';

export function About() {
  return (
    <div className="min-h-screen bg-[#07090d] text-white p-6 md:p-12 lg:p-16 font-sans overflow-y-auto selection:bg-white/20">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <button 
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-2.5 text-sm font-medium text-white/60 hover:text-white transition-colors group cursor-pointer"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Desktop</span>
          </button>

          <span className="text-xs font-mono text-white/40 tracking-wider uppercase">
            Profile & Education
          </span>
        </div>
        
        {/* Hero Section */}
        <header className="space-y-4">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            About Me.
          </h1>

          <p className="text-lg sm:text-xl text-white/75 max-w-3xl leading-relaxed">
            Pre-final-year Civil Engineering student at <strong className="text-white font-semibold">SVNIT Surat</strong> with hands-on experience in full-stack development, AI-powered applications, cloud computing, and digital marketing. I design, build, and deploy production software that turns real-world requirements into fast, dependable solutions.
          </p>

          {/* Quick Contact & Location Bar */}
          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-white/60 font-mono">
            <span className="flex items-center gap-1.5">
              <MapPin size={13} className="text-white/40" />
              Surat, India (SVNIT)
            </span>
            <span>·</span>
            <a 
              href="mailto:nitinkumawat2807@gmail.com" 
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Mail size={13} className="text-white/40" />
              nitinkumawat2807@gmail.com
            </a>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <Phone size={13} className="text-white/40" />
              +91-8905281919
            </span>
          </div>
        </header>

        {/* Highlight Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
          {[
            { label: "Daily Active Users", value: "20+", sub: "HealthSaral Organic Traffic" },
            { label: "Client Outreach", value: "50+", sub: "Cafes & Restaurants Pitched" },
            { label: "Deployed SaaS", value: "3+", sub: "AI & Full-Stack Products" },
          ].map((stat, i) => (
            <div key={i} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{stat.value}</span>
              <div className="mt-2">
                <span className="text-xs font-semibold text-white/90 block">{stat.label}</span>
                <span className="text-[11px] text-white/40 block mt-0.5">{stat.sub}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Education Section */}
        <section className="space-y-6 pt-4">
          <div className="flex items-center gap-2.5">
            <GraduationCap className="text-blue-400 w-6 h-6" />
            <h2 className="text-2xl font-bold tracking-tight text-white">Education</h2>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-[#0f131a] border border-white/10 shadow-xl relative overflow-hidden">
            {/* Subtle background glow */}
            <div className="pointer-events-none absolute -right-20 -top-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />

            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-blue-400 block mb-1">
                  National Institute of Technology
                </span>
                <h3 className="text-2xl font-bold text-white">
                  Sardar Vallabhbhai National Institute of Technology (SVNIT)
                </h3>
                <p className="text-white/80 font-medium text-base mt-1">
                  B.Tech. in Civil Engineering
                </p>
                <p className="text-white/50 text-xs mt-0.5">
                  Surat, Gujarat, India
                </p>
              </div>

              <div className="flex flex-col items-start sm:items-end gap-1.5 shrink-0">
                <span className="px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 font-mono text-xs font-semibold">
                  Aug 2024 – May 2028
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* What I Do / Core Technical Competencies */}
        <section className="space-y-6 pt-4">
          <div className="flex items-center gap-2.5">
            <Sparkles className="text-amber-400 w-5 h-5" />
            <h2 className="text-2xl font-bold tracking-tight text-white">Core Competencies</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Full-Stack & AI */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4 text-blue-400">
                  <Code2 size={20} />
                </div>
                <h3 className="text-base font-bold text-white mb-2">Full-Stack & AI Solutions</h3>
                <p className="text-xs text-white/65 leading-relaxed">
                  Developing full-stack platforms using React, Node.js, Express, Python, and integrating the Gemini API and Cloud Vision for intelligent OCR and conversational workflows.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-white/5 flex flex-wrap gap-1">
                {["React.js", "Node.js", "Gemini API", "Python", "Three.js"].map(tag => (
                  <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-white/60">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 2. Cloud & DevOps */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4 text-purple-400">
                  <Cloud size={20} />
                </div>
                <h3 className="text-base font-bold text-white mb-2">Cloud, DevOps & Data</h3>
                <p className="text-xs text-white/65 leading-relaxed">
                  Deploying on AWS (S3, EC2), Cloudflare Workers & R2 storage. Managing reliable data storage with Supabase, Neon PostgreSQL, MySQL, and Docker CI/CD pipelines.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-white/5 flex flex-wrap gap-1">
                {["Cloudflare R2", "AWS S3", "Neon", "Docker", "Supabase"].map(tag => (
                  <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-white/60">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 3. Growth & Digital Marketing */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 text-emerald-400">
                  <TrendingUp size={20} />
                </div>
                <h3 className="text-base font-bold text-white mb-2">Digital Marketing & SEO</h3>
                <p className="text-xs text-white/65 leading-relaxed">
                  Driving organic traffic and customer acquisition through technical SEO, Semrush, Google Ads, GA4 conversion tracking, and data analytics on Power BI and Sheets.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-white/5 flex flex-wrap gap-1">
                {["SEO", "Semrush", "Google Ads", "GA4", "CRO"].map(tag => (
                  <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-white/60">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Action Call to Action */}
        <div className="pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-3">
            <a 
              href="mailto:nitinkumawat2807@gmail.com" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black text-sm font-bold rounded-xl hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 shadow-lg"
            >
              <Send size={15} />
              <span>Get in Touch</span>
            </a>

            <a 
              href="/resume.pdf" 
              download="Nitin_Kumawat_Resume.pdf" 
              className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 text-white text-sm font-semibold rounded-xl hover:bg-white/15 transition-all hover:scale-105 active:scale-95 border border-white/10"
            >
              <FileText size={15} />
              <span>Download Resume</span>
            </a>
          </div>

          <div className="flex items-center gap-3">
            <a 
              href="https://github.com/nitinkumawat28" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="h-10 w-10 flex items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </a>
            <a 
              href="https://www.linkedin.com/in/nitin-kumawat-25367a311/" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="h-10 w-10 flex items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
