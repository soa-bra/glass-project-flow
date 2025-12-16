import { Camera } from "./canvasCoordinates";

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function rafThrottle<T extends (...args: any[]) => void>(fn: T): T {
  let frame = 0;
  return ((...args: any[]) => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      fn(...args);
    });
  }) as T;
}

export function getGridStyle(camera: Camera) {
  const size = 40 * camera.zoom;

  return {
    backgroundSize: `${size}px ${size}px`,
    backgroundPosition: `${camera.x}px ${camera.y}px`,
    backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.15) 1px, transparent 1px)",
  };
}
