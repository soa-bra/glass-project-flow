
interface PlanningWorkspaceProps {
  isSidebarCollapsed: boolean;
}


  return (
    <div
      className={`fixed top-[var(--sidebar-top-offset)] h-[calc(100vh-var(--sidebar-top-offset))] transition-all duration-300 ${
        isSidebarCollapsed
      </div>
    </div>
  );
};

export default PlanningWorkspace;
