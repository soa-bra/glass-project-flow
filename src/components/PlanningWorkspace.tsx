import React, { useState, useCallback } from 'react';
import { DirectionProvider } from '@/contexts/direction-context';
import CollaborativeCanvas from '@/apps/brain/canvas/CollaborativeCanvas';
import SolidarityPlanningToolbar from './solidarity/SolidarityPlanningToolbar';
import ResourceTeamPanel from './solidarity/ResourceTeamPanel';
import TimelinePanel from './solidarity/TimelinePanel';
import { AuthProvider } from '@/lib/auth/auth-provider';

interface PlanningWorkspaceProps {
  isSidebarCollapsed: boolean;
}

const PlanningWorkspace: React.FC<PlanningWorkspaceProps> = ({
  isSidebarCollapsed
}) => {
  const [showResourcePanel, setShowResourcePanel] = useState(false);
  const [showTimelinePanel, setShowTimelinePanel] = useState(false);
  const [selectedSolidarityTool, setSelectedSolidarityTool] = useState<string | null>(null);

  const handleSolidarityToolClick = useCallback((tool: string) => {
    setSelectedSolidarityTool(tool);
    
    // Handle specific tools
    switch (tool) {
      case 'team-management':
      case 'budget':
        setShowResourcePanel(true);
        setShowTimelinePanel(false);
        break;
      case 'timeline':
      case 'milestones':
        setShowTimelinePanel(true);
        setShowResourcePanel(false);
        break;
      case 'goals':
      case 'impact':
      case 'innovation':
        // These tools work with smart elements directly
        setShowResourcePanel(false);
        setShowTimelinePanel(false);
        break;
      case 'workflow':
        // Special workflow tool - could trigger both panels
        setShowResourcePanel(true);
        setShowTimelinePanel(true);
        break;
      default:
        // Close panels for unknown tools
        setShowResourcePanel(false);
        setShowTimelinePanel(false);
    }
  }, []);

  const handleSave = useCallback(() => {
    // Enhanced save for solidarity projects
    console.log('حفظ المشروع التضامني');
  }, []);

  return (
    <div className={`fixed top-[var(--sidebar-top-offset)] h-[calc(100vh-var(--sidebar-top-offset))] transition-all duration-300 ${isSidebarCollapsed ? 'right-[calc(var(--sidebar-width-collapsed)+8px)] w-[calc(100vw-var(--sidebar-width-collapsed)-16px)]' : 'right-[calc(var(--sidebar-width-expanded)+8px)] w-[calc(100vw-var(--sidebar-width-expanded)-16px)]'}`}>
      <div className="h-full backdrop-blur-sm rounded-3xl overflow-hidden bg-white relative">
        <AuthProvider>
          <DirectionProvider>
            {/* Enhanced Solidarity Planning Interface */}
            <div className="h-full w-full flex flex-col">
              
              {/* Solidarity Planning Toolbar */}
              <SolidarityPlanningToolbar
                selectedTool={selectedSolidarityTool || 'select'}
                onToolChange={() => {}} // Basic tools handled by canvas
                onSolidarityToolClick={handleSolidarityToolClick}
                onSaveClick={handleSave}
                onZoomIn={() => {}}
                onZoomOut={() => {}}
                onZoomReset={() => {}}
                zoom={1}
                data-test-id="solidarity-toolbar"
              />

              {/* Main Content Area */}
              <div className="flex-1 relative flex">
                
                {/* Resource & Team Panel */}
                {showResourcePanel && (
                  <div className="absolute left-4 top-4 bottom-4 z-10">
                    <ResourceTeamPanel
                      isOpen={showResourcePanel}
                      onClose={() => setShowResourcePanel(false)}
                      data-test-id="resource-team-panel"
                    />
                  </div>
                )}

                {/* Timeline Panel */}
                {showTimelinePanel && (
                  <div className="absolute right-4 top-4 bottom-4 z-10">
                    <TimelinePanel
                      isOpen={showTimelinePanel}
                      onClose={() => setShowTimelinePanel(false)}
                      data-test-id="timeline-panel"
                    />
                  </div>
                )}

                {/* Collaborative Canvas with Solidarity Elements */}
                <div className="flex-1">
                  <CollaborativeCanvas
                    boardAlias="integrated-planning-solidarity"
                    data-test-id="solidarity-canvas"
                  />
                </div>
              </div>

              {/* Floating Help Panel - Quick Access */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
                <div className="bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-border/50">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      اضغط على أدوات التضامن للبدء
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      S للعناصر الذكية التضامنية
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                      Ctrl+S للحفظ
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </DirectionProvider>
        </AuthProvider>
      </div>
    </div>
  );
};
export default PlanningWorkspace;