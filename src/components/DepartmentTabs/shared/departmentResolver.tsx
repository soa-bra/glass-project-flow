import React from 'react';
import { FinancialDashboard } from '@/components/DepartmentTabs/Financial';
import { LegalDashboard } from '@/components/DepartmentTabs/Legal';
import { MarketingDashboard } from '@/components/DepartmentTabs/Marketing';
import { HRDashboard } from '@/components/DepartmentTabs/HR';
import { CRMDashboard } from '@/components/DepartmentTabs/CRM';
import { CSRDashboard } from '@/components/DepartmentTabs/CSR';
import { TrainingDashboard } from '@/components/DepartmentTabs/Training';
import { KMPADashboard } from '@/components/DepartmentTabs/KMPA';
import { BrandDashboard } from '@/components/DepartmentTabs/Brand';
import * as DepartmentServices from '@/services/departments';
import { departmentsSpecification, departmentsSpecByKey } from './departmentDataModel';

export type DepartmentKey = keyof typeof departmentsSpecByKey;

interface DepartmentResolverEntry {
  dashboardComponent?: React.ComponentType;
  serviceClient?: unknown;
  implementedTabs: string[];
}

const resolverMap: Record<string, DepartmentResolverEntry> = {
  financial: {
    dashboardComponent: FinancialDashboard,
    serviceClient: DepartmentServices.FinancialBudgetsService,
    implementedTabs: ['overview', 'budgets', 'transactions', 'invoices', 'analysis', 'settings', 'templates', 'reports']
  },
  legal: {
    dashboardComponent: LegalDashboard,
    serviceClient: DepartmentServices.LegalCasesService,
    implementedTabs: ['overview', 'contracts', 'compliance', 'risks', 'licenses', 'templates', 'reports']
  },
  hr: {
    dashboardComponent: HRDashboard,
    serviceClient: DepartmentServices.HrEmployeesService,
    implementedTabs: ['overview', 'employees', 'attendance', 'performance', 'recruitment', 'training', 'partners', 'templates', 'reports']
  },
  crm: {
    dashboardComponent: CRMDashboard,
    serviceClient: DepartmentServices.CrmCustomersService,
    implementedTabs: ['overview', 'customers', 'opportunities', 'service', 'analytics', 'templates', 'reports']
  },
  marketing: {
    dashboardComponent: MarketingDashboard,
    serviceClient: DepartmentServices.MarketingCampaignsService,
    implementedTabs: ['overview', 'campaigns', 'content', 'performance', 'budgets', 'pr', 'templates', 'reports']
  },
  partnerships: {
    implementedTabs: []
  },
  social: {
    dashboardComponent: CSRDashboard,
    serviceClient: DepartmentServices.CsrInitiativesService,
    implementedTabs: ['overview', 'initiatives', 'partnerships', 'monitoring', 'stories', 'templates', 'reports']
  },
  training: {
    dashboardComponent: TrainingDashboard,
    serviceClient: DepartmentServices.HrTrainingCoursesService,
    implementedTabs: ['overview', 'courses', 'lms', 'scheduling', 'certifications', 'analytics', 'corporate', 'partnerships', 'templates', 'reports']
  },
  research: {
    dashboardComponent: KMPADashboard,
    serviceClient: DepartmentServices.KmpaDocumentsService,
    implementedTabs: ['overview', 'repository', 'authoring', 'analytics', 'templates', 'reports']
  },
  knowledge: {
    implementedTabs: []
  },
  brand: {
    dashboardComponent: BrandDashboard,
    serviceClient: DepartmentServices.BrandAssetsService,
    implementedTabs: ['overview', 'identity', 'assets', 'content', 'research', 'events', 'templates', 'reports']
  },
  'brand-community': {
    implementedTabs: []
  }
};

export const resolveDepartment = (key: string) => {
  const specification = departmentsSpecByKey[key];
  const implementation = resolverMap[key];

  if (!specification) {
    console.error(`[Departments] Unknown department key: ${key}`);
    return null;
  }

  if (!implementation) {
    console.error(`[Departments] Missing resolver implementation for key: ${key}`);
  }

  return {
    specification,
    dashboardComponent: implementation?.dashboardComponent,
    serviceClient: implementation?.serviceClient,
    tabEndpoints: specification.service.tabEndpoints,
    implementedTabs: implementation?.implementedTabs ?? []
  };
};

export const getDepartmentCoverageReport = () =>
  departmentsSpecification.map((spec) => {
    const resolved = resolveDepartment(spec.key);
    const specifiedTabs = Object.keys(spec.service.tabEndpoints);
    const implementedTabs = resolved?.implementedTabs ?? [];
    const implementedSet = new Set(implementedTabs);

    const missingTabs = specifiedTabs.filter((tab) => !implementedSet.has(tab));

    return {
      key: spec.key,
      specifiedTabs: specifiedTabs.length,
      implementedTabs: implementedTabs.length,
      missingTabs
    };
  });


export const logDepartmentImplementationGaps = (key: string) => {
  const resolved = resolveDepartment(key);
  if (!resolved) return;

  const specifiedTabs = Object.keys(resolved.tabEndpoints);
  const implementedTabs = new Set(resolved.implementedTabs);
  const missingTabs = specifiedTabs.filter((tab) => !implementedTabs.has(tab));

  if (missingTabs.length > 0) {
    console.error(
      `[Departments] Missing tab implementations for ${key}: ${missingTabs.join(', ')}`
    );
  }
};
