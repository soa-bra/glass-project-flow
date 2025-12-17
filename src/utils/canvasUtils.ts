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