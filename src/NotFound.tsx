import { ArrowLeft, Home, FolderKanban, GitBranch, Wrench, Award, User, AlertOctagon } from 'lucide-react';

interface NotFoundProps {
  path?: string;
}

export function NotFound({ path }: NotFoundProps) {
  const currentPath = path || (typeof window !== 'undefined' ? window.location.pathname : '');

  const quickLinks = [
    { label: 'Projects', href: '/folder/projects', icon: FolderKanban, color: 'text-pink-400 border-pink-500/20 bg-pink-500/10' },
    { label: 'Git Repositories', href: '/folder/repositories', icon: GitBranch, color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10' },
    { label: 'Skills', href: '/folder/skills', icon: Wrench, color: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/10' },
    { label: 'Achievements', href: '/folder/achievements', icon: Award, color: 'text-amber-400 border-amber-500/20 bg-amber-500/10' },
    { label: 'About Nitin', href: '/about', icon: User, color: 'text-purple-400 border-purple-500/20 bg-purple-500/10' },
  ];

  return (
    <div className="relative min-h-screen w-full bg-[#07090d] text-white flex flex-col justify-between p-6 sm:p-12 font-sans selection:bg-white/20 overflow-x-hidden">
      {/* Background ambient lighting */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-red-500/10 rounded-full blur-[140px] opacity-60" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[120px] opacity-40" />
      </div>

      {/* Top Bar */}
      <header className="relative z-10 flex items-center justify-between border-b border-white/10 pb-5 max-w-4xl mx-auto w-full">
        <button
          onClick={() => (window.location.href = '/')}
          className="flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors cursor-pointer group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Desktop</span>
        </button>

        <div className="flex items-center gap-2 font-mono text-xs text-red-400/90 border border-red-500/30 bg-red-500/10 px-3 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
          <span>HTTP 404 · NOT_FOUND</span>
        </div>
      </header>

      {/* Center 404 Hero */}
      <main className="relative z-10 max-w-2xl mx-auto w-full text-center py-12 sm:py-16 space-y-7">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/25 text-red-400 mb-2 shadow-lg shadow-red-500/10">
          <AlertOctagon size={32} />
        </div>

        <div className="space-y-3">
          <h1 className="text-7xl sm:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white/80 to-white/20 select-none">
            404
          </h1>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Lost in Cyberspace
          </h2>
          <p className="text-sm sm:text-base text-white/60 max-w-md mx-auto leading-relaxed">
            The requested route could not be found on this system.
          </p>
        </div>

        {/* Path Indicator */}
        {currentPath && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-white/70 max-w-full overflow-hidden text-ellipsis">
            <span className="text-white/40">Requested:</span>
            <span className="text-red-300 font-semibold truncate">{currentPath}</span>
          </div>
        )}

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-bold text-sm hover:bg-gray-200 transition-all hover:scale-105 active:scale-95 shadow-xl"
          >
            <Home size={16} />
            <span>Go to Desktop</span>
          </a>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 text-white font-semibold text-sm hover:bg-white/15 border border-white/10 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Go Back</span>
          </button>
        </div>

        {/* Quick Directory Exploration */}
        <div className="pt-10 border-t border-white/10 space-y-4">
          <p className="text-xs uppercase font-mono tracking-wider text-white/40">
            Or jump directly to a known section
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all hover:scale-105 ${link.color}`}
                >
                  <Icon size={14} />
                  <span>{link.label}</span>
                </a>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-4xl mx-auto w-full text-center border-t border-white/10 pt-5 text-xs text-white/40 font-mono">
        Nitin Kumawat · Portfolio OS · All rights reserved
      </footer>
    </div>
  );
}

export default NotFound;
