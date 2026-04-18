import { useCallback, useRef } from 'react';
import type { RefObject } from 'react';
import { canvasKernel } from '@/engine/canvas/kernel/canvasKernel';

interface UseCanvasPointerTrackingOptions {
  containerRef: RefObject<HTMLDivElement>;
  viewport: { zoom: number; pan: { x: number; y: number } };
}

export function useCanvasPointerTracking({ containerRef, viewport }: UseCanvasPointerTrackingOptions) {
  const lastPointerPositionRef = useRef<{ x: number; y: number } | null>(null);

  const updatePointerFromClient = useCallback(
    (clientX: number, clientY: number) => {
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return null;

      const worldPoint = canvasKernel.screenToWorld(clientX, clientY, viewport, containerRect);
      lastPointerPositionRef.current = worldPoint;
      return worldPoint;
    },
    [containerRef, viewport],
  );

  return { lastPointerPositionRef, updatePointerFromClient };
}

export default useCanvasPointerTracking;
