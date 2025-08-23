// Hook للـ Canvas Element Actions مع تحسينات TypeScript
import { useCallback } from 'react';
import { toNumber } from '@/utils/canvasUtils';

export const useCanvasElementActions = () => {
  const handleRotationUpdate = useCallback((rotation: any) => {
    return toNumber(rotation, 0) + 90;
  }, []);

  return {
    handleRotationUpdate
  };
};