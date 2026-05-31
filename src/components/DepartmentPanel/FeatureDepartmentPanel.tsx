/**
 * FeatureDepartmentPanel
 *
 * Routing policy:
 *  - Existing departments (financial, legal, marketing, hr, crm, csr, training,
 *    kmpa, brand) render their full legacy feature dashboards by default.
 *  - Newly added departments (bcm, partnerships, knowledge) render through
 *    SpecDrivenDepartmentDashboard until full feature implementations land.
 *  - Append `?spec=1` to force the spec-driven view for any department (QA).
 *
 * @specRef Section 6 (Departments) — 12 dashboards / 94 tabs
 */
import React from 'react';
import { SpecDrivenDepartmentDashboard } from './SpecDrivenDepartmentDashboard';
import { FinancialDashboard } from '../DepartmentTabs/Financial';
import { LegalDashboard } from '../DepartmentTabs/Legal';
import { MarketingDashboard } from '../DepartmentTabs/Marketing';
import { HRDashboard } from '../DepartmentTabs/HR';
import { CRMDashboard } from '../DepartmentTabs/CRM';
import { CSRDashboard } from '../DepartmentTabs/CSR';
import { TrainingDashboard } from '../DepartmentTabs/Training';
import { KMPADashboard } from '../DepartmentTabs/KMPA';
import { BrandDashboard } from '../DepartmentTabs/Brand';

interface FeatureDepartmentPanelProps {
  selectedDepartment: string;
}

const FEATURE_DASHBOARDS: Record<string, React.ComponentType> = {
  financial: FinancialDashboard,
  legal: LegalDashboard,
  marketing: MarketingDashboard,
  hr: HRDashboard,
  crm: CRMDashboard,
  csr: CSRDashboard,
  training: TrainingDashboard,
  kmpa: KMPADashboard,
  brand: BrandDashboard,
};

const SPEC_ONLY_DEPARTMENTS = new Set(['bcm', 'partnerships', 'knowledge']);

export const FeatureDepartmentPanel: React.FC<FeatureDepartmentPanelProps> = ({
  selectedDepartment,
}) => {
  const forceSpec =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('spec') === '1';

  if (!forceSpec) {
    const Feature = FEATURE_DASHBOARDS[selectedDepartment];
    if (Feature) return <Feature />;
  }

  if (forceSpec || SPEC_ONLY_DEPARTMENTS.has(selectedDepartment)) {
    return <SpecDrivenDepartmentDashboard dashboardKey={selectedDepartment} />;
  }

  return null;
};
