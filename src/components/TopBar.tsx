import { useState } from 'react';
import { Mail, Download, Copy, Check } from 'lucide-react';
import { Eyes } from './Eyes';
import { siteData } from '../data/site';

const LinkedinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
);

const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
);

export function TopBar() {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const socialIconClass = "w-9 h-9 flex items-center justify-center rounded-full bg-white/5 backdrop-blur border border-white/10 hover:bg-white/10 hover:-translate-y-[2px] transition-all cursor-pointer text-white";
  const pillClass = "h-9 px-4 flex items-center gap-2 rounded-full bg-white/5 backdrop-blur border border-white/10 hover:bg-white/10 hover:-translate-y-[2px] transition-all cursor-pointer text-sm font-medium text-white";

  return (
    <header className="fixed top-0 left-0 right-0 h-20 flex items-center justify-between px-6 z-50">
      <div className="flex items-center gap-3">
        <Eyes />
        <span className="text-white font-semibold text-sm">Nitin Kumawat</span>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2">
          <a href={siteData.socialLinks.linkedin} className={socialIconClass} aria-label="LinkedIn" target="_blank" rel="noreferrer"><LinkedinIcon /></a>
          <a href={siteData.socialLinks.email} className={socialIconClass} aria-label="Email"><Mail size={16} /></a>
          <a href={siteData.socialLinks.github} className={socialIconClass} aria-label="GitHub" target="_blank" rel="noreferrer"><GithubIcon /></a>
        </div>
        
        <a href={siteData.customPdfBase64 || "/resume.pdf"} download="resume.pdf" className={`${pillClass} hidden sm:flex`}>
          <Download size={16} />
          <span>Get CV</span>
        </a>
        
        <button onClick={handleShare} className={pillClass}>
          {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
          <span>{copied ? 'Copied' : 'Share'}</span>
        </button>
      </div>
    </header>
  );
}
