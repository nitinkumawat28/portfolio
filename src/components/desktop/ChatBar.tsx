import { MessageCircle, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatBarProps {
  onOpenFolder?: (id: string) => void;
}

export function ChatBar({ onOpenFolder }: ChatBarProps = {}) {
  const [expanded, setExpanded] = useState(false);
  const [inputVal, setInputVal] = useState('');

  // Close on Escape key
  useEffect(() => {
    if (!expanded) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpanded(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expanded]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    window.location.href = `mailto:nitinkumawat2807@gmail.com?subject=Message from Portfolio&body=${encodeURIComponent(inputVal)}`;
    setInputVal('');
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50">
      <AnimatePresence mode="wait">
        {!expanded ? (
          <motion.div
            key="chat-collapsed"
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="w-[280px] h-[52px] rounded-full bg-[#121316] border border-white/10 shadow-2xl flex items-center px-5 gap-3 text-white/50 font-mono text-[14px] cursor-pointer hover:bg-[#1a1b22] hover:text-white/80 transition-colors will-change-transform"
            onClick={() => setExpanded(true)}
          >
            <MessageCircle size={18} className="text-white/60" />
            <span>Message me...</span>
          </motion.div>
        ) : (
          <motion.div
            key="chat-expanded"
            initial={{ opacity: 0, y: 16, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.94 }}
            transition={{ type: "spring", damping: 26, stiffness: 340 }}
            className="w-[320px] h-[400px] rounded-2xl bg-[#121316] border border-white/12 shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden will-change-transform"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#16171d]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-white font-medium text-[15px]">Chat with Nitin</span>
              </div>
              <button 
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white text-sm transition-colors"
                onClick={(e) => { e.stopPropagation(); setExpanded(false); }}
                aria-label="Close chat"
              >
                <X size={15} />
              </button>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 text-[14px] overscroll-contain">
              <div className="self-start bg-[#1e2028] text-white px-4 py-2 rounded-2xl rounded-tl-sm max-w-[85%] leading-relaxed border border-white/5">
                Hi! I'm Nitin. I build AI-powered web apps. What are you working on?
              </div>
              <div className="self-start bg-[#1e2028] text-white px-4 py-2 rounded-2xl rounded-tl-sm max-w-[85%] leading-relaxed border border-white/5">
                The fastest way to reach me is email: nitinkumawat2807@gmail.com
                <a href="mailto:nitinkumawat2807@gmail.com" className="mt-2 block w-max px-3 py-1.5 bg-blue-500 hover:bg-blue-600 rounded-lg text-xs font-semibold text-white transition-colors">
                  Email me
                </a>
              </div>
              <div className="self-start bg-[#1e2028] text-white px-4 py-2 rounded-2xl rounded-tl-sm max-w-[85%] leading-relaxed border border-white/5">
                If you're asking about projects, here are my top 3:
                <div className="mt-2 flex flex-col gap-1">
                  <a 
                    href="/folder/ar-restaurant-pos" 
                    onClick={(e) => {
                      if (onOpenFolder) {
                        e.preventDefault();
                        onOpenFolder('ar-restaurant-pos');
                      }
                    }}
                    className="text-blue-400 hover:underline text-xs"
                  >
                    1. 3D AR Restaurant POS
                  </a>
                  <a 
                    href="/folder/healthsaral" 
                    onClick={(e) => {
                      if (onOpenFolder) {
                        e.preventDefault();
                        onOpenFolder('healthsaral');
                      }
                    }}
                    className="text-blue-400 hover:underline text-xs"
                  >
                    2. HealthSaral AI Analyzer
                  </a>
                  <a 
                    href="/folder/hrms" 
                    onClick={(e) => {
                      if (onOpenFolder) {
                        e.preventDefault();
                        onOpenFolder('hrms');
                      }
                    }}
                    className="text-blue-400 hover:underline text-xs"
                  >
                    3. AI-Powered HRMS
                  </a>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleSend} className="p-3 border-t border-white/10 bg-[#16171d]">
              <div className="relative">
                <input 
                  type="text" 
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Type a message..." 
                  className="w-full bg-[#20222a] text-white placeholder-white/40 rounded-full py-2.5 pl-4 pr-10 text-[14px] outline-none border border-transparent focus:border-white/20 transition-colors"
                />
                <button 
                  type="submit"
                  className="absolute right-1 top-1 w-7 h-7 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center text-white transition-colors"
                  aria-label="Send message"
                >
                  ↑
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
