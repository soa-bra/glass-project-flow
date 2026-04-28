import React, { useCallback, useEffect, useRef } from 'react';
import { usePlanningStore } from '@/stores/planningStore';
import { useCanvasStore } from '@/stores/canvasStore';
import type { CanvasBoard } from '@/types/planning';
import InfiniteCanvas from '@/features/planning/canvas/viewport/InfiniteCanvas';
import BottomToolbar from '@/features/planning/ui/toolbars/BottomToolbar';
import CanvasToolbar from '@/features/planning/ui/toolbars/CanvasToolbar';
import ToolZone from './panels/ToolZone';
import NavigationBar from '@/features/planning/ui/toolbars/NavigationBar';
import ContextualToolbarManager from '@/features/planning/ui/toolbars/ContextualToolbarManager';
import { SmartCommandBar, useSmartCommandBar } from '@/features/planning/elements/smart/SmartCommandBar';
import { createTypedSmartElement } from '@/features/planning/elements/smart/factories/createTypedSmartElement';
import { executeCommandWithAuthorization } from '@/features/planning/domain/commands';
import { useCollaborationStore } from '@/stores/collaborationStore';

interface PlanningCanvasProps {
  board: CanvasBoard;
}

const PlanningCanvas: React.FC<PlanningCanvasProps> = ({ board }) => {
  const setCurrentBoard = usePlanningStore((state) => state.setCurrentBoard);
  const activeTool = useCanvasStore((state) => state.activeTool);
  const setViewportHostSize = useCanvasStore((state) => state.setViewportHostSize);
  const addElement = useCanvasStore((state) => state.addElement);
  const viewport = useCanvasStore((state) => state.viewport);
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const commandBar = useSmartCommandBar();
  const currentUserId = useCollaborationStore((state) => state.currentUserId) ?? 'anonymous-user';
  const isHost = useCollaborationStore((state) => state.isHost);
  const participants = useCollaborationStore((state) => state.participants);

  useEffect(() => {
    const host = canvasHostRef.current;
    if (!host) return;

    const syncSize = () => {
      setViewportHostSize(host.clientWidth, host.clientHeight);
    };

    syncSize();

    if (typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(() => {
      syncSize();
    });

    observer.observe(host);
    return () => observer.disconnect();
  }, [setViewportHostSize]);

  const handleElementsGenerated = useCallback(
    (elements: any[]) => {
      const currentParticipant = participants.find((participant) => participant.id === currentUserId);
      const actorRole = isHost ? 'host' : currentParticipant?.role ?? 'viewer';

      executeCommandWithAuthorization(
        {
          command: 'canvas.smart-elements.generate',
          actor: {
            id: currentUserId,
            role: actorRole,
          },
          attributes: {
            boardId: board.id,
            boardStatus: board.status,
            boardOwnerId: board.owner,
            source: 'smart-command-bar',
            generatedElementCount: elements.length,
            isTrustedSession: currentUserId !== 'anonymous-user',
          },
        },
        () => {
          elements.forEach((element, index) => {
            addElement(
              createTypedSmartElement({
                element,
                index,
                viewport,
              }),
            );
          });
        },
      );
    },
    [addElement, board.id, board.owner, board.status, currentUserId, isHost, participants, viewport],
  );

  return (
    <div className="h-full flex flex-col bg-white">
      <CanvasToolbar board={board} onBack={() => setCurrentBoard(null)} onOpenAI={commandBar.open} />
      <div ref={canvasHostRef} className="flex-1 flex overflow-hidden relative">
        <div data-board-frame="true" className="flex-1 relative overflow-hidden">
          <InfiniteCanvas boardId={board.id} />
          <div id="planning-floating-overlay" data-floating-overlay="true" className="absolute inset-0 pointer-events-none" />
        </div>
        <ToolZone activeTool={activeTool} />
      </div>
      <BottomToolbar />
      <NavigationBar />
      <ContextualToolbarManager />
      <SmartCommandBar
        isOpen={commandBar.isOpen}
        onClose={commandBar.close}
        onElementsGenerated={handleElementsGenerated}
      />
    </div>
  );
};

export default PlanningCanvas;
