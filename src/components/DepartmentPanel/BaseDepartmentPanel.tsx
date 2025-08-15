
import React, { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { AnimatedTabs } from '@/components/ui/AnimatedTabs';
import { GeneralOverviewTab } from '../DepartmentTabs/GeneralOverviewTab';
import { ReportsTab } from '../DepartmentTabs/ReportsTab';
import { TemplatesTab } from '../DepartmentTabs/TemplatesTab';
import { TrainingDashboard } from '../DepartmentTabs/Training/TrainingDashboard';
import { KMPADashboard } from '../DepartmentTabs/KMPA';
import { BrandDashboard } from '../DepartmentTabs/Brand';

interface BaseDepartmentPanelProps {
  selectedDepartment: string;
}

export const BaseDepartmentPanel: React.FC<BaseDepartmentPanelProps> = ({
  selectedDepartment 
}) => {
  const [activeTab, setActiveTab] = useState('');

  // Check if this is a specialized department
  if (selectedDepartment === 'training') {
    return <TrainingDashboard />;
  }
  
  if (selectedDepartment === 'research') {
    return <KMPADashboard />;
  }

  if (selectedDepartment === 'brand') {
    return <BrandDashboard />;
  }

  const getDepartmentContent = (department: string) => {
    const departmentData = {
      clients: {
        title: 'إدارة علاقات العملاء',
        tabs: ['النظرة العامة', 'قاعدة العملاء', 'الخدمات', 'الشكاوى', 'الرضا', 'النماذج والقوالب', 'التقارير']
      },
      social: {
        title: 'إدارة المسؤولية الاجتماعية',
        tabs: ['النظرة العامة', 'المبادرات', 'الشراكات والموارد', 'المراقبة والتقييم', 'قصص الأثر', 'النماذج والقوالب', 'التقارير']
      }
    };
    return departmentData[department as keyof typeof departmentData] || {
      title: 'إدارة غير محددة',
      tabs: ['النظرة العامة', 'النماذج والقوالب', 'التقارير']
    };
  };

  const renderTabContent = (tab: string, department: string) => {
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

  const content = getDepartmentContent(selectedDepartment);
  
  // Initialize active tab if not set
  if (!activeTab && content.tabs.length > 0) {
    setActiveTab(content.tabs[0]);
  }

  const tabItems = content.tabs.map(tab => ({ value: tab, label: tab }));

  return (
    <div className="h-full flex flex-col bg-transparent">
      {/* Header with Title and Tabs */}
      <div className="flex items-center justify-between px-6 py-[24px] my-[24px]">
        <h2 className="font-medium text-black font-arabic text-3xl whitespace-nowrap px-[24px]">
          {content.title}
        </h2>
        <div className="w-fit">
          <AnimatedTabs 
            tabs={tabItems}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 pb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" dir="rtl">
          {content.tabs.map(tab => (
            <TabsContent key={tab} value={tab} className="space-y-6">
              {renderTabContent(tab, selectedDepartment)}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};
