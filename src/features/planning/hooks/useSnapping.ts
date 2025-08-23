import { useState, useCallback } from 'react';
import { Position } from '../types/canvas';

interface SnapGuides {
  vertical: number[];
  horizontal: number[];
}

interface SnapOptions {
  snapToGrid: boolean;
  snapToObjects: boolean;
  gridSize: number;
  snapThreshold: number;
}

export const useSnapping = (options: SnapOptions) => {
  const [snapGuides, setSnapGuides] = useState<SnapGuides>({
    vertical: [],
    horizontal: []
  });

  const snapToGrid = useCallback((position: Position): Position => {
    if (!options.snapToGrid) return position;

    const { gridSize } = options;
    return {
      x: Math.round(position.x / gridSize) * gridSize,
      y: Math.round(position.y / gridSize) * gridSize
    };
  }, [options.snapToGrid, options.gridSize]);

  const snapToGuides = useCallback((position: Position): Position => {
    if (!options.snapToObjects) return position;

    const { snapThreshold } = options;
    let snappedX = position.x;
    let snappedY = position.y;
    const activeGuides: SnapGuides = { vertical: [], horizontal: [] };

    // Check vertical guides (x-axis snapping)
    for (const guide of snapGuides.vertical) {
      if (Math.abs(position.x - guide) <= snapThreshold) {
        snappedX = guide;
        activeGuides.vertical.push(guide);
        break;
      }
    }

    // Check horizontal guides (y-axis snapping)
    for (const guide of snapGuides.horizontal) {
      if (Math.abs(position.y - guide) <= snapThreshold) {
        snappedY = guide;
        activeGuides.horizontal.push(guide);
        break;
      }
    }

    return { x: snappedX, y: snappedY };
  }, [snapGuides, options.snapToObjects, options.snapThreshold]);

  const snap = useCallback((position: Position): Position => {
    let snappedPosition = position;
    
    if (options.snapToGrid) {
      snappedPosition = snapToGrid(snappedPosition);
    }
    
    if (options.snapToObjects) {
      snappedPosition = snapToGuides(snappedPosition);
    }
    
    return snappedPosition;
  }, [snapToGrid, snapToGuides, options]);

  const updateSnapGuides = useCallback((guides: SnapGuides) => {
    setSnapGuides(guides);
  }, []);

  const clearSnapGuides = useCallback(() => {
    setSnapGuides({ vertical: [], horizontal: [] });
  }, []);

  return {
    snap,
    snapGuides,
    updateSnapGuides,
    clearSnapGuides,
    snapToGrid,
    snapToGuides
  };
};