import { useEffect, useState } from "react";

type TypewriterOptions = {
  speed?: number;
  delay?: number;
  instant?: boolean;
};

export function useTypewriter(
  fullText: string,
  options: TypewriterOptions = {}
): { text: string; done: boolean } {
  const { speed = 20, delay = 0, instant = false } = options;
  const [displayedLength, setDisplayedLength] = useState(() => (instant ? fullText.length : 0));
  const [done, setDone] = useState(() => instant);
  const [prevText, setPrevText] = useState(fullText);

  if (prevText !== fullText) {
    setPrevText(fullText);
    setDisplayedLength(instant ? fullText.length : 0);
    setDone(instant);
  }

  useEffect(() => {
    if (instant) return;

    let intervalId: number | undefined;
    const timeoutId = window.setTimeout(() => {
      let currentLength = 0;
      intervalId = window.setInterval(() => {
        currentLength++;
        setDisplayedLength(currentLength);
        if (currentLength >= fullText.length) {
          clearInterval(intervalId);
          setDone(true);
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId !== undefined) clearInterval(intervalId);
    };
  }, [fullText, speed, delay, instant]);

  return {
    text: instant ? fullText : fullText.slice(0, displayedLength),
    done: instant ? true : done,
  };
}
