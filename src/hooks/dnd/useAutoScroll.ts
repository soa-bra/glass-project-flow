import { useEffect, useRef } from "react";

type Opts = {
  container: React.RefObject<HTMLElement>;
  active: boolean;       // true أثناء التحريك
  pointerY: number;      // أحدث موضع Y للمؤشر/الإصبع
  threshold?: number;    // كم تبعد عن الحافة لبدء الأوتوسكرول
  maxSpeed?: number;     // أقصى سرعة بكسلات/فريم
};

export function useAutoScroll({ container, active, pointerY, threshold = 32, maxSpeed = 18 }: Opts) {
  const raf = useRef<number | null>(null);
  const lastY = useRef(0);

  const tick = () => {
    const el = container.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const y = lastY.current;

    const distTop = y - rect.top;
    const distBottom = rect.bottom - y;

    let delta = 0;
    if (distTop < threshold) {
      const pct = 1 - distTop / threshold;
      delta = -Math.max(2, Math.round(pct * maxSpeed));
    } else if (distBottom < threshold) {
      const pct = 1 - distBottom / threshold;
      delta = Math.max(2, Math.round(pct * maxSpeed));
    }

    if (delta !== 0) el.scrollTop += delta;

    raf.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    if (!active) {
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = null;
      return;
    }
    if (!raf.current) raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = null;
    };
  }, [active]);

  useEffect(() => {
    lastY.current = pointerY;
  }, [pointerY]);
}