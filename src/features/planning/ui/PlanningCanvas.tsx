import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import { useBoardCanvasLifecycle } from '@/features/planning/hooks/useBoardCanvasLifecycle';
import { usePlanningStoreSync } from '@/features/planning/hooks/usePlanningStoreSync';
import { SmartConversionReviewDialog } from '@/features/planning/ui/overlays/SmartConversionReviewDialog';
import type { SmartConversionPayload, SmartConversionResult } from '@/features/planning/services/smartConversion.service';
import { toast } from 'sonner';

interface PlanningCanvasProps {
  board: CanvasBoard;
}

const PlanningCanvas: React.FC<PlanningCanvasProps> = ({ board }) => {
  const setCurrentBoard = usePlanningStore((state) => state.setCurrentBoard);
  const activeTool = useCanvasStore((state) => state.activeTool);
  const setViewportHostSize = useCanvasStore((state) => state.setViewportHostSize);
  const addElement = useCanvasStore((state) => state.addElement);
  const updateElement = useCanvasStore((state) => state.updateElement);
  const selectedElementIds = useCanvasStore((state) => state.selectedElementIds);
  const viewport = useCanvasStore((state) => state.viewport);
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const commandBar = useSmartCommandBar();
  const [conversionPayload, setConversionPayload] = useState<SmartConversionPayload | null>(null);
  const currentUserId = useCollaborationStore((state) => state.currentUserId) ?? 'anonymous-user';
  const isHost = useCollaborationStore((state) => state.isHost);
  const participants = useCollaborationStore((state) => state.participants);
  const selfName =
    participants.find((p) => p.id === currentUserId)?.name ?? 'مستخدم حالي';

  useBoardCanvasLifecycle(board);

  const { peers, connectionStatus, lastSyncAt } = usePlanningStoreSync(board.id, selfName);

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

  const handleSmartConversionSuggested = useCallback(
    (suggestion: Pick<SmartConversionPayload, 'targetEntityType' | 'suggestedData'>) => {
      if (selectedElementIds.length === 0) {
        toast.error('حدد عناصر الكانفس المصدر قبل تحويل AI إلى سجل تنفيذي');
        return;
      }

      setConversionPayload({
        boardId: board.id,
        sourceElementIds: selectedElementIds,
        targetEntityType: suggestion.targetEntityType,
        suggestedData: suggestion.suggestedData,
        approval: { approved: false },
      });
    },
    [board.id, selectedElementIds],
  );

  const handleSmartConversionApproved = useCallback(
    (result: SmartConversionResult) => {
      result.linkedElements.forEach((element) => {
        updateElement(element.id, {
          metadata: {
            ...(typeof element.metadata === 'object' && element.metadata !== null ? element.metadata : {}),
          },
          content: typeof element.content === 'object' && element.content !== null
            ? { ...element.content }
            : element.content,
        });
      });
    },
    [updateElement],
  );

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
      <CanvasToolbar
        board={board}
        onBack={() => setCurrentBoard(null)}
        onOpenAI={commandBar.open}
        peers={peers}
        selfName={selfName}
        realtimeStatus={connectionStatus}
        lastSyncAt={lastSyncAt}
      />
      <div ref={canvasHostRef} className="flex-1 flex overflow-hidden relative">
        <div data-board-frame="true" className="flex-1 relative overflow-hidden">
          <InfiniteCanvas boardId={board.id} />
          <div id="planning-floating-overlay" data-floating-overlay="true" className="absolute inset-0 pointer-events-none" />
        </div>
        <ToolZone activeTool={activeTool} boardId={board.id} />
      </div>
      <BottomToolbar />
      <NavigationBar />
      <ContextualToolbarManager />
      <SmartCommandBar
        isOpen={commandBar.isOpen}
        onClose={commandBar.close}
        onElementsGenerated={handleElementsGenerated}
        onSmartConversionSuggested={handleSmartConversionSuggested}
      />
      <SmartConversionReviewDialog
        open={Boolean(conversionPayload)}
        payload={conversionPayload}
        onOpenChange={(open) => {
          if (!open) setConversionPayload(null);
        }}
        onApproved={handleSmartConversionApproved}
      />
    </div>
  );
};

export default PlanningCanvas;
