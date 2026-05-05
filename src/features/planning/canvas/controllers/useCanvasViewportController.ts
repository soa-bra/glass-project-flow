import { useCallback, useEffect, useMemo, useState } from 'react';
import type { RefObject } from 'react';
import { canvasKernel } from '@/engine/canvas/kernel/canvasKernel';
import { getCursorForMode } from '@/engine/canvas/interaction/interactionStateMachine';
import type { CanvasElement, CanvasLayer, CanvasSettings } from '@/types/canvas';

const DEFAULT_CONTAINER_SIZE = { width: 1280, height: 720 };

function getCanvasHostSize(container: HTMLDivElement | null): { width: number; height: number } {
  if (!container) return { ...DEFAULT_CONTAINER_SIZE };

  return {
    width: container.clientWidth || DEFAULT_CONTAINER_SIZE.width,
    height: container.clientHeight || DEFAULT_CONTAINER_SIZE.height,
  };
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
  setViewportHostSize: (width: number, height: number) => void;
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
  setViewportHostSize,
}: UseCanvasViewportControllerOptions) {
  const [containerSize, setContainerSize] = useState(() => getCanvasHostSize(null));

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const syncContainerSize = () => {
      const nextSize = getCanvasHostSize(container);
      setContainerSize(nextSize);
      setViewportHostSize(nextSize.width, nextSize.height);
    };

    syncContainerSize();

    if (typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(syncContainerSize);
    observer.observe(container);
    return () => observer.disconnect();
  }, [containerRef, setViewportHostSize]);

  const viewportBounds = useMemo(() => {
    return canvasKernel.getVisibleBounds(viewport, containerSize.width, containerSize.height);
  }, [viewport, containerSize.width, containerSize.height]);

  const layerVisibilityMap = useMemo(() => new Map(layers.map((layer) => [layer.id, layer.visible])), [layers]);

  const visibleElements = useMemo(() => {
    const padding = 200;
    return elements.filter((el) => {
      const isLayerVisible = el.layerId ? (layerVisibilityMap.get(el.layerId) ?? true) : true;
      if (!isLayerVisible || el.visible === false) return false;
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
