import { ArrowUpRight, Eye, Clock } from 'lucide-react';
import { siteData } from '../../data/site';
import { DraggableObject } from './DraggableObject';

interface Props {
  zIndex: number;
  onBringToFront: () => void;
  constraintsRef?: React.RefObject<HTMLElement>;
}

export function PostCard({ zIndex, onBringToFront, constraintsRef }: Props) {
  return (
    <DraggableObject
      id="postCard"
      initialX={siteData.positions.postCard.x}
      initialY={siteData.positions.postCard.y}
      rotation={1.2}
      zIndex={zIndex}
      onBringToFront={onBringToFront}
      constraintsRef={constraintsRef}
    >
      <div 
        className="w-[300px] bg-white rounded-2xl p-5 shadow-[0_20px_40px_rgba(0,0,0,0.35)] cursor-grab relative overflow-hidden select-none" 
        style={{ color: '#1a1a1a', animation: 'float 6s ease-in-out infinite' }}
      >
        {/* Subtle background pattern watermark reduced to ~4% opacity */}
        <div 
          className="absolute right-0 top-0 bottom-0 w-[120px] opacity-[0.04] pointer-events-none" 
          style={{ 
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M10 0l10 10-10 10L0 10z\' fill=\'%23000\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")', 
            backgroundSize: '20px 20px' 
          }} 
        />

        <div className="block outline-none">
          <div className="flex items-start justify-between mb-3 relative z-10">
            <div className="flex items-center gap-3">
              <img src={siteData.postCard.avatar} alt="HealthSaral Avatar" className="w-10 h-10 rounded-full bg-gray-100 object-cover" />
              <div>
                <div className="font-bold text-[15px] leading-tight">HealthSaral</div>
                <div className="text-gray-500 text-[13px]">Live project · healthsaral.in</div>
              </div>
            </div>
            <a 
              href={siteData.postCard.url} 
              target="_blank" 
              rel="noreferrer" 
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer relative z-20"
            >
              <ArrowUpRight size={18} className="text-gray-400" />
            </a>
          </div>

          <p className="text-[14px] leading-relaxed mb-4 text-gray-800 whitespace-pre-wrap relative z-10">
            {siteData.postCard.text}
          </p>

          <div className="flex items-center justify-end gap-4 text-gray-400 text-[12px] font-medium relative z-10">
            <div className="flex items-center gap-1.5"><Eye size={14} /> <span>{siteData.postCard.views}</span></div>
            <div className="flex items-center gap-1.5"><Clock size={14} /> <span>{siteData.postCard.timeAgo}</span></div>
          </div>
        </div>
      </div>
    </DraggableObject>
  );
}
