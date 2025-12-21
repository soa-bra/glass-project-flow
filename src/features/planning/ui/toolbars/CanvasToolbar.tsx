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
import { HistoryPopover } from '../overlays/HistoryPopover';
import { SharePopover } from '../overlays/SharePopover';
import { CanvasPropertiesPopover } from '../overlays/CanvasPropertiesPopover';
import { FileMenuPopover } from '../overlays/FileMenuPopover';
import { LayersMenuPopover } from '../overlays/LayersMenuPopover';
import { AIAssistantPopover } from '../widgets/AIAssistantPopover';

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
    <div 
      className="flex items-center justify-between px-6 py-3 bg-white border-b border-sb-border"
      role="toolbar"
      aria-label="شريط أدوات اللوحة"
      aria-orientation="horizontal"
    >
      {/* Left: File Menu & Board Info */}
      <div className="flex items-center gap-4" role="group" aria-label="قائمة الملفات ومعلومات اللوحة">
        {/* File Menu */}
        <div className="relative">
          <button
            onClick={() => setIsFileMenuOpen(!isFileMenuOpen)}
            className="flex items-center gap-2 px-3 py-2 hover:bg-sb-panel-bg rounded-lg transition-colors"
            aria-label="قائمة الملف"
            aria-haspopup="menu"
            aria-expanded={isFileMenuOpen}
            aria-keyshortcuts="Alt+F"
          >
            <File size={18} className="text-sb-ink" aria-hidden="true" />
            <span className="text-[13px] font-medium text-sb-ink">ملف</span>
          </button>
          <FileMenuPopover isOpen={isFileMenuOpen} onClose={() => setIsFileMenuOpen(false)} />
        </div>
        
        <div className="h-6 w-px bg-sb-border" role="separator" aria-orientation="vertical" />
        
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
            aria-label="اسم اللوحة"
          />
        ) : (
          <h2 
            className="text-[16px] font-bold text-sb-ink cursor-pointer hover:bg-sb-panel-bg px-2 py-1 rounded"
            onDoubleClick={() => setIsEditingName(true)}
            tabIndex={0}
            role="button"
            aria-label={`اسم اللوحة: ${currentBoard?.name || 'لوحة جديدة'}. انقر مرتين للتعديل`}
            onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(true)}
          >
            {currentBoard?.name || 'لوحة جديدة'}
          </h2>
        )}
        
        <span className="text-[11px] text-sb-ink-40" aria-live="polite">
          آخر حفظ: الآن
        </span>
      </div>
      
      {/* Center: Control Buttons */}
      <div className="flex items-center gap-2" role="group" aria-label="أدوات التحكم">
        {/* History Log */}
        <div className="relative">
          <button
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
            className="flex items-center gap-2 px-3 py-2 hover:bg-sb-panel-bg rounded-lg transition-colors"
            aria-label="سجل العمليات"
            aria-haspopup="dialog"
            aria-expanded={isHistoryOpen}
          >
            <Clock size={18} className="text-sb-ink" aria-hidden="true" />
            <span className="text-[13px] font-medium text-sb-ink">السجل</span>
          </button>
          <HistoryPopover isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
        </div>
        
        {/* Share */}
        <div className="relative">
          <button
            onClick={() => setIsShareOpen(!isShareOpen)}
            className="flex items-center gap-2 px-3 py-2 hover:bg-sb-panel-bg rounded-lg transition-colors"
            aria-label="مشاركة اللوحة"
            aria-haspopup="dialog"
            aria-expanded={isShareOpen}
          >
            <Share2 size={18} className="text-sb-ink" aria-hidden="true" />
            <span className="text-[13px] font-medium text-sb-ink">مشاركة</span>
          </button>
          <SharePopover isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} boardId={currentBoard?.id} />
        </div>
        
        {/* Layers */}
        <div className="relative">
          <button
            onClick={() => setIsLayersOpen(!isLayersOpen)}
            className="flex items-center gap-2 px-3 py-2 hover:bg-sb-panel-bg rounded-lg transition-colors"
            aria-label="إدارة الطبقات"
            aria-haspopup="dialog"
            aria-expanded={isLayersOpen}
          >
            <Layers size={18} className="text-sb-ink" aria-hidden="true" />
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
              aria-label="مساعد الذكاء الصناعي"
              aria-haspopup="dialog"
              aria-expanded={isAIOpen}
              aria-keyshortcuts="Control+K Meta+K"
            >
              <Sparkles size={18} className="animate-pulse" aria-hidden="true" />
              <span className="text-[13px] font-medium">AI</span>
            </button>
          </AIAssistantPopover>
        </div>
        
        {/* Canvas Properties */}
        <div className="relative">
          <button
            onClick={() => setIsPropertiesOpen(!isPropertiesOpen)}
            className="flex items-center gap-2 px-3 py-2 hover:bg-sb-panel-bg rounded-lg transition-colors"
            aria-label="خصائص اللوحة"
            aria-haspopup="dialog"
            aria-expanded={isPropertiesOpen}
          >
            <Settings size={18} className="text-sb-ink" aria-hidden="true" />
          </button>
          <CanvasPropertiesPopover isOpen={isPropertiesOpen} onClose={() => setIsPropertiesOpen(false)} />
        </div>
        
        <div className="h-6 w-px bg-sb-border mx-2" role="separator" aria-orientation="vertical" />
        
        {/* Demo: Add Test Element */}
        <button
          onClick={handleAddTestElement}
          className="flex items-center gap-1 px-3 py-2 bg-[hsl(var(--accent-green))] text-white rounded-lg hover:opacity-90 transition-opacity text-[12px] font-medium"
          aria-label="إضافة عنصر تجريبي للوحة"
        >
          <Plus size={14} aria-hidden="true" />
          <span>عنصر تجريبي</span>
        </button>
        
        <div className="h-6 w-px bg-[hsl(var(--border))] mx-2" role="separator" aria-orientation="vertical" />
        
        {/* Undo */}
        <button
          onClick={undo}
          disabled={!canUndo}
          className={`p-2 rounded-lg transition-colors ${
            canUndo
              ? 'hover:bg-sb-panel-bg text-sb-ink'
              : 'text-sb-ink-20 cursor-not-allowed'
          }`}
          aria-label="تراجع عن آخر إجراء"
          aria-disabled={!canUndo}
          aria-keyshortcuts="Control+Z"
        >
          <RotateCcw size={18} aria-hidden="true" />
        </button>
        
        {/* Redo */}
        <button
          onClick={redo}
          disabled={!canRedo}
          className={`p-2 rounded-lg transition-colors ${
            canRedo
              ? 'hover:bg-sb-panel-bg text-sb-ink'
              : 'text-sb-ink-20 cursor-not-allowed'
          }`}
          aria-label="إعادة الإجراء الملغي"
          aria-disabled={!canRedo}
          aria-keyshortcuts="Control+Shift+Z Control+Y"
        >
          <RotateCw size={18} aria-hidden="true" />
        </button>
      </div>
      
      {/* Right: Save Button */}
      <button 
        className="flex items-center gap-2 px-4 py-2 bg-[#3DBE8B] text-white rounded-[10px] hover:opacity-90 transition-opacity"
        aria-label="حفظ اللوحة"
        aria-keyshortcuts="Control+S"
      >
        <Save size={16} aria-hidden="true" />
        <span className="text-[13px] font-medium">حفظ</span>
      </button>
    </div>
  );
};

export default CanvasToolbar;
