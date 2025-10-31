import React from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize,
  RotateCcw,
  RotateCw,
  Grid3x3,
  Save,
  Plus
} from 'lucide-react';
import { useCanvasStore } from '@/stores/canvasStore';
import { usePlanningStore } from '@/stores/planningStore';

const CanvasToolbar: React.FC = () => {
  const {
    zoomIn,
    zoomOut,
    zoomToFit,
    undo,
    redo,
    toggleGrid,
    settings,
    history,
    addElement
  } = useCanvasStore();
  
  const { currentBoard } = usePlanningStore();
  
  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;
  
  // Demo: Add test elements
  const handleAddTestElement = () => {
    const types = ['text', 'sticky', 'shape'] as const;
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    addElement({
      type: randomType,
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      size: { width: 200, height: 100 },
      style: {
        backgroundColor: randomType === 'sticky' ? '#FFF4CC' : '#FFFFFF'
      },
      content: randomType === 'shape' ? undefined : `عنصر ${randomType} تجريبي`
    });
  };
  
  return (
    <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-[hsl(var(--border))]">
      {/* Left: Board Info */}
      <div className="flex items-center gap-4">
        <h2 className="text-[18px] font-bold text-[hsl(var(--ink))]">
          {currentBoard?.name}
        </h2>
        <div className="h-4 w-px bg-[hsl(var(--border))]" />
        <span className="text-[12px] text-[hsl(var(--ink-60))]">
          آخر حفظ: الآن
        </span>
      </div>
      
      {/* Center: Zoom & View Controls */}
      <div className="flex items-center gap-2">
        {/* Demo: Add Test Element */}
        <button
          onClick={handleAddTestElement}
          className="flex items-center gap-1 px-3 py-2 bg-[hsl(var(--accent-green))] text-white rounded-lg hover:opacity-90 transition-opacity text-[12px] font-medium"
          title="إضافة عنصر تجريبي"
        >
          <Plus size={14} />
          <span>عنصر تجريبي</span>
        </button>
        
        <div className="h-6 w-px bg-[hsl(var(--border))] mx-2" />
        
        <button
          onClick={zoomOut}
          className="p-2 hover:bg-[hsl(var(--panel))] rounded-lg transition-colors"
          title="تصغير (Ctrl + -)"
        >
          <ZoomOut size={18} className="text-[hsl(var(--ink))]" />
        </button>
        
        <button
          onClick={zoomIn}
          className="p-2 hover:bg-[hsl(var(--panel))] rounded-lg transition-colors"
          title="تكبير (Ctrl + +)"
        >
          <ZoomIn size={18} className="text-[hsl(var(--ink))]" />
        </button>
        
        <button
          onClick={zoomToFit}
          className="p-2 hover:bg-[hsl(var(--panel))] rounded-lg transition-colors"
          title="احتواء الكل"
        >
          <Maximize size={18} className="text-[hsl(var(--ink))]" />
        </button>
        
        <div className="h-6 w-px bg-[hsl(var(--border))] mx-2" />
        
        <button
          onClick={undo}
          disabled={!canUndo}
          className={`p-2 rounded-lg transition-colors ${
            canUndo
              ? 'hover:bg-[hsl(var(--panel))] text-[hsl(var(--ink))]'
              : 'text-[hsl(var(--ink-30))] cursor-not-allowed'
          }`}
          title="تراجع (Ctrl + Z)"
        >
          <RotateCcw size={18} />
        </button>
        
        <button
          onClick={redo}
          disabled={!canRedo}
          className={`p-2 rounded-lg transition-colors ${
            canRedo
              ? 'hover:bg-[hsl(var(--panel))] text-[hsl(var(--ink))]'
              : 'text-[hsl(var(--ink-30))] cursor-not-allowed'
          }`}
          title="إعادة (Ctrl + Shift + Z)"
        >
          <RotateCw size={18} />
        </button>
        
        <div className="h-6 w-px bg-[hsl(var(--border))] mx-2" />
        
        <button
          onClick={toggleGrid}
          className={`p-2 rounded-lg transition-colors ${
            settings.gridEnabled
              ? 'bg-[hsl(var(--panel))] text-[hsl(var(--ink))]'
              : 'hover:bg-[hsl(var(--panel))] text-[hsl(var(--ink-60))]'
          }`}
          title="تبديل الشبكة (G)"
        >
          <Grid3x3 size={18} />
        </button>
      </div>
      
      {/* Right: Save Button */}
      <button className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--accent-green))] text-white rounded-[10px] hover:opacity-90 transition-opacity">
        <Save size={16} />
        <span className="text-[13px] font-medium">حفظ</span>
      </button>
    </div>
  );
};

export default CanvasToolbar;
