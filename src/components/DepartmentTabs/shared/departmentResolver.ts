import React from "react";
import { FinancialDashboard } from "../Financial";
import { LegalDashboard } from "../Legal";
import { MarketingDashboard } from "../Marketing";
import { HRDashboard } from "../HR";
import { CRMDashboard } from "../CRM";
import { CSRDashboard } from "../CSR";
import { TrainingDashboard } from "../Training";
import { KMPADashboard } from "../KMPA";
import { BrandDashboard } from "../Brand";
import { departmentsSpecification, departmentsSpecByKey } from "./departmentDataModel";
import * as DepartmentServices from "@/services/departments";

type DepartmentClient = Record<string, unknown>;

type DepartmentResolverEntry = {
  dashboardComponent?: React.ComponentType;
  serviceClient?: DepartmentClient;
  implementedTabs: string[];
};

const registry: Partial<Record<string, DepartmentResolverEntry>> = {
  financial: {
    dashboardComponent: FinancialDashboard,
    serviceClient: {
      budgets: DepartmentServices.FinancialBudgetsService,
      transactions: DepartmentServices.FinancialTransactionsService,
    },
    implementedTabs: ["overview", "budgets", "transactions", "invoices", "analysis", "settings", "templates", "reports"],
  },
  legal: {
    dashboardComponent: LegalDashboard,
    serviceClient: {
      cases: DepartmentServices.LegalCasesService,
      contracts: DepartmentServices.LegalContractsService,
    },
    implementedTabs: ["overview", "contracts", "compliance", "risks", "licenses", "templates", "reports"],
  },
  hr: {
    dashboardComponent: HRDashboard,
    serviceClient: {
      employees: DepartmentServices.HrEmployeesService,
      attendance: DepartmentServices.HrAttendanceService,
      trainingCourses: DepartmentServices.HrTrainingCoursesService,
      trainingEnrollments: DepartmentServices.HrTrainingEnrollmentsService,
      performanceReviews: DepartmentServices.HrPerformanceReviewsService,
    },
    implementedTabs: ["overview", "workforce", "recruitment", "performance", "payroll", "templates", "reports"],
  },
  crm: {
    dashboardComponent: CRMDashboard,
    serviceClient: {
      customers: DepartmentServices.CrmCustomersService,
      opportunities: DepartmentServices.CrmOpportunitiesService,
      activities: DepartmentServices.CrmActivitiesService,
      serviceTickets: DepartmentServices.CrmServiceTicketsService,
    },
    implementedTabs: ["overview", "customers", "opportunities", "service", "analytics", "templates", "reports"],
  },
  marketing: {
    dashboardComponent: MarketingDashboard,
    serviceClient: {
      campaigns: DepartmentServices.MarketingCampaignsService,
      leads: DepartmentServices.MarketingLeadsService,
    },
    implementedTabs: ["overview", "campaigns", "content", "analytics", "budgets", "pr", "templates", "reports"],
  },
  social: {
    dashboardComponent: CSRDashboard,
    serviceClient: {
      initiatives: DepartmentServices.CsrInitiativesService,
      tickets: DepartmentServices.CsrTicketsService,
    },
    implementedTabs: ["overview", "initiatives", "impact", "stakeholders", "templates", "reports"],
  },
  training: {
    dashboardComponent: TrainingDashboard,
    serviceClient: {
      courses: DepartmentServices.HrTrainingCoursesService,
      enrollments: DepartmentServices.HrTrainingEnrollmentsService,
    },
    implementedTabs: ["overview", "programs", "attendance", "assessments", "templates", "reports"],
  },
  research: {
    dashboardComponent: KMPADashboard,
    serviceClient: { documents: DepartmentServices.KmpaDocumentsService },
    implementedTabs: ["overview", "projects", "publications", "peer-review", "templates", "reports"],
  },
  brand: {
    dashboardComponent: BrandDashboard,
    serviceClient: {
      assets: DepartmentServices.BrandAssetsService,
      guidelines: DepartmentServices.BrandGuidelinesService,
    },
    implementedTabs: ["overview", "assets", "guidelines", "compliance", "templates", "reports"],
  },
};

export const resolveDepartment = (key: string) => {
  const spec = departmentsSpecByKey[key];
  const entry = registry[key];
  if (!spec) {
    console.error("[DepartmentResolver] Missing department specification", { key });
    return null;
  }

  const missingTabs = Object.keys(spec.service.tabEndpoints).filter((tab) => !entry?.implementedTabs.includes(tab));
  if (!entry) {
    console.error("[DepartmentResolver] Missing implementation for department", { key, dashboard: spec.dashboard });
  }
  if (missingTabs.length > 0) {
    console.warn("[DepartmentResolver] Missing tab implementations", { key, missingTabs, expectedTabs: Object.keys(spec.service.tabEndpoints) });
  }

  return {
    key,
    spec,
    dashboardComponent: entry?.dashboardComponent,
    serviceClient: entry?.serviceClient,
    tabEndpoints: spec.service.tabEndpoints,
    implementedTabs: entry?.implementedTabs ?? [],
    missingTabs,
  };
};

export const getDepartmentCoverageReport = () => {
  return departmentsSpecification.map((spec) => {
    const resolved = resolveDepartment(spec.key);
    return {
      key: spec.key,
      dashboard: spec.dashboard,
      specifiedTabsCount: Object.keys(spec.service.tabEndpoints).length,
      implementedTabsCount: resolved?.implementedTabs.length ?? 0,
      missingTabs: resolved?.missingTabs ?? Object.keys(spec.service.tabEndpoints),
      hasDashboardImplementation: Boolean(resolved?.dashboardComponent),
    };
  });
};

