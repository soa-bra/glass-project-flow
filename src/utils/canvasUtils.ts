// Simplified Canvas Utilities
export const toNumber = (value: any, defaultValue: number = 0): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
  }
  return defaultValue;
};

export const toString = (value: any, defaultValue: string = ''): string => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  if (value === null || value === undefined) return defaultValue;
  return String(value);
};

export const sanitizeStyleForCSS = (style: any): any => {
  // Just return style as-is for maximum compatibility
  return { ...style };
};

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export const getGridStyle = (viewport: { pan: { x: number; y: number }; zoom: number }) => {
  const gridSize = 20 * viewport.zoom;
  return {
    backgroundImage: `
      linear-gradient(to right, hsl(var(--border) / 0.3) 1px, transparent 1px),
      linear-gradient(to bottom, hsl(var(--border) / 0.3) 1px, transparent 1px)
    `,
    backgroundSize: `${gridSize}px ${gridSize}px`,
    backgroundPosition: `${viewport.pan.x % gridSize}px ${viewport.pan.y % gridSize}px`,
  };
};