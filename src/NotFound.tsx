import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';

interface NotFoundProps {
  path?: string;
}

export function NotFound({ path }: NotFoundProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [smoothPos, setSmoothPos] = useState({ x: 0, y: 0 });
  const reqRef = useRef<number | null>(null);

  // Smooth lerp follow for mouse
  useEffect(() => {
    let currentX = 0;
    let currentY = 0;

    const loop = () => {
      currentX += (mousePos.x - currentX) * 0.08;
      currentY += (mousePos.y - currentY) * 0.08;
      setSmoothPos({ x: currentX, y: currentY });
      reqRef.current = requestAnimationFrame(loop);
    };

    reqRef.current = requestAnimationFrame(loop);
    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, [mousePos]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX - innerWidth / 2) / (innerWidth / 2);
    const y = (e.clientY - innerHeight / 2) / (innerHeight / 2);
    setMousePos({ x, y });
  };

  // Parallax offsets (Left moves upward on cursor move, Right moves opposite downward)
  const leftColOffset = smoothPos.y * -28;
  const rightColOffset = smoothPos.y * 28;
  const centerColOffset = smoothPos.y * -6;

  // Dynamic chromatic aberration based on mouse
  const redShift = smoothPos.x * 5 + 1.5;
  const cyanShift = -smoothPos.x * 5 - 1.5;
  const rgbShadow = `${redShift.toFixed(1)}px 0px 3px rgba(255, 50, 50, 0.8), ${cyanShift.toFixed(1)}px 0px 3px rgba(0, 240, 255, 0.8)`;

  const rulerNumbers = ['410', '420', '430', '440', '450', '460', '470', '480', '490', '500', '510', '520', '530', '540', '550'];

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full bg-[var(--color-brand-bg)] text-[#a3a3a3] font-mono selection:bg-white/20 selection:text-white overflow-hidden flex flex-col justify-between select-none"
    >
      {/* Embedded CSS for smooth opposing vertical motion and error blur */}
      <style>{`
        @keyframes error-drift-up {
          0% {
            transform: translateY(16px);
            filter: blur(0.8px);
          }
          50% {
            transform: translateY(-28px);
            filter: blur(1.8px);
          }
          100% {
            transform: translateY(16px);
            filter: blur(0.8px);
          }
        }
        @keyframes error-drift-down {
          0% {
            transform: translateY(-16px);
            filter: blur(0.8px);
          }
          50% {
            transform: translateY(28px);
            filter: blur(1.8px);
          }
          100% {
            transform: translateY(-16px);
            filter: blur(0.8px);
          }
        }
        .animate-drift-up {
          animation: error-drift-up 6s ease-in-out infinite;
          will-change: transform, filter;
        }
        .animate-drift-down {
          animation: error-drift-down 6s ease-in-out infinite;
          will-change: transform, filter;
        }
      `}</style>

      {/* Subtle vintage film grain overlay */}
      <div 
        className="pointer-events-none fixed inset-0 opacity-[0.03] mix-blend-overlay z-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }} 
      />

      {/* 3-Column Editorial Grid Layout */}
      <div className="relative z-10 w-full flex-1 grid grid-cols-1 md:grid-cols-3 max-w-[1550px] mx-auto border-x border-white/10">
        
        {/* ================= LEFT COLUMN (MOVING UPWARD WITH ERROR BLUR) ================= */}
        <div 
          className="hidden md:flex flex-col justify-between p-8 lg:p-12 border-r border-white/10 relative transition-transform duration-100 ease-out will-change-transform"
          style={{ transform: `translateY(${leftColOffset}px)` }}
        >
          {/* Top Edge Text */}
          <div className="opacity-40 text-[10px] tracking-widest text-[#737373] uppercase font-mono">
            REMOVED FROM THE BACKSTAGE.
          </div>

          {/* Left 404 Block with opposing upward motion & error blur */}
          <div className="my-auto py-12 flex flex-col items-center text-center animate-drift-up">
            {/* Stamp Circle Badges */}
            <div className="flex items-center gap-1.5 mb-3 text-[11px] text-[#737373]">
              <span className="w-5 h-5 rounded-full border border-[#737373]/60 flex items-center justify-center font-bold">C</span>
              <span className="w-5 h-5 rounded-full border border-[#737373]/60 flex items-center justify-center font-bold">H</span>
              <span className="w-5 h-5 rounded-full border border-[#737373]/60 flex items-center justify-center font-bold">E</span>
            </div>

            {/* Info Missing headline */}
            <h2 className="text-xs lg:text-sm font-mono tracking-wider text-[#a3a3a3] uppercase mb-1">
              INFO MISSING // PAGE NOT FOUND
            </h2>

            {/* Huge Serif 404 with Registered Symbol & Error Blur/RGB Glitch */}
            <div className="relative inline-block my-2">
              <span 
                className="text-[7.5rem] lg:text-[10rem] xl:text-[11.5rem] leading-none font-['DM_Serif_Display',serif] text-[#f4eedb] tracking-tighter"
                style={{ 
                  textShadow: rgbShadow,
                  filter: 'blur(1px)',
                }}
              >
                404
              </span>
              <span className="absolute top-4 -right-5 text-sm lg:text-base font-mono text-[#737373] border border-[#737373]/50 rounded-full w-5 h-5 flex items-center justify-center">
                ®
              </span>
            </div>

            {/* Secondary subtitle */}
            <p className="text-[10px] lg:text-[11px] text-[#737373] max-w-xs font-mono uppercase tracking-wide leading-relaxed mt-2">
              THE RESOURCE MAY HAVE BEEN DEPRECATED OR REMOVED FROM THE BACKSTAGE.
            </p>
          </div>

          {/* Bottom Cut Glitch Repeat Block */}
          <div className="opacity-75 translate-y-4" style={{ filter: 'blur(1.2px)' }}>
            <div className="flex items-center justify-center gap-1.5 mb-1 text-[9px] text-[#737373]">
              <span className="w-4 h-4 rounded-full border border-[#737373]/40 flex items-center justify-center">C</span>
              <span className="w-4 h-4 rounded-full border border-[#737373]/40 flex items-center justify-center">H</span>
              <span className="w-4 h-4 rounded-full border border-[#737373]/40 flex items-center justify-center">E</span>
            </div>
            <p 
              className="text-[10px] font-mono tracking-wider text-[#d4d4d4] text-center uppercase"
              style={{
                textShadow: '-2px 0 1px #00ffff, 2px 0 1px #ff0055, 0 1px 2px #ffee00',
              }}
            >
              INFO MISSING // PAGE NOT FOUND
            </p>
          </div>
        </div>

        {/* ================= CENTER COLUMN (CLEAR & INTERACTIVE) ================= */}
        <div 
          className="relative flex flex-col justify-between py-10 px-6 sm:px-10 border-r border-white/10 overflow-hidden transition-transform duration-100 ease-out will-change-transform"
          style={{ transform: `translateY(${centerColOffset}px)` }}
        >
          {/* Vertical Ruler Hash Ticks on left boundary */}
          <div className="absolute left-1 top-0 bottom-0 flex flex-col justify-between py-6 text-[8px] text-[#404040] font-mono select-none pointer-events-none hidden sm:flex">
            {rulerNumbers.map((num, i) => (
              <span key={`l-${i}`} className="tracking-tighter">- {num}</span>
            ))}
          </div>

          {/* Vertical Ruler Hash Ticks on right boundary */}
          <div className="absolute right-1 top-0 bottom-0 flex flex-col justify-between py-6 text-[8px] text-[#404040] font-mono select-none pointer-events-none hidden sm:flex">
            {rulerNumbers.map((num, i) => (
              <span key={`r-${i}`} className="tracking-tighter">{num} -</span>
            ))}
          </div>

          {/* Top text: YOU CAN ENJOY HERE */}
          <div className="text-center pt-2">
            <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-[#737373] uppercase">
              YOU CAN ENJOY HERE
            </span>
          </div>

          {/* Center Main Feature: "Take Me Back Home" Button & Mobile 404 */}
          <div className="my-auto py-12 flex flex-col items-center justify-center text-center space-y-8">
            
            {/* Mobile View 404 Headline with subtle error blur */}
            <div className="md:hidden flex flex-col items-center text-center mb-4 animate-drift-up">
              <div className="flex items-center gap-1.5 mb-2 text-[10px] text-[#737373]">
                <span className="w-5 h-5 rounded-full border border-[#737373]/60 flex items-center justify-center">C</span>
                <span className="w-5 h-5 rounded-full border border-[#737373]/60 flex items-center justify-center">H</span>
                <span className="w-5 h-5 rounded-full border border-[#737373]/60 flex items-center justify-center">E</span>
              </div>
              <h2 className="text-xs font-mono tracking-wider text-[#a3a3a3] uppercase">
                INFO MISSING // PAGE NOT FOUND
              </h2>
              <div className="relative inline-block my-1">
                <span 
                  className="text-[6.5rem] leading-none font-['DM_Serif_Display',serif] text-[#f4eedb] tracking-tighter"
                  style={{ 
                    textShadow: rgbShadow,
                    filter: 'blur(1px)',
                  }}
                >
                  404
                </span>
                <span className="absolute top-2 -right-4 text-xs font-mono text-[#737373] border border-[#737373]/50 rounded-full w-4 h-4 flex items-center justify-center">
                  ®
                </span>
              </div>
              <p className="text-[10px] text-[#737373] max-w-xs font-mono uppercase tracking-wide">
                THE RESOURCE MAY HAVE BEEN DEPRECATED OR REMOVED FROM THE BACKSTAGE.
              </p>
            </div>

            {/* Ultra-Stylish & Creative Editorial "Take Me Back Home" Centerpiece */}
            <a
              href="/"
              className="group relative flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl transition-all duration-500 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
            >
              {/* Ethereal Champagne Backlight Bloom on Hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-500/0 via-[#f4eedb]/10 to-amber-500/0 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-700 pointer-events-none" />

              {/* Architectural Film Crop Marks / Corner Accents */}
              <span className="absolute top-0 left-0 text-[10px] font-mono text-white/20 group-hover:text-[#f4eedb]/70 transition-colors duration-300">┌</span>
              <span className="absolute top-0 right-0 text-[10px] font-mono text-white/20 group-hover:text-[#f4eedb]/70 transition-colors duration-300">┐</span>
              <span className="absolute bottom-0 left-0 text-[10px] font-mono text-white/20 group-hover:text-[#f4eedb]/70 transition-colors duration-300">└</span>
              <span className="absolute bottom-0 right-0 text-[10px] font-mono text-white/20 group-hover:text-[#f4eedb]/70 transition-colors duration-300">┘</span>

              {/* Top Meta Label with Live Signal Indicator */}
              <div className="flex items-center gap-2 mb-3.5 text-[10px] font-mono tracking-[0.2em] text-[#737373] group-hover:text-[#a3a3a3] uppercase transition-colors">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                </span>
                <span>ESC // RETURN TO ROOT</span>
              </div>

              {/* Main Typographic Headline with Kinetic Arrow Token */}
              <div className="relative inline-flex items-center gap-3 sm:gap-4 select-none">
                <h1 className="font-['DM_Serif_Display',serif] text-2xl sm:text-3xl md:text-4xl text-[#f4eedb] tracking-tight whitespace-nowrap group-hover:text-white transition-colors duration-300">
                  <span className="italic font-light">Take </span>
                  <span className="italic font-light">Me </span>
                  <span className="italic font-light">Back </span>
                  <span className="not-italic font-normal">Home</span>
                </h1>

                {/* Floating Glass Orb Arrow Token */}
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/15 bg-white/[0.04] backdrop-blur-md flex items-center justify-center text-[#f4eedb]/75 group-hover:text-white group-hover:border-[#f4eedb]/50 group-hover:bg-[#f4eedb]/10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 shadow-lg">
                  <ArrowUpRight size={17} className="transition-transform duration-300 group-hover:rotate-45" />
                </div>
              </div>

              {/* Interactive Expanding Light Ray */}
              <div className="mt-3.5 h-[1px] w-12 group-hover:w-full bg-gradient-to-r from-transparent via-[#f4eedb]/70 to-transparent transition-all duration-500 ease-out" />

              {/* Secondary Subtext Prompt */}
              <span className="text-[9px] font-mono tracking-widest text-white/30 uppercase mt-2.5 group-hover:text-white/60 transition-colors duration-300">
                CLICK TO RESTORE DESKTOP SESSION
              </span>
            </a>

            {/* Back button option */}
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 text-xs font-mono text-[#737373] hover:text-[#f4eedb] transition-colors cursor-pointer group"
            >
              <ArrowLeft size={13} className="group-hover:-translate-x-1 transition-transform" />
              <span>Or return to previous page</span>
            </button>

            {path && (
              <div className="text-[10px] font-mono text-[#525252] tracking-wider">
                REQUESTED_URI: {path}
              </div>
            )}
          </div>

          {/* Bottom text: ONLY DOPE STUFF */}
          <div className="text-center pb-2">
            <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-[#737373] uppercase">
              ONLY DOPE STUFF
            </span>
          </div>
        </div>

        {/* ================= RIGHT COLUMN (MOVING OPPOSITE DOWNWARD WITH ERROR BLUR) ================= */}
        <div 
          className="hidden md:flex flex-col justify-between p-8 lg:p-12 relative transition-transform duration-100 ease-out will-change-transform"
          style={{ transform: `translateY(${rightColOffset}px)` }}
        >
          {/* Top Edge */}
          <div className="opacity-40 text-[10px] tracking-widest text-[#737373] uppercase font-mono text-right">
            NITIN KUMAWAT // PORTFOLIO
          </div>

          {/* Right 404 Block with opposing downward motion & error blur */}
          <div className="my-auto py-12 flex flex-col items-center text-center animate-drift-down">
            {/* Stamp Circle Badges */}
            <div className="flex items-center gap-1.5 mb-3 text-[11px] text-[#737373]">
              <span className="w-5 h-5 rounded-full border border-[#737373]/60 flex items-center justify-center font-bold">C</span>
              <span className="w-5 h-5 rounded-full border border-[#737373]/60 flex items-center justify-center font-bold">H</span>
              <span className="w-5 h-5 rounded-full border border-[#737373]/60 flex items-center justify-center font-bold">E</span>
            </div>

            {/* Info Missing headline */}
            <h2 className="text-xs lg:text-sm font-mono tracking-wider text-[#a3a3a3] uppercase mb-1">
              INFO MISSING // PAGE NOT FOUND
            </h2>

            {/* Huge Serif 404 with Registered Symbol & Error Blur/RGB Glitch */}
            <div className="relative inline-block my-2">
              <span 
                className="text-[7.5rem] lg:text-[10rem] xl:text-[11.5rem] leading-none font-['DM_Serif_Display',serif] text-[#f4eedb] tracking-tighter"
                style={{ 
                  textShadow: rgbShadow,
                  filter: 'blur(1px)',
                }}
              >
                404
              </span>
              <span className="absolute top-4 -right-5 text-sm lg:text-base font-mono text-[#737373] border border-[#737373]/50 rounded-full w-5 h-5 flex items-center justify-center">
                ®
              </span>
            </div>

            {/* Secondary subtitle */}
            <p className="text-[10px] lg:text-[11px] text-[#737373] max-w-xs font-mono uppercase tracking-wide leading-relaxed mt-2">
              THE RESOURCE MAY HAVE BEEN DEPRECATED OR REMOVED FROM THE BACKSTAGE.
            </p>
          </div>

          {/* Bottom Chromatic Aberration Rainbow Slice */}
          <div className="overflow-hidden h-14 relative flex flex-col items-center opacity-85" style={{ filter: 'blur(1.2px)' }}>
            <p 
              className="text-[10px] font-mono tracking-wider text-[#d4d4d4] uppercase"
              style={{
                textShadow: '-2px 0 1px #00ffff, 2px 0 1px #ff0055, 0 1px 3px #ffee00',
              }}
            >
              INFO MISSING // PAGE NOT FOUND
            </p>
            <div 
              className="text-[4rem] leading-none font-['DM_Serif_Display',serif] text-[#f4eedb] -mt-1 font-bold tracking-tighter select-none"
              style={{
                textShadow: '-3px 0 2px #00f0ff, 3px 0 2px #ff0055, 0 2px 4px #ffe600',
              }}
            >
              404
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default NotFound;
