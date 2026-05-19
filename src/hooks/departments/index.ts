/**
 * Department hooks — React Query bindings for all domain services.
 * Provides one factory `useDomainQueries(name)` that returns
 * `{ list, get, create, update, remove }` hooks bound to a service.
 */
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from "@tanstack/react-query";
import type { ListOptions } from "@/services/departments/_factory";
import * as Services from "@/services/departments";

export const deptKeys = {
  all: (table: string) => ["dept", table] as const,
  list: (table: string, opts?: ListOptions) => ["dept", table, "list", opts ?? {}] as const,
  one: (table: string, id: string) => ["dept", table, id] as const,
};

type Svc<T> = {
  list: (opts?: ListOptions) => Promise<T[]>;
  get: (id: string) => Promise<T | null>;
  create: (input: Partial<T>) => Promise<T>;
  update: (id: string, patch: Partial<T>) => Promise<T>;
  remove: (id: string) => Promise<void>;
};

function useList<T>(table: string, svc: Svc<T>, opts?: ListOptions): UseQueryResult<T[]> {
  return useQuery({
    queryKey: deptKeys.list(table, opts),
    queryFn: () => svc.list(opts),
  });
}

function useOne<T>(table: string, svc: Svc<T>, id: string | null): UseQueryResult<T | null> {
  return useQuery({
    queryKey: id ? deptKeys.one(table, id) : ["dept", table, "null"],
    queryFn: () => (id ? svc.get(id) : Promise.resolve(null)),
    enabled: !!id,
  });
}

function useCreate<T>(table: string, svc: Svc<T>) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Partial<T>) => svc.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: deptKeys.all(table) }),
  });
}

function useUpdate<T>(table: string, svc: Svc<T>) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<T> }) => svc.update(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: deptKeys.all(table) }),
  });
}

function useRemove<T>(table: string, svc: Svc<T>) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => svc.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: deptKeys.all(table) }),
  });
}

function bind<T>(table: string, svc: Svc<T>) {
  return {
    useList: (opts?: ListOptions) => useList<T>(table, svc, opts),
    useOne: (id: string | null) => useOne<T>(table, svc, id),
    useCreate: () => useCreate<T>(table, svc),
    useUpdate: () => useUpdate<T>(table, svc),
    useRemove: () => useRemove<T>(table, svc),
  };
}

// HR
export const HrEmployees = bind("hr_employees", Services.HrEmployeesService);
export const HrAttendance = bind("hr_attendance", Services.HrAttendanceService);
export const HrTrainingCourses = bind("hr_training_courses", Services.HrTrainingCoursesService);
export const HrTrainingEnrollments = bind("hr_training_enrollments", Services.HrTrainingEnrollmentsService);
export const HrPerformanceReviews = bind("hr_performance_reviews", Services.HrPerformanceReviewsService);
export const HrPartners = bind("hr_partners", Services.HrPartnersService);

// CRM
export const CrmCustomers = bind("crm_customers", Services.CrmCustomersService);
export const CrmOpportunities = bind("crm_opportunities", Services.CrmOpportunitiesService);
export const CrmActivities = bind("crm_activities", Services.CrmActivitiesService);
export const CrmServiceTickets = bind("crm_service_tickets", Services.CrmServiceTicketsService);

// Financial
export const FinancialBudgets = bind("financial_budgets", Services.FinancialBudgetsService);
export const FinancialTransactions = bind("financial_transactions", Services.FinancialTransactionsService);

// Legal
export const LegalCases = bind("legal_cases", Services.LegalCasesService);
export const LegalContracts = bind("legal_contracts", Services.LegalContractsService);

// Brand
export const BrandAssets = bind("brand_assets", Services.BrandAssetsService);
export const BrandGuidelines = bind("brand_guidelines", Services.BrandGuidelinesService);

// Marketing
export const MarketingCampaigns = bind("marketing_campaigns", Services.MarketingCampaignsService);
export const MarketingLeads = bind("marketing_leads", Services.MarketingLeadsService);

// CSR
export const CsrInitiatives = bind("csr_initiatives", Services.CsrInitiativesService);
export const CsrTickets = bind("csr_tickets", Services.CsrTicketsService);

// KMPA
export const KmpaDocuments = bind("kmpa_documents", Services.KmpaDocumentsService);

// Templates
export const TemplateItems = bind("template_items", Services.TemplateItemsService);

// BCM / Partnerships / Knowledge — P5.3
export const BcmMembers = bind("bcm_members", Services.BcmMembersService);
export const PartnershipAgreements = bind("partnership_agreements", Services.PartnershipAgreementsService);
export const KnowledgeArticles = bind("knowledge_articles", Services.KnowledgeArticlesService);
