import React from 'react';
import { usePlanningStore } from '@/stores/planningStore';
import { useCanvasStore } from '@/stores/canvasStore';
import type { CanvasBoard } from '@/types/planning';
import InfiniteCanvas from '@/features/planning/canvas/viewport/InfiniteCanvas';
import BottomToolbar from '@/features/planning/ui/toolbars/BottomToolbar';
import CanvasToolbar from '@/features/planning/ui/toolbars/CanvasToolbar';
import ToolZone from './panels/ToolZone';
import NavigationBar from '@/features/planning/ui/toolbars/NavigationBar';
import ContextualToolbarManager from '@/features/planning/ui/toolbars/ContextualToolbarManager';

interface PlanningCanvasProps {
  board: CanvasBoard;
}

const PlanningCanvas: React.FC<PlanningCanvasProps> = ({ board }) => {
  const setCurrentBoard = usePlanningStore((state) => state.setCurrentBoard);
  const activeTool = useCanvasStore((state) => state.activeTool);

  return (
    <div className="h-full flex flex-col bg-white">
      <CanvasToolbar board={board} onBack={() => setCurrentBoard(null)} onOpenAI={() => undefined} />
      <div className="flex-1 flex overflow-hidden relative">
        <div className="flex-1">
          <InfiniteCanvas boardId={board.id} />
        </div>
        <ToolZone activeTool={activeTool} />
      </div>
      <BottomToolbar />
      <NavigationBar />
      <ContextualToolbarManager />
    </div>
  );
};

export default PlanningCanvas;
