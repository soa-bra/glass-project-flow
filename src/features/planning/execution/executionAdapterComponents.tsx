import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ProjectManagementBoard } from '@/components/ProjectManagement/ProjectManagementBoard';
import { InvoicesTab } from '@/components/DepartmentTabs/Financial/InvoicesTab';
import { BudgetsTab } from '@/components/DepartmentTabs/Financial/BudgetsTab';
import { TransactionsTab } from '@/components/DepartmentTabs/Financial/TransactionsTab';
import { LegalDashboard } from '@/components/DepartmentTabs/Legal';
import { RisksTab } from '@/components/DepartmentTabs/Legal/RisksTab';
import { SmartDocRenderer, InteractiveSheet } from '@/features/planning/elements/smart-doc';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import type { Project } from '@/types/project';
import type { ExecutionAdapterContext } from './executionAdapters';

type ProjectRow = Database['public']['Tables']['projects']['Row'];
type TaskRow = Database['public']['Tables']['tasks']['Row'];
type TaskUpdate = Database['public']['Tables']['tasks']['Update'];
type TaskState = TaskRow['state'];
type TaskPriority = TaskRow['priority'];

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
  if (!/^\d+(\.\d+)?$/.test(trimmed)) return { value: null, invalid: true };
  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed)) return { value: null, invalid: true };
  return { value: parsed, invalid: false };
};

const daysUntil = (date?: string | null) => {
  if (!date) return 0;
  const due = new Date(date);
  if (Number.isNaN(due.getTime())) return 0;
  return Math.max(0, Math.ceil((due.getTime() - Date.now()) / 86_400_000));
};

const mapProjectStatus = (state: ProjectRow['state']): Project['status'] => {
  if (state === 'completed') return 'success';
  if (state === 'blocked' || state === 'cancelled') return 'error';
  if (state === 'paused') return 'warning';
  return 'info';
};

const mapProjectRow = (row: ProjectRow): Project => ({
  id: row.id,
  title: row.name,
  description: row.description ?? '',
  daysLeft: daysUntil(row.due_date),
  tasksCount: 0,
  status: mapProjectStatus(row.state),
  date: row.due_date ?? row.start_date ?? '',
  dueDate: row.due_date ?? null,
  owner: row.owner_id,
  value: row.budget ? String(row.budget) : '0',
  isOverBudget: false,
  hasOverdueTasks: Boolean(row.due_date && daysUntil(row.due_date) === 0),
  progress: row.state === 'completed' ? 100 : 0,
});

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

const LoadingPanel: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex h-full items-center justify-center p-6 text-sm text-muted-foreground" dir="rtl">
    {label}
  </div>
);

export const ProjectPanelAdapter: React.FC<ExecutionAdapterContext> = ({ target, currentUserId, onClose }) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadProject = async () => {
      if (!target.entityId) {
        setProject(null);
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', target.entityId)
        .maybeSingle();

      if (cancelled) return;
      if (error || !data) {
        toast.error('تعذر فتح لوحة المشروع المرتبطة');
        setProject(null);
      } else {
        setProject(mapProjectRow(data));
      }
      setLoading(false);
    };

    void loadProject();
    return () => {
      cancelled = true;
    };
  }, [target.entityId]);

  const fallbackProject = useMemo<Project>(() => ({
    id: target.entityId ?? 'loading',
    title: 'جاري فتح المشروع',
    description: '',
    daysLeft: 0,
    tasksCount: 0,
    status: 'info',
    date: '',
    dueDate: null,
    owner: currentUserId,
    value: '0',
    isOverBudget: false,
    hasOverdueTasks: false,
    progress: 0,
  }), [currentUserId, target.entityId]);

  return (
    <ProjectManagementBoard
      project={project ?? fallbackProject}
      isVisible={Boolean(project) || loading}
      onClose={onClose}
      isSidebarCollapsed
      presentation="planning-canvas"
    />
  );
};

export const TaskExecutionPanel: React.FC<ExecutionAdapterContext> = ({ target, currentUserId }) => {
  const [executionTask, setExecutionTask] = useState<TaskRow | null>(null);
  const [taskDraft, setTaskDraft] = useState<TaskExecutionDraft | null>(null);
  const [loading, setLoading] = useState(false);
  const [taskSaving, setTaskSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadTask = async () => {
      if (!target.entityId) {
        setExecutionTask(null);
        setTaskDraft(null);
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', target.entityId)
        .maybeSingle();

      if (cancelled) return;
      if (error || !data) {
        toast.error('تعذر فتح تفاصيل المهمة المرتبطة');
        setExecutionTask(null);
        setTaskDraft(null);
      } else {
        setExecutionTask(data);
        setTaskDraft(mapTaskDraft(data));
      }
      setLoading(false);
    };

    void loadTask();
    return () => {
      cancelled = true;
    };
  }, [target.entityId]);

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

  if (loading || !executionTask || !taskDraft) {
    return <LoadingPanel label="جاري تحميل بيانات المهمة..." />;
  }

  return (
    <div className="flex h-full flex-col" dir="rtl">
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
          <div className="rounded-md border border-border p-3"><p className="text-muted-foreground">المدة المقدرة</p><p className="font-semibold">{executionTask.estimated_duration} ساعة</p></div>
          <div className="rounded-md border border-border p-3"><p className="text-muted-foreground">التكلفة المقدرة</p><p className="font-semibold">{executionTask.estimated_cost.toLocaleString('ar-SA')} ريال</p></div>
          <div className="rounded-md border border-border p-3"><p className="text-muted-foreground">الفريق المطلوب</p><p className="font-semibold">{executionTask.required_team_size} أعضاء</p></div>
          <div className="rounded-md border border-border p-3"><p className="text-muted-foreground">تاريخ البداية</p><p className="font-semibold">{executionTask.start_date ?? '-'}</p></div>
          <div className="rounded-md border border-border p-3"><p className="text-muted-foreground">تاريخ التسليم</p><p className="font-semibold">{executionTask.due_date ?? '-'}</p></div>
          <div className="rounded-md border border-border p-3"><p className="text-muted-foreground">آخر تحديث</p><p className="font-semibold">{new Date(executionTask.updated_at).toLocaleDateString('ar-SA')}</p></div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-foreground">حالة التنفيذ</span>
            <select className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm" value={taskDraft.state} onChange={(event) => setTaskDraft((draft) => draft ? { ...draft, state: event.target.value as TaskState } : draft)}>
              {TASK_STATE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-foreground">الأولوية</span>
            <select className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm" value={taskDraft.priority} onChange={(event) => setTaskDraft((draft) => draft ? { ...draft, priority: event.target.value as TaskPriority } : draft)}>
              {TASK_PRIORITY_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>

          <label className="space-y-2"><span className="text-sm font-medium text-foreground">المدة الفعلية بالساعات</span><input className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm" inputMode="decimal" value={taskDraft.actualDuration} onChange={(event) => setTaskDraft((draft) => draft ? { ...draft, actualDuration: event.target.value } : draft)} placeholder="0" /></label>
          <label className="space-y-2"><span className="text-sm font-medium text-foreground">التكلفة الفعلية</span><input className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm" inputMode="decimal" value={taskDraft.actualCost} onChange={(event) => setTaskDraft((draft) => draft ? { ...draft, actualCost: event.target.value } : draft)} placeholder="0" /></label>
        </div>

        <label className="mt-4 block space-y-2">
          <span className="flex items-center justify-between text-sm font-medium text-foreground"><span>نسبة التقدم</span><span>{taskDraft.progress}%</span></span>
          <input className="w-full accent-primary" type="range" min={0} max={100} step={5} value={taskDraft.progress} onChange={(event) => setTaskDraft((draft) => draft ? { ...draft, progress: Number(event.target.value) } : draft)} />
        </label>

        <label className="mt-4 block space-y-2">
          <span className="text-sm font-medium text-foreground">ملاحظات التنفيذ</span>
          <textarea className="min-h-[120px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm" value={taskDraft.executionNotes} onChange={(event) => setTaskDraft((draft) => draft ? { ...draft, executionNotes: event.target.value } : draft)} placeholder="أضف آخر تقدم، عائق، أو قرار متعلق بهذه المهمة..." />
        </label>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-border px-5 py-4">
        <p className="text-xs text-muted-foreground">يتم حفظ تحديثات التنفيذ على سجل المهمة المرتبط بهذه البطاقة.</p>
        <button type="button" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60" disabled={taskSaving} onClick={() => void handleSaveTaskExecution()}>
          {taskSaving ? 'جاري الحفظ...' : 'حفظ التحديثات'}
        </button>
      </div>
    </div>
  );
};

export const HostedTab: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="h-full overflow-y-auto bg-background p-4" dir="rtl">{children}</div>
);

export const InvoicesAdapter: React.FC = () => <HostedTab><InvoicesTab /></HostedTab>;
export const BudgetsAdapter: React.FC = () => <HostedTab><BudgetsTab /></HostedTab>;
export const TransactionsAdapter: React.FC = () => <HostedTab><TransactionsTab /></HostedTab>;
export const LegalDashboardAdapter: React.FC = () => <HostedTab><LegalDashboard /></HostedTab>;
export const RiskPanelAdapter: React.FC = () => <HostedTab><RisksTab /></HostedTab>;

export const SmartDocAdapter: React.FC<ExecutionAdapterContext> = ({ target }) => {
  if (!target.element) return <LoadingPanel label="لا يوجد مستند ذكي مرتبط بهذا العنصر." />;
  return <SmartDocRenderer element={target.element} onUpdate={target.onUpdate} />;
};

export const SheetAdapter: React.FC<ExecutionAdapterContext> = ({ target }) => {
  const sheetData = target.element?.data ?? target.data ?? {};
  return (
    <HostedTab>
      <InteractiveSheet data={sheetData as any} onUpdate={(nextData) => target.onUpdate?.({ ...sheetData, ...nextData })} />
    </HostedTab>
  );
};
