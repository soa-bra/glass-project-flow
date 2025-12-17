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

export function toNumber(value: any, defaultValue: number = 0): number {
  if (typeof value === 'number' && !isNaN(value)) return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    if (!isNaN(parsed)) return parsed;
  }
  return defaultValue;
}

export function toString(value: any, defaultValue: string = ''): string {
  if (typeof value === 'string') return value;
  if (value === null || value === undefined) return defaultValue;
  return String(value);
}

export function sanitizeStyleForCSS(style: Record<string, any>): Record<string, string> {
  const result: Record<string, string> = {};
  for (const key in style) {
    const value = style[key];
    if (value !== null && value !== undefined) {
      result[key] = typeof value === 'number' ? `${value}px` : String(value);
    }
  }
  return result;
}
