import { useCallback, useEffect, useMemo, useState } from 'react';
import type { RefObject } from 'react';
import { canvasKernel } from '@/engine/canvas/kernel/canvasKernel';
import { getCursorForMode } from '@/engine/canvas/interaction/interactionStateMachine';
import type { CanvasElement, CanvasLayer, CanvasSettings } from '@/types/canvas';

function getCanvasHostSize(container: HTMLDivElement | null): { width: number; height: number } {
  if (container) {
    return { width: container.clientWidth, height: container.clientHeight };
  }
  if (typeof window !== 'undefined') {
    return { width: window.innerWidth, height: window.innerHeight };
  }
  return { width: 1280, height: 720 };
}

interface UseCanvasViewportControllerOptions {
  containerRef: RefObject<HTMLDivElement>;
  elements: CanvasElement[];
  layers: CanvasLayer[];
  viewport: { zoom: number; pan: { x: number; y: number } };
  settings: CanvasSettings;
  activeTool: string;
  interactionMode: any;
  panBy: (deltaX: number, deltaY: number) => void;
  zoomByWheel: (deltaY: number, screenX: number, screenY: number) => void;
}

export function useCanvasViewportController({
  containerRef,
  elements,
  layers,
  viewport,
  settings,
  activeTool,
  interactionMode,
  panBy,
  zoomByWheel,
}: UseCanvasViewportControllerOptions) {
  const [containerSize, setContainerSize] = useState(() => getCanvasHostSize(null));

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const syncContainerSize = () => {
      setContainerSize(getCanvasHostSize(container));
    };

    syncContainerSize();

    if (typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(() => {
      syncContainerSize();
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [containerRef]);

  const viewportBounds = useMemo(() => {
    return canvasKernel.getVisibleBounds(viewport, containerSize.width, containerSize.height);
  }, [viewport, containerSize.width, containerSize.height]);

  const layerVisibilityMap = useMemo(() => new Map(layers.map((layer) => [layer.id, layer.visible])), [layers]);

  const visibleElements = useMemo(() => {
    const padding = 200;
    return elements.filter((el) => {
      const isLayerVisible = el.layerId ? layerVisibilityMap.get(el.layerId) : undefined;
      if (!isLayerVisible || !el.visible) return false;
      if (el.type === 'mindmap_connector') return true;

      return (
        el.position.x + el.size.width >= viewportBounds.x - padding &&
        el.position.x <= viewportBounds.x + viewportBounds.width + padding &&
        el.position.y + el.size.height >= viewportBounds.y - padding &&
        el.position.y <= viewportBounds.y + viewportBounds.height + padding
      );
    });
  }, [elements, layerVisibilityMap, viewportBounds]);

  const snapToGrid = useCallback(
    (x: number, y: number) => canvasKernel.snapToGrid({ x, y }, settings.gridSize, settings.snapToGrid),
    [settings.gridSize, settings.snapToGrid],
  );

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) {
        zoomByWheel(e.deltaY, e.clientX, e.clientY);
      } else {
        panBy(-e.deltaX, -e.deltaY);
      }
    },
    [panBy, zoomByWheel],
  );

  const getCursorStyle = useCallback(() => {
    if (interactionMode.kind !== 'idle') {
      return getCursorForMode(interactionMode);
    }

    switch (activeTool) {
      case 'text_tool':
        return 'text';
      case 'smart_pen':
      case 'shapes_tool':
      case 'frame_tool':
      case 'smart_element_tool':
      case 'smart_doc_tool':
        return 'crosshair';
      case 'file_uploader':
        return 'copy';
      default:
        return 'default';
    }
  }, [activeTool, interactionMode]);

  return {
    containerSize,
    viewportBounds,
    visibleElements,
    snapToGrid,
    handleWheel,
    getCursorStyle,
  };
}

export default useCanvasViewportController;
