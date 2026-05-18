
import React from 'react';
import { FinancialDashboard } from '../DepartmentTabs/Financial';
import { LegalDashboard } from '../DepartmentTabs/Legal';
import { MarketingDashboard } from '../DepartmentTabs/Marketing';
import { HRDashboard } from '../DepartmentTabs/HR';
import { CRMDashboard } from '../DepartmentTabs/CRM';
import { CSRDashboard } from '../DepartmentTabs/CSR';
import { TrainingDashboard } from '../DepartmentTabs/Training';
import { KMPADashboard } from '../DepartmentTabs/KMPA';
import { BrandDashboard } from '../DepartmentTabs/Brand';
import { SpecDrivenDepartmentDashboard } from './SpecDrivenDepartmentDashboard';

interface FeatureDepartmentPanelProps {
  selectedDepartment: string;
}

export const FeatureDepartmentPanel: React.FC<FeatureDepartmentPanelProps> = ({
  selectedDepartment 
}) => {
  switch (selectedDepartment) {
    case 'financial':    return <FinancialDashboard />;
    case 'legal':        return <LegalDashboard />;
    case 'marketing':    return <MarketingDashboard />;
    case 'hr':           return <HRDashboard />;
    case 'crm':          return <CRMDashboard />;
    case 'csr':          return <CSRDashboard />;
    case 'training':     return <TrainingDashboard />;
    case 'kmpa':         return <KMPADashboard />;
    case 'brand':        return <BrandDashboard />;
    // New spec-driven departments (BCM, Partnerships, Knowledge) — rendered from APP_SPEC
    case 'bcm':
    case 'partnerships':
    case 'knowledge':
      return <SpecDrivenDepartmentDashboard dashboardKey={selectedDepartment} />;
    default:
      return null;
  }
};
