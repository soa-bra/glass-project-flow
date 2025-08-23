import React from 'react';
import { TopToolbar } from './components/shell/TopToolbar/TopToolbar';
import { Toolbox } from './components/shell/Toolbox/Toolbox';
import { Inspector } from './components/shell/Inspector/Inspector';
import { CanvasSurface } from './components/canvas/CanvasSurface/CanvasSurface';
import { BottomBar } from './components/shell/BottomBar/BottomBar';
import { MiniMap } from './components/shell/MiniMap/MiniMap';
import { AIAssistantPanel } from './components/ai/AIAssistantPanel/AIAssistantPanel';
import { PresenceIndicators } from './components/collaboration/PresenceIndicators/PresenceIndicators';
import { LiveCursors } from './components/collaboration/LiveCursors/LiveCursors';
import { CollaborationChat } from './components/collaboration/CollaborationChat/CollaborationChat';
import { CollaborationToolbar } from './components/collaboration/CollaborationToolbar/CollaborationToolbar';
import { RealtimeSync } from './components/collaboration/RealtimeSync/RealtimeSync';

interface PlanningBoardProps {
  isSidebarCollapsed: boolean;
}

export const PlanningBoard: React.FC<PlanningBoardProps> = ({
  isSidebarCollapsed
}) => {
  return (
    <div className="planning-board-container h-full flex flex-col bg-background">
      {/* شريط الأدوات العلوي */}
      <TopToolbar />
      
      <div className="flex flex-1 overflow-hidden">
        {/* شريط الأدوات الجانبي */}
        <Toolbox />
        
        {/* منطقة الكانفاس الرئيسية */}
        <div className="flex-1 relative bg-background">
          <CanvasSurface />
          <MiniMap />
        </div>
        
        {/* لوحة الخصائص */}
        <Inspector />
      </div>
      
      {/* الشريط السفلي */}
      <BottomBar />
      
      {/* AI Assistant Panel */}
      <AIAssistantPanel />
      
      {/* Collaboration Components */}
      <PresenceIndicators />
      <LiveCursors />
      <CollaborationChat />
      <CollaborationToolbar />
      <RealtimeSync />
    </div>
  );
};