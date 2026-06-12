import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
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

export interface SmartConversionTraceReferences {
  transformationIds: string[];
  dataLinkIds: string[];
  syncQueueId: string;
  projectEventId?: string;
}

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
  traceReferences: SmartConversionTraceReferences;
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

export async function approveSmartConversion(
  payload: SmartConversionPayload,
): Promise<SmartConversionResult> {
  const parsed = smartConversionPayloadSchema.parse(payload) as SmartConversionPayload;
  if (!parsed.approval.approved) {
    throw new Error('Smart conversion must be approved before creating an executable record.');
  }

  const { data, error } = await supabase.rpc('approve_smart_conversion', {
    p_payload: parsed,
  });

  if (error) throw error;
  if (!data) {
    throw new Error('لم تُرجع عملية اعتماد التحويل الذرية أي نتيجة.');
  }

  return data as unknown as SmartConversionResult;
}
