import { motion, useMotionValue } from 'framer-motion';
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

  // Idle timer (10s idle sleep)
  useEffect(() => {
    let idleTimeout: ReturnType<typeof setTimeout>;
    
    const resetIdle = () => {
      setIsSleeping(false);
      clearTimeout(idleTimeout);
      idleTimeout = setTimeout(() => setIsSleeping(true), 10000);
    };

    window.addEventListener('mousemove', resetIdle, { passive: true });
    window.addEventListener('pointermove', resetIdle, { passive: true });
    window.addEventListener('keydown', resetIdle, { passive: true });
    resetIdle();

    return () => {
      window.removeEventListener('mousemove', resetIdle);
      window.removeEventListener('pointermove', resetIdle);
      window.removeEventListener('keydown', resetIdle);
      clearTimeout(idleTimeout);
    };
  }, []);

  // Blinking cycle: blink every 3-6s, quick natural eye blink (120ms)
  useEffect(() => {
    let blinkTimeout: ReturnType<typeof setTimeout>;
    let isMounted = true;

    const scheduleBlink = () => {
      const delay = 3000 + Math.random() * 3000; // 3 - 6 seconds
      blinkTimeout = setTimeout(() => {
        if (!isMounted) return;
        if (!isSleeping) {
          setIsBlinking(true);
          setTimeout(() => {
            if (isMounted) setIsBlinking(false);
          }, 120);
        }
        scheduleBlink();
      }, delay);
    };

    scheduleBlink();
    return () => {
      isMounted = false;
      clearTimeout(blinkTimeout);
    };
  }, [isSleeping]);

  useEffect(() => {
    const updatePupils = (mX: number, mY: number) => {
      if (isSleeping) return;

      const maxTravel = 5; // px
      
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
        const dist = Math.min(Math.hypot(dx, dy) / 25, maxTravel);
        
        xVal.set(Math.cos(angle) * dist);
        yVal.set(Math.sin(angle) * dist);
      });
    };

    const unsubscribeX = mouseX.on('change', (latestX) => updatePupils(latestX, mouseY.get()));
    const unsubscribeY = mouseY.on('change', (latestY) => updatePupils(mouseX.get(), latestY));

    // Initial positioning if mouse hasn't moved yet
    if (mouseX.get() !== 0 || mouseY.get() !== 0) {
      updatePupils(mouseX.get(), mouseY.get());
    }

    return () => {
      unsubscribeX();
      unsubscribeY();
    };
  }, [mouseX, mouseY, isSleeping, leftPupilX, leftPupilY, rightPupilX, rightPupilY]);

  return (
    <div className="flex gap-[6px] items-center drop-shadow-sm select-none">
      {[
        { ref: leftEyeRef, x: leftPupilX, y: leftPupilY },
        { ref: rightEyeRef, x: rightPupilX, y: rightPupilY }
      ].map((eye, i) => (
        <motion.div 
          key={i}
          ref={eye.ref} 
          className={`relative w-[24px] h-[24px] rounded-full flex items-center justify-center overflow-hidden transition-opacity duration-300 ${isSleeping ? 'opacity-40' : 'opacity-100'}`}
          style={{ 
            background: 'radial-gradient(circle at 35% 35%, #ffffff 0%, #e2e8f0 100%)',
            boxShadow: 'inset -2px -3px 5px rgba(0,0,0,0.12), inset 2px 2px 4px rgba(255,255,255,0.9), 0 2px 5px rgba(0,0,0,0.2)'
          }}
          animate={{ scaleY: isBlinking || isSleeping ? 0.12 : 1 }}
          transition={{ type: "spring", stiffness: 450, damping: 22 }}
        >
          {/* Pupil */}
          <motion.div 
            className="w-[12px] h-[12px] rounded-full relative"
            style={{ 
              x: eye.x, 
              y: eye.y, 
              background: isSleeping ? '#475569' : 'linear-gradient(135deg, #a855f7, #4c1d95)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.3), inset -1px -1px 2px rgba(0,0,0,0.4)'
            }}
          >
            {/* Catchlight reflection */}
            <div className="absolute top-[2px] left-[2.5px] w-[3.5px] h-[3.5px] bg-white rounded-full shadow-[0_0_2px_rgba(255,255,255,0.8)]" />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
