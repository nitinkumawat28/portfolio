import { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowLeft, Home } from 'lucide-react';

interface NotFoundProps {
  path?: string;
}

export function NotFound({ path }: NotFoundProps) {
  const currentPath = path || (typeof window !== 'undefined' ? window.location.pathname : '');
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mouse & physics tracking
  const mouseRef = useRef({
    targetX: 0,
    targetY: 0,
    currentX: 0,
    currentY: 0,
    isHovering: false,
  });

  const [hasInteracted, setHasInteracted] = useState(false);

  // Smooth animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Offscreen canvas for crisp text masking
    const maskCanvas = document.createElement('canvas');
    const maskCtx = maskCanvas.getContext('2d');
    if (!maskCtx) return;

    // Second offscreen layer for compositing illuminated rings
    const ringCanvas = document.createElement('canvas');
    const ringCtx = ringCanvas.getContext('2d');
    if (!ringCtx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      if (!canvas || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      width = rect.width;
      height = Math.max(rect.height, 460);
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      maskCanvas.width = canvas.width;
      maskCanvas.height = canvas.height;

      ringCanvas.width = canvas.width;
      ringCanvas.height = canvas.height;
    };

    resize();
    window.addEventListener('resize', resize);

    let startTime = performance.now();

    const render = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const mouse = mouseRef.current;

      // Smooth lerp easing for fluid floating inertia
      mouse.currentX += (mouse.targetX - mouse.currentX) * 0.07;
      mouse.currentY += (mouse.targetY - mouse.currentY) * 0.07;

      if (!width || !height) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // Base centers
      const centerX = width / 2;
      const centerY = height * 0.48;

      // Parallax offsets: rings shift one way, 404 shifts slightly opposite for deep 3D illusion
      const ringOriginX = centerX + mouse.currentX * 0.14;
      const ringOriginY = centerY + mouse.currentY * 0.14;

      const textOriginX = centerX - mouse.currentX * 0.08;
      const textOriginY = centerY - mouse.currentY * 0.08;

      // Responsive font sizing for 404
      const fontSize = Math.min(Math.max(width * 0.32, 160), 340);

      // --- 1. RENDER 404 MASK ON OFFSCREEN CANVAS ---
      maskCtx.save();
      maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
      maskCtx.scale(dpr, dpr);
      maskCtx.fillStyle = '#ffffff';
      maskCtx.font = `900 ${fontSize}px "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      maskCtx.textAlign = 'center';
      maskCtx.textBaseline = 'middle';
      maskCtx.letterSpacing = '-0.04em';
      maskCtx.fillText('404', textOriginX, textOriginY);
      maskCtx.restore();

      // --- 2. RENDER MAIN CANVAS (BACKGROUND RINGS) ---
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);

      const ringSpacing = Math.max(width * 0.012, 10);
      const maxRadius = Math.hypot(width, height) * 0.85;

      // Faint ambient background rings
      ctx.lineWidth = 1.1;
      for (let r = ringSpacing; r < maxRadius; r += ringSpacing) {
        // Subtle ambient wave ripple
        const pulse = Math.sin(elapsed * 1.8 - r * 0.018) * 0.015;
        const alpha = Math.max(0.02, 0.05 + pulse);

        ctx.beginPath();
        ctx.arc(ringOriginX, ringOriginY, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
        ctx.stroke();
      }
      ctx.restore();

      // --- 3. RENDER HIGHLIGHTED RINGS ON OFFSCREEN CANVAS ---
      ringCtx.save();
      ringCtx.clearRect(0, 0, ringCanvas.width, ringCanvas.height);
      ringCtx.scale(dpr, dpr);

      // Cursor position in canvas coordinates
      const cursorCanvasX = centerX + mouse.currentX;
      const cursorCanvasY = centerY + mouse.currentY;

      // Draw bright, sharp concentric rings
      for (let r = ringSpacing; r < maxRadius; r += ringSpacing) {
        // Distance from ring to cursor for interactive spotlight illumination
        const distToCursor = Math.abs(Math.hypot(cursorCanvasX - ringOriginX, cursorCanvasY - ringOriginY) - r);
        const proximityBoost = Math.max(0, 1 - distToCursor / 160) * 0.35;
        const wave = Math.sin(elapsed * 2.2 - r * 0.02) * 0.08;
        const brightness = Math.min(1, 0.72 + wave + proximityBoost);

        ringCtx.lineWidth = 3.2;
        ringCtx.lineCap = 'round';
        ringCtx.beginPath();
        ringCtx.arc(ringOriginX, ringOriginY, r, 0, Math.PI * 2);
        ringCtx.strokeStyle = `rgba(240, 243, 250, ${brightness.toFixed(3)})`;
        ringCtx.stroke();
      }

      // Clip bright rings precisely to the 404 silhouette
      ringCtx.globalCompositeOperation = 'destination-in';
      ringCtx.drawImage(maskCanvas, 0, 0, width, height);
      ringCtx.globalCompositeOperation = 'source-over';
      ringCtx.restore();

      // --- 4. COMPOSITE HIGHLIGHTED 404 ON TOP ---
      ctx.save();
      ctx.drawImage(ringCanvas, 0, 0);

      // Subtle soft glow around the active 404
      ctx.globalCompositeOperation = 'screen';
      ctx.filter = 'blur(12px)';
      ctx.globalAlpha = 0.28;
      ctx.drawImage(ringCanvas, 0, 0);
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // Mouse / Pointer Move listener
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    mouseRef.current.targetX = x;
    mouseRef.current.targetY = y;
    mouseRef.current.isHovering = true;
    if (!hasInteracted) setHasInteracted(true);
  }, [hasInteracted]);

  const handlePointerLeave = useCallback(() => {
    mouseRef.current.targetX = 0;
    mouseRef.current.targetY = 0;
    mouseRef.current.isHovering = false;
  }, []);

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative min-h-screen w-full bg-[#050608] text-white flex flex-col justify-between selection:bg-white/20 select-none overflow-hidden"
    >
      {/* Subtle radial ambient vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.03)_0%,transparent_70%)]" />

      {/* Top Header */}
      <header className="relative z-20 flex items-center justify-between p-6 sm:p-8 max-w-5xl mx-auto w-full">
        <button
          onClick={() => (window.location.href = '/')}
          className="flex items-center gap-2 text-xs sm:text-sm font-medium text-white/60 hover:text-white transition-colors cursor-pointer group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Desktop</span>
        </button>

        <div className="flex items-center gap-2 font-mono text-[11px] sm:text-xs text-white/40 tracking-wider uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" />
          <span>STATUS: 404_NOT_FOUND</span>
        </div>
      </header>

      {/* Center Interactive Canvas */}
      <div className="relative flex-1 flex flex-col items-center justify-center w-full px-4">
        {/* Canvas containing dynamic concentric rings & reactive 404 */}
        <canvas
          ref={canvasRef}
          className="w-full max-w-4xl h-[340px] sm:h-[420px] md:h-[480px] cursor-crosshair touch-none"
        />

        {/* Clean, elegant subtext & action controls */}
        <div className="relative z-20 flex flex-col items-center text-center mt-2 space-y-4 max-w-md px-4">
          <p className="text-sm sm:text-base text-white/60 font-normal leading-relaxed">
            Looks like this page doesn’t exist. The route may have moved or was never created.
          </p>

          {currentPath && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-mono text-white/50">
              <span>Path:</span>
              <span className="text-white/80 font-semibold">{currentPath}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <a
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-xs sm:text-sm hover:bg-neutral-200 transition-all hover:scale-105 active:scale-95 shadow-lg"
            >
              <Home size={15} />
              <span>Go to Desktop</span>
            </a>

            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 text-white/80 hover:text-white font-medium text-xs sm:text-sm hover:bg-white/10 border border-white/10 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ArrowLeft size={15} />
              <span>Go Back</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-20 p-6 sm:p-8 text-center text-[11px] sm:text-xs text-white/30 font-mono">
        Nitin Kumawat · Portfolio OS · All rights reserved
      </footer>
    </div>
  );
}

export default NotFound;
