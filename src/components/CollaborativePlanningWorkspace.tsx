import React, { useState } from 'react';
import CollaborativePlanningSidebar from './CollaborativePlanningSidebar';
import CollaborativePlanningBoard from './CollaborativePlanningBoard';

interface CollaborativePlanningWorkspaceProps {
  isSidebarCollapsed: boolean;
}

const CollaborativePlanningWorkspace: React.FC<CollaborativePlanningWorkspaceProps> = ({
  isSidebarCollapsed
}) => {
  return (
    <div className="flex-1 flex min-h-0 overflow-hidden">
      {/* Sidebar - Always collapsed in planning mode */}
      <div
        style={{
          width: 'var(--sidebar-width-collapsed)',
          transition: 'all var(--animation-duration-main) var(--animation-easing)',
          background: '#dfecf2'
        }}
        className="flex-shrink-0 h-full rounded-3xl mr-[22px] overflow-hidden"
      >
        <CollaborativePlanningSidebar />
      </div>

      {/* Main Planning Board - Takes full remaining space */}
      <div className="flex-1 min-w-0 overflow-hidden">
        <CollaborativePlanningBoard />
      </div>
    </div>
  );
};

export default CollaborativePlanningWorkspace;