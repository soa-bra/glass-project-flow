import { z } from "zod";

// Base Event Schema
export const BaseEventSchema = z.object({
  name: z.string(),
  version: z.number(),
  payload: z.record(z.any()),
  dedupKey: z.string().optional(),
  timestamp: z.date().default(() => new Date()),
  source: z.string().default("SoaBra-system"),
});

// Cultural Impact Events
export const CulturalImpactMeasuredV1 = z.object({
  brand_id: z.string().uuid(),
  metric_code: z.enum(["belonging_index", "meaning_shift", "cultural_resonance", "identity_strength"]),
  period_start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  period_end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  value: z.number().min(0).max(1),
  method: z.enum(["survey-v1", "social-listening", "focus-group", "behavioral-analysis"]),
  confidence: z.number().min(0).max(1).optional(),
  metadata: z.record(z.any()).optional(),
});

export const BrandIdentityUpdatedV1 = z.object({
  brand_id: z.string().uuid(),
  updated_fields: z.array(z.string()),
  previous_values: z.record(z.any()),
  new_values: z.record(z.any()),
  updated_by: z.string().uuid(),
  reason: z.string().optional(),
});

// Project Management Events
export const ProjectCreatedV1 = z.object({
  project_id: z.string().uuid(),
  name: z.string(),
  client_id: z.string().uuid(),
  project_type: z.enum(["cultural-strategy", "brand-identity", "research", "consultation"]),
  budget: z.number().positive(),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  assigned_team: z.array(z.string().uuid()),
  created_by: z.string().uuid(),
});

export const ProjectStatusChangedV1 = z.object({
  project_id: z.string().uuid(),
  previous_status: z.enum(["draft", "active", "on-hold", "completed", "cancelled"]),
  new_status: z.enum(["draft", "active", "on-hold", "completed", "cancelled"]),
  changed_by: z.string().uuid(),
  reason: z.string().optional(),
  completion_percentage: z.number().min(0).max(100).optional(),
});

export const TaskCompletedV1 = z.object({
  task_id: z.string().uuid(),
  project_id: z.string().uuid(),
  completed_by: z.string().uuid(),
  completion_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time_spent_hours: z.number().positive(),
  quality_score: z.number().min(1).max(5).optional(),
});

// Financial Events
export const ExpenseApprovedV1 = z.object({
  expense_id: z.string().uuid(),
  project_id: z.string().uuid().optional(),
  amount: z.number().positive(),
  category: z.enum(["travel", "equipment", "software", "research", "marketing", "other"]),
  approved_by: z.string().uuid(),
  approval_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  budget_impact: z.number(),
});

export const BudgetExceededV1 = z.object({
  project_id: z.string().uuid(),
  budget_type: z.enum(["project", "department", "annual"]),
  allocated_amount: z.number().positive(),
  spent_amount: z.number().positive(),
  excess_amount: z.number().positive(),
  excess_percentage: z.number().positive(),
  department: z.string().optional(),
});

// HR Events
export const EmployeeOnboardedV1 = z.object({
  employee_id: z.string().uuid(),
  email: z.string().email(),
  full_name: z.string(),
  department: z.enum(["cultural-strategy", "research", "creative", "account-management", "operations"]),
  position: z.string(),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  onboarded_by: z.string().uuid(),
  initial_projects: z.array(z.string().uuid()).optional(),
});

export const PerformanceReviewCompletedV1 = z.object({
  review_id: z.string().uuid(),
  employee_id: z.string().uuid(),
  reviewer_id: z.string().uuid(),
  review_period_start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  review_period_end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  overall_score: z.number().min(1).max(5),
  cultural_fit_score: z.number().min(1).max(5),
  technical_score: z.number().min(1).max(5),
  growth_areas: z.array(z.string()),
  achievements: z.array(z.string()),
});

// Client Events
export const ClientEngagementScoredV1 = z.object({
  client_id: z.string().uuid(),
  engagement_type: z.enum(["project-satisfaction", "retention-likelihood", "referral-potential"]),
  score: z.number().min(0).max(10),
  scoring_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  scored_by: z.string().uuid(),
  factors: z.array(z.string()).optional(),
  feedback: z.string().optional(),
});

// Legal Events
export const ContractSignedV1 = z.object({
  contract_id: z.string().uuid(),
  client_id: z.string().uuid(),
  project_id: z.string().uuid().optional(),
  contract_type: z.enum(["service-agreement", "nda", "partnership", "vendor"]),
  value: z.number().positive(),
  signed_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  signed_by_client: z.string(),
  signed_by_SoaBra: z.string().uuid(),
});

export const ComplianceCheckCompletedV1 = z.object({
  check_id: z.string().uuid(),
  compliance_type: z.enum(["data-protection", "financial", "contractual", "regulatory"]),
  entity_type: z.enum(["project", "client", "employee", "contract"]),
  entity_id: z.string().uuid(),
  status: z.enum(["compliant", "non-compliant", "requires-action"]),
  checked_by: z.string().uuid(),
  check_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  findings: z.array(z.string()).optional(),
  action_items: z.array(z.string()).optional(),
});

// Event Contract Registry
export const EventContracts = {
  CulturalImpactMeasured: {
    1: CulturalImpactMeasuredV1,
  },
  BrandIdentityUpdated: {
    1: BrandIdentityUpdatedV1,
  },
  ProjectCreated: {
    1: ProjectCreatedV1,
  },
  ProjectStatusChanged: {
    1: ProjectStatusChangedV1,
  },
  TaskCompleted: {
    1: TaskCompletedV1,
  },
  ExpenseApproved: {
    1: ExpenseApprovedV1,
  },
  BudgetExceeded: {
    1: BudgetExceededV1,
  },
  EmployeeOnboarded: {
    1: EmployeeOnboardedV1,
  },
  PerformanceReviewCompleted: {
    1: PerformanceReviewCompletedV1,
  },
  ClientEngagementScored: {
    1: ClientEngagementScoredV1,
  },
  ContractSigned: {
    1: ContractSignedV1,
  },
  ComplianceCheckCompleted: {
    1: ComplianceCheckCompletedV1,
  },
} as const;

export type EventName = keyof typeof EventContracts;
export type EventPayload<T extends EventName, V extends number> = any;

// Helper to get schema for validation
export function getEventSchema(name: EventName, version: number) {
  const eventVersions = EventContracts[name];
  if (!eventVersions || !(version in eventVersions)) {
    throw new Error(`Unknown event: ${name} version ${version}`);
  }
  return (eventVersions as any)[version];
}
