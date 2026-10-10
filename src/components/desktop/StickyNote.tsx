import { Send } from 'lucide-react';
import { siteData } from '../../data/site';
import { DraggableObject } from './DraggableObject';

interface Props {
  zIndex: number;
  onBringToFront: () => void;
}

export function StickyNote({ zIndex, onBringToFront }: Props) {
  return (
    <DraggableObject
      id="stickyNote"
      initialX={siteData.positions.stickyNote.x}
      initialY={siteData.positions.stickyNote.y}
      rotation={-2}
      zIndex={zIndex}
      onBringToFront={onBringToFront}
    >
      <div className="w-[320px] rounded-[20px] p-8 pb-10 relative" style={{ background: 'linear-gradient(135deg, var(--color-brand-yellow-from), var(--color-brand-yellow-to))', color: '#1a1a1a', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
        <h1 className="text-3xl font-medium leading-tight mb-5 tracking-tight">
          I'm {siteData.name.split(' ')[0]}, a {siteData.role} for {siteData.niche}
        </h1>
        <p className="text-sm font-medium mb-8 leading-relaxed opacity-90" dangerouslySetInnerHTML={{ __html: siteData.introParagraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
        
        <a href={siteData.socialLinks.telegram} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/10 hover:bg-black/15 transition-colors text-sm font-semibold">
          <Send size={16} />
          <span>Chat Me</span>
        </a>
      </div>
    </DraggableObject>
  );
}
