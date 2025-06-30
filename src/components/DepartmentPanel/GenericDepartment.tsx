
import React from 'react';
import { GeneralOverviewTab } from '../DepartmentTabs/GeneralOverviewTab';
import { TemplatesTab } from '../DepartmentTabs/TemplatesTab';
import { ReportsTab } from '../DepartmentTabs/ReportsTab';
import { DepartmentPanelHeader } from './DepartmentPanelHeader';
import { DepartmentContent } from './DepartmentContent';
import { departmentConfig } from './departmentConfig';

interface GenericDepartmentProps {
  selectedDepartment: string;
}

export const GenericDepartment: React.FC<GenericDepartmentProps> = ({ selectedDepartment }) => {
  const content = departmentConfig[selectedDepartment as keyof typeof departmentConfig] || {
    title: 'إدارة غير محددة',
    tabs: ['النظرة العامة', 'النماذج والقوالب', 'التقارير']
  };

  const renderTabContent = (tab: string) => {
    if (tab === 'النظرة العامة') {
      return <GeneralOverviewTab departmentTitle={content.title} />;
    }
    if (tab === 'النماذج والقوالب') {
      return <TemplatesTab departmentTitle={content.title} />;
    }
    if (tab === 'التقارير') {
      return <ReportsTab departmentTitle={content.title} />;
    }
    
    return (
      <div className="text-center text-gray-600 font-arabic p-8">
        <h3 className="text-xl font-semibold mb-2">{tab}</h3>
        <p className="text-base">محتوى تبويب {tab} سيتم تطويره هنا</p>
      </div>
    );
  };

  return (
    <div style={{
      background: 'var(--backgrounds-admin-ops-board-bg)'
    }} className="h-full rounded-3xl overflow-hidden">
      <div className="h-full flex flex-col">
        <DepartmentPanelHeader title={content.title} tabs={content.tabs} />
        <DepartmentContent tabs={content.tabs} renderTabContent={renderTabContent} />
      </div>
    </div>
  );
};
