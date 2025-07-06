import React, { useState } from 'react';
import PlanningSidebar from './PlanningSidebar';
import PlanningPanel from './PlanningPanel';

interface PlanningWorkspaceProps {
  isSidebarCollapsed: boolean;
}

const PlanningWorkspace: React.FC<PlanningWorkspaceProps> = ({
  isSidebarCollapsed
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isPlanningSidebarCollapsed, setIsPlanningSidebarCollapsed] = useState(false);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleToggleCollapse = (collapsed: boolean) => {
    setIsPlanningSidebarCollapsed(collapsed);
  };

  // Calculate widths based on both sidebars
  const planningSidebarWidth = isPlanningSidebarCollapsed ? '80px' : '280px';
  const mainSidebarWidth = isSidebarCollapsed ? 'var(--sidebar-width-collapsed)' : 'var(--sidebar-width-expanded)';
  
  return (
    <>
      {/* Planning Sidebar - positioned after main sidebar */}
      <div 
        className={`fixed top-[var(--sidebar-top-offset)] h-[calc(100vh-var(--sidebar-top-offset))] transition-all duration-300 z-30`}
        style={{
          right: `calc(${mainSidebarWidth} + 8px)`,
          width: planningSidebarWidth
        }}
      >
        <PlanningSidebar
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
          isCollapsed={isPlanningSidebarCollapsed}
          onToggleCollapse={handleToggleCollapse}
        />
      </div>

      {/* Planning Content Panel - positioned after both sidebars */}
      <div 
        className={`fixed top-[var(--sidebar-top-offset)] h-[calc(100vh-var(--sidebar-top-offset))] transition-all duration-300`}
        style={{
          right: `calc(${mainSidebarWidth} + ${planningSidebarWidth} + 18px)`,
          width: `calc(100vw - ${mainSidebarWidth} - ${planningSidebarWidth} - 26px)`
        }}
      >
        <PlanningPanel 
          selectedCategory={selectedCategory} 
          isMainSidebarCollapsed={isSidebarCollapsed} 
          isPlanningSidebarCollapsed={isPlanningSidebarCollapsed} 
        />
      </div>
    </>
  );
};
export default PlanningWorkspace;