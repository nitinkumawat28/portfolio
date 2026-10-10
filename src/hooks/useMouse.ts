import { motionValue } from 'framer-motion';
import { useEffect } from 'react';

const mouseX = motionValue(0);
const mouseY = motionValue(0);

let isListening = false;

export function useGlobalMouse() {
  useEffect(() => {
    if (!isListening && typeof window !== 'undefined') {
      isListening = true;
      let ticking = false;
      const handleMouseMove = (e: MouseEvent) => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
            ticking = false;
          });
          ticking = true;
        }
      };
      window.addEventListener('mousemove', handleMouseMove);
    }
  }, []);

  return { mouseX, mouseY };
}
