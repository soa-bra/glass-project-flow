import React, { useState, useCallback } from 'react';
import { ArrowRight, Save, RotateCcw, RotateCw, Clock, Share2, File, Layers, Sparkles, Command } from 'lucide-react';
import { usePlanningStore } from '@/stores/planningStore';
import { useCanvasStore } from '@/stores/canvasStore';
import type { CanvasBoard } from '@/types/planning';
import InfiniteCanvas from '@/features/planning/canvas/viewport/InfiniteCanvas';
import BottomToolbar from '@/features/planning/ui/toolbars/BottomToolbar';
import ToolZone from './panels/ToolZone';
import NavigationBar from '@/features/planning/ui/toolbars/NavigationBar';
import ContextualToolbarManager from '@/features/planning/ui/toolbars/ContextualToolbarManager';
import { HistoryPopover } from './overlays/HistoryPopover';
import { SharePopover } from './overlays/SharePopover';
import { FileMenuPopover } from './overlays/FileMenuPopover';
import { LayersMenuPopover } from './overlays/LayersMenuPopover';
import { AIAssistantPopover } from '@/features/planning/ui/widgets/AIAssistantPopover';
import { SmartCommandBar, useSmartCommandBar } from '@/features/planning/elements/smart/SmartCommandBar';

interface PlanningCanvasProps {
  board: CanvasBoard;
}
const PlanningCanvas: React.FC<PlanningCanvasProps> = ({
  board
}) => {
  const { setCurrentBoard, renameBoard } = usePlanningStore();
  const { activeTool, undo, redo, history, addElement, viewport } = useCanvasStore();
  
  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;
  
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isFileMenuOpen, setIsFileMenuOpen] = useState(false);
  const [isLayersOpen, setIsLayersOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [boardName, setBoardName] = useState(board?.name || 'لوحة جديدة');
  
  // Smart Command Bar
  const commandBar = useSmartCommandBar();
  
  // Handle AI-generated elements
  const handleElementsGenerated = useCallback((elements: any[], layout: string) => {
    elements.forEach((element, index) => {
      // Adjust position based on current viewport
      const adjustedPosition = {
        x: (element.position?.x || 100 + index * 50) - viewport.pan.x / viewport.zoom,
        y: (element.position?.y || 100 + index * 50) - viewport.pan.y / viewport.zoom
      };
      
      addElement({
        type: 'smart',
        position: adjustedPosition,
        size: { width: 400, height: 300 },
        content: element.title,
        style: {
          backgroundColor: 'transparent'
        },
        metadata: {
          smartType: element.type,
          smartData: element.data,
          description: element.description,
          connections: element.connections
        }
      });
    });
  }, [addElement, viewport]);
  
  const handleSaveName = () => {
    if (board && boardName.trim()) {
      renameBoard(board.id, boardName.trim());
    }
    setIsEditingName(false);
  };
  
  return <div className="h-full flex flex-col bg-white">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-[hsl(var(--border))]">
        {/* Right Section: Back Button + Board Name */}
        <div className="flex items-center gap-3">
          {/* Back Button */}
          <button 
            onClick={() => setCurrentBoard(null)} 
            className="p-2 hover:bg-[hsl(var(--panel))] rounded-lg transition-colors" 
            title="العودة إلى القائمة"
          >
            <ArrowRight size={20} className="text-[hsl(var(--ink))]" />
          </button>
          
          <div className="h-6 w-px bg-[hsl(var(--border))]" />
          
          {/* Board Name */}
          {isEditingName ? (
            <input
              type="text"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              onBlur={handleSaveName}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
              autoFocus
              className="text-[16px] font-bold text-[hsl(var(--ink))] px-2 py-1 border border-[hsl(var(--ink))] rounded focus:outline-none"
            />
          ) : (
            <h2 
              className="text-[16px] font-bold text-[hsl(var(--ink))] cursor-pointer hover:bg-[hsl(var(--panel))] px-2 py-1 rounded"
              onDoubleClick={() => setIsEditingName(true)}
              title="انقر مرتين للتعديل"
            >
              {board?.name || 'لوحة جديدة'}
            </h2>
          )}
        </div>
        
        {/* Center Section: Main Controls */}
        <div className="flex items-center gap-2">
          {/* Share - Black Capsule */}
          <div className="relative">
            <button
              onClick={() => setIsShareOpen(!isShareOpen)}
              className="flex items-center gap-2 px-4 py-1.5 bg-[hsl(var(--ink))] text-white rounded-full transition-opacity hover:opacity-90"
              title="المشاركين"
            >
              <span className="text-[12px] font-medium">المشاركين</span>
            </button>
            <SharePopover isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} boardId={board?.id} />
          </div>
          
          {/* AI Assistant */}
          <div className="relative">
            <AIAssistantPopover isOpen={isAIOpen} onOpenChange={setIsAIOpen}>
              <button
                onClick={() => setIsAIOpen(!isAIOpen)}
                className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-br from-[#3DBE8B] to-[#3DA8F5] text-white rounded-full hover:opacity-90 transition-opacity"
                title="مساعد الذكاء الصناعي"
              >
                <Sparkles size={18} className="animate-pulse" />
                <span className="text-[12px] font-medium">AI</span>
              </button>
            </AIAssistantPopover>
          </div>
          
          
          {/* File Menu */}
          <div className="relative">
            <button
              onClick={() => setIsFileMenuOpen(!isFileMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 hover:bg-[hsl(var(--panel))] rounded-lg transition-colors"
              title="قائمة الملف"
            >
              <File size={18} className="text-[hsl(var(--ink))]" />
              <span className="text-[13px] font-medium text-[hsl(var(--ink))]">ملف</span>
            </button>
            <FileMenuPopover isOpen={isFileMenuOpen} onClose={() => setIsFileMenuOpen(false)} />
          </div>
          
          {/* Layers */}
          <div className="relative">
            <button
              onClick={() => setIsLayersOpen(!isLayersOpen)}
              className="flex items-center gap-2 px-3 py-2 hover:bg-[hsl(var(--panel))] rounded-lg transition-colors"
              title="الطبقات"
            >
              <Layers size={18} className="text-[hsl(var(--ink))]" />
              <span className="text-[13px] font-medium text-[hsl(var(--ink))]">الطبقات</span>
            </button>
            <LayersMenuPopover isOpen={isLayersOpen} onClose={() => setIsLayersOpen(false)} />
          </div>
          
          <div className="h-6 w-px bg-[hsl(var(--border))] mx-1" />
          
          {/* History */}
          <div className="relative">
            <button
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
              className="flex items-center gap-2 px-3 py-2 hover:bg-[hsl(var(--panel))] rounded-lg transition-colors"
              title="سجل العمليات"
            >
              <Clock size={18} className="text-[hsl(var(--ink))]" />
              <span className="text-[13px] font-medium text-[hsl(var(--ink))]">السجل</span>
            </button>
            <HistoryPopover isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
          </div>
          
          {/* Undo */}
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
          
          {/* Redo */}
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
        </div>
        
        {/* Left Section: Save Button */}
        <button className="flex items-center gap-2 px-4 py-1.5 bg-[#3DBE8B] text-white rounded-full hover:opacity-90 transition-opacity">
          <Save size={16} />
          <span className="text-[12px] font-medium">حفظ</span>
        </button>
      </div>
      
      {/* Main Canvas Area with Panels */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Infinite Canvas */}
        <div className="flex-1">
          <InfiniteCanvas boardId={board.id} />
        </div>
        
        {/* Tool Settings Panel (Right) */}
        <ToolZone activeTool={activeTool} />
      </div>
      
      {/* Bottom Toolbar */}
      <BottomToolbar />
      
      {/* Navigation Bar */}
      <NavigationBar />
      
      {/* Floating Edit Bar */}
      <FloatingBar />
      
      {/* Minimap */}
      <Minimap />
      
      {/* Smart Command Bar */}
      <SmartCommandBar
        isOpen={commandBar.isOpen}
        onClose={commandBar.close}
        onElementsGenerated={handleElementsGenerated}
      />
      
    </div>;
};
export default PlanningCanvas;