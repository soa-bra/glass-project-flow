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
import { canMutateCanvas, useCurrentBoardRole } from '@/features/planning/hooks/useCurrentBoardRole';
import { useCanvasAIPermissions } from '@/features/planning/hooks/useCanvasAIPermissions';
import { SmartConversionReviewDialog } from '@/features/planning/ui/overlays/SmartConversionReviewDialog';
import type { SmartConversionPayload, SmartConversionResult } from '@/features/planning/services/smartConversion.service';
import { planningElementToCanvas } from '@/features/planning/state/planningElementMapper';
import { ProjectManagementBoard } from '@/components/ProjectManagement/ProjectManagementBoard';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import type { Project } from '@/types/project';
import { toast } from 'sonner';

interface PlanningCanvasProps {
  board: CanvasBoard;
}

type ProjectRow = Database['public']['Tables']['projects']['Row'];
type TaskRow = Database['public']['Tables']['tasks']['Row'];
type TaskUpdate = Database['public']['Tables']['tasks']['Update'];
type TaskState = TaskRow['state'];
type TaskPriority = TaskRow['priority'];
type ExecutionTarget = {
  entityType: 'project' | 'task';
  entityId: string;
  data?: Record<string, unknown>;
};
type SmartConversionSuggestion = Pick<SmartConversionPayload, 'targetEntityType' | 'suggestedData'> & {
  sourceBoardId?: string | null;
  sourceElementIds?: string[];
};
type TaskExecutionDraft = {
  state: TaskState;
  priority: TaskPriority;
  actualDuration: string;
  actualCost: string;
  progress: number;
  executionNotes: string;
};
type ParsedNumberInput = {
  value: number | null;
  invalid: boolean;
};

const TASK_STATE_OPTIONS: Array<{ value: TaskState; label: string }> = [
  { value: 'draft', label: 'مسودة' },
  { value: 'planned', label: 'مخطط' },
  { value: 'active', label: 'نشطة' },
  { value: 'blocked', label: 'متوقفة' },
  { value: 'paused', label: 'معلقة' },
  { value: 'completed', label: 'مكتملة' },
  { value: 'cancelled', label: 'ملغية' },
];

const TASK_PRIORITY_OPTIONS: Array<{ value: TaskPriority; label: string }> = [
  { value: 'low', label: 'منخفضة' },
  { value: 'medium', label: 'متوسطة' },
  { value: 'high', label: 'مرتفعة' },
  { value: 'critical', label: 'حرجة' },
];

const asRecord = (value: unknown): Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value) ? value as Record<string, unknown> : {};

const readNumber = (value: unknown): number | null =>
  typeof value === 'number' && Number.isFinite(value) ? value : null;

const readString = (value: unknown): string =>
  typeof value === 'string' ? value : '';

const normalizeNumberInput = (value: string): ParsedNumberInput => {
  const trimmed = value.trim();
  if (!trimmed) return { value: null, invalid: false };
  const parsed = Number(trimmed.replace(',', '.'));
  if (!Number.isFinite(parsed)) return { value: null, invalid: true };
  return { value: Math.max(0, parsed), invalid: false };
};

const deriveTaskProgress = (task: TaskRow): number => {
  const metadataProgress = readNumber(asRecord(task.metadata).executionProgress);
  if (metadataProgress !== null) return Math.min(100, Math.max(0, metadataProgress));
  if (task.state === 'completed') return 100;
  if (task.state === 'active') return 50;
  if (task.state === 'planned') return 20;
  return 0;
};

const mapTaskDraft = (task: TaskRow): TaskExecutionDraft => {
  const metadata = asRecord(task.metadata);
  return {
    state: task.state,
    priority: task.priority,
    actualDuration: task.actual_duration === null ? '' : String(task.actual_duration),
    actualCost: task.actual_cost === null ? '' : String(task.actual_cost),
    progress: deriveTaskProgress(task),
    executionNotes: readString(metadata.executionNotes),
  };
};

const mapProjectStatus = (state: ProjectRow['state']): Project['status'] => {
  if (state === 'completed') return 'success';
  if (state === 'blocked' || state === 'cancelled') return 'error';
  if (state === 'paused') return 'warning';
  return 'info';
};

const daysUntil = (date?: string | null) => {
  if (!date) return 0;
  const due = new Date(date);
  if (Number.isNaN(due.getTime())) return 0;
  return Math.max(0, Math.ceil((due.getTime() - Date.now()) / 86_400_000));
};

const mapProjectRow = (row: ProjectRow): Project => ({
  id: row.id,
  title: row.name,
  description: row.description ?? '',
  daysLeft: daysUntil(row.due_date),
  tasksCount: 0,
  status: mapProjectStatus(row.state),
  date: row.due_date ?? row.start_date ?? '',
  owner: row.owner_id,
  value: row.budget ? String(row.budget) : '0',
  isOverBudget: false,
  hasOverdueTasks: Boolean(row.due_date && daysUntil(row.due_date) === 0),
  progress: row.state === 'completed' ? 100 : 0,
});

const PlanningCanvas: React.FC<PlanningCanvasProps> = ({ board }) => {
  const setCurrentBoard = usePlanningStore((state) => state.setCurrentBoard);
  const activeTool = useCanvasStore((state) => state.activeTool);
  const setViewportHostSize = useCanvasStore((state) => state.setViewportHostSize);
  const addElement = useCanvasStore((state) => state.addElement);
  const updateElement = useCanvasStore((state) => state.updateElement);
  const selectedElementIds = useCanvasStore((state) => state.selectedElementIds);
  const viewport = useCanvasStore((state) => state.viewport);
  const setConnected = useCollaborationStore((state) => state.setConnected);
  const setCurrentUser = useCollaborationStore((state) => state.setCurrentUser);
  const setParticipants = useCollaborationStore((state) => state.setParticipants);
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const commandBar = useSmartCommandBar();
  const [conversionPayload, setConversionPayload] = useState<SmartConversionPayload | null>(null);
  const [executionTarget, setExecutionTarget] = useState<ExecutionTarget | null>(null);
  const [executionProject, setExecutionProject] = useState<Project | null>(null);
  const [executionTask, setExecutionTask] = useState<TaskRow | null>(null);
  const [executionLoading, setExecutionLoading] = useState(false);
  const [taskDraft, setTaskDraft] = useState<TaskExecutionDraft | null>(null);
  const [taskSaving, setTaskSaving] = useState(false);
  const currentUserId = useCollaborationStore((state) => state.currentUserId) ?? 'anonymous-user';
  const participants = useCollaborationStore((state) => state.participants);
  const selfName =
    participants.find((p) => p.id === currentUserId)?.name ?? 'مستخدم حالي';
  const boardRole = useCurrentBoardRole(board.id);
  const aiPermissions = useCanvasAIPermissions(board.id);
  const canEditBoard = !boardRole.loading && canMutateCanvas(boardRole.role);

  useBoardCanvasLifecycle(board);

  const sync = usePlanningCanvasPersistence(board.id, {
    selfDisplayName: selfName,
    canPersist: canEditBoard,
  });
  const { peers, connectionStatus, lastSyncAt } = sync;

  useEffect(() => {
    const handleOpenExecution = (event: Event) => {
      const detail = (event as CustomEvent<ExecutionTarget>).detail;
      if (!detail?.entityId || (detail.entityType !== 'project' && detail.entityType !== 'task')) return;
      setExecutionTarget(detail);
    };

    window.addEventListener('planning:open-execution', handleOpenExecution);
    return () => window.removeEventListener('planning:open-execution', handleOpenExecution);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadExecutionTarget = async () => {
      if (!executionTarget) {
        setExecutionProject(null);
        setExecutionTask(null);
        setTaskDraft(null);
        return;
      }

      setExecutionLoading(true);
      if (executionTarget.entityType === 'project') {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', executionTarget.entityId)
          .maybeSingle();

        if (!cancelled) {
          if (error || !data) {
            toast.error('تعذر فتح لوحة المشروع المرتبطة');
            setExecutionProject(null);
          } else {
            setExecutionProject(mapProjectRow(data));
          }
          setExecutionLoading(false);
        }
        return;
      }

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', executionTarget.entityId)
        .maybeSingle();

      if (!cancelled) {
        if (error || !data) {
          toast.error('تعذر فتح تفاصيل المهمة المرتبطة');
          setExecutionTask(null);
          setTaskDraft(null);
        } else {
          setExecutionTask(data);
          setTaskDraft(mapTaskDraft(data));
        }
        setExecutionLoading(false);
      }
    };

    void loadExecutionTarget();
    return () => {
      cancelled = true;
    };
  }, [executionTarget]);

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

  const handleSaveTaskExecution = useCallback(async () => {
    if (!executionTask || !taskDraft) return;

    const actualDurationInput = normalizeNumberInput(taskDraft.actualDuration);
    const actualCostInput = normalizeNumberInput(taskDraft.actualCost);

    if (actualDurationInput.invalid || actualCostInput.invalid) {
      toast.error('أدخل المدة الفعلية والتكلفة الفعلية كأرقام فقط قبل الحفظ');
      return;
    }

    const nextMetadata = {
      ...asRecord(executionTask.metadata),
      executionProgress: taskDraft.progress,
      executionNotes: taskDraft.executionNotes.trim() || null,
      planningCanvasLastEditedAt: new Date().toISOString(),
      planningCanvasLastEditedBy: currentUserId,
    } as TaskUpdate['metadata'];

    const updates: TaskUpdate = {
      state: taskDraft.state,
      priority: taskDraft.priority,
      actual_duration: actualDurationInput.value,
      actual_cost: actualCostInput.value,
      metadata: nextMetadata,
      updated_at: new Date().toISOString(),
    };

    setTaskSaving(true);
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', executionTask.id)
      .select('*')
      .maybeSingle();

    setTaskSaving(false);
    if (error || !data) {
      toast.error('تعذر حفظ تحديثات المهمة التنفيذية');
      return;
    }

    setExecutionTask(data);
    setTaskDraft(mapTaskDraft(data));
    toast.success('تم حفظ تحديثات المهمة التنفيذية');
  }, [currentUserId, executionTask, taskDraft]);

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

  return (
    <div className="h-full flex flex-col bg-white">
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
        <div data-board-frame="true" className="flex-1 relative overflow-hidden">
          <InfiniteCanvas
            boardId={board.id}
            peers={peers}
            broadcastCursor={sync.broadcastCursor}
            canEdit={canEditBoard}
          />
          <div id="planning-floating-overlay" data-floating-overlay="true" className="absolute inset-0 pointer-events-none" />
        </div>
        <ToolZone activeTool={activeTool} boardId={board.id} />
      </div>
      <BottomToolbar canEdit={canEditBoard} />
      {aiPermissions.canUseAI && <AIAssistantButton />}
      <NavigationBar />
      <ContextualToolbarManager boardId={board.id} />
      <SmartCommandBar
        isOpen={commandBar.isOpen}
        onClose={commandBar.close}
        boardId={board.id}
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
      <ProjectManagementBoard
        project={executionProject ?? mapProjectRow({
          id: executionTarget?.entityId ?? 'loading',
          name: 'جاري فتح المشروع',
          description: '',
          owner_id: currentUserId,
          state: 'draft',
          priority: 'medium',
          budget: null,
          start_date: null,
          due_date: null,
          metadata: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })}
        isVisible={executionTarget?.entityType === 'project' && (Boolean(executionProject) || executionLoading)}
        onClose={() => setExecutionTarget(null)}
        isSidebarCollapsed
        presentation="planning-canvas"
      />
      <Dialog
        open={executionTarget?.entityType === 'task' && (Boolean(executionTask) || executionLoading)}
        onOpenChange={(open) => {
          if (!open) setExecutionTarget(null);
        }}
      >
        <DialogContent className="flex h-[100dvh] w-screen max-w-none flex-col overflow-hidden rounded-none p-0 sm:h-[min(90dvh,760px)] sm:w-full sm:max-w-4xl sm:rounded-lg">
          <DialogHeader className="border-b border-border px-5 py-4 text-right" dir="rtl">
            <DialogTitle>{executionTask?.name ?? 'جاري فتح المهمة'}</DialogTitle>
            <DialogDescription>{executionTask?.description ?? 'تفاصيل وإدارة المهمة التنفيذية المرتبطة بلوحة التخطيط'}</DialogDescription>
          </DialogHeader>

          {executionTask && taskDraft ? (
            <div className="flex-1 overflow-y-auto px-5 py-4" dir="rtl">
              <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
                <div className="rounded-md border border-border p-3">
                  <p className="text-muted-foreground">المدة المقدرة</p>
                  <p className="font-semibold">{executionTask.estimated_duration} ساعة</p>
                </div>
                <div className="rounded-md border border-border p-3">
                  <p className="text-muted-foreground">التكلفة المقدرة</p>
                  <p className="font-semibold">{executionTask.estimated_cost.toLocaleString('ar-SA')} ريال</p>
                </div>
                <div className="rounded-md border border-border p-3">
                  <p className="text-muted-foreground">الفريق المطلوب</p>
                  <p className="font-semibold">{executionTask.required_team_size} أعضاء</p>
                </div>
                <div className="rounded-md border border-border p-3">
                  <p className="text-muted-foreground">تاريخ البداية</p>
                  <p className="font-semibold">{executionTask.start_date ?? '-'}</p>
                </div>
                <div className="rounded-md border border-border p-3">
                  <p className="text-muted-foreground">تاريخ التسليم</p>
                  <p className="font-semibold">{executionTask.due_date ?? '-'}</p>
                </div>
                <div className="rounded-md border border-border p-3">
                  <p className="text-muted-foreground">آخر تحديث</p>
                  <p className="font-semibold">{new Date(executionTask.updated_at).toLocaleDateString('ar-SA')}</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-foreground">حالة التنفيذ</span>
                  <select
                    className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
                    value={taskDraft.state}
                    onChange={(event) => setTaskDraft((draft) => draft ? { ...draft, state: event.target.value as TaskState } : draft)}
                  >
                    {TASK_STATE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-foreground">الأولوية</span>
                  <select
                    className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
                    value={taskDraft.priority}
                    onChange={(event) => setTaskDraft((draft) => draft ? { ...draft, priority: event.target.value as TaskPriority } : draft)}
                  >
                    {TASK_PRIORITY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-foreground">المدة الفعلية بالساعات</span>
                  <input
                    className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
                    inputMode="decimal"
                    value={taskDraft.actualDuration}
                    onChange={(event) => setTaskDraft((draft) => draft ? { ...draft, actualDuration: event.target.value } : draft)}
                    placeholder="0"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-foreground">التكلفة الفعلية</span>
                  <input
                    className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
                    inputMode="decimal"
                    value={taskDraft.actualCost}
                    onChange={(event) => setTaskDraft((draft) => draft ? { ...draft, actualCost: event.target.value } : draft)}
                    placeholder="0"
                  />
                </label>
              </div>

              <label className="mt-4 block space-y-2">
                <span className="flex items-center justify-between text-sm font-medium text-foreground">
                  <span>نسبة التقدم</span>
                  <span>{taskDraft.progress}%</span>
                </span>
                <input
                  className="w-full accent-primary"
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={taskDraft.progress}
                  onChange={(event) => setTaskDraft((draft) => draft ? { ...draft, progress: Number(event.target.value) } : draft)}
                />
              </label>

              <label className="mt-4 block space-y-2">
                <span className="text-sm font-medium text-foreground">ملاحظات التنفيذ</span>
                <textarea
                  className="min-h-[120px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  value={taskDraft.executionNotes}
                  onChange={(event) => setTaskDraft((draft) => draft ? { ...draft, executionNotes: event.target.value } : draft)}
                  placeholder="أضف آخر تقدم، عائق، أو قرار متعلق بهذه المهمة..."
                />
              </label>
            </div>
          ) : (
            <div className="flex-1 px-5 py-4 text-sm text-muted-foreground" dir="rtl">جاري تحميل بيانات المهمة...</div>
          )}

          <div className="flex items-center justify-between gap-3 border-t border-border px-5 py-4" dir="rtl">
            <p className="text-xs text-muted-foreground">يتم حفظ تحديثات التنفيذ على سجل المهمة المرتبط بهذه البطاقة.</p>
            <button
              type="button"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
              disabled={!executionTask || !taskDraft || taskSaving}
              onClick={() => void handleSaveTaskExecution()}
            >
              {taskSaving ? 'جاري الحفظ...' : 'حفظ التحديثات'}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlanningCanvas;
