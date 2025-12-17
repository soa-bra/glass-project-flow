import React, { useEffect, useMemo, useState } from "react";
import { ArrowRight, Save, RotateCcw, RotateCw, Clock, Share2, File, Layers, Sparkles } from "lucide-react";
import { usePlanningStore } from "@/stores/planningStore";
import { useCanvasStore } from "@/stores/canvasStore";
import type { CanvasBoard } from "@/types/planning";
import InfiniteCanvas from "./InfiniteCanvas";
import BottomToolbar from "./BottomToolbar";
import RightSidePanel from "./RightSidePanel";
import NavigationBar from "./NavigationBar";
import FloatingEditBar from "./FloatingEditBar";
import Minimap from "./Minimap";
import { HistoryPopover } from "./popovers/HistoryPopover";
import { SharePopover } from "./popovers/SharePopover";
import { FileMenuPopover } from "./popovers/FileMenuPopover";
import { LayersMenuPopover } from "./popovers/LayersMenuPopover";
import { AIAssistantPopover } from "./AIAssistantPopover";

interface PlanningCanvasProps {
  board: CanvasBoard;
}

const PlanningCanvas: React.FC<PlanningCanvasProps> = ({ board }) => {
  const { setCurrentBoard, renameBoard } = usePlanningStore();
  const { activeTool, undo, redo, history, typingMode } = useCanvasStore();

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isFileMenuOpen, setIsFileMenuOpen] = useState(false);
  const [isLayersOpen, setIsLayersOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [boardName, setBoardName] = useState(board?.name || "لوحة جديدة");

  useEffect(() => {
    setBoardName(board?.name || "لوحة جديدة");
  }, [board?.name]);

  const handleSaveName = () => {
    if (board && boardName.trim()) renameBoard(board.id, boardName.trim());
    setIsEditingName(false);
  };

  const topBarButtonsDisabled = useMemo(() => typingMode, [typingMode]);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-[hsl(var(--border))]">
        {/* Right Section */}
        <div className="flex items-center gap-3">
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
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveName();
                if (e.key === "Escape") setIsEditingName(false);
              }}
              className="px-3 py-1.5 rounded-lg border border-[hsl(var(--border))] text-[14px] outline-none focus:ring-2 focus:ring-[hsl(var(--accent-green))/0.35]"
              autoFocus
            />
          ) : (
            <button
              onClick={() => setIsEditingName(true)}
              className="px-3 py-1.5 rounded-lg hover:bg-[hsl(var(--panel))] transition-colors"
              title="تعديل اسم اللوحة"
            >
              <span className="text-[14px] font-semibold text-[hsl(var(--ink))]">{boardName}</span>
            </button>
          )}
        </div>

        {/* Middle Section */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setIsFileMenuOpen((v) => !v)}
              disabled={topBarButtonsDisabled}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                topBarButtonsDisabled ? "opacity-60 cursor-not-allowed" : "hover:bg-[hsl(var(--panel))]"
              }`}
              title="الملف"
            >
              <File size={18} className="text-[hsl(var(--ink))]" />
              <span className="text-[13px] font-medium text-[hsl(var(--ink))]">ملف</span>
            </button>
            <FileMenuPopover isOpen={isFileMenuOpen} onClose={() => setIsFileMenuOpen(false)} />
          </div>

          <div className="relative">
            <button
              onClick={() => setIsLayersOpen((v) => !v)}
              disabled={topBarButtonsDisabled}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                topBarButtonsDisabled ? "opacity-60 cursor-not-allowed" : "hover:bg-[hsl(var(--panel))]"
              }`}
              title="الطبقات"
            >
              <Layers size={18} className="text-[hsl(var(--ink))]" />
              <span className="text-[13px] font-medium text-[hsl(var(--ink))]">طبقات</span>
            </button>
            <LayersMenuPopover isOpen={isLayersOpen} onClose={() => setIsLayersOpen(false)} />
          </div>

          <div className="relative">
            <button
              onClick={() => setIsShareOpen((v) => !v)}
              disabled={topBarButtonsDisabled}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                topBarButtonsDisabled ? "opacity-60 cursor-not-allowed" : "hover:bg-[hsl(var(--panel))]"
              }`}
              title="مشاركة"
            >
              <Share2 size={18} className="text-[hsl(var(--ink))]" />
              <span className="text-[13px] font-medium text-[hsl(var(--ink))]">مشاركة</span>
            </button>
            <SharePopover isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
          </div>

          <div className="relative">
            <button
              onClick={() => setIsHistoryOpen((v) => !v)}
              disabled={topBarButtonsDisabled}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                topBarButtonsDisabled ? "opacity-60 cursor-not-allowed" : "hover:bg-[hsl(var(--panel))]"
              }`}
              title="سجل العمليات"
            >
              <Clock size={18} className="text-[hsl(var(--ink))]" />
              <span className="text-[13px] font-medium text-[hsl(var(--ink))]">السجل</span>
            </button>
            <HistoryPopover isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
          </div>

          <button
            onClick={undo}
            disabled={!canUndo || topBarButtonsDisabled}
            className={`p-2 rounded-lg transition-colors ${
              canUndo && !topBarButtonsDisabled
                ? "hover:bg-[hsl(var(--panel))] text-[hsl(var(--ink))]"
                : "text-[hsl(var(--ink-30))] cursor-not-allowed"
            }`}
            title="تراجع (Ctrl + Z)"
          >
            <RotateCcw size={18} />
          </button>

          <button
            onClick={redo}
            disabled={!canRedo || topBarButtonsDisabled}
            className={`p-2 rounded-lg transition-colors ${
              canRedo && !topBarButtonsDisabled
                ? "hover:bg-[hsl(var(--panel))] text-[hsl(var(--ink))]"
                : "text-[hsl(var(--ink-30))] cursor-not-allowed"
            }`}
            title="إعادة (Ctrl + Shift + Z)"
          >
            <RotateCw size={18} />
          </button>

          <div className="relative">
            <button
              onClick={() => setIsAIOpen((v) => !v)}
              disabled={topBarButtonsDisabled}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                topBarButtonsDisabled ? "opacity-60 cursor-not-allowed" : "hover:bg-[hsl(var(--panel))]"
              }`}
              title="مساعد ذكي"
            >
              <Sparkles size={18} className="text-[hsl(var(--ink))]" />
              <span className="text-[13px] font-medium text-[hsl(var(--ink))]">مساعد</span>
            </button>
            <AIAssistantPopover isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
          </div>
        </div>

        {/* Left Section */}
        <button className="flex items-center gap-2 px-4 py-1.5 bg-[#3DBE8B] text-white rounded-full hover:opacity-90 transition-opacity">
          <Save size={16} />
          <span className="text-[12px] font-medium">حفظ</span>
        </button>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex overflow-hidden relative">
        <div className="flex-1">
          <InfiniteCanvas boardId={board.id} />
        </div>
        <RightSidePanel activeTool={activeTool} />
      </div>

      <BottomToolbar />
      <NavigationBar />
      <FloatingEditBar />
      <Minimap />
    </div>
  );
};

export default PlanningCanvas;
