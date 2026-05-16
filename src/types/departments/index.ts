/**
 * Zod schemas + TS types for all department domain tables.
 * Centralized so services and hooks share validation.
 */
import { z } from "zod";

const baseDates = {
  id: z.string().uuid(),
  owner_id: z.string().uuid(),
  created_at: z.string(),
  updated_at: z.string(),
};

// ── HR ──────────────────────────────────────────────────────────────────────
export const hrEmployeeSchema = z.object({
  ...baseDates,
  department_id: z.string().uuid().nullable().optional(),
  name: z.string().min(1),
  role: z.string().nullable().optional(),
  email: z.string().email().nullable().optional().or(z.literal("")),
  phone: z.string().nullable().optional(),
  hire_date: z.string().nullable().optional(),
  status: z.string(),
  salary: z.number().nullable().optional(),
  metadata: z.record(z.unknown()).nullable().optional(),
});
export type HrEmployee = z.infer<typeof hrEmployeeSchema>;
export const hrEmployeeCreateSchema = hrEmployeeSchema.omit({ id: true, owner_id: true, created_at: true, updated_at: true }).partial({ status: true });
export type HrEmployeeCreate = z.infer<typeof hrEmployeeCreateSchema>;

export const hrAttendanceSchema = z.object({
  ...baseDates,
  employee_id: z.string().uuid(),
  date: z.string(),
  check_in: z.string().nullable().optional(),
  check_out: z.string().nullable().optional(),
  status: z.string(),
  notes: z.string().nullable().optional(),
});
export type HrAttendance = z.infer<typeof hrAttendanceSchema>;

export const hrTrainingCourseSchema = z.object({
  ...baseDates,
  name: z.string().min(1),
  provider: z.string().nullable().optional(),
  duration_hours: z.number().nullable().optional(),
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
  status: z.string(),
  description: z.string().nullable().optional(),
  metadata: z.record(z.unknown()).nullable().optional(),
});
export type HrTrainingCourse = z.infer<typeof hrTrainingCourseSchema>;

export const hrTrainingEnrollmentSchema = z.object({
  ...baseDates,
  course_id: z.string().uuid(),
  employee_id: z.string().uuid(),
  status: z.string(),
  completion_date: z.string().nullable().optional(),
  score: z.number().nullable().optional(),
});
export type HrTrainingEnrollment = z.infer<typeof hrTrainingEnrollmentSchema>;

export const hrPerformanceReviewSchema = z.object({
  ...baseDates,
  employee_id: z.string().uuid(),
  reviewer_id: z.string().uuid().nullable().optional(),
  period: z.string(),
  score: z.number().nullable().optional(),
  rating: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});
export type HrPerformanceReview = z.infer<typeof hrPerformanceReviewSchema>;

export const hrPartnerSchema = z.object({
  ...baseDates,
  name: z.string().min(1),
  type: z.string().nullable().optional(),
  contact_email: z.string().nullable().optional(),
  contact_phone: z.string().nullable().optional(),
  status: z.string(),
  notes: z.string().nullable().optional(),
});
export type HrPartner = z.infer<typeof hrPartnerSchema>;

// ── CRM ─────────────────────────────────────────────────────────────────────
export const crmCustomerSchema = z.object({
  ...baseDates,
  name: z.string().min(1),
  email: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  company: z.string().nullable().optional(),
  segment: z.string().nullable().optional(),
  status: z.string(),
  notes: z.string().nullable().optional(),
  metadata: z.record(z.unknown()).nullable().optional(),
});
export type CrmCustomer = z.infer<typeof crmCustomerSchema>;

export const crmOpportunitySchema = z.object({
  ...baseDates,
  customer_id: z.string().uuid().nullable().optional(),
  name: z.string().min(1),
  value: z.number(),
  probability: z.number(),
  stage: z.string(),
  expected_close: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});
export type CrmOpportunity = z.infer<typeof crmOpportunitySchema>;

export const crmActivitySchema = z.object({
  ...baseDates,
  customer_id: z.string().uuid().nullable().optional(),
  opportunity_id: z.string().uuid().nullable().optional(),
  type: z.string(),
  subject: z.string().min(1),
  due_date: z.string().nullable().optional(),
  status: z.string(),
  notes: z.string().nullable().optional(),
});
export type CrmActivity = z.infer<typeof crmActivitySchema>;

export const crmServiceTicketSchema = z.object({
  ...baseDates,
  customer_id: z.string().uuid().nullable().optional(),
  subject: z.string().min(1),
  description: z.string().nullable().optional(),
  priority: z.string(),
  status: z.string(),
  assignee_id: z.string().uuid().nullable().optional(),
});
export type CrmServiceTicket = z.infer<typeof crmServiceTicketSchema>;

// ── Financial ───────────────────────────────────────────────────────────────
export const financialBudgetSchema = z.object({
  ...baseDates,
  project_id: z.string().uuid().nullable().optional(),
  department_id: z.string().uuid().nullable().optional(),
  name: z.string().min(1),
  period: z.string(),
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
  planned_amount: z.number(),
  spent_amount: z.number(),
  currency: z.string(),
  status: z.string(),
  notes: z.string().nullable().optional(),
});
export type FinancialBudget = z.infer<typeof financialBudgetSchema>;

export const financialTransactionSchema = z.object({
  ...baseDates,
  budget_id: z.string().uuid().nullable().optional(),
  project_id: z.string().uuid().nullable().optional(),
  kind: z.enum(["income", "expense"]),
  amount: z.number(),
  currency: z.string(),
  date: z.string(),
  vendor: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});
export type FinancialTransaction = z.infer<typeof financialTransactionSchema>;

// ── Legal ───────────────────────────────────────────────────────────────────
export const legalCaseSchema = z.object({
  ...baseDates,
  title: z.string().min(1),
  type: z.string().nullable().optional(),
  status: z.string(),
  client_name: z.string().nullable().optional(),
  opened_at: z.string().nullable().optional(),
  closed_at: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  external_reference: z.string().nullable().optional(),
});
export type LegalCase = z.infer<typeof legalCaseSchema>;

export const legalContractSchema = z.object({
  ...baseDates,
  case_id: z.string().uuid().nullable().optional(),
  project_id: z.string().uuid().nullable().optional(),
  name: z.string().min(1),
  party: z.string().nullable().optional(),
  signed_at: z.string().nullable().optional(),
  expires_at: z.string().nullable().optional(),
  status: z.string(),
  file_url: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});
export type LegalContract = z.infer<typeof legalContractSchema>;

// ── Brand ───────────────────────────────────────────────────────────────────
export const brandAssetSchema = z.object({
  ...baseDates,
  name: z.string().min(1),
  category: z.string().nullable().optional(),
  file_url: z.string().nullable().optional(),
  status: z.string(),
  tags: z.array(z.string()),
  description: z.string().nullable().optional(),
});
export type BrandAsset = z.infer<typeof brandAssetSchema>;

export const brandGuidelineSchema = z.object({
  ...baseDates,
  title: z.string().min(1),
  body_md: z.string().nullable().optional(),
  version: z.string(),
  status: z.string(),
});
export type BrandGuideline = z.infer<typeof brandGuidelineSchema>;

// ── Marketing ───────────────────────────────────────────────────────────────
export const marketingCampaignSchema = z.object({
  ...baseDates,
  name: z.string().min(1),
  channel: z.string().nullable().optional(),
  status: z.string(),
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
  budget: z.number(),
  spent: z.number(),
  notes: z.string().nullable().optional(),
});
export type MarketingCampaign = z.infer<typeof marketingCampaignSchema>;

export const marketingLeadSchema = z.object({
  ...baseDates,
  campaign_id: z.string().uuid().nullable().optional(),
  name: z.string().min(1),
  email: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  source: z.string().nullable().optional(),
  status: z.string(),
  score: z.number(),
  notes: z.string().nullable().optional(),
});
export type MarketingLead = z.infer<typeof marketingLeadSchema>;

// ── CSR ─────────────────────────────────────────────────────────────────────
export const csrInitiativeSchema = z.object({
  ...baseDates,
  name: z.string().min(1),
  type: z.string().nullable().optional(),
  status: z.string(),
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
  budget: z.number(),
  beneficiaries_count: z.number(),
  notes: z.string().nullable().optional(),
});
export type CsrInitiative = z.infer<typeof csrInitiativeSchema>;

export const csrTicketSchema = z.object({
  ...baseDates,
  initiative_id: z.string().uuid().nullable().optional(),
  requester_name: z.string().min(1),
  requester_email: z.string().nullable().optional(),
  subject: z.string().min(1),
  description: z.string().nullable().optional(),
  priority: z.string(),
  status: z.string(),
  assignee_id: z.string().uuid().nullable().optional(),
});
export type CsrTicket = z.infer<typeof csrTicketSchema>;

// ── KMPA ────────────────────────────────────────────────────────────────────
export const kmpaDocumentSchema = z.object({
  ...baseDates,
  title: z.string().min(1),
  category: z.string().nullable().optional(),
  version: z.string(),
  status: z.string(),
  content_md: z.string().nullable().optional(),
  tags: z.array(z.string()),
});
export type KmpaDocument = z.infer<typeof kmpaDocumentSchema>;

// ── Templates ───────────────────────────────────────────────────────────────
export const templateItemSchema = z.object({
  ...baseDates,
  kind: z.string(),
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  body_md: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  metadata: z.record(z.unknown()).nullable().optional(),
});
export type TemplateItem = z.infer<typeof templateItemSchema>;

// ── Domain catalog (table name → schema) — used by generic factory ──────────
export const DEPARTMENT_TABLES = {
  hr_employees: hrEmployeeSchema,
  hr_attendance: hrAttendanceSchema,
  hr_training_courses: hrTrainingCourseSchema,
  hr_training_enrollments: hrTrainingEnrollmentSchema,
  hr_performance_reviews: hrPerformanceReviewSchema,
  hr_partners: hrPartnerSchema,
  crm_customers: crmCustomerSchema,
  crm_opportunities: crmOpportunitySchema,
  crm_activities: crmActivitySchema,
  crm_service_tickets: crmServiceTicketSchema,
  financial_budgets: financialBudgetSchema,
  financial_transactions: financialTransactionSchema,
  legal_cases: legalCaseSchema,
  legal_contracts: legalContractSchema,
  brand_assets: brandAssetSchema,
  brand_guidelines: brandGuidelineSchema,
  marketing_campaigns: marketingCampaignSchema,
  marketing_leads: marketingLeadSchema,
  csr_initiatives: csrInitiativeSchema,
  csr_tickets: csrTicketSchema,
  kmpa_documents: kmpaDocumentSchema,
  template_items: templateItemSchema,
} as const;

export type DepartmentTableName = keyof typeof DEPARTMENT_TABLES;
