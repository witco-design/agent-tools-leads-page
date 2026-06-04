import { useState, useEffect } from 'react';

interface UseTypewriterOptions {
  text: string;
  speed?: number;
  startDelay?: number;
  enabled?: boolean;
}

export function useTypewriter({ text, speed = 25, startDelay = 0, enabled = true }: UseTypewriterOptions) {
  const [displayed, setDisplayed] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setDisplayed('');
      setIsComplete(false);
      return;
    }

    let i = 0;
    let interval: ReturnType<typeof setInterval>;

    const startTimer = setTimeout(() => {
      interval = setInterval(() => {
        if (i < text.length) {
          i++;
          setDisplayed(text.slice(0, i));
        } else {
          setIsComplete(true);
          clearInterval(interval);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(startTimer);
      if (interval) clearInterval(interval);
    };
  }, [text, speed, startDelay, enabled]);

  return { displayed, isComplete };
}
