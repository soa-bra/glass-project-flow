
'use client';
import React from 'react';
import TopToolbar from './components/topbar/TopToolbar';
import Toolbox from './components/toolbox/Toolbox';
import Inspector from './components/inspector/Inspector';
import BottomBar from './components/bottom-bar/BottomBar';
import CanvasSurface from './components/canvas/CanvasSurface';
import MiniMap from './components/minimap/MiniMap';
import QuickToolbar from './components/floating/QuickToolbar';
import ContextMenus from './components/floating/ContextMenus';
import SmartAssistantPanel from './components/assistant/SmartAssistantPanel';
import CollaborationPanel from './components/collaboration/CollaborationPanel';

export default function PlanningPanel() {
  return (
    <div className="h-full flex flex-col">
      <TopToolbar />
      <div className="flex flex-1 overflow-hidden">
        {/* الأدوات الجانبية */}
        <div className="w-64 border-r bg-gray-50 flex flex-col">
          <div className="flex-1 overflow-auto">
            <Toolbox />
          </div>
          <SmartAssistantPanel />
        </div>

        {/* منطقة الرسم */}
        <div className="flex-1 relative bg-gray-100">
          <CanvasSurface />
          <QuickToolbar />
          <ContextMenus />
          <MiniMap />
        </div>

        {/* لوحة الخصائص */}
        <div className="w-80 border-l bg-gray-50">
          <Inspector />
        </div>
      </div>
      <BottomBar />
      <CollaborationPanel />
    </div>
  );
}
