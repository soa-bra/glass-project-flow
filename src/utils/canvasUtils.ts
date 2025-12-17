export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function isTypingTarget(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  if (!el) return false;
  return !!el.closest('input, textarea, [contenteditable="true"]');
}

export function rafThrottle<T extends (...args: any[]) => void>(fn: T) {
  let raf = 0;
  let lastArgs: any[] | null = null;

  const wrapped = (...args: any[]) => {
    lastArgs = args;
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      if (lastArgs) fn(...lastArgs);
      lastArgs = null;
    });
  };

  (wrapped as any).cancel = () => {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    lastArgs = null;
  };

  return wrapped as T & { cancel: () => void };
}

export function distance(a: { x: number; y: number }, b: { x: number; y: number }) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}
