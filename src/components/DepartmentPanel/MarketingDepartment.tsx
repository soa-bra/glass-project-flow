
import React from 'react';
import { MarketingOverviewTab, CampaignsChannelsTab, ContentAssetsTab, PerformanceAnalyticsTab, BudgetsTab } from '../DepartmentTabs/Marketing';
import { TemplatesTab } from '../DepartmentTabs/TemplatesTab';
import { ReportsTab } from '../DepartmentTabs/ReportsTab';
import { DepartmentPanelHeader } from './DepartmentPanelHeader';
import { DepartmentContent } from './DepartmentContent';
import { marketingTabs } from './departmentConfig';

export const MarketingDepartment: React.FC = () => {
  const renderMarketingTabContent = (tab: string) => {
    switch (tab) {
      case 'النظرة العامة':
        return <MarketingOverviewTab />;
      case 'الحملات والقنوات':
        return <CampaignsChannelsTab />;
      case 'المحتوى والأصول':
        return <ContentAssetsTab />;
      case 'الأداء والتحليلات':
        return <PerformanceAnalyticsTab />;
      case 'الميزانيات':
        return <BudgetsTab />;
      case 'النماذج والقوالب':
        return <TemplatesTab departmentTitle="إدارة الأنشطة التسويقية" />;
      case 'التقارير':
        return <ReportsTab departmentTitle="إدارة الأنشطة التسويقية" />;
      default:
        return (
          <div className="text-center text-gray-600 font-arabic p-8">
            <h3 className="text-xl font-semibold mb-2">{tab}</h3>
            <p className="text-base">محتوى تبويب {tab} سيتم تطويره هنا</p>
          </div>
        );
    }
  };

  return (
    <div style={{
      background: 'var(--backgrounds-admin-ops-board-bg)'
    }} className="h-full rounded-3xl overflow-hidden">
      <div className="h-full flex flex-col">
        <DepartmentPanelHeader title="إدارة الأنشطة التسويقية" tabs={marketingTabs} />
        <DepartmentContent tabs={marketingTabs} renderTabContent={renderMarketingTabContent} />
      </div>
    </div>
  );
};
