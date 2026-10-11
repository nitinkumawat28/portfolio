import React, { useEffect, useRef } from 'react';
import { FloatingNumbersEngine } from '../../lib/floatingNumbers';
import { numbersTheme } from '../../data/theme';

interface FloatingNumbersProps {
  paused?: boolean;
}

export const FloatingNumbers: React.FC<FloatingNumbersProps> = ({ paused = false }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<FloatingNumbersEngine | null>(null);

  const initialPausedRef = useRef(paused);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new FloatingNumbersEngine(canvas, {
      theme: numbersTheme,
      paused: initialPausedRef.current,
    });
    engineRef.current = engine;

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setPaused(paused);
    }
  }, [paused]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
      />
      {/* Edge vignette: darken the edges slightly so the content in the center stays readable */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 60%, rgba(0, 0, 0, 0.45) 100%)',
        }}
      />
    </div>
  );
};
