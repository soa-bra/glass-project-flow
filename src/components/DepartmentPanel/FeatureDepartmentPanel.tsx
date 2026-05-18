/**
 * FeatureDepartmentPanel
 *
 * P4 — All 12 departments are now rendered through SpecDrivenDepartmentDashboard
 * (driven by APP_SPEC). Legacy feature dashboards remain importable for fallback
 * via the `?legacy=1` query param while data wiring (slotProps) lands per dept.
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

const LEGACY: Record<string, React.ComponentType> = {
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

const SPEC_DEPARTMENTS = new Set([
  'financial', 'legal', 'marketing', 'hr', 'crm', 'brand',
  'csr', 'kmpa', 'training', 'bcm', 'partnerships', 'knowledge',
]);

export const FeatureDepartmentPanel: React.FC<FeatureDepartmentPanelProps> = ({
  selectedDepartment,
}) => {
  if (!SPEC_DEPARTMENTS.has(selectedDepartment)) return null;

  // Legacy fallback for QA: append `?legacy=1` to compare with previous dashboards.
  const useLegacy =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('legacy') === '1' &&
    LEGACY[selectedDepartment];

  if (useLegacy) {
    const Legacy = LEGACY[selectedDepartment];
    return <Legacy />;
  }

  return <SpecDrivenDepartmentDashboard dashboardKey={selectedDepartment} />;
};
