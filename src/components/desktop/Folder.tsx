import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { DraggableObject } from './DraggableObject';

interface FolderData {
  id: string;
  title: string;
  isFeatured: boolean;
  color: string;
}

interface Props {
  folder: FolderData;
  initialX: string;
  initialY: string;
  zIndex: number;
  onBringToFront: () => void;
  onClick: () => void;
  constraintsRef?: React.RefObject<HTMLElement>;
}

export function Folder({ folder, initialX, initialY, zIndex, onBringToFront, onClick, constraintsRef }: Props) {
  const isPink = folder.color === 'pink';
  const isAmber = folder.color === 'amber' || (!folder.color && folder.isFeatured);
  const isCyan = folder.color === 'cyan';
  const isEmerald = folder.color === 'emerald';
  
  // Distinct colors and tints for folders, with starred folder having a warm amber/gold tint
  let backColor = '#a3a3a3';
  let frontColor = '#d4d4d4';
  let shadowColor = 'rgba(0,0,0,0.35)';

  if (isEmerald) {
    backColor = '#047857';
    frontColor = '#10b981';
    shadowColor = 'rgba(16, 185, 129, 0.45)';
  } else if (isAmber) {
    // Starred / Featured Folder: distinct golden-amber tint
    backColor = '#d97706';
    frontColor = '#f59e0b';
    shadowColor = 'rgba(245, 158, 11, 0.45)';
  } else if (isPink) {
    backColor = '#9d4edd';
    frontColor = '#d946ef';
    shadowColor = 'rgba(217, 70, 239, 0.4)';
  } else if (isCyan) {
    backColor = '#0284c7';
    frontColor = '#38bdf8';
    shadowColor = 'rgba(56, 189, 248, 0.4)';
  }

  return (
    <DraggableObject
      id={`folder_${folder.id}`}
      initialX={initialX}
      initialY={initialY}
      zIndex={zIndex}
      onBringToFront={onBringToFront}
      constraintsRef={constraintsRef}
    >
      <motion.div 
        className="relative flex flex-col items-center group w-[140px] outline-none select-none cursor-pointer"
        onClick={onClick}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        tabIndex={0}
      >
        {/* Folder Icon Container */}
        <div className="relative w-[112px] h-[86px] mb-2 drop-shadow-xl" style={{ perspective: 1000 }}>
          
          {/* Back flap */}
          <div 
            className="absolute bottom-0 left-0 w-full h-[76px] rounded-t-lg rounded-b-xl transition-colors duration-300"
            style={{ backgroundColor: backColor }}
          >
            {/* Folder tab (top left) */}
            <div 
              className="absolute -top-[10px] left-0 w-[45px] h-[15px] rounded-t-lg transition-colors duration-300" 
              style={{ backgroundColor: backColor }} 
            />
          </div>

          {/* Peeking Documents / Thumbnail Fan-out */}
          <div className="absolute bottom-[10px] left-[10px] right-[10px] h-[68px] z-10 flex justify-center">
            {/* Thumbnail Card 1 (Fanned left) */}
            <motion.div 
              className="absolute w-[80%] h-full bg-white rounded-md shadow-md border border-gray-200/90 origin-bottom-center overflow-hidden"
              variants={{ 
                rest: { rotate: -3, y: 0, scale: 0.95 },
                hover: { rotate: -22, y: -24, x: -14, scale: 1.06 } 
              }}
              transition={{ type: 'spring', stiffness: 380, damping: 22 }}
            >
              <div className="w-full h-3.5 bg-gradient-to-r from-gray-100 to-gray-200 border-b border-gray-200 flex items-center px-1.5 gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
              </div>
              <div className="p-1.5 space-y-1">
                <div className="w-3/4 h-1.5 bg-gray-200 rounded-full" />
                <div className="w-1/2 h-1 bg-gray-150 rounded-full" />
                <div className="w-full h-4 bg-gray-100 rounded mt-1 flex items-center justify-center">
                  <div className="w-4 h-1.5 bg-blue-300/60 rounded" />
                </div>
              </div>
            </motion.div>
            
            {/* Thumbnail Card 2 (Fanned center high) */}
            <motion.div 
              className="absolute w-[84%] h-[98%] bg-[#1c1d21] rounded-md shadow-md border border-gray-700/80 origin-bottom-center overflow-hidden"
              variants={{ 
                rest: { rotate: 2, y: -2, scale: 0.98 },
                hover: { rotate: 0, y: -32, scale: 1.12 } 
              }}
              transition={{ type: 'spring', stiffness: 380, damping: 22 }}
            >
              <div className="w-full h-3 bg-[#2a2b30] border-b border-gray-700 flex items-center px-1.5 gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400/80" />
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/80" />
              </div>
              <div className="p-1.5 space-y-1">
                <div className="w-2/3 h-1.5 bg-white/30 rounded-full" />
                <div className="w-full h-4 bg-emerald-500/20 border border-emerald-500/30 rounded mt-1 flex items-center justify-center">
                  <span className="text-[7px] text-emerald-300 font-mono font-bold tracking-tight">AI • DATA</span>
                </div>
              </div>
            </motion.div>
            
            {/* Thumbnail Card 3 (Fanned right) */}
            <motion.div 
              className="absolute w-[88%] h-[92%] bg-white rounded-md shadow-md border border-gray-200/90 origin-bottom-center overflow-hidden"
              variants={{ 
                rest: { rotate: 8, y: -1, scale: 1 },
                hover: { rotate: 24, y: -22, x: 14, scale: 1.06 } 
              }}
              transition={{ type: 'spring', stiffness: 380, damping: 22 }}
            >
              <div className="w-full h-3.5 bg-gradient-to-r from-gray-100 to-gray-200 border-b border-gray-200 flex items-center px-1.5 gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              </div>
              <div className="p-1.5 space-y-1">
                <div className="w-full h-4 bg-pink-100 rounded flex items-center px-1">
                  <div className="w-2 h-2 rounded bg-pink-400 mr-1" />
                  <div className="w-8 h-1 bg-pink-300 rounded" />
                </div>
                <div className="w-3/4 h-1 bg-gray-200 rounded-full" />
              </div>
            </motion.div>
          </div>

          {/* Front flap */}
          <motion.div 
            className="absolute bottom-0 left-0 w-full h-[65px] rounded-xl z-20 origin-bottom backdrop-blur-md border-t border-white/30 flex items-center justify-center transition-colors duration-300"
            style={{ backgroundColor: frontColor, boxShadow: `0 -2px 12px ${shadowColor}` }}
            variants={{ 
              rest: { rotateX: 0 },
              hover: { rotateX: -26 } 
            }}
            transition={{ type: 'spring', stiffness: 380, damping: 22 }}
          >
             {folder.isFeatured && (
               <div className="flex items-center justify-center p-1 rounded-full bg-white/20 shadow-inner">
                 <Star className="text-amber-950/80 w-6 h-6 stroke-[1.8px]" fill="#fef08a" />
               </div>
             )}
          </motion.div>
        </div>

        {/* Label with subtle text-shadow for crisp legibility */}
        <div 
          className="text-white text-[13px] font-medium text-center leading-tight max-w-[130px] px-2 py-0.5 rounded transition-all group-focus:bg-blue-500/50 group-focus:outline-none"
          style={{
            textShadow: '0 1px 3px rgba(0, 0, 0, 0.9), 0 2px 6px rgba(0, 0, 0, 0.7)'
          }}
        >
          {folder.title}
        </div>
      </motion.div>
    </DraggableObject>
  );
}
