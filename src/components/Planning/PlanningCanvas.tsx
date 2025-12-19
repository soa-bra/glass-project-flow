import React, { useState, useCallback, useEffect } from "react";
import {
  ArrowRight,
  Save,
  RotateCcw,
  RotateCw,
  Clock,
  Share2,
  File,
  Layers,
  Sparkles,
  Command,
  PanelRightClose,
  PanelRightOpen,
  Workflow,
} from "lucide-react";
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
import { SmartCommandBar, useSmartCommandBar } from "./SmartElements/SmartCommandBar";
import ContextSmartMenu from "./SmartElements/ContextSmartMenu";
import { CommandBar, SuggestionsPanel, WorkflowGenerator } from "./AI";
import type { GeneratedWorkflow } from '@/core/ai/smartWorkflow';
interface PlanningCanvasProps {
  board: CanvasBoard;
}
const PlanningCanvas: React.FC<PlanningCanvasProps> = ({ board }) => {
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
  const [boardName, setBoardName] = useState(board?.name || "لوحة جديدة");

  // Smart Command Bar
  const commandBar = useSmartCommandBar();

  // AI Command Bar & Workflow Generator
  const [isCommandBarOpen, setIsCommandBarOpen] = useState(false);
  const [isWorkflowGeneratorOpen, setIsWorkflowGeneratorOpen] = useState(false);
  const [isSuggestionsPanelCollapsed, setIsSuggestionsPanelCollapsed] = useState(false);

  // Panel collapse state
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);

  // Auto-collapse panel when text tool is selected
  useEffect(() => {
    if (activeTool === "text_tool") {
      setIsPanelCollapsed(true);
    } else {
      setIsPanelCollapsed(false);
    }
  }, [activeTool]);

  // Keyboard shortcut for Command Bar (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandBarOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle AI-generated elements
  const handleElementsGenerated = useCallback(
    (elements: any[], layout: string) => {
      elements.forEach((element, index) => {
        // Adjust position based on current viewport
        const adjustedPosition = {
          x: (element.position?.x || 100 + index * 50) - viewport.pan.x / viewport.zoom,
          y: (element.position?.y || 100 + index * 50) - viewport.pan.y / viewport.zoom,
        };

        addElement({
          type: "smart",
          position: adjustedPosition,
          size: { width: 400, height: 300 },
          content: element.title,
          style: {
            backgroundColor: "transparent",
          },
          metadata: {
            smartType: element.type,
            smartData: element.data,
            description: element.description,
            connections: element.connections,
          },
        });
      });
    },
    [addElement, viewport],
  );

  // Handle AI-generated workflow
  const handleWorkflowGenerated = useCallback((workflow: GeneratedWorkflow) => {
    workflow.nodes.forEach((node, index) => {
      addElement({
        type: "smart",
        position: node.position || { x: 400, y: 100 + index * 150 },
        size: { width: 200, height: 100 },
        content: node.label,
        style: {
          backgroundColor: "transparent",
        },
        metadata: {
          smartType: 'workflow_node',
          workflowNodeType: node.type,
          workflowNodeData: node,
        },
      });
    });
  }, [addElement]);

  const handleSaveName = () => {
    if (board && boardName.trim()) {
      renameBoard(board.id, boardName.trim());
    }
    setIsEditingName(false);
  };

  return (
    <div className="h-full flex flex-col bg-white">
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
              onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
              autoFocus
              className="text-[16px] font-bold text-[hsl(var(--ink))] px-2 py-1 border border-[hsl(var(--ink))] rounded focus:outline-none"
            />
          ) : (
            <h2
              className="text-[16px] font-bold text-[hsl(var(--ink))] cursor-pointer hover:bg-[hsl(var(--panel))] px-2 py-1 rounded"
              onDoubleClick={() => setIsEditingName(true)}
              title="انقر مرتين للتعديل"
            >
              {board?.name || "لوحة جديدة"}
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

          {/* Workflow Generator Button */}
          <button
            onClick={() => setIsWorkflowGeneratorOpen(true)}
            className="flex items-center gap-2 px-3 py-2 hover:bg-[hsl(var(--panel))] rounded-lg transition-colors"
            title="مولد Workflow"
          >
            <Workflow size={18} className="text-[hsl(var(--ink))]" />
          </button>

          {/* Command Bar Shortcut */}
          <button
            onClick={() => setIsCommandBarOpen(true)}
            className="flex items-center gap-2 px-3 py-2 hover:bg-[hsl(var(--panel))] rounded-lg transition-colors"
            title="شريط الأوامر (⌘K)"
          >
            <Command size={18} className="text-[hsl(var(--ink))]" />
          </button>

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
                ? "hover:bg-[hsl(var(--panel))] text-[hsl(var(--ink))]"
                : "text-[hsl(var(--ink-30))] cursor-not-allowed"
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
                ? "hover:bg-[hsl(var(--panel))] text-[hsl(var(--ink))]"
                : "text-[hsl(var(--ink-30))] cursor-not-allowed"
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
      <div className="flex-1 overflow-hidden relative">
        {/* Infinite Canvas - Always takes full space */}
        <div className="absolute inset-0">
          <InfiniteCanvas boardId={board.id} />
        </div>

        {/* Panel Toggle Button - Always visible */}
        <button
          onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
          className="absolute left-4 top-6 z-40 p-2 bg-white border border-[hsl(var(--border))] rounded-lg shadow-sm hover:bg-[hsl(var(--panel))] transition-colors"
          title={isPanelCollapsed ? "توسيع البانل" : "طي البانل"}
        >
          {isPanelCollapsed ? (
            <PanelRightOpen size={18} className="text-[hsl(var(--ink))]" />
          ) : (
            <PanelRightClose size={18} className="text-[hsl(var(--ink))]" />
          )}
        </button>

        {/* Tool Settings Panel (Right) - Floating over canvas with slide animation */}
        <div
          className={`absolute left-0 top-0 h-full z-30 w-[320px] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isPanelCollapsed ? "-translate-x-full" : "translate-x-0"
          }`}
        >
          <RightSidePanel activeTool={activeTool} />
        </div>
      </div>

      {/* Bottom Toolbar */}
      <BottomToolbar />

      {/* Navigation Bar */}
      <NavigationBar />

      {/* Floating Edit Bar */}
      <FloatingEditBar />

      {/* Minimap */}
      <Minimap />

      {/* Smart Command Bar */}
      <SmartCommandBar
        isOpen={commandBar.isOpen}
        onClose={commandBar.close}
        onElementsGenerated={handleElementsGenerated}
      />

      {/* Context Smart Menu - appears when multiple elements selected */}
      <ContextSmartMenu />

      {/* AI Command Bar */}
      <CommandBar
        isOpen={isCommandBarOpen}
        onClose={() => setIsCommandBarOpen(false)}
        onWorkflowGenerated={handleWorkflowGenerated}
      />

      {/* AI Workflow Generator */}
      <WorkflowGenerator
        isOpen={isWorkflowGeneratorOpen}
        onClose={() => setIsWorkflowGeneratorOpen(false)}
        onGenerate={handleWorkflowGenerated}
      />


      {/* Suggestions Panel */}
      <SuggestionsPanel
        isCollapsed={isSuggestionsPanelCollapsed}
        onToggleCollapse={() => setIsSuggestionsPanelCollapsed(prev => !prev)}
      />
    </div>
  );
};
export default PlanningCanvas;
