import { useCallback } from 'react';

export const useZoomPan = () => {
  const zoomIn = useCallback(() => {
    console.log('Zoom in');
  }, []);

  const zoomOut = useCallback(() => {
    console.log('Zoom out');
  }, []);

  const fitToScreen = useCallback(() => {
    console.log('Fit to screen');
  }, []);

  return {
    zoomIn,
    zoomOut,
    fitToScreen,
  };
};