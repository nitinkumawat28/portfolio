import { MessageCircle } from 'lucide-react';
import { useState } from 'react';

interface ChatBarProps {
  onOpenFolder?: (id: string) => void;
}

export function ChatBar({ onOpenFolder }: ChatBarProps = {}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div 
        className={`bg-[#111] backdrop-blur-md border border-white/10 overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] shadow-2xl ${
          expanded ? 'w-[320px] h-[400px] rounded-2xl flex flex-col' : 'w-[280px] h-[52px] rounded-full cursor-pointer hover:bg-[#1a1a1a]'
        }`}
        onClick={() => !expanded && setExpanded(true)}
      >
        {!expanded ? (
          <div className="w-full h-full flex items-center px-5 gap-3 text-white/50 font-mono text-[14px]">
            <MessageCircle size={18} />
            <span>Message me...</span>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <span className="text-white font-medium text-[15px]">Chat with Nitin</span>
              <button 
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-sm"
                onClick={(e) => { e.stopPropagation(); setExpanded(false); }}
              >
                ×
              </button>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 text-[14px]">
              <div className="self-start bg-[#222] text-white px-4 py-2 rounded-2xl rounded-tl-sm max-w-[85%] leading-relaxed">
                Hi! I'm Nitin. I build AI-powered web apps. What are you working on?
              </div>
              <div className="self-start bg-[#222] text-white px-4 py-2 rounded-2xl rounded-tl-sm max-w-[85%] leading-relaxed">
                The fastest way to reach me is email: nitinkumawat2807@gmail.com
                <a href="mailto:nitinkumawat2807@gmail.com" className="mt-2 block w-max px-3 py-1.5 bg-blue-500 hover:bg-blue-600 rounded-lg text-xs font-semibold transition-colors">
                  Email me
                </a>
              </div>
              <div className="self-start bg-[#222] text-white px-4 py-2 rounded-2xl rounded-tl-sm max-w-[85%] leading-relaxed">
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
            
            <div className="p-3 border-t border-white/10">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Type a message..." 
                  className="w-full bg-[#222] text-white placeholder-white/40 rounded-full py-2.5 pl-4 pr-10 text-[14px] outline-none border border-transparent focus:border-white/20 transition-colors"
                />
                <button className="absolute right-1 top-1 w-7 h-7 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center text-white transition-colors">
                  ↑
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
