import { FileText } from 'lucide-react';
import { DraggableObject } from './DraggableObject';
import { siteData } from '../../data/site';

interface Props {
  zIndex: number;
  onBringToFront: () => void;
  onClick: () => void;
}

export function PdfFile({ zIndex, onBringToFront, onClick }: Props) {
  return (
    <DraggableObject
      id="pdfFile"
      initialX={siteData.positions.pdf.x}
      initialY={siteData.positions.pdf.y}
      zIndex={zIndex}
      onBringToFront={onBringToFront}
    >
      <div 
        className="flex flex-col items-center group w-[100px] cursor-pointer outline-none"
        onClick={onClick}
        tabIndex={0}
      >
        <div className="w-[72px] h-[92px] bg-white rounded-lg shadow-md border border-gray-200 relative mb-2 flex flex-col p-2 group-hover:scale-105 group-hover:shadow-lg transition-all">
          {/* Folded corner */}
          <div className="absolute top-0 right-0 w-0 h-0 border-l-[16px] border-l-transparent border-t-[16px] border-t-[#f0f0f0]" style={{ boxShadow: '-2px 2px 3px rgba(0,0,0,0.05)' }} />
          <div className="absolute top-0 right-0 w-[16px] h-[16px] bg-[#f0f0f0] rounded-bl-lg" />
          
          <div className="flex justify-between items-start mb-3">
            <FileText size={16} className="text-red-500" strokeWidth={2.5} />
            <span className="text-[9px] font-bold text-gray-500 mr-3 uppercase">pdf</span>
          </div>

          <div className="flex flex-col gap-[3px] w-full px-1">
            <div className="w-full h-[2px] bg-gray-200 rounded-full" />
            <div className="w-[85%] h-[2px] bg-gray-200 rounded-full" />
            <div className="w-[95%] h-[2px] bg-gray-200 rounded-full" />
            <div className="w-[60%] h-[2px] bg-gray-200 rounded-full mt-1" />
            <div className="w-full h-[2px] bg-gray-200 rounded-full" />
          </div>
        </div>

        <span className="text-white text-[13px] font-medium drop-shadow-md group-focus:bg-blue-500/50 group-focus:rounded px-1">
          Resume.pdf
        </span>
      </div>
    </DraggableObject>
  );
}
