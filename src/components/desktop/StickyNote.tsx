import type React from 'react';
import { Send, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { siteData } from '../../data/site';
import { DraggableObject } from './DraggableObject';

interface Props {
  zIndex: number;
  onBringToFront: () => void;
  constraintsRef?: React.RefObject<HTMLElement>;
}

export function StickyNote({ zIndex, onBringToFront, constraintsRef }: Props) {
  return (
    <DraggableObject
      id="stickyNote"
      initialX={siteData.positions.stickyNote.x}
      initialY={siteData.positions.stickyNote.y}
      rotation={-1.2}
      zIndex={zIndex}
      onBringToFront={onBringToFront}
      constraintsRef={constraintsRef}
    >
      <motion.div 
        className="w-[285px] max-w-[310px] rounded-[24px] p-6 pb-6 relative group select-none flex flex-col justify-between" 
        style={{ 
          background: 'linear-gradient(135deg, var(--color-brand-yellow-from), var(--color-brand-yellow-to))', 
          color: '#1a1a1a', 
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)' 
        }}
      >
        <div>
          <h1 className="text-[22px] font-medium leading-[1.26] tracking-[-0.015em] text-[#141414] mb-2.5">
            Hi, I’m Nitin, Student at SVNIT
          </h1>
          <p className="text-[14px] font-medium text-black/85 mb-3 leading-snug">
            Data Analyst, AI-assisted developer
          </p>
          <p className="text-[13.5px] leading-[1.5] text-black/75 mb-6 font-normal">
            I turn raw data into <strong className="font-semibold text-black">clear insights</strong>, Building <strong className="font-semibold text-black">&ldquo;AI assisted Saas&rdquo;</strong> tools that <strong className="font-semibold text-black">solving real-world problem</strong>.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <a 
            href={siteData.socialLinks.email} 
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-black/10 hover:bg-black/15 active:scale-95 transition-all text-[13.5px] font-semibold text-[#141414]"
          >
            <Send size={14} className="text-black/80 fill-black/60 -rotate-12" />
            <span>Let’s talk</span>
          </a>
          <span className="text-black/35 font-normal">·</span>
          <a 
            href="/about" 
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-[13.5px] font-medium text-black/75 hover:text-black transition-colors"
          >
            <span>About</span>
            <ArrowRight size={13} />
          </a>
        </div>
      </motion.div>
    </DraggableObject>
  );
}
