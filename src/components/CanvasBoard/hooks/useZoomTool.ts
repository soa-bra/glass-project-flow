import { useCallback } from 'react';

export interface ZoomToolController {
  handleZoomClick: (e: React.MouseEvent, zoomIn?: boolean) => void;
  handleWheelZoom: (e: WheelEvent) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  fitToScreen: () => void;
}

export const useZoomTool = (
  zoom: number,
  onZoomChange: (newZoom: number) => void,
  onPositionChange: (position: { x: number; y: number }) => void
): ZoomToolController => {
  const ZOOM_STEP = 0.1;
  const MIN_ZOOM = 0.1;
  const MAX_ZOOM = 5;

  const clampZoom = (newZoom: number): number => {
    return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoom));
  };

  const handleZoomClick = useCallback((e: React.MouseEvent, zoomIn = true) => {
    e.preventDefault();
    const newZoom = zoomIn ? zoom + ZOOM_STEP : zoom - ZOOM_STEP;
    onZoomChange(clampZoom(newZoom));
  }, [zoom, onZoomChange]);

  const handleWheelZoom = useCallback((e: WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
      const newZoom = zoom + delta;
      onZoomChange(clampZoom(newZoom));
    }
  }, [zoom, onZoomChange]);

  const zoomIn = useCallback(() => {
    onZoomChange(clampZoom(zoom + ZOOM_STEP));
  }, [zoom, onZoomChange]);

  const zoomOut = useCallback(() => {
    onZoomChange(clampZoom(zoom - ZOOM_STEP));
  }, [zoom, onZoomChange]);

  const resetZoom = useCallback(() => {
    onZoomChange(1);
  }, [onZoomChange]);

  const fitToScreen = useCallback(() => {
    onZoomChange(1);
    onPositionChange({ x: 0, y: 0 });
  }, [onZoomChange, onPositionChange]);

  return {
    handleZoomClick,
    handleWheelZoom,
    zoomIn,
    zoomOut,
    resetZoom,
    fitToScreen
  };
};