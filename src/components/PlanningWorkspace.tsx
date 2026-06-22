import React, { Component, type ErrorInfo, type ReactNode, useEffect } from 'react';
import PlanningEntryScreen from '@/features/planning/ui/PlanningEntryScreen';
import PlanningCanvas from '@/features/planning/ui/PlanningCanvas';
import { usePlanningStore } from '@/stores/planningStore';

interface PlanningWorkspaceProps {
  isSidebarCollapsed: boolean;
}

interface PlanningWorkspaceBoundaryState {
  hasError: boolean;
  message: string | null;
}

class PlanningWorkspaceBoundary extends Component<{ children: ReactNode }, PlanningWorkspaceBoundaryState> {
  state: PlanningWorkspaceBoundaryState = { hasError: false, message: null };

  static getDerivedStateFromError(error: unknown): PlanningWorkspaceBoundaryState {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : 'Unknown planning workspace error',
    };
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error('[PlanningWorkspace] render failed', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="flex h-full items-center justify-center bg-slate-50 p-6 text-center text-slate-800"
          role="alert"
          data-testid="planning-workspace-error"
        >
          <div className="max-w-md rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-red-700">حدث خطأ في planning</h2>
            <p className="mt-2 text-sm text-slate-600">
              تعذر عرض مساحة التخطيط. تم عزل الخطأ حتى لا تتعطل بقية الواجهة.
            </p>
            {this.state.message ? (
              <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 font-mono text-xs text-red-800" dir="ltr">
                {this.state.message}
              </p>
            ) : null}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const PlanningWorkspace: React.FC<PlanningWorkspaceProps> = ({
  isSidebarCollapsed
}) => {
  const { currentBoard, loadBoards } = usePlanningStore();

  useEffect(() => {
    void loadBoards();
  }, [loadBoards]);

  return (
    <div className={`fixed top-[var(--sidebar-top-offset)] h-[calc(100vh-var(--sidebar-top-offset))] transition-all duration-300 ${
      isSidebarCollapsed 
        ? 'right-[calc(var(--sidebar-width-collapsed)+8px)] w-[calc(100vw-var(--sidebar-width-collapsed)-16px)]'
        : 'right-[calc(var(--sidebar-width-expanded)+8px)] w-[calc(100vw-var(--sidebar-width-expanded)-16px)]'
    }`}>
      <div className="h-full backdrop-blur-sm rounded-3xl overflow-hidden bg-white">
        <PlanningWorkspaceBoundary>
          {!currentBoard ? (
            <PlanningEntryScreen />
          ) : (
            <PlanningCanvas board={currentBoard} />
          )}
        </PlanningWorkspaceBoundary>
      </div>
    </div>
  );
};
export default PlanningWorkspace;