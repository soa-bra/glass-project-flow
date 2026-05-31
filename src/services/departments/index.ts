/**
 * Department services — domain CRUD per table.
 * Each export is a service object with: list / get / create / update / remove.
 */
import { createDomainService } from "./_factory";
import type {
  BrandAsset,
  BrandGuideline,
  CrmActivity,
  CrmCustomer,
  CrmOpportunity,
  CrmServiceTicket,
  CsrInitiative,
  CsrTicket,
  FinancialBudget,
  FinancialTransaction,
  HrAttendance,
  HrEmployee,
  HrPartner,
  HrPerformanceReview,
  HrTrainingCourse,
  HrTrainingEnrollment,
  KmpaDocument,
  LegalCase,
  LegalContract,
  MarketingCampaign,
  MarketingLead,
  TemplateItem,
  BcmMember,
  PartnershipAgreement,
  KnowledgeArticle,
} from "@/types/departments";

// HR
export const HrEmployeesService = createDomainService<HrEmployee>("hr_employees");
export const HrAttendanceService = createDomainService<HrAttendance>("hr_attendance");
export const HrTrainingCoursesService = createDomainService<HrTrainingCourse>("hr_training_courses");
export const HrTrainingEnrollmentsService = createDomainService<HrTrainingEnrollment>("hr_training_enrollments");
export const HrPerformanceReviewsService = createDomainService<HrPerformanceReview>("hr_performance_reviews");
export const HrPartnersService = createDomainService<HrPartner>("hr_partners");

// CRM
export const CrmCustomersService = createDomainService<CrmCustomer>("crm_customers");
export const CrmOpportunitiesService = createDomainService<CrmOpportunity>("crm_opportunities");
export const CrmActivitiesService = createDomainService<CrmActivity>("crm_activities");
export const CrmServiceTicketsService = createDomainService<CrmServiceTicket>("crm_service_tickets");

// Financial
export const FinancialBudgetsService = createDomainService<FinancialBudget>("financial_budgets");
export const FinancialTransactionsService = createDomainService<FinancialTransaction>("financial_transactions");

// Legal
export const LegalCasesService = createDomainService<LegalCase>("legal_cases");
export const LegalContractsService = createDomainService<LegalContract>("legal_contracts");

// Brand
export const BrandAssetsService = createDomainService<BrandAsset>("brand_assets");
export const BrandGuidelinesService = createDomainService<BrandGuideline>("brand_guidelines");

// Marketing
export const MarketingCampaignsService = createDomainService<MarketingCampaign>("marketing_campaigns");
export const MarketingLeadsService = createDomainService<MarketingLead>("marketing_leads");

// CSR
export const CsrInitiativesService = createDomainService<CsrInitiative>("csr_initiatives");
export const CsrTicketsService = createDomainService<CsrTicket>("csr_tickets");

// KMPA
export const KmpaDocumentsService = createDomainService<KmpaDocument>("kmpa_documents");

// Templates
export const TemplateItemsService = createDomainService<TemplateItem>("template_items");

// BCM — P5.3
export const BcmMembersService = createDomainService<BcmMember>("bcm_members");

// Partnerships — P5.3
export const PartnershipAgreementsService = createDomainService<PartnershipAgreement>("partnership_agreements");

// Knowledge — P5.3
export const KnowledgeArticlesService = createDomainService<KnowledgeArticle>("knowledge_articles");
