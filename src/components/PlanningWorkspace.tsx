import React, { useState } from 'react';
import { DirectionProvider } from '@/contexts/direction-context';
import IntegratedPlanningCanvasCard from '@/pages/operations/solidarity/IntegratedPlanningCanvasCard';
import SolidarityPlanningToolbar from './solidarity/SolidarityPlanningToolbar';
import ResourceTeamPanel from './solidarity/ResourceTeamPanel';
import TimelinePanel from './solidarity/TimelinePanel';

interface PlanningWorkspaceProps {
  isSidebarCollapsed: boolean;
}

const PlanningWorkspace: React.FC<PlanningWorkspaceProps> = ({
  isSidebarCollapsed
}) => {
  const [isResourcePanelVisible, setIsResourcePanelVisible] = useState(false);
  const [isTimelinePanelVisible, setIsTimelinePanelVisible] = useState(false);

  const handleAddElement = (elementType: string) => {
    // TODO: Integrate with canvas to add smart elements
    console.log('Adding solidarity element:', elementType);
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving solidarity planning workspace');
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    console.log('Sharing solidarity planning workspace');
  };

  return (
    <DirectionProvider>
      <div className={`fixed top-[var(--sidebar-top-offset)] h-[calc(100vh-var(--sidebar-top-offset))] transition-all duration-300 ${isSidebarCollapsed ? 'right-[calc(var(--sidebar-width-collapsed)+8px)] w-[calc(100vw-var(--sidebar-width-collapsed)-16px)]' : 'right-[calc(var(--sidebar-width-expanded)+8px)] w-[calc(100vw-var(--sidebar-width-expanded)-16px)]'}`}>
        <div className="h-full backdrop-blur-sm rounded-3xl overflow-hidden bg-white relative">
          {/* Integrated Canvas */}
          <IntegratedPlanningCanvasCard />
          
          {/* Solidarity Planning Toolbar */}
          <SolidarityPlanningToolbar
            onAddElement={handleAddElement}
            onSave={handleSave}
            onShare={handleShare}
          />
          
          {/* Resource & Team Panel */}
          <ResourceTeamPanel
            isVisible={isResourcePanelVisible}
            onToggle={() => setIsResourcePanelVisible(!isResourcePanelVisible)}
          />
          
          {/* Timeline Panel */}
          <TimelinePanel
            isVisible={isTimelinePanelVisible}
            onToggle={() => setIsTimelinePanelVisible(!isTimelinePanelVisible)}
          />
        </div>
      </div>
    </DirectionProvider>
  );
};
export default PlanningWorkspace;