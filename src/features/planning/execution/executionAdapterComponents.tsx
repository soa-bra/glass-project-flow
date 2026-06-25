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
  dueDate: row.due_date ?? row.start_date ?? null,
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

  const updateTaskDraft = useCallback(<K extends keyof TaskExecutionDraft>(key: K, value: TaskExecutionDraft[K]) => {
    setTaskDraft(prev => prev ? { ...prev, [key]: value } : prev);
  }, []);

  const handleSaveExecution = async () => {
    if (!executionTask || !taskDraft) return;

    const actualDuration = normalizeNumberInput(taskDraft.actualDuration);
    const actualCost = normalizeNumberInput(taskDraft.actualCost);

    if (actualDuration.invalid || actualCost.invalid) {
      toast.error('المدة والتكلفة يجب أن تكون أرقامًا صحيحة');
      return;
    }

    setTaskSaving(true);
    const metadata = asRecord(executionTask.metadata);
    const update: TaskUpdate = {
      state: taskDraft.state,
      priority: taskDraft.priority,
      actual_duration: actualDuration.value,
      actual_cost: actualCost.value,
      metadata: {
        ...metadata,
        executionProgress: taskDraft.progress,
        executionNotes: taskDraft.executionNotes,
      },
    };

    const { data, error } = await supabase
      .from('tasks')
      .update(update)
      .eq('id', executionTask.id)
      .select('*')
      .maybeSingle();

    setTaskSaving(false);

    if (error || !data) {
      toast.error('تعذر حفظ تحديث التنفيذ');
      return;
    }

    setExecutionTask(data);
    setTaskDraft(mapTaskDraft(data));
    toast.success('تم حفظ تحديث التنفيذ');
  };

  if (loading) return <LoadingPanel label="جاري تحميل تفاصيل المهمة..." />;
  if (!executionTask || !taskDraft) return <LoadingPanel label="لا توجد مهمة مرتبطة بهذا العنصر" />;

  return (
    <div className="flex h-full flex-col gap-4 overflow-auto p-6" dir="rtl">
      <div>
        <h3 className="text-lg font-semibold text-foreground">{executionTask.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{executionTask.description || 'لا يوجد وصف للمهمة'}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm">
          <span className="font-medium">حالة التنفيذ</span>
          <select
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={taskDraft.state}
            onChange={(event) => updateTaskDraft('state', event.target.value as TaskState)}
          >
            {TASK_STATE_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </label>

        <label className="space-y-2 text-sm">
          <span className="font-medium">الأولوية</span>
          <select
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={taskDraft.priority}
            onChange={(event) => updateTaskDraft('priority', event.target.value as TaskPriority)}
          >
            {TASK_PRIORITY_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </label>

        <label className="space-y-2 text-sm">
          <span className="font-medium">المدة الفعلية</span>
          <input
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={taskDraft.actualDuration}
            onChange={(event) => updateTaskDraft('actualDuration', event.target.value)}
            placeholder="مثال: 12"
            inputMode="decimal"
          />
        </label>

        <label className="space-y-2 text-sm">
          <span className="font-medium">التكلفة الفعلية</span>
          <input
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={taskDraft.actualCost}
            onChange={(event) => updateTaskDraft('actualCost', event.target.value)}
            placeholder="مثال: 5000"
            inputMode="decimal"
          />
        </label>

        <label className="space-y-2 text-sm md:col-span-2">
          <span className="font-medium">نسبة الإنجاز</span>
          <input
            type="range"
            min={0}
            max={100}
            value={taskDraft.progress}
            onChange={(event) => updateTaskDraft('progress', Number(event.target.value))}
            className="w-full"
          />
          <span className="text-xs text-muted-foreground">{taskDraft.progress}%</span>
        </label>

        <label className="space-y-2 text-sm md:col-span-2">
          <span className="font-medium">ملاحظات التنفيذ</span>
          <textarea
            className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={taskDraft.executionNotes}
            onChange={(event) => updateTaskDraft('executionNotes', event.target.value)}
            placeholder="اكتب ملخص التنفيذ أو العوائق..."
          />
        </label>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSaveExecution}
          disabled={taskSaving}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
        >
          {taskSaving ? 'جاري الحفظ...' : 'حفظ تحديث التنفيذ'}
        </button>
      </div>
    </div>
  );
};
