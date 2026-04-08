import { useState, useEffect, useRef } from 'react';

/**
 * useAnimatedNumber - عداد رقمي متحرك
 * يحرك الرقم من 0 إلى القيمة النهائية بتأثير سلس
 */
export function useAnimatedNumber(
  target: number,
  duration: number = 800,
  enabled: boolean = true
): number {
  const [current, setCurrent] = useState(0);
  const rafRef = useRef<number>();
  const startRef = useRef<number>();

  useEffect(() => {
    if (!enabled) {
      setCurrent(target);
      return;
    }

    const from = 0;
    const start = performance.now();
    startRef.current = start;

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(from + (target - from) * eased));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, enabled]);

  return current;
}
