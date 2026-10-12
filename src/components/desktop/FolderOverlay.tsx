import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { ProjectsFolderView } from "../deck/ProjectsFolderView";
import { GitReposFolderView } from "../deck/GitReposFolderView";
import { AchievementsFolderView } from "../deck/AchievementsFolderView";
import { CaseStudyView } from "../deck/CaseStudyView";
import { SkillsFolderView } from "../skills/SkillsFolderView";
import { FolderContent } from "../../FolderContent";

type Props = {
  isOpen: boolean;
  folderId: string | null;
  initialCaseStudySlug?: string | null;
  onClose: () => void;
};

export function FolderOverlay({
  isOpen,
  folderId,
  initialCaseStudySlug = null,
  onClose,
}: Props) {
  const isCaseStudySlug =
    folderId === "ar-restaurant-pos" ||
    folderId === "healthsaral" ||
    folderId === "hrms" ||
    folderId === "portfolio";

  const getInitialSlug = () =>
    initialCaseStudySlug || (isCaseStudySlug ? folderId : null);

  const [activeCaseStudy, setActiveCaseStudy] = useState<string | null>(getInitialSlug);
  const [prevFolderId, setPrevFolderId] = useState(folderId);

  if (prevFolderId !== folderId) {
    setPrevFolderId(folderId);
    setActiveCaseStudy(getInitialSlug());
  }

  // Handle Esc key to close overlay
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !folderId) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="folder-overlay"
        role="dialog"
        aria-modal="true"
        aria-label="Folder View"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="fixed inset-0 z-40 flex flex-col bg-[#070a10] will-change-transform transform-gpu"
      >
        {/* Top Control Bar (positioned below TopBar at top-20) */}
        <div className="pt-20 px-6 sm:px-10 flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-medium uppercase tracking-wider text-white/50">
              {activeCaseStudy
                ? `Case Study / ${activeCaseStudy}`
                : folderId === "projects"
                ? "Interactive Projects Deck"
                : folderId === "repositories"
                ? "Git Repositories"
                : folderId === "skills"
                ? "Technical Skills"
                : folderId === "achievements"
                ? "Achievements & Certificates"
                : `Folder / ${folderId}`}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-[11px] font-mono text-white/40 border border-white/10 px-2 py-0.5 rounded">
              Esc to close
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              title="Close (Esc)"
              className="group flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-all hover:scale-105 hover:border-white/30 hover:bg-rose-500/20 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              <X size={17} className="transition-transform duration-200 group-hover:rotate-90 group-hover:text-rose-300" />
            </button>
          </div>
        </div>

        {/* Scrollable content container with bottom padding for ChatBar */}
        <div
          className={`flex-1 overflow-y-auto overflow-x-hidden px-4 md:px-8 ${
            folderId === "repositories"
              ? "py-4 pb-32"
              : folderId === "skills" || folderId === "achievements"
              ? "py-6 pb-36"
              : "py-6 pb-28"
          }`}
        >
          {activeCaseStudy ? (
            <CaseStudyView
              slug={activeCaseStudy}
              onBack={() => {
                if (folderId === "projects") {
                  setActiveCaseStudy(null);
                } else {
                  onClose();
                }
              }}
            />
          ) : folderId === "projects" ? (
            <ProjectsFolderView
              onOpenCaseStudy={(slug) => {
                setActiveCaseStudy(slug);
              }}
            />
          ) : folderId === "repositories" ? (
            <GitReposFolderView />
          ) : folderId === "skills" ? (
            <SkillsFolderView />
          ) : folderId === "achievements" ? (
            <AchievementsFolderView />
          ) : isCaseStudySlug ? (
            <CaseStudyView slug={folderId} onBack={onClose} />
          ) : (
            <div className="max-w-4xl mx-auto">
              <FolderContent folderId={folderId} />
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
