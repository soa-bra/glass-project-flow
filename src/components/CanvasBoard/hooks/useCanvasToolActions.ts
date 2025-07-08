import { useCallback } from 'react';

export const useCanvasToolActions = (
  gridSize: number,
  setGridSize: (size: number) => void
) => {
  const handleGridSizeChange = useCallback((size: number) => {
    setGridSize(size);
  }, [setGridSize]);

  const handleAlignToGrid = useCallback(() => {
    // Align elements to grid implementation
  }, []);

  const handleGroup = useCallback(() => {
    // Group elements implementation
  }, []);

  const handleUngroup = useCallback(() => {
    // Ungroup elements implementation
  }, []);

  const handleLock = useCallback(() => {
    // Lock elements implementation
  }, []);

  const handleUnlock = useCallback(() => {
    // Unlock elements implementation
  }, []);

  return {
    handleGridSizeChange,
    handleAlignToGrid,
    handleGroup,
    handleUngroup,
    handleLock,
    handleUnlock,
  };
};