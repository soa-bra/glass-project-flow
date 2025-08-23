import React from 'react';
import { TopToolbar } from './components/shell/TopToolbar/TopToolbar';
import { Toolbox } from './components/shell/Toolbox/Toolbox';
import { Inspector } from './components/shell/Inspector/Inspector';
import { CanvasSurface } from './components/canvas/CanvasSurface/CanvasSurface';
import { BottomBar } from './components/shell/BottomBar/BottomBar';
import { MiniMap } from './components/shell/MiniMap/MiniMap';

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
    </div>
  );
};