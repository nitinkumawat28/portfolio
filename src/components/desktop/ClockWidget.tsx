import { motion, useMotionValue, useTransform, useVelocity, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState, memo } from 'react';
import { siteData } from '../../data/site';
import { useIsMobile } from '../../hooks/useIsMobile';

interface Props {
  zIndex: number;
  onBringToFront: () => void;
  constraintsRef?: React.RefObject<HTMLElement>;
}

export const ClockWidget = memo(({ zIndex, onBringToFront, constraintsRef }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Drag physics
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const velocityX = useVelocity(x);
  const velocityY = useVelocity(y);
  
  // Tilt based on velocity (3D effect)
  const rotateY = useTransform(velocityX, [-500, 500], [-15, 15], { clamp: true });
  const rotateX = useTransform(velocityY, [-500, 500], [15, -15], { clamp: true });

  const isMobile = useIsMobile();
  const [isDigital, setIsDigital] = useState<boolean>(() => {
    try {
      return localStorage.getItem('clock_mode_digital') === 'true';
    } catch {
      return false;
    }
  });

  // Digital clock time state
  const [digitalTime, setDigitalTime] = useState({
    hours: '12',
    minutes: '00',
    seconds: '00',
    secondsNum: 0,
    ampm: 'PM',
    day: 'SUN',
    date: '11'
  });

  // Load position
  useEffect(() => {
    try {
      const saved = localStorage.getItem('drag_pos_clock');
      if (saved) {
        const parsed = JSON.parse(saved);
        x.set(parsed.x);
        y.set(parsed.y);
      }
    } catch {}
  }, [x, y]);

  // Analog Clock time
  const hrHand = useRef<HTMLDivElement>(null);
  const minHand = useRef<HTMLDivElement>(null);
  const secHand = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame: number;
    const updateTime = () => {
      const now = new Date();
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

  // Update digital clock state
  useEffect(() => {
    const updateDigital = () => {
      const now = new Date();
      let h = now.getHours();
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12;
      h = h ? h : 12;
      const hh = String(h).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const ssNum = now.getSeconds();
      const ss = String(ssNum).padStart(2, '0');
      const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
      const day = days[now.getDay()];
      const date = String(now.getDate()).padStart(2, '0');
      setDigitalTime({ hours: hh, minutes: mm, seconds: ss, secondsNum: ssNum, ampm, day, date });
    };
    updateDigital();
    const interval = setInterval(updateDigital, 1000);
    return () => clearInterval(interval);
  }, []);

  const pointerStart = useRef({ x: 0, y: 0, time: 0 });
  const isDraggingRef = useRef(false);

  const handleDragStart = () => {
    isDraggingRef.current = true;
    if (onBringToFront) onBringToFront();
  };

  const handleDragEnd = () => {
    try {
      localStorage.setItem('drag_pos_clock', JSON.stringify({ x: x.get(), y: y.get() }));
    } catch {}
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 120);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerStart.current = { x: e.clientX, y: e.clientY, time: e.timeStamp };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const dx = Math.abs(e.clientX - pointerStart.current.x);
    const dy = Math.abs(e.clientY - pointerStart.current.y);
    const dt = e.timeStamp - pointerStart.current.time;
    // Detect tap: less than 10px of movement
    if (dx < 10 && dy < 10 && dt < 800) {
      toggleWatchMode();
    }
  };

  const toggleWatchMode = () => {
    if (onBringToFront) onBringToFront();
    setIsDigital(prev => {
      const next = !prev;
      try {
        localStorage.setItem('clock_mode_digital', String(next));
      } catch {}
      return next;
    });
  };

  const clockContent = (
    <div 
      onClick={(e) => {
        if (!isDraggingRef.current) {
          e.stopPropagation();
          toggleWatchMode();
        }
      }}
      className="w-[120px] h-[120px] bg-[#111] rounded-[24px] border border-white/10 shadow-xl relative overflow-hidden select-none cursor-pointer hover:border-white/30 transition-colors"
      style={{ perspective: 1000 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {!isDigital ? (
          /* Analog Watch Mode */
          <motion.div
            key="analog"
            initial={{ opacity: 0, rotateY: -90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: 90 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-full h-full relative flex items-center justify-center"
          >
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
            <div className="absolute bottom-3 text-white/45 text-[9px] font-mono font-bold tracking-widest uppercase">
              {siteData.timezoneLabel || 'IST'}
            </div>
            
            {/* Hands */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div ref={hrHand} className="absolute w-[4px] h-[36px] bg-white rounded-full origin-bottom -translate-y-[18px]" />
              <div ref={minHand} className="absolute w-[3px] h-[46px] bg-white/80 rounded-full origin-bottom -translate-y-[23px]" />
              <div ref={secHand} className="absolute w-[2px] h-[50px] bg-orange-500 rounded-full origin-bottom -translate-y-[25px]" />
              <div className="absolute w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_4px_rgba(0,0,0,0.5)] z-10" />
            </div>
          </motion.div>
        ) : (
          /* Digital Watch Mode */
          <motion.div
            key="digital"
            initial={{ opacity: 0, rotateY: 90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: -90 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-full h-full flex flex-col justify-between p-3.5 relative bg-gradient-to-b from-[#161616] to-[#0c0c0c]"
          >
            {/* Top row: Date & Timezone */}
            <div className="flex items-center justify-between text-[10px] font-mono font-semibold tracking-wider">
              <span className="text-orange-400">{digitalTime.day} {digitalTime.date}</span>
              <span className="text-white/40 tracking-widest uppercase text-[9px]">{siteData.timezoneLabel || 'IST'}</span>
            </div>

            {/* Center: Large Digits */}
            <div className="flex flex-col items-center justify-center my-auto">
              <div className="flex items-baseline font-mono font-extrabold tracking-tight text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.25)]">
                <span className="text-[27px] leading-none">{digitalTime.hours}</span>
                <span className="text-[22px] text-orange-500 animate-pulse leading-none mx-0.5">:</span>
                <span className="text-[27px] leading-none">{digitalTime.minutes}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1 font-mono text-[10px]">
                <span className="text-orange-400 font-bold">{digitalTime.seconds}s</span>
                <span className="px-1.5 py-0.2 rounded bg-white/10 text-white/80 font-bold text-[8px] tracking-wide">
                  {digitalTime.ampm}
                </span>
              </div>
            </div>

            {/* Bottom row: Second tracker progress bar */}
            <div className="w-full">
              <div className="w-full h-[2.5px] bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-300"
                  style={{ width: `${((digitalTime.secondsNum + 1) / 60) * 100}%` }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  if (isMobile) {
    return (
      <div 
        className="relative shrink-0 flex justify-center cursor-pointer select-none" 
        style={{ zIndex }} 
        onClick={toggleWatchMode}
      >
        {clockContent}
      </div>
    );
  }

  return (
    <motion.div
      ref={containerRef}
      className="absolute cursor-grab active:cursor-grabbing select-none"
      style={{
        left: siteData.positions.clock.x,
        top: siteData.positions.clock.y,
        x,
        y,
        rotateX,
        rotateY,
        zIndex,
        transformPerspective: 800
      }}
      drag
      dragConstraints={constraintsRef || { top: -500, left: -500, right: 1500, bottom: 1000 }}
      dragElastic={0.15}
      dragTransition={{ power: 0.2, timeConstant: 200 }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onTap={toggleWatchMode}
      whileDrag={{ scale: 1.05, filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.6))' }}
      whileHover={{ scale: 1.02 }}
      title="Tap to toggle Analog / Digital Watch"
    >
      {clockContent}
    </motion.div>
  );
});
