import { supabase } from '@/integrations/supabase/client';
import type { Database, Json } from '@/integrations/supabase/types';
import { z } from 'zod';

export const smartConversionTargetEntityTypes = [
  'project',
  'task',
  'financial_budget',
  'financial_transaction',
] as const;

export type SmartConversionTargetEntityType = typeof smartConversionTargetEntityTypes[number];

type Project = Database['public']['Tables']['projects']['Row'];
type Task = Database['public']['Tables']['tasks']['Row'];
type FinancialBudget = Database['public']['Tables']['financial_budgets']['Row'];
type FinancialTransaction = Database['public']['Tables']['financial_transactions']['Row'];
type PlanningElement = Database['public']['Tables']['planning_elements']['Row'];

type CreatedEntity = Project | Task | FinancialBudget | FinancialTransaction;

export interface SmartConversionApproval {
  approved: boolean;
  approverId?: string;
  approvedAt?: string;
  note?: string;
}

export interface SmartConversionPayload {
  sourceElementIds: string[];
  targetEntityType: SmartConversionTargetEntityType;
  suggestedData: Record<string, unknown>;
  approval: SmartConversionApproval;
  boardId: string;
}

export interface SmartConversionResult {
  entity: CreatedEntity;
  linkedElements: PlanningElement[];
  auditEventId?: string;
}

const approvalSchema = z.object({
  approved: z.boolean(),
  approverId: z.string().uuid().optional(),
  approvedAt: z.string().datetime().optional(),
  note: z.string().max(1000).optional(),
});

const smartConversionPayloadSchema = z.object({
  sourceElementIds: z.array(z.string().uuid()).min(1),
  targetEntityType: z.enum(smartConversionTargetEntityTypes),
  suggestedData: z.record(z.unknown()),
  approval: approvalSchema,
  boardId: z.string().uuid(),
});

const asString = (value: unknown): string | undefined => (
  typeof value === 'string' && value.trim() ? value.trim() : undefined
);

const asNumber = (value: unknown): number | undefined => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
};

const normalizeDateTime = (value: unknown): string | null => {
  const text = asString(value);
  if (!text) return null;
  const date = new Date(text);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

const normalizeDate = (value: unknown): string | undefined => {
  const text = asString(value);
  if (!text) return undefined;
  const date = new Date(text);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString().slice(0, 10);
};

async function requireUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!data.user) throw new Error('Not authenticated');
  return data.user.id;
}

function buildMetadata(payload: SmartConversionPayload): Json {
  return {
    ...(typeof payload.suggestedData.metadata === 'object' && payload.suggestedData.metadata !== null
      ? payload.suggestedData.metadata as Record<string, unknown>
      : {}),
    smartConversion: {
      boardId: payload.boardId,
      sourceElementIds: payload.sourceElementIds,
      approvedAt: payload.approval.approvedAt,
      approvalNote: payload.approval.note,
    },
  } as Json;
}

async function createProject(payload: SmartConversionPayload, ownerId: string): Promise<Project> {
  const suggested = payload.suggestedData;
  const { data, error } = await supabase
    .from('projects')
    .insert({
      name: asString(suggested.name) ?? asString(suggested.title) ?? 'مشروع من الكانفس',
      description: asString(suggested.description) ?? null,
      state: (asString(suggested.state) as Project['state'] | undefined) ?? 'draft',
      priority: (asString(suggested.priority) as Project['priority'] | undefined) ?? 'medium',
      start_date: normalizeDateTime(suggested.start_date ?? suggested.startDate),
      due_date: normalizeDateTime(suggested.due_date ?? suggested.dueDate),
      budget: asNumber(suggested.budget) ?? null,
      metadata: buildMetadata(payload),
      owner_id: ownerId,
    })
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

async function createTask(payload: SmartConversionPayload, ownerId: string): Promise<Task> {
  const suggested = payload.suggestedData;
  const linkedProjectId = asString(suggested.linked_project_id ?? suggested.linkedProjectId ?? suggested.project_id);
  if (!linkedProjectId) {
    throw new Error('Task conversion requires suggestedData.linked_project_id.');
  }

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      linked_project_id: linkedProjectId,
      name: asString(suggested.name) ?? asString(suggested.title) ?? 'مهمة من الكانفس',
      description: asString(suggested.description) ?? null,
      state: (asString(suggested.state) as Task['state'] | undefined) ?? 'draft',
      priority: (asString(suggested.priority) as Task['priority'] | undefined) ?? 'medium',
      assignee_id: asString(suggested.assignee_id ?? suggested.assigneeId) ?? null,
      estimated_duration: asNumber(suggested.estimated_duration ?? suggested.estimatedDuration) ?? 0,
      estimated_cost: asNumber(suggested.estimated_cost ?? suggested.estimatedCost) ?? 0,
      complexity: (asString(suggested.complexity) as Task['complexity'] | undefined) ?? 'simple',
      required_team_size: asNumber(suggested.required_team_size ?? suggested.requiredTeamSize) ?? 1,
      start_date: normalizeDateTime(suggested.start_date ?? suggested.startDate),
      due_date: normalizeDateTime(suggested.due_date ?? suggested.dueDate),
      metadata: buildMetadata(payload),
      owner_id: ownerId,
    })
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

async function createFinancialBudget(payload: SmartConversionPayload, ownerId: string): Promise<FinancialBudget> {
  const suggested = payload.suggestedData;
  const { data, error } = await supabase
    .from('financial_budgets')
    .insert({
      project_id: asString(suggested.project_id ?? suggested.projectId) ?? null,
      department_id: asString(suggested.department_id ?? suggested.departmentId) ?? null,
      name: asString(suggested.name) ?? asString(suggested.title) ?? 'ميزانية من الكانفس',
      period: asString(suggested.period) ?? 'monthly',
      start_date: normalizeDate(suggested.start_date ?? suggested.startDate),
      end_date: normalizeDate(suggested.end_date ?? suggested.endDate),
      planned_amount: asNumber(suggested.planned_amount ?? suggested.plannedAmount ?? suggested.amount) ?? 0,
      spent_amount: asNumber(suggested.spent_amount ?? suggested.spentAmount) ?? 0,
      currency: asString(suggested.currency) ?? 'SAR',
      status: asString(suggested.status) ?? 'draft',
      notes: asString(suggested.notes ?? suggested.description) ?? null,
      owner_id: ownerId,
    })
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

async function createFinancialTransaction(payload: SmartConversionPayload, ownerId: string): Promise<FinancialTransaction> {
  const suggested = payload.suggestedData;
  const { data, error } = await supabase
    .from('financial_transactions')
    .insert({
      budget_id: asString(suggested.budget_id ?? suggested.budgetId) ?? null,
      project_id: asString(suggested.project_id ?? suggested.projectId) ?? null,
      kind: asString(suggested.kind) === 'income' ? 'income' : 'expense',
      amount: asNumber(suggested.amount) ?? 0,
      currency: asString(suggested.currency) ?? 'SAR',
      date: normalizeDate(suggested.date) ?? new Date().toISOString().slice(0, 10),
      vendor: asString(suggested.vendor) ?? null,
      category: asString(suggested.category) ?? null,
      notes: asString(suggested.notes ?? suggested.description) ?? null,
      owner_id: ownerId,
    })
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

async function createEntity(payload: SmartConversionPayload, ownerId: string): Promise<CreatedEntity> {
  switch (payload.targetEntityType) {
    case 'project':
      return createProject(payload, ownerId);
    case 'task':
      return createTask(payload, ownerId);
    case 'financial_budget':
      return createFinancialBudget(payload, ownerId);
    case 'financial_transaction':
      return createFinancialTransaction(payload, ownerId);
    default:
      throw new Error('Unsupported smart conversion target.');
  }
}

async function linkPlanningElements(payload: SmartConversionPayload, entity: CreatedEntity): Promise<PlanningElement[]> {
  const { data: elements, error: selectError } = await supabase
    .from('planning_elements')
    .select('*')
    .eq('board_id', payload.boardId)
    .in('id', payload.sourceElementIds);
  if (selectError) throw selectError;

  const updated: PlanningElement[] = [];
  for (const element of elements ?? []) {
    const metadata = {
      ...(typeof element.metadata === 'object' && element.metadata !== null ? element.metadata as Record<string, unknown> : {}),
      linkedEntityType: payload.targetEntityType,
      linkedEntityId: entity.id,
    };
    const content = typeof element.content === 'object' && element.content !== null
      ? {
          ...element.content as Record<string, unknown>,
          linkedEntityType: payload.targetEntityType,
          linkedEntityId: entity.id,
        }
      : element.content;

    const { data, error } = await supabase
      .from('planning_elements')
      .update({ metadata: metadata as Json, content: content as Json })
      .eq('id', element.id)
      .select('*')
      .single();
    if (error) throw error;
    updated.push(data);
  }

  return updated;
}

async function recordConversionAudit(
  payload: SmartConversionPayload,
  entity: CreatedEntity,
  ownerId: string,
): Promise<string | undefined> {
  const { data, error } = await supabase
    .from('audit_events')
    .insert({
      actor_id: payload.approval.approverId ?? ownerId,
      resource_type: payload.targetEntityType,
      resource_id: entity.id,
      action: 'planning.smart_conversion.approve',
      decision: 'allowed',
      scope_type: 'board',
      scope_id: payload.boardId,
      metadata: {
        boardId: payload.boardId,
        sourceElementIds: payload.sourceElementIds,
        targetEntityType: payload.targetEntityType,
        suggestedData: payload.suggestedData,
        approval: payload.approval,
      } as Json,
    })
    .select('id')
    .single();

  if (error) {
    console.warn('[smartConversion] Failed to write audit event', error);
    return undefined;
  }

  return data.id;
}

export async function approveSmartConversion(
  payload: SmartConversionPayload,
): Promise<SmartConversionResult> {
  const parsed = smartConversionPayloadSchema.parse(payload);
  if (!parsed.approval.approved) {
    throw new Error('Smart conversion must be approved before creating an executable record.');
  }

  const ownerId = await requireUserId();
  const approval = {
    ...parsed.approval,
    approverId: parsed.approval.approverId ?? ownerId,
    approvedAt: parsed.approval.approvedAt ?? new Date().toISOString(),
  };
  const approvedPayload = { ...parsed, approval };

  const entity = await createEntity(approvedPayload, ownerId);
  const linkedElements = await linkPlanningElements(approvedPayload, entity);
  const auditEventId = await recordConversionAudit(approvedPayload, entity, ownerId);

  return { entity, linkedElements, auditEventId };
}
