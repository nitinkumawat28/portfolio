import { motion, useMotionValue, useTransform, useVelocity, useAnimation } from 'framer-motion';
import { useEffect, useRef, useState, memo } from 'react';

interface Props {
  id: string;
  initialX: string;
  initialY: string;
  children: React.ReactNode;
  className?: string;
  zIndex?: number;
  onBringToFront?: () => void;
  rotation?: number; // Base rotation
}

function clamp(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max);
}

export const DraggableObject = memo(({ id, initialX, initialY, children, className = '', zIndex = 1, onBringToFront, rotation = 0 }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const velocityX = useVelocity(x);
  const dragRotation = useTransform(velocityX, (v) => clamp(v / 40, -8, 8));
  const finalRotation = useTransform(() => dragRotation.get() + rotation);

  // Z-index management
  const [localZ, setLocalZ] = useState(zIndex);

  useEffect(() => {
    setLocalZ(zIndex);
  }, [zIndex]);

  // Load saved position
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`drag_pos_${id}`);
      if (saved) {
        const { x: savedX, y: savedY } = JSON.parse(saved);
        x.set(savedX);
        y.set(savedY);
      }
    } catch (e) {
      // ignore
    }
  }, [id, x, y]);

  const handleDragStart = () => {
    if (onBringToFront) onBringToFront();
    if (containerRef.current) {
      containerRef.current.style.willChange = 'transform';
    }
  };

  const handleDragEnd = () => {
    if (containerRef.current) {
      containerRef.current.style.willChange = 'auto';
    }
    try {
      localStorage.setItem(`drag_pos_${id}`, JSON.stringify({ x: x.get(), y: y.get() }));
    } catch (e) {
      // ignore
    }
  };

  return (
    <motion.div
      ref={containerRef}
      className={`absolute cursor-grab active:cursor-grabbing ${className}`}
      style={{
        left: initialX,
        top: initialY,
        x,
        y,
        rotate: finalRotation,
        zIndex: localZ,
        touchAction: 'none'
      }}
      drag
      dragConstraints={{ top: -500, left: -500, right: 1500, bottom: 1000 }} // Arbitrary large constraints, visually handled by momentum
      dragElastic={0.15}
      dragTransition={{ power: 0.2, timeConstant: 200 }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.04, filter: 'drop-shadow(0 25px 35px rgba(0,0,0,0.5))' }}
      whileHover={{ scale: 1.01, rotate: 0 }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24, delay: Math.random() * 0.1 }}
    >
      {children}
    </motion.div>
  );
});
