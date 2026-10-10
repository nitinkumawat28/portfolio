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
}

export function Folder({ folder, initialX, initialY, zIndex, onBringToFront, onClick }: Props) {
  const isPink = folder.color === 'pink';
  
  const backColor = isPink ? '#9d4edd' : '#a3a3a3';
  const frontColor = isPink ? '#d946ef' : '#d4d4d4';
  const shadowColor = isPink ? 'rgba(217, 70, 239, 0.4)' : 'rgba(0,0,0,0.4)';

  return (
    <DraggableObject
      id={`folder_${folder.id}`}
      initialX={initialX}
      initialY={initialY}
      zIndex={zIndex}
      onBringToFront={onBringToFront}
    >
      <motion.div 
        className="relative flex flex-col items-center group w-[140px] outline-none"
        onClick={onClick}
        whileHover="hover"
        whileTap="tap"
        tabIndex={0}
      >
        {/* Folder Icon Container */}
        <div className="relative w-[110px] h-[85px] mb-2 drop-shadow-xl perspective-1000">
          
          {/* Back flap */}
          <div 
            className="absolute bottom-0 left-0 w-full h-[75px] rounded-t-lg rounded-b-xl"
            style={{ backgroundColor: backColor }}
          >
            {/* Folder tab (top left) */}
            <div className="absolute -top-[10px] left-0 w-[45px] h-[15px] rounded-t-lg" style={{ backgroundColor: backColor }} />
          </div>

          {/* Peeking Documents */}
          <div className="absolute bottom-[10px] left-[10px] right-[10px] h-[65px] z-10 flex justify-center">
            {/* Doc 1 (Back) */}
            <motion.div 
              className="absolute w-[80%] h-full bg-white rounded shadow-sm border border-gray-200 origin-bottom"
              variants={{ hover: { rotate: -12, y: -15, scale: 1.05 } }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
               <div className="w-full h-4 bg-gray-100 rounded-t border-b border-gray-200" />
            </motion.div>
            
            {/* Doc 2 (Middle) */}
            <motion.div 
              className="absolute w-[85%] h-[95%] bg-[#1a1a1a] rounded shadow-sm border border-gray-700 origin-bottom"
              variants={{ hover: { rotate: 5, y: -20, scale: 1.1 } }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
               <div className="w-full h-3 bg-gray-800 rounded-t" />
            </motion.div>
            
            {/* Doc 3 (Front) */}
            <motion.div 
              className="absolute w-[90%] h-[90%] bg-white rounded shadow-sm border border-gray-200 origin-bottom overflow-hidden"
              variants={{ hover: { rotate: 18, y: -10, scale: 1.05 } }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
               <div className="w-full h-full p-1 flex flex-col gap-1">
                 <div className="w-full h-6 bg-pink-100 rounded-[2px]" />
                 <div className="w-3/4 h-1 bg-gray-200 rounded-full" />
                 <div className="w-1/2 h-1 bg-gray-200 rounded-full" />
               </div>
            </motion.div>
          </div>

          {/* Front flap */}
          <motion.div 
            className="absolute bottom-0 left-0 w-full h-[65px] rounded-xl z-20 origin-bottom backdrop-blur-md border-t border-white/20 flex items-center justify-center"
            style={{ backgroundColor: frontColor, boxShadow: `0 -2px 10px ${shadowColor}` }}
            variants={{ hover: { rotateX: -20 } }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
             {folder.isFeatured && (
               <Star className="text-black/10 w-10 h-10 stroke-[1.5px]" fill="currentColor" />
             )}
          </motion.div>
        </div>

        {/* Label */}
        <div className="text-white text-[13px] font-medium text-center leading-tight max-w-[130px] drop-shadow-md px-1 group-focus:bg-blue-500/50 group-focus:rounded group-focus:outline-none">
          {folder.title}
        </div>
      </motion.div>
    </DraggableObject>
  );
}
