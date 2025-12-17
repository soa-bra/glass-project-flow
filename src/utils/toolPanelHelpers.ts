// Tool Panel Helpers
import { toNumber } from '@/utils/canvasUtils';

export const calculateNewPosition = (currentPosition: any, offset: number) => {
  return toNumber(currentPosition, 0) + offset;
};

export const sanitizeNumericValue = (value: any, defaultValue: number = 0) => {
  return toNumber(value, defaultValue);
};