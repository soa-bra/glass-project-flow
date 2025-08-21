// src/features/planning/PlanningPanel.tsx
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
    <div style={{display:'grid', gridTemplateRows:'auto 1fr auto', height:'100%'}}>
      <TopToolbar />
      <div style={{
        display:'grid',
        gridTemplateColumns:'260px 1fr 320px',
        gap:'0',
        height:'100%',
        position:'relative'
      }}>
        {/* Toolbox */}
        <div style={{borderInlineEnd:'1px solid var(--line)', background:'var(--surface)'}}>
          <Toolbox />
          <CollaborationPanel />
          <SmartAssistantPanel />
        </div>

        {/* Canvas */}
        <div style={{position:'relative'}}>
          <CanvasSurface />
          <QuickToolbar />
          <ContextMenus />
          <MiniMap />
        </div>

        {/* Inspector */}
        <div style={{borderInlineStart:'1px solid var(--line)', background:'var(--surface)'}}>
          <Inspector />
        </div>
      </div>
      <BottomBar />
    </div>
  );
}
