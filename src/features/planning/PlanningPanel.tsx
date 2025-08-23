// ===============================
// Planning Panel - Main Container
// لوحة التخطيط - الحاوي الرئيسي
// ===============================

import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { COLORS, TYPOGRAPHY, LAYOUT, SPACING } from '@/components/shared/design-system/constants';
import { TopToolbar } from './components/topbar/TopToolbar';
import { Toolbox } from './components/toolbox/Toolbox';
import { CanvasSurface } from './components/canvas/CanvasSurface';
import { Inspector } from './components/inspector/Inspector';
import { BottomBar } from './components/bottom-bar/BottomBar';
import { useCanvasStore } from './store/canvas.store';
import { useToolsStore } from './store/tools.store';

interface PlanningPanelProps {
  boardId?: string;
  className?: string;
}

export const PlanningPanel: React.FC<PlanningPanelProps> = ({
  boardId,
  className
}) => {
  const { loadBoard, createBoard, board, loading } = useCanvasStore();
  const { setActiveTool } = useToolsStore();

  useEffect(() => {
    // Load board or create new one
    if (boardId) {
      loadBoard(boardId);
    } else {
      createBoard('لوحة تخطيط جديدة', 'user-1');
    }
  }, [boardId, loadBoard, createBoard]);

  useEffect(() => {
    // Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent shortcuts when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'v':
          if (!e.ctrlKey && !e.metaKey) {
            setActiveTool('select');
            e.preventDefault();
          }
          break;
        case 'h':
          if (!e.ctrlKey && !e.metaKey) {
            setActiveTool('pan');
            e.preventDefault();
          }
          break;
        case 'z':
          if (!e.ctrlKey && !e.metaKey) {
            setActiveTool('zoom');
            e.preventDefault();
          }
          break;
        case 't':
          if (!e.ctrlKey && !e.metaKey) {
            setActiveTool('text');
            e.preventDefault();
          }
          break;
        case 'r':
          if (!e.ctrlKey && !e.metaKey) {
            setActiveTool('shapes');
            e.preventDefault();
          }
          break;
        case 'p':
          if (!e.ctrlKey && !e.metaKey) {
            setActiveTool('smart-pen');
            e.preventDefault();
          }
          break;
        case 's':
          if (!e.ctrlKey && !e.metaKey) {
            setActiveTool('smart-element');
            e.preventDefault();
          }
          break;
        case 'c':
          if (!e.ctrlKey && !e.metaKey) {
            setActiveTool('comment');
            e.preventDefault();
          }
          break;
        case 'u':
          if (!e.ctrlKey && !e.metaKey) {
            setActiveTool('file-upload');
            e.preventDefault();
          }
          break;
        case 'f':
          if (!e.ctrlKey && !e.metaKey) {
            setActiveTool('frame');
            e.preventDefault();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [setActiveTool]);

  if (loading) {
    return (
      <div className={cn(
        "h-full w-full",
        LAYOUT.FLEX_CENTER,
        COLORS.PANEL_BACKGROUND,
        className
      )}>
        <div className={cn(
          "flex flex-col items-center gap-4",
          TYPOGRAPHY.ARABIC_FONT
        )}>
          <div className="animate-spin h-8 w-8 border-2 border-sb-ink border-t-transparent rounded-full" />
          <p className={cn(TYPOGRAPHY.BODY, COLORS.SECONDARY_TEXT)}>
            جاري تحميل لوحة التخطيط...
          </p>
        </div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className={cn(
        "h-full w-full",
        LAYOUT.FLEX_CENTER,
        COLORS.PANEL_BACKGROUND,
        className
      )}>
        <div className={cn(
          "flex flex-col items-center gap-4 p-8 rounded-24 border",
          COLORS.BOX_BACKGROUND,
          COLORS.BORDER_COLOR,
          TYPOGRAPHY.ARABIC_FONT
        )}>
          <h2 className={cn(TYPOGRAPHY.H2, COLORS.PRIMARY_TEXT)}>
            خطأ في تحميل اللوحة
          </h2>
          <p className={cn(TYPOGRAPHY.BODY, COLORS.SECONDARY_TEXT)}>
            لم نتمكن من تحميل لوحة التخطيط. يرجى المحاولة مرة أخرى.
          </p>
          <button
            onClick={() => window.location.reload()}
            className={cn(
              "px-6 py-2 rounded-full",
              "bg-sb-ink text-sb-white",
              "hover:opacity-90 transition-opacity",
              TYPOGRAPHY.BODY
            )}
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "h-full w-full relative overflow-hidden",
      COLORS.PANEL_BACKGROUND,
      className
    )}>
      {/* Layout Grid */}
      <div className="h-full grid grid-rows-[auto_1fr_auto] grid-cols-[auto_1fr_auto]">
        {/* Top Toolbar - spans all columns */}
        <div className="col-span-3 border-b border-sb-border">
          <TopToolbar />
        </div>

        {/* Left Toolbox */}
        <div className="row-start-2 border-l border-sb-border">
          <Toolbox />
        </div>

        {/* Main Canvas Area */}
        <div className="row-start-2 col-start-2 relative overflow-hidden">
          <CanvasSurface />
        </div>

        {/* Right Inspector */}
        <div className="row-start-2 col-start-3 border-r border-sb-border">
          <Inspector />
        </div>

        {/* Bottom Bar - spans all columns */}
        <div className="col-span-3 border-t border-sb-border">
          <BottomBar />
        </div>
      </div>

      {/* Performance Monitor (Development Only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 left-2 z-50">
          <PerformanceMonitor />
        </div>
      )}
    </div>
  );
};

// Performance monitor component for development
const PerformanceMonitor: React.FC = () => {
  const { fps, renderCount } = useCanvasStore();
  
  return (
    <div className={cn(
      "px-2 py-1 rounded text-xs",
      "bg-sb-ink/80 text-sb-white",
      "font-mono backdrop-blur-sm"
    )}>
      FPS: {fps.toFixed(0)} | Renders: {renderCount}
    </div>
  );
};

export default PlanningPanel;