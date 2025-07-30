import React, { useState } from 'react';
import { Canvas } from './core/Canvas';
import { ToolBar } from './tools/ToolBar';
import { SidePanel } from './panels/SidePanel';
import { CanvasCollaborationSection } from './components/CanvasCollaborationSection';
import useCanvasState from '@/hooks/useCanvasState';
import { PanelType } from '@/types/canvas';

interface CanvasBoardProps {
  projectId?: string;
  userId?: string;
  userName?: string;
  className?: string;
}

export const CanvasBoard: React.FC<CanvasBoardProps> = ({
  projectId = 'default-project',
  userId = 'user-1',
  userName = 'مستخدم افتراضي',
  className = ""
}) => {
  const [activePanel, setActivePanel] = useState<PanelType | null>('layers');
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  
  const { activeTool, setActiveTool } = useCanvasState();

  const handleToolChange = (toolId: string) => {
    setActiveTool(toolId);
    
    // Auto-open relevant panels
    switch (toolId) {
      case 'smart-elements':
        setActivePanel('smart-assistant');
        break;
      case 'text':
      case 'shapes':
        setActivePanel('appearance');
        break;
      case 'collaboration':
        setActivePanel('collaboration');
        break;
      default:
        break;
    }
  };

  return (
    <div className={`flex h-screen bg-background ${className}`}>
      {/* Left Toolbar */}
      <div className="w-16 bg-card border-r border-border flex-shrink-0">
        <ToolBar
          activeTool={activeTool}
          onToolChange={handleToolChange}
          onPanelToggle={(panelType) => {
            setActivePanel(activePanel === panelType ? null : panelType);
            setIsPanelCollapsed(false);
          }}
        />
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex">
        <div className="flex-1 relative">
          <Canvas
            projectId={projectId}
            userId={userId}
            userName={userName}
            className="w-full h-full"
          />
        </div>

        {/* Right Side Panel */}
        {activePanel && !isPanelCollapsed && (
          <div className="w-80 bg-card border-l border-border flex-shrink-0">
            <SidePanel
              activePanel={activePanel}
              onClose={() => setActivePanel(null)}
              onCollapse={() => setIsPanelCollapsed(true)}
            />
          </div>
        )}
      </div>

      {/* Collapsed Panel Indicator */}
      {activePanel && isPanelCollapsed && (
        <div className="w-8 bg-card border-l border-border flex-shrink-0 flex items-center justify-center">
          <button
            onClick={() => setIsPanelCollapsed(false)}
            className="p-2 hover:bg-accent rounded-md"
            title="توسيع اللوحة"
          >
            <div className="w-1 h-6 bg-muted-foreground rounded" />
          </button>
        </div>
      )}
    </div>
  );
};