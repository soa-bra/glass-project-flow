import React, { useState, useRef } from 'react';
import { ToolProvider } from './planning/ToolState';
import InfiniteCanvas from './planning/InfiniteCanvas';
import BottomToolbar from './planning/BottomToolbar';
import TopToolbar from './planning/TopToolbar';
import NavigationBar from './planning/NavigationBar';
import FloatingToolbar from './planning/FloatingToolbar';
import ToolPanel from './planning/ToolPanel';
import AIAssistant from './planning/AIAssistant';

interface PlanningWorkspaceProps {
  isSidebarCollapsed: boolean;
}

const PlanningWorkspace: React.FC<PlanningWorkspaceProps> = ({
  isSidebarCollapsed
}) => {
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const canvasRef = useRef<HTMLDivElement>(null);

  return (
    <ToolProvider>
      <div className={`fixed top-[var(--sidebar-top-offset)] h-[calc(100vh-var(--sidebar-top-offset))] transition-all duration-300 ${isSidebarCollapsed ? 'right-[calc(var(--sidebar-width-collapsed)+8px)] w-[calc(100vw-var(--sidebar-width-collapsed)-16px)]' : 'right-[calc(var(--sidebar-width-expanded)+8px)] w-[calc(100vw-var(--sidebar-width-expanded)-16px)]'}`}>
        <div className="h-full backdrop-blur-sm rounded-3xl overflow-hidden bg-white relative">
          {/* Top Toolbar */}
          <TopToolbar />
          
          {/* Tool Panel - Left Side */}
          <ToolPanel />
          
          {/* Infinite Canvas */}
          <InfiniteCanvas 
            ref={canvasRef}
            selectedElements={selectedElements}
            onSelectElements={setSelectedElements}
          />
          
          {/* Floating Toolbar - Appears above selected elements */}
          {selectedElements.length > 0 && (
            <FloatingToolbar selectedElements={selectedElements} />
          )}
          
          {/* Bottom Toolbar - Center */}
          <BottomToolbar />
          
          {/* AI Assistant - Next to Bottom Toolbar */}
          <AIAssistant />
          
          {/* Navigation Bar - Bottom Right */}
          <NavigationBar canvasRef={canvasRef} />
        </div>
      </div>
    </ToolProvider>
  );
};

export default PlanningWorkspace;