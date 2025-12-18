import React, { useState } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize,
  RotateCcw,
  RotateCw,
  Grid3x3,
  Save,
  Plus,
  Clock,
  Share2,
  Settings,
  File,
  Layers,
  Sparkles
} from 'lucide-react';
import { useCanvasStore } from '@/stores/canvasStore';
import { usePlanningStore } from '@/stores/planningStore';
import { HistoryPopover } from './popovers/HistoryPopover';
import { SharePopover } from './popovers/SharePopover';
import { CanvasPropertiesPopover } from './popovers/CanvasPropertiesPopover';
import { FileMenuPopover } from './popovers/FileMenuPopover';
import { LayersMenuPopover } from './popovers/LayersMenuPopover';
import { AIAssistantPopover } from './AIAssistantPopover';

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
  
  const { currentBoard, renameBoard } = usePlanningStore();
  
  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;
  
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(false);
  const [isFileMenuOpen, setIsFileMenuOpen] = useState(false);
  const [isLayersOpen, setIsLayersOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [boardName, setBoardName] = useState(currentBoard?.name || 'لوحة جديدة');
  
  const handleSaveName = () => {
    if (currentBoard && boardName.trim()) {
      renameBoard(currentBoard.id, boardName.trim());
    }
    setIsEditingName(false);
  };
  
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
    <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-sb-border">
      {/* Left: File Menu & Board Info */}
      <div className="flex items-center gap-4">
        {/* File Menu */}
        <div className="relative">
          <button
            onClick={() => setIsFileMenuOpen(!isFileMenuOpen)}
            className="flex items-center gap-2 px-3 py-2 hover:bg-sb-panel-bg rounded-lg transition-colors"
            title="قائمة الملف"
          >
            <File size={18} className="text-sb-ink" />
            <span className="text-[13px] font-medium text-sb-ink">ملف</span>
          </button>
          <FileMenuPopover isOpen={isFileMenuOpen} onClose={() => setIsFileMenuOpen(false)} />
        </div>
        
        <div className="h-6 w-px bg-sb-border" />
        
        {/* Editable Board Name */}
        {isEditingName ? (
          <input
            type="text"
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            onBlur={handleSaveName}
            onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
            autoFocus
            className="text-[16px] font-bold text-sb-ink px-2 py-1 border border-sb-ink rounded focus:outline-none"
          />
        ) : (
          <h2 
            className="text-[16px] font-bold text-sb-ink cursor-pointer hover:bg-sb-panel-bg px-2 py-1 rounded"
            onDoubleClick={() => setIsEditingName(true)}
            title="انقر مرتين للتعديل"
          >
            {currentBoard?.name || 'لوحة جديدة'}
          </h2>
        )}
        
        <span className="text-[11px] text-sb-ink-40">
          آخر حفظ: الآن
        </span>
      </div>
      
      {/* Center: Control Buttons */}
      <div className="flex items-center gap-2">
        {/* History Log */}
        <div className="relative">
          <button
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
            className="flex items-center gap-2 px-3 py-2 hover:bg-sb-panel-bg rounded-lg transition-colors"
            title="سجل العمليات"
          >
            <Clock size={18} className="text-sb-ink" />
            <span className="text-[13px] font-medium text-sb-ink">السجل</span>
          </button>
          <HistoryPopover isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
        </div>
        
        {/* Share */}
        <div className="relative">
          <button
            onClick={() => setIsShareOpen(!isShareOpen)}
            className="flex items-center gap-2 px-3 py-2 hover:bg-sb-panel-bg rounded-lg transition-colors"
            title="المشاركة"
          >
            <Share2 size={18} className="text-sb-ink" />
            <span className="text-[13px] font-medium text-sb-ink">مشاركة</span>
          </button>
          <SharePopover isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} boardId={currentBoard?.id} />
        </div>
        
        {/* Layers */}
        <div className="relative">
          <button
            onClick={() => setIsLayersOpen(!isLayersOpen)}
            className="flex items-center gap-2 px-3 py-2 hover:bg-sb-panel-bg rounded-lg transition-colors"
            title="الطبقات"
          >
            <Layers size={18} className="text-sb-ink" />
            <span className="text-[13px] font-medium text-sb-ink">الطبقات</span>
          </button>
          <LayersMenuPopover isOpen={isLayersOpen} onClose={() => setIsLayersOpen(false)} />
        </div>
        
        {/* AI Assistant */}
        <div className="relative">
          <AIAssistantPopover isOpen={isAIOpen} onOpenChange={setIsAIOpen}>
            <button
              onClick={() => setIsAIOpen(!isAIOpen)}
              className="flex items-center gap-2 px-3 py-2 bg-gradient-to-br from-[#3DBE8B] to-[#3DA8F5] text-white rounded-lg hover:opacity-90 transition-opacity"
              title="مساعد الذكاء الصناعي (Cmd/Ctrl+K)"
            >
              <Sparkles size={18} className="animate-pulse" />
              <span className="text-[13px] font-medium">AI</span>
            </button>
          </AIAssistantPopover>
        </div>
        
        {/* Canvas Properties */}
        <div className="relative">
          <button
            onClick={() => setIsPropertiesOpen(!isPropertiesOpen)}
            className="flex items-center gap-2 px-3 py-2 hover:bg-sb-panel-bg rounded-lg transition-colors"
            title="خصائص الكانفاس"
          >
            <Settings size={18} className="text-sb-ink" />
          </button>
          <CanvasPropertiesPopover isOpen={isPropertiesOpen} onClose={() => setIsPropertiesOpen(false)} />
        </div>
        
        <div className="h-6 w-px bg-sb-border mx-2" />
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
          onClick={undo}
          disabled={!canUndo}
          className={`p-2 rounded-lg transition-colors ${
            canUndo
              ? 'hover:bg-sb-panel-bg text-sb-ink'
              : 'text-sb-ink-20 cursor-not-allowed'
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
              ? 'hover:bg-sb-panel-bg text-sb-ink'
              : 'text-sb-ink-20 cursor-not-allowed'
          }`}
          title="إعادة (Ctrl + Shift + Z)"
        >
          <RotateCw size={18} />
        </button>
      </div>
      
      {/* Right: Save Button */}
      <button className="flex items-center gap-2 px-4 py-2 bg-[#3DBE8B] text-white rounded-[10px] hover:opacity-90 transition-opacity">
        <Save size={16} />
        <span className="text-[13px] font-medium">حفظ</span>
      </button>
    </div>
  );
};

export default CanvasToolbar;
