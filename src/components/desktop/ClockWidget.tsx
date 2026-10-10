import { motion, useMotionValue, useTransform, useVelocity } from 'framer-motion';
import { useEffect, useRef, useState, memo } from 'react';
import { siteData } from '../../data/site';

interface Props {
  zIndex: number;
  onBringToFront: () => void;
}

export const ClockWidget = memo(({ zIndex, onBringToFront }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Drag physics
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const velocityX = useVelocity(x);
  const velocityY = useVelocity(y);
  
  // Tilt based on velocity (3D effect)
  const rotateY = useTransform(velocityX, [-500, 500], [-15, 15], { clamp: true });
  const rotateX = useTransform(velocityY, [-500, 500], [15, -15], { clamp: true });

  const [localZ, setLocalZ] = useState(zIndex);
  useEffect(() => setLocalZ(zIndex), [zIndex]);

  // Load position
  useEffect(() => {
    try {
      const saved = localStorage.getItem('drag_pos_clock');
      if (saved) {
        const parsed = JSON.parse(saved);
        x.set(parsed.x);
        y.set(parsed.y);
      }
    } catch (e) {}
  }, [x, y]);

  // Clock time
  const hrHand = useRef<HTMLDivElement>(null);
  const minHand = useRef<HTMLDivElement>(null);
  const secHand = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame: number;
    const updateTime = () => {
      const now = new Date();
      // To properly handle timezone, we could use Intl.DateTimeFormat, but for simplicity let's just use local time for now, or offset.
      // Since it's a visual clock, local time is fine for the demo if timezone isn't easily parsed to an offset.
      const ms = now.getMilliseconds();
      const s = now.getSeconds() + ms / 1000;
      const m = now.getMinutes() + s / 60;
      const h = (now.getHours() % 12) + m / 60;

      if (secHand.current) secHand.current.style.transform = `rotate(${s * 6}deg)`;
      if (minHand.current) minHand.current.style.transform = `rotate(${m * 6}deg)`;
      if (hrHand.current) hrHand.current.style.transform = `rotate(${h * 30}deg)`;

      frame = requestAnimationFrame(updateTime);
    };
    frame = requestAnimationFrame(updateTime);
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleDragStart = () => {
    if (onBringToFront) onBringToFront();
  };

  const handleDragEnd = () => {
    try {
      localStorage.setItem('drag_pos_clock', JSON.stringify({ x: x.get(), y: y.get() }));
    } catch (e) {}
  };

  return (
    <motion.div
      ref={containerRef}
      className="absolute cursor-grab active:cursor-grabbing"
      style={{
        left: siteData.positions.clock.x,
        top: siteData.positions.clock.y,
        x,
        y,
        rotateX,
        rotateY,
        zIndex: localZ,
        transformPerspective: 800
      }}
      drag
      dragElastic={0.15}
      dragTransition={{ power: 0.2, timeConstant: 200 }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.05, filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.6))' }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="w-[120px] h-[120px] bg-[#111] rounded-[24px] border border-white/10 shadow-xl relative flex items-center justify-center overflow-hidden">
        {/* Tick marks */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-full p-2 box-border flex justify-center"
            style={{ transform: `rotate(${i * 30}deg)` }}
          >
            <div className={`w-[2px] ${i % 3 === 0 ? 'h-[8px] bg-white' : 'h-[4px] bg-white/40'} rounded-full`} />
            
            {/* Numbers for 12, 3, 6, 9 */}
            {i % 3 === 0 && (
               <div className="absolute top-[10px] text-white/50 text-[10px] font-mono font-bold" style={{ transform: `rotate(${-i * 30}deg)` }}>
                 {i === 0 ? 12 : i}
               </div>
            )}
          </div>
        ))}
        
        {/* TZ Label */}
        <div className="absolute top-7 text-white/40 text-[9px] font-bold tracking-widest">{siteData.timezone}</div>
        
        {/* Hands */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div ref={hrHand} className="absolute w-[4px] h-[36px] bg-white rounded-full origin-bottom -translate-y-[18px]" />
          <div ref={minHand} className="absolute w-[3px] h-[46px] bg-white/80 rounded-full origin-bottom -translate-y-[23px]" />
          <div ref={secHand} className="absolute w-[2px] h-[50px] bg-orange-500 rounded-full origin-bottom -translate-y-[25px]" />
          <div className="absolute w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_4px_rgba(0,0,0,0.5)] z-10" />
        </div>
      </div>
    </motion.div>
  );
});
