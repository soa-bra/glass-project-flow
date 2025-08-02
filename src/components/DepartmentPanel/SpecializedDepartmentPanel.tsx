
import React from 'react';
import { FinancialDashboard } from '../DepartmentTabs/Financial';
import { LegalDashboard } from '../DepartmentTabs/Legal';
import { MarketingDashboard } from '../DepartmentTabs/Marketing';
import { HRDashboard } from '../DepartmentTabs/HR';
import { CRMDashboard } from '../DepartmentTabs/CRM';
import { CSRDashboard } from '../DepartmentTabs/CSR';
import { TrainingDashboard } from '../DepartmentTabs/Training';

interface SpecializedDepartmentPanelProps {
  selectedDepartment: string;
}

export const SpecializedDepartmentPanel: React.FC<SpecializedDepartmentPanelProps> = ({ 
  selectedDepartment 
}) => {
  const renderDepartmentDashboard = () => {
    switch (selectedDepartment) {
      case 'financial':
        return <FinancialDashboard />;
      case 'legal':
        return <LegalDashboard />;
      case 'marketing':
        return <MarketingDashboard />;
      case 'hr':
        return <HRDashboard />;
      case 'crm':
        return <CRMDashboard />;
      case 'social':
        return <CSRDashboard />;
      case 'training':
        return <TrainingDashboard />;
      case 'kmpa':
        return <KMPADashboard />;
      case 'brand':
        return <BrandDashboard />;
      
      default:
        return null;
    }
  };

  return renderDepartmentDashboard();
};
