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
import { AIAssistantButton } from '@/features/planning/ui/widgets/AIAssistantButton';
import { createTypedSmartElement } from '@/features/planning/elements/smart/factories/createTypedSmartElement';
import { executeCommandWithAuthorization } from '@/features/planning/domain/commands';
import { useCollaborationStore } from '@/stores/collaborationStore';
import { useBoardCanvasLifecycle } from '@/features/planning/hooks/useBoardCanvasLifecycle';
import { usePlanningCanvasPersistence } from '@/features/planning/hooks/usePlanningCanvasPersistence';
import { useElementLock } from '@/features/planning/hooks/useElementLock';
import { useElementLockAcquire } from '@/features/planning/hooks/useElementLockAcquire';
import { canMutateCanvas, useCurrentBoardRole } from '@/features/planning/hooks/useCurrentBoardRole';
import { useCanvasAIPermissions } from '@/features/planning/hooks/useCanvasAIPermissions';
import { usePlanningCanvasReadyState } from '@/features/planning/hooks/usePlanningCanvasReadyState';
import { SmartConversionReviewDialog } from '@/features/planning/ui/overlays/SmartConversionReviewDialog';
import type { SmartConversionPayload, SmartConversionResult } from '@/features/planning/services/smartConversion.service';
import { planningElementToCanvas } from '@/features/planning/state/planningElementMapper';
import { ExecutionPanelHost } from '@/features/planning/execution/ExecutionPanelHost';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { registerAIContextSource } from '@/features/ai/context/projectContextBuilder';
import { usePlanningCanvasReadyState } from '@/features/planning/hooks/usePlanningCanvasReadyState';

interface PlanningCanvasProps {
  board: CanvasBoard;
}

type SmartConversionSuggestion = Pick<SmartConversionPayload, 'targetEntityType' | 'suggestedData'> & {
  sourceBoardId?: string | null;
  sourceElementIds?: string[];
};
const PlanningCanvas: React.FC<PlanningCanvasProps> = ({ board }) => {
  const setCurrentBoard = usePlanningStore((state) => state.setCurrentBoard);
  const activeTool = useCanvasStore((state) => state.activeTool);
  const setViewportHostSize = useCanvasStore((state) => state.setViewportHostSize);
  const addElement = useCanvasStore((state) => state.addElement);
  const elements = useCanvasStore((state) => state.elements);
  const updateElement = useCanvasStore((state) => state.updateElement);
  const selectedElementIds = useCanvasStore((state) => state.selectedElementIds);
  const viewport = useCanvasStore((state) => state.viewport);
  const setConnected = useCollaborationStore((state) => state.setConnected);
  const setCurrentUser = useCollaborationStore((state) => state.setCurrentUser);
  const setParticipants = useCollaborationStore((state) => state.setParticipants);
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const [viewportHostSize, setMeasuredViewportHostSize] = useState<{ width: number; height: number } | null>(null);
  const commandBar = useSmartCommandBar();
  const [conversionPayload, setConversionPayload] = useState<SmartConversionPayload | null>(null);
  const currentUserId = useCollaborationStore((state) => state.currentUserId) ?? 'anonymous-user';
  const participants = useCollaborationStore((state) => state.participants);
  const selfName =
    participants.find((p) => p.id === currentUserId)?.name ?? 'مستخدم حالي';
  const boardRole = useCurrentBoardRole(board.id);
  const aiPermissions = useCanvasAIPermissions(board.id);
  const canEditBoard = !boardRole.loading && canMutateCanvas(boardRole.role);

  useBoardCanvasLifecycle(board);

  useEffect(() => {
    const selectedElements = elements.filter((element) => selectedElementIds.includes(element.id));
    const selectedProjectCards = selectedElements.filter((element) => element.type === 'smart' && element.data?.type === 'project_card');
    const selectedTaskCards = selectedElements.filter((element) => element.type === 'smart' && element.data?.type === 'task_card');

    return registerAIContextSource({
      id: `planning-canvas-${board.id}`,
      kind: 'planning',
      data: {
        project_summary: {
          boardId: board.id,
          boardName: board.name,
          boardStatus: board.status,
          totalElements: elements.length,
          selectedElementsCount: selectedElementIds.length,
        },
        active_tab: { id: 'planning-canvas', label: 'لوحة التخطيط', boardId: board.id },
        visible_boxes: selectedElements.slice(0, 12).map((element) => ({
          id: element.id,
          type: element.type,
          title: 'title' in element ? element.title : undefined,
        })),
        linked_entities: selectedElements.slice(0, 12).map((element) => ({
          id: element.id,
          type: element.type,
          entityType: element.data?.type,
        })),
        tasks_snapshot: {
          selectedTaskCards: selectedTaskCards.length,
          selectedProjectCards: selectedProjectCards.length,
        },
        recent_events: [
          { type: 'planning-canvas-opened', boardId: board.id, status: board.status },
        ],
        risks: board.status === 'archived' ? [{ type: 'archived-board-ai-context', severity: 'medium' }] : [],
      },
      permission_scope: {
        role: boardRole.role,
        allowed: aiPermissions.canUseAI,
        reason: aiPermissions.denialReason,
        canViewFinancial: boardRole.role === 'host' || boardRole.role === 'editor',
        canViewSensitive: boardRole.role === 'host' || boardRole.role === 'editor',
      },
    });
  }, [aiPermissions.canUseAI, aiPermissions.denialReason, board.id, board.name, board.status, boardRole.role, elements, selectedElementIds]);

  const sync = usePlanningCanvasPersistence(board.id, {
    selfDisplayName: selfName,
    canPersist: canEditBoard,
  });
  const elementLock = useElementLock(canEditBoard ? board.id : null, sync.updateSelfPresence);
  const requestElementLock = useElementLockAcquire(elementLock.acquire, peersById);

  useEffect(() => {
    setConnected(sync.isConnected);
  }, [setConnected, sync.isConnected]);

  useEffect(() => {
    if (!sync.selfUserId) return;
    setCurrentUser(sync.selfUserId, sync.selfUserId === board.owner);
  }, [board.owner, setCurrentUser, sync.selfUserId]);

  useEffect(() => {
    setParticipants(
      peers.map((peer) => ({
        id: peer.user_id,
        name: peer.display_name,
        color: peer.color,
        role: 'editor',
        online: true,
        inVoiceCall: false,
        isMuted: true,
        isSpeaking: false,
      })),
    );
  }, [peers, setParticipants]);

  useEffect(() => {
    const host = canvasHostRef.current;
    if (!host) return;

    const syncSize = () => {
      const nextSize = { width: host.clientWidth, height: host.clientHeight };
      setViewportHostSize(nextSize.width, nextSize.height);
      setMeasuredViewportHostSize(nextSize);
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
    (suggestion: SmartConversionSuggestion) => {
      if (suggestion.sourceBoardId && suggestion.sourceBoardId !== board.id) return;

      const sourceElementIds = suggestion.sourceElementIds ?? selectedElementIds;

      if (sourceElementIds.length === 0) {
        toast.error('حدد عناصر الكانفس المصدر قبل تحويل AI إلى سجل تنفيذي');
        return;
      }

      setConversionPayload({
        boardId: board.id,
        sourceElementIds,
        targetEntityType: suggestion.targetEntityType,
        suggestedData: suggestion.suggestedData,
        approval: { approved: false },
      });
    },
    [board.id, selectedElementIds],
  );

  useEffect(() => {
    const handleSmartConversionSuggestedEvent = (event: Event) => {
      const detail = (event as CustomEvent<SmartConversionSuggestion>).detail;
      if (!detail?.targetEntityType) return;
      handleSmartConversionSuggested(detail);
    };

    window.addEventListener('planning:smart-conversion-suggested', handleSmartConversionSuggestedEvent);
    return () => window.removeEventListener('planning:smart-conversion-suggested', handleSmartConversionSuggestedEvent);
  }, [handleSmartConversionSuggested]);

  const handleSmartConversionApproved = useCallback(
    (result: SmartConversionResult) => {
      result.linkedElements.forEach((element) => {
        const canvasElement = planningElementToCanvas(element);
        updateElement(element.id, {
          metadata: {
            ...(typeof element.metadata === 'object' && element.metadata !== null && !Array.isArray(element.metadata) ? (element.metadata as Record<string, unknown>) : {}),
          },
          content: (typeof element.content === 'object' && element.content !== null && !Array.isArray(element.content)
            ? { ...(element.content as Record<string, unknown>) }
            : element.content) as never,
          ...(canvasElement.type === 'smart' ? { data: canvasElement.data } : {}),
        });
      });
    },
    [updateElement],
  );

  const handleElementsGenerated = useCallback(
    (elements: any[]) => {
      if (!aiPermissions.canUseAI) {
        toast.error(aiPermissions.denialReason ?? 'لا تملك صلاحية استخدام AI على هذه اللوحة');
        return;
      }

      const actorRole = boardRole.role;

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
    [
      addElement,
      aiPermissions.canUseAI,
      aiPermissions.denialReason,
      board.id,
      board.owner,
      board.status,
      boardRole.role,
      currentUserId,
      participants,
      viewport,
    ],
  );

  const isCanvasBootstrapping =
    boardRole.loading || aiPermissions.loading || sync.hydrationStatus === 'loading';

  if (isCanvasBootstrapping) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50 text-slate-700" data-testid="planning-canvas-loading">
        <div className="flex max-w-sm flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white px-8 py-7 text-center shadow-sm">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" aria-hidden="true" />
          <div className="space-y-1">
            <p className="text-base font-semibold">جاري تجهيز لوحة التخطيط</p>
            <p className="text-sm text-slate-500">
              نحمّل العناصر والصلاحيات وأدوات الذكاء قبل إظهار اللوحة.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
<div
  className="h-full flex flex-col bg-white"
  data-testid="planning-canvas-ready"
  data-canvas-ready={readyState.isReady}
  data-canvas-ready-reason={readyState.reason}
>
      <CanvasToolbar
        board={board}
        onBack={() => setCurrentBoard(null)}
        peers={peers}
        selfName={selfName}
        realtimeStatus={connectionStatus}
        lastSyncAt={lastSyncAt}
        canEdit={canEditBoard}
        elementPersistence={sync.persistence}
      />
      <div ref={canvasHostRef} className="flex-1 flex overflow-hidden relative">
        {readyState.isReady ? (
          <>
            <div data-board-frame="true" className="flex-1 relative overflow-hidden">
              <InfiniteCanvas
                boardId={board.id}
                peers={peers}
                broadcastCursor={sync.broadcastCursor}
                requestElementLock={requestElementLock}
                releaseElementLock={elementLock.release}
                canEdit={canEditBoard}
              />
              <div id="planning-floating-overlay" data-floating-overlay="true" className="absolute inset-0 pointer-events-none" />
            </div>
            <ToolZone activeTool={activeTool} boardId={board.id} />
          </>
        ) : (
          <div
            className="flex-1 bg-slate-50 p-6"
            data-testid="planning-canvas-loading"
            role="status"
            aria-live="polite"
          >
            <div className="mb-6 max-w-xl">
              <h2 className="text-lg font-semibold text-slate-900">تحميل لوحة التخطيط</h2>
              <p className="mt-2 text-sm text-slate-600">
                يتم تجهيز الصلاحيات والعناصر وأدوات الذكاء الاصطناعي
              </p>
            </div>
            <div className="relative h-full min-h-[420px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:32px_32px] opacity-60" />
              <div className="absolute left-10 top-10 h-24 w-44 rounded-xl bg-slate-200/80" />
              <div className="absolute left-72 top-28 h-28 w-56 rounded-xl bg-slate-200/70" />
              <div className="absolute bottom-12 right-16 h-10 w-32 rounded-full bg-slate-200/80" />
            </div>
          </div>
        )}
      </div>
      {readyState.isReady && <BottomToolbar canEdit={canEditBoard} />}
      {readyState.isReady && aiPermissions.canUseAI && <AIAssistantButton />}
      {readyState.isReady && <NavigationBar />}
      {readyState.isReady && <ContextualToolbarManager boardId={board.id} />}
      {readyState.isReady && (
        <SmartCommandBar
          isOpen={commandBar.isOpen}
          onClose={commandBar.close}
          boardId={board.id}
          onElementsGenerated={handleElementsGenerated}
          onSmartConversionSuggested={handleSmartConversionSuggested}
        />
      )}
      <SmartConversionReviewDialog
        open={Boolean(conversionPayload)}
        payload={conversionPayload}
        onOpenChange={(open) => {
          if (!open) setConversionPayload(null);
        }}
        onApproved={handleSmartConversionApproved}
      />
      <ExecutionPanelHost currentUserId={currentUserId} />
    </div>
  );
};

export default PlanningCanvas;
