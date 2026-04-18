import React, { useCallback, useEffect, useRef } from 'react';
import { usePlanningStore } from '@/stores/planningStore';
import { useCanvasStore } from '@/stores/canvasStore';
import type { CanvasBoard } from '@/types/planning';
import InfiniteCanvas from '@/features/planning/canvas/viewport/InfiniteCanvas';
import BottomToolbar from '@/features/planning/ui/toolbars/BottomToolbar';
import CanvasToolbar from '@/features/planning/ui/toolbars/CanvasToolbar';
import ToolZone from './panels/ToolZone';
import NavigationBar from '@/features/planning/ui/toolbars/NavigationBar';
import ContextualToolbarManager from '@/features/planning/ui/toolbars/ContextualToolbarManager';
import { SmartCommandBar, useSmartCommandBar } from '@/features/planning/elements/smart/SmartCommandBar';
import { createTypedSmartElement } from '@/features/planning/elements/smart/factories/createTypedSmartElement';

interface PlanningCanvasProps {
  board: CanvasBoard;
}

const PlanningCanvas: React.FC<PlanningCanvasProps> = ({ board }) => {
  const setCurrentBoard = usePlanningStore((state) => state.setCurrentBoard);
  const activeTool = useCanvasStore((state) => state.activeTool);
  const setViewportHostSize = useCanvasStore((state) => state.setViewportHostSize);
  const addElement = useCanvasStore((state) => state.addElement);
  const viewport = useCanvasStore((state) => state.viewport);
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const commandBar = useSmartCommandBar();

  useEffect(() => {
    const host = canvasHostRef.current;
    if (!host) return;

    const syncSize = () => {
      setViewportHostSize(host.clientWidth, host.clientHeight);
    };

    syncSize();

    if (typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(() => {
      syncSize();
    });

    observer.observe(host);
    return () => observer.disconnect();
  }, [setViewportHostSize]);

  const handleElementsGenerated = useCallback(
    (elements: any[]) => {
      elements.forEach((element, index) => {
        addElement(
          createTypedSmartElement({
            element,
            index,
            viewport,
          }),
        );
      });
    },
    [addElement, viewport],
  );

  return (
    <div className="h-full flex flex-col bg-white">
      <CanvasToolbar board={board} onBack={() => setCurrentBoard(null)} onOpenAI={commandBar.open} />
      <div ref={canvasHostRef} className="flex-1 flex overflow-hidden relative">
        <div className="flex-1">
          <InfiniteCanvas boardId={board.id} />
        </div>
        <ToolZone activeTool={activeTool} />
      </div>
      <BottomToolbar />
      <NavigationBar />
      <ContextualToolbarManager />
      <SmartCommandBar
        isOpen={commandBar.isOpen}
        onClose={commandBar.close}
        onElementsGenerated={handleElementsGenerated}
      />
    </div>
  );
};

export default PlanningCanvas;
