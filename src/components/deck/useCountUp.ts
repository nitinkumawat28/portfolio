import { useEffect, useState } from "react";

type CountUpOptions = {
  duration?: number;
  delay?: number;
  instant?: boolean;
};

export function useCountUp(target: number, options: CountUpOptions = {}): number {
  const { duration = 800, delay = 0, instant = false } = options;
  const [current, setCurrent] = useState(() => (instant ? target : 0));
  const [prevTarget, setPrevTarget] = useState(target);

  if (prevTarget !== target) {
    setPrevTarget(target);
    setCurrent(instant ? target : 0);
  }

  useEffect(() => {
    if (instant) return;

    let rafId: number;
    const timeoutId = window.setTimeout(() => {
      const startTime = performance.now();
      const startVal = 0;

      const tick = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        // easeOutQuad
        const eased = 1 - Math.pow(1 - progress, 2);
        const val = startVal + (target - startVal) * eased;

        if (Number.isInteger(target)) {
          setCurrent(Math.round(val));
        } else {
          setCurrent(Number(val.toFixed(1)));
        }

        if (progress < 1) {
          rafId = requestAnimationFrame(tick);
        } else {
          setCurrent(target);
        }
      };

      rafId = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(rafId);
    };
  }, [target, duration, delay, instant]);

  return instant ? target : current;
}
