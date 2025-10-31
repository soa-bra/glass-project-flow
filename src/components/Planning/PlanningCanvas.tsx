import React from 'react';
import { ArrowRight } from 'lucide-react';
import { usePlanningStore } from '@/stores/planningStore';
import type { CanvasBoard } from '@/types/planning';

interface PlanningCanvasProps {
  board: CanvasBoard;
}

const PlanningCanvas: React.FC<PlanningCanvasProps> = ({ board }) => {
  const { setCurrentBoard } = usePlanningStore();

  return (
    <div className="h-full flex flex-col bg-[hsl(var(--sb-column-3-bg))]">
      {/* Header */}
      <div className="flex items-center gap-4 p-6 border-b border-[hsl(var(--border))]">
        <button
          onClick={() => setCurrentBoard(null)}
          className="p-2 hover:bg-[hsl(var(--panel))] rounded-full transition-colors"
        >
          <ArrowRight size={20} className="text-[hsl(var(--ink))]" />
        </button>
        <div>
          <h1 className="text-[20px] font-bold text-[hsl(var(--ink))]">
            {board.name}
          </h1>
          <p className="text-[12px] text-[hsl(var(--ink-60))]">
            {board.type === 'blank' && 'لوحة فارغة'}
            {board.type === 'template' && 'من قالب'}
            {board.type === 'from_file' && 'من ملف'}
          </p>
        </div>
      </div>

      {/* Canvas Area - Placeholder */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 rounded-full bg-[hsl(var(--panel))] mx-auto mb-4 flex items-center justify-center">
            <div className="text-[48px]">🎨</div>
          </div>
          <p className="text-[16px] font-semibold text-[hsl(var(--ink))] mb-2">
            الكانفاس قيد التطوير
          </p>
          <p className="text-[14px] text-[hsl(var(--ink-60))]">
            سيتم إضافة وظائف الكانفاس في المرحلة الثالثة
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlanningCanvas;
