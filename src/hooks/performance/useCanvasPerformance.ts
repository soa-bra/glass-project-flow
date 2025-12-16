import { useEffect, useRef, useState } from "react";

export function useCanvasPerformance(enabled = false) {
  const [fps, setFps] = useState<number | null>(null);
  const frames = useRef(0);
  const last = useRef(performance.now());
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const loop = () => {
      frames.current += 1;
      const now = performance.now();
      const dt = now - last.current;

      if (dt >= 500) {
        setFps(Math.round((frames.current * 1000) / dt));
        frames.current = 0;
        last.current = now;
      }

      raf.current = requestAnimationFrame(loop);
    };

    raf.current = requestAnimationFrame(loop);

    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [enabled]);

  return { fps };
}
