import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { ProjectsFolderView } from './components/deck/ProjectsFolderView';
import { GitReposFolderView } from './components/deck/GitReposFolderView';
import { CaseStudyView } from './components/deck/CaseStudyView';
import { SkillsFolderView } from './components/skills/SkillsFolderView';
import { AchievementsFolderView } from './components/deck/AchievementsFolderView';

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
      items: <AchievementsFolderView />
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
