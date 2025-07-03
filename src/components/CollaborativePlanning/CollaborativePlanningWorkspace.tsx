import React, { useState } from 'react';
import { CollaborativePlanningSidebar } from './CollaborativePlanningSidebar';
import { PlanningBoard } from './PlanningBoard/PlanningBoard';
import { AIAssistantPanel } from './AIAssistant/AIAssistantPanel';
import { IntegrationPanel } from './Integration/IntegrationPanel';
import { AnalyticsPanel } from './Analytics/AnalyticsPanel';

interface CollaborativePlanningWorkspaceProps {
  isSidebarCollapsed: boolean;
}

export const CollaborativePlanningWorkspace: React.FC<CollaborativePlanningWorkspaceProps> = ({ 
  isSidebarCollapsed 
}) => {
  const [activeView, setActiveView] = useState<'planning' | 'ai' | 'integration' | 'analytics'>('planning');
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const renderMainContent = () => {
    switch (activeView) {
      case 'ai':
        return <AIAssistantPanel selectedPlanId={selectedPlanId} />;
      case 'integration':
        return <IntegrationPanel selectedPlanId={selectedPlanId} />;
      case 'analytics':
        return <AnalyticsPanel selectedPlanId={selectedPlanId} />;
      default:
        return <PlanningBoard selectedPlanId={selectedPlanId} onPlanSelect={setSelectedPlanId} />;
    }
  };

  // Dynamic positioning based on sidebar state
  const sidebarRight = isSidebarCollapsed ? 'var(--sidebar-width-collapsed)' : 'var(--sidebar-width-expanded)';
  const mainContentLeft = isSidebarCollapsed ? 'calc(var(--sidebar-width-collapsed) + 300px)' : 'calc(var(--sidebar-width-expanded) + 300px)';

  return (
    <div className="flex h-screen pt-[var(--header-height)] overflow-hidden">
      {/* Planning Sidebar */}
      <div
        className="fixed h-[calc(100vh-var(--header-height))] bg-background border-r border-border/20"
        style={{
          top: 'var(--header-height)',
          right: sidebarRight,
          width: '300px',
          transition: 'all var(--animation-duration-main) var(--animation-easing)',
          zIndex: 100,
        }}
      >
        <CollaborativePlanningSidebar 
          activeView={activeView}
          onViewChange={setActiveView}
          selectedPlanId={selectedPlanId}
          onPlanSelect={setSelectedPlanId}
        />
      </div>

      {/* Main Content Area */}
      <div
        className="flex-1 bg-muted/30"
        style={{
          marginLeft: mainContentLeft,
          transition: 'all var(--animation-duration-main) var(--animation-easing)',
        }}
      >
        {renderMainContent()}
      </div>
    </div>
  );
};