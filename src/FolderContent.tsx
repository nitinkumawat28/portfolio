import { useState } from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { ProjectsFolderView } from './components/deck/ProjectsFolderView';
import { GitReposFolderView } from './components/deck/GitReposFolderView';
import { CaseStudyView } from './components/deck/CaseStudyView';
import { SkillsFolderView } from './components/skills/SkillsFolderView';

interface Props {
  folderId: string;
}

export function FolderContent({ folderId }: Props) {
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<string | null>(null);

  // Simple mapping of folder ID to title and content
  const contentMap: Record<string, { title: string, description: string, items: React.ReactNode }> = {
    projects: {
      title: "My Projects",
      description: "A showcase of my recent work, side projects, and experiments.",
      items: selectedCaseStudy ? (
        <CaseStudyView slug={selectedCaseStudy} onBack={() => setSelectedCaseStudy(null)} />
      ) : (
        <ProjectsFolderView onOpenCaseStudy={(slug) => setSelectedCaseStudy(slug)} />
      )
    },
    repositories: {
      title: "Git Repositories",
      description: "All public repositories hosted on my GitHub (@nitinkumawat28). Explore source code, full-stack architectures, and live deployments.",
      items: <GitReposFolderView />
    },
    achievements: {
      title: "Achievements & Certificates",
      description: "Professional job simulations, technical credentials, and verified certifications.",
      items: (
        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                title: "Deloitte Cyber Job Simulation",
                organization: "Deloitte • Forage",
                date: "2024",
                category: "Cybersecurity & Risk",
                certificateUrl: "https://drive.google.com/file/d/1DPQWwiEMWF1w9j1MbVTO6CH3d75SNOba/view?usp=sharing",
                description: "Practical simulation tackling real-world cybersecurity scenarios, enterprise vulnerability assessments, network forensic analysis, and security architectures.",
                skills: ["Cyber Defense", "Risk Assessment", "Network Forensics", "Security Best Practices"]
              },
              {
                title: "Skyscanner Front-End Software Engineering",
                organization: "Skyscanner • Forage",
                date: "2024",
                category: "Software Engineering",
                certificateUrl: "https://drive.google.com/file/d/1VXrogIHqEqtRynTzt3BlNGDemikAKB2F/view?usp=sharing",
                description: "Built responsive user interface components, interactive date picker workflows, and practiced production-grade front-end code reviews following Skyscanner standards.",
                skills: ["React.js", "Front-End Architecture", "Design Systems", "Web Performance"]
              },
              {
                title: "AI Search Operating System Certification",
                organization: "Semrush Academy",
                date: "2025",
                category: "AI & Search Systems",
                certificateUrl: "https://drive.google.com/file/d/1Xcm4d4B_ZkOzieNIk0rwETh2HmspC-zJ/view?usp=sharing",
                description: "Specialized certification in generative AI search algorithms, Search Generative Experience (SGE), semantic entity authority, and high-impact SEO discoverability.",
                skills: ["AI Search Engines", "Semrush", "SGE Optimization", "Semantic SEO"]
              },
              {
                title: "AI Tool Workshop Certification",
                organization: "be10x",
                date: "2024",
                category: "Artificial Intelligence",
                certificateUrl: "https://drive.google.com/file/d/1j9JwBxuDwv4PqUqpXz2oRdQXcCnKH-vW/view?usp=sharing",
                description: "Intensive hands-on workshop focused on generative AI tools, prompt engineering methodologies, agentic workflows, and productivity automation systems.",
                skills: ["Generative AI", "Prompt Engineering", "Workflow Automation", "LLM APIs"]
              }
            ].map((cert, index) => (
              <div 
                key={index}
                className="bg-[#16181d] p-6 rounded-2xl border border-white/10 hover:border-amber-400/30 transition-all flex flex-col justify-between group shadow-lg"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      {cert.category}
                    </span>
                    <span className="text-xs text-white/40">{cert.date}</span>
                  </div>

                  <h4 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors mt-2 mb-1">
                    {cert.title}
                  </h4>
                  <p className="text-xs font-medium text-white/50 mb-3">{cert.organization}</p>
                  
                  <p className="text-sm text-white/70 leading-relaxed mb-5">
                    {cert.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-1.5">
                    {cert.skills.map(skill => (
                      <span 
                        key={skill} 
                        className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 text-white/60 border border-white/5"
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
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300/90 hover:text-amber-200 transition-colors shrink-0 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20"
                    >
                      <span>View Certificate</span>
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    skills: {
      title: "Technical Skills",
      description: "Technologies, tools, and methodologies I work with on a daily basis.",
      items: <SkillsFolderView />
    }
  };

  // Backwards compatibility alias for experience -> repositories
  contentMap.experience = contentMap.repositories;

  if (folderId === 'ar-restaurant-pos' || folderId === 'healthsaral' || folderId === 'hrms') {
    return (
      <div className="min-h-screen bg-[#0d0d0d] text-white p-6 md:p-12 lg:p-20 font-sans overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <CaseStudyView slug={folderId} onBack={() => window.location.href = '/'} />
        </div>
      </div>
    );
  }

  const data = contentMap[folderId] || {
    title: "Folder Content",
    description: "Details for this folder will be displayed here.",
    items: null
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white p-6 md:p-12 lg:p-20 font-sans overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => window.location.href = '/'}
          className="flex items-center gap-2 text-white/50 hover:text-white mb-12 transition-colors group cursor-pointer"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Desktop</span>
        </button>
        
        <header className="space-y-4 mb-12">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight capitalize">
            {data.title}.
          </h1>
          <p className="text-xl text-white/60 max-w-2xl">
            {data.description}
          </p>
        </header>

        {data.items}
      </div>
    </div>
  );
}
