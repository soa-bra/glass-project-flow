import React from 'react';
import { ArrowRight } from 'lucide-react';
import { usePlanningStore } from '@/stores/planningStore';
import type { CanvasBoard } from '@/types/planning';
import InfiniteCanvas from './InfiniteCanvas';
import LayersPanel from './LayersPanel';
import CanvasToolbar from './CanvasToolbar';

interface PlanningCanvasProps {
  board: CanvasBoard;
}

const PlanningCanvas: React.FC<PlanningCanvasProps> = ({ board }) => {
  const { setCurrentBoard } = usePlanningStore();

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-[hsl(var(--border))]">
        <button
          onClick={() => setCurrentBoard(null)}
          className="p-2 hover:bg-[hsl(var(--panel))] rounded-full transition-colors"
          title="العودة إلى القائمة"
        >
          <ArrowRight size={20} className="text-[hsl(var(--ink))]" />
        </button>
      </div>
      
      {/* Toolbar */}
      <CanvasToolbar />
      
      {/* Main Canvas Area with Layers Panel */}
      <div className="flex-1 flex overflow-hidden">
        {/* Infinite Canvas */}
        <div className="flex-1">
          <InfiniteCanvas boardId={board.id} />
        </div>
        
        {/* Layers Panel */}
        <LayersPanel />
      </div>
    </div>
  );
};

export default PlanningCanvas;
