import { motion, useMotionValue, useTransform, useVelocity } from 'framer-motion';
import { useEffect, useRef, memo } from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';

interface Props {
  id: string;
  initialX: string;
  initialY: string;
  children: React.ReactNode;
  className?: string;
  zIndex?: number;
  onBringToFront?: () => void;
  rotation?: number; // Base rotation
  constraintsRef?: React.RefObject<HTMLElement>;
  onClick?: () => void;
}

function clamp(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max);
}

export const DraggableObject = memo(({ id, initialX, initialY, children, className = '', zIndex = 1, onBringToFront, rotation = 0, constraintsRef, onClick }: Props) => {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const velocityX = useVelocity(x);

  // Track dragging to prevent click events upon mouse release after dragging
  const isDraggingRef = useRef(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  
  // Clamped rest rotation to max ±1.5deg, and velocity-induced rotation subtle
  const clampedBaseRotation = clamp(rotation, -1.5, 1.5);
  const dragRotation = useTransform(velocityX, (v) => clamp(v / 80, -2, 2));
  const finalRotation = useTransform(() => clampedBaseRotation + dragRotation.get());

  // Load saved position
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`drag_pos_${id}`);
      if (saved) {
        const { x: savedX, y: savedY } = JSON.parse(saved);
        x.set(savedX);
        y.set(savedY);
      }
    } catch {
      // ignore
    }
  }, [id, x, y]);

  const handleDragStart = () => {
    isDraggingRef.current = true;
    dragStartPos.current = { x: x.get(), y: y.get() };
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
    } catch {
      // ignore
    }
    // Keep isDraggingRef true for a short tick so any synthetic click event immediately following pointerup is suppressed
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 100);
  };

  const handleClickCapture = (e: React.MouseEvent) => {
    // If the object was dragged, prevent the click from bubbling and executing
    if (isDraggingRef.current) {
      e.stopPropagation();
      e.preventDefault();
      return;
    }
    if (onClick) {
      onClick();
    }
  };

  if (isMobile) {
    return (
      <div 
        className={`relative shrink-0 flex justify-center ${className}`} 
        style={{ zIndex }}
        onClick={onBringToFront}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={containerRef}
      className={`absolute cursor-grab active:cursor-grabbing ${className}`}
      onClickCapture={handleClickCapture}
      style={{
        left: initialX,
        top: initialY,
        x,
        y,
        rotate: finalRotation,
        zIndex,
        touchAction: 'none',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        transform: 'translateZ(0)',
      }}
      drag
      dragConstraints={constraintsRef || { top: -500, left: -500, right: 1500, bottom: 1000 }}
      dragElastic={0.15}
      dragTransition={{ power: 0.2, timeConstant: 200 }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.04, filter: 'drop-shadow(0 25px 35px rgba(0,0,0,0.5))' }}
      whileHover={{ scale: 1.01 }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24, delay: 0.05 }}
    >
      {children}
    </motion.div>
  );
});
