
import React from 'react';
import { X } from 'lucide-react';
import { Tabs } from '@/components/ui/tabs';
import { FinancialDepartmentTabs } from './FinancialDepartmentTabs';
import { LegalDepartmentTabs } from './LegalDepartmentTabs';
import { MarketingDepartmentTabs } from './MarketingDepartmentTabs';
import { ProjectsDepartmentTabs } from './ProjectsDepartmentTabs';
import { HRDepartmentTabs } from './HRDepartmentTabs';
import { ClientsDepartmentTabs } from './ClientsDepartmentTabs';
import { SocialDepartmentTabs } from './SocialDepartmentTabs';
import { TrainingDepartmentTabs } from './TrainingDepartmentTabs';
import { KnowledgeDepartmentTabs } from './KnowledgeDepartmentTabs';
import { BrandDepartmentTabs } from './BrandDepartmentTabs';

const DEPARTMENT_TITLES = {
  financial: 'إدارة الأوضاع المالية',
  legal: 'إدارة الأحوال القانونية',
  marketing: 'إدارة الأنشطة التسويقية',
  projects: 'إدارة المشاريع',
  hr: 'إدارة الطاقات البشرية',
  clients: 'إدارة علاقات العملاء',
  social: 'إدارة المسؤولية الاجتماعية',
  training: 'إدارة التدريب',
  knowledge: 'إدارة المعرفة والنشر والبحث العلمي',
  brand: 'إدارة العلامة التجارية'
};

interface DepartmentPanelProps {
  departmentId: string;
  onClose: () => void;
  isSidebarCollapsed: boolean;
}

export const DepartmentPanel: React.FC<DepartmentPanelProps> = ({
  departmentId,
  onClose,
  isSidebarCollapsed
}) => {
  const title = DEPARTMENT_TITLES[departmentId as keyof typeof DEPARTMENT_TITLES];

  const renderDepartmentContent = () => {
    switch (departmentId) {
      case 'financial':
        return <FinancialDepartmentTabs />;
      case 'legal':
        return <LegalDepartmentTabs />;
      case 'marketing':
        return <MarketingDepartmentTabs />;
      case 'projects':
        return <ProjectsDepartmentTabs />;
      case 'hr':
        return <HRDepartmentTabs />;
      case 'clients':
        return <ClientsDepartmentTabs />;
      case 'social':
        return <SocialDepartmentTabs />;
      case 'training':
        return <TrainingDepartmentTabs />;
      case 'knowledge':
        return <KnowledgeDepartmentTabs />;
      case 'brand':
        return <BrandDepartmentTabs />;
      default:
        return <div className="p-6 text-center">المحتوى قيد التطوير...</div>;
    }
  };

  return (
    <div 
      className={`fixed transition-all duration-500 ease-in-out ${isSidebarCollapsed ? 'department-panel-collapsed' : 'department-panel-expanded'}`}
      style={{
        height: 'calc(100vh - 60px)',
        top: 'var(--sidebar-top-offset)',
        borderRadius: '20px',
        background: 'rgba(255, 255, 255, 0.4)',
        backdropFilter: 'blur(20px)',
        overflow: 'hidden',
        zIndex: 25
      }}
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-white/20">
          <h2 className="font-medium text-black font-arabic text-2xl">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-300/50 hover:border-gray-400/60 hover:bg-white/20 hover:shadow-lg transition-all duration-300"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {renderDepartmentContent()}
        </div>
      </div>
    </div>
  );
};
