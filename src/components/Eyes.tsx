import { motion, useTransform, useMotionValue } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useGlobalMouse } from '../hooks/useMouse';

export function Eyes() {
  const { mouseX, mouseY } = useGlobalMouse();
  const leftEyeRef = useRef<HTMLDivElement>(null);
  const rightEyeRef = useRef<HTMLDivElement>(null);

  const [isBlinking, setIsBlinking] = useState(false);
  const [isSleeping, setIsSleeping] = useState(false);

  // Compute angles for pupils
  const leftPupilX = useMotionValue(0);
  const leftPupilY = useMotionValue(0);
  const rightPupilX = useMotionValue(0);
  const rightPupilY = useMotionValue(0);

  useEffect(() => {
    let idleTimeout: ReturnType<typeof setTimeout>;
    
    const resetIdle = () => {
      setIsSleeping(false);
      clearTimeout(idleTimeout);
      idleTimeout = setTimeout(() => setIsSleeping(true), 10000);
    };

    window.addEventListener('mousemove', resetIdle);
    resetIdle();

    return () => {
      window.removeEventListener('mousemove', resetIdle);
      clearTimeout(idleTimeout);
    };
  }, []);

  useEffect(() => {
    let blinkTimeout: ReturnType<typeof setTimeout>;
    const scheduleBlink = () => {
      const delay = Math.random() * 3000 + 3000; // 3-6s
      blinkTimeout = setTimeout(() => {
        if (!isSleeping) {
          setIsBlinking(true);
          setTimeout(() => setIsBlinking(false), 150);
        }
        scheduleBlink();
      }, delay);
    };
    scheduleBlink();
    return () => clearTimeout(blinkTimeout);
  }, [isSleeping]);

  useEffect(() => {
    let unsubscribeX = mouseX.on('change', (latestX) => updatePupils(latestX, mouseY.get()));
    let unsubscribeY = mouseY.on('change', (latestY) => updatePupils(mouseX.get(), latestY));
    
    const updatePupils = (mX: number, mY: number) => {
      if (isSleeping) return;

      const maxTravel = 4; // px
      
      [
        { ref: leftEyeRef, xVal: leftPupilX, yVal: leftPupilY },
        { ref: rightEyeRef, xVal: rightPupilX, yVal: rightPupilY }
      ].forEach(({ ref, xVal, yVal }) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const eyeCenterX = rect.left + rect.width / 2;
        const eyeCenterY = rect.top + rect.height / 2;
        
        const dx = mX - eyeCenterX;
        const dy = mY - eyeCenterY;
        const angle = Math.atan2(dy, dx);
        const dist = Math.min(Math.hypot(dx, dy) / 20, maxTravel); // Clamp distance
        
        xVal.set(Math.cos(angle) * dist);
        yVal.set(Math.sin(angle) * dist);
      });
    };

    return () => {
      unsubscribeX();
      unsubscribeY();
    };
  }, [mouseX, mouseY, isSleeping, leftPupilX, leftPupilY, rightPupilX, rightPupilY]);

  return (
    <div className="flex gap-[2px] items-center">
      <div 
        ref={leftEyeRef} 
        className={`relative w-[22px] h-[22px] rounded-full bg-white flex items-center justify-center overflow-hidden transition-all duration-300 ${isSleeping ? 'opacity-50 h-[8px]' : ''}`}
      >
        <motion.div 
          className="w-[10px] h-[10px] rounded-full bg-purple-600 transition-colors duration-500"
          style={{ x: leftPupilX, y: leftPupilY, backgroundColor: isSleeping ? '#333' : '#7c3aed', scaleY: isBlinking ? 0.1 : 1 }}
        />
        {isSleeping && <div className="absolute inset-0 bg-black/20" />}
      </div>
      <div 
        ref={rightEyeRef} 
        className={`relative w-[22px] h-[22px] rounded-full bg-white flex items-center justify-center overflow-hidden transition-all duration-300 ${isSleeping ? 'opacity-50 h-[8px]' : ''}`}
      >
        <motion.div 
          className="w-[10px] h-[10px] rounded-full bg-purple-600 transition-colors duration-500"
          style={{ x: rightPupilX, y: rightPupilY, backgroundColor: isSleeping ? '#333' : '#7c3aed', scaleY: isBlinking ? 0.1 : 1 }}
        />
        {isSleeping && <div className="absolute inset-0 bg-black/20" />}
      </div>
    </div>
  );
}
