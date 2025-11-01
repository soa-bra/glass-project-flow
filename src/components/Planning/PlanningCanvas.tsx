import React, { useState } from 'react';
import { ArrowRight, Save, RotateCcw, RotateCw, Clock, Share2, File, Layers, Sparkles } from 'lucide-react';
import { usePlanningStore } from '@/stores/planningStore';
import { useCanvasStore } from '@/stores/canvasStore';
import type { CanvasBoard } from '@/types/planning';
import InfiniteCanvas from './InfiniteCanvas';
import BottomToolbar from './BottomToolbar';
import RightSidePanel from './RightSidePanel';
import NavigationBar from './NavigationBar';
import FloatingEditBar from './FloatingEditBar';
import Minimap from './Minimap';
import { HistoryPopover } from './popovers/HistoryPopover';
import { SharePopover } from './popovers/SharePopover';
import { FileMenuPopover } from './popovers/FileMenuPopover';
import { LayersMenuPopover } from './popovers/LayersMenuPopover';
import { AIAssistantPopover } from './AIAssistantPopover';
interface PlanningCanvasProps {
  board: CanvasBoard;
}
const PlanningCanvas: React.FC<PlanningCanvasProps> = ({
  board
}) => {
  const { setCurrentBoard, renameBoard } = usePlanningStore();
  const { activeTool, undo, redo, history } = useCanvasStore();
  
  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;
  
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isFileMenuOpen, setIsFileMenuOpen] = useState(false);
  const [isLayersOpen, setIsLayersOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [boardName, setBoardName] = useState(board?.name || 'لوحة جديدة');
  
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
              className="flex items-center gap-2 px-3 py-1.5 bg-[hsl(var(--ink))] text-white rounded-full transition-opacity hover:opacity-90"
              title="المشاركين"
            >
              <Share2 size={16} />
              <span className="text-[12px] font-medium">المشاركين</span>
            </button>
            <SharePopover isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
          </div>
          
          {/* AI Assistant */}
          <div className="relative">
            <AIAssistantPopover isOpen={isAIOpen} onOpenChange={setIsAIOpen}>
              <button
                onClick={() => setIsAIOpen(!isAIOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-gradient-to-br from-[#3DBE8B] to-[#3DA8F5] text-white rounded-lg hover:opacity-90 transition-opacity"
                title="مساعد الذكاء الصناعي"
              >
                <Sparkles size={18} className="animate-pulse" />
                <span className="text-[13px] font-medium">AI</span>
              </button>
            </AIAssistantPopover>
          </div>
          
          <div className="h-6 w-px bg-[hsl(var(--border))] mx-1" />
          
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
        <button className="flex items-center gap-2 px-4 py-2 bg-[#3DBE8B] text-white rounded-[10px] hover:opacity-90 transition-opacity">
          <Save size={16} />
          <span className="text-[13px] font-medium">حفظ</span>
        </button>
      </div>
      
      {/* Main Canvas Area with Panels */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Infinite Canvas */}
        <div className="flex-1">
          <InfiniteCanvas boardId={board.id} />
        </div>
        
        {/* Tool Settings Panel (Right) */}
        <RightSidePanel activeTool={activeTool} />
      </div>
      
      {/* Bottom Toolbar */}
      <BottomToolbar />
      
      {/* Navigation Bar */}
      <NavigationBar />
      
      {/* Floating Edit Bar */}
      <FloatingEditBar />
      
      {/* Minimap */}
      <Minimap />
    </div>;
};
export default PlanningCanvas;