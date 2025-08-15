
import React, { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { AnimatedTabs } from '@/components/ui/AnimatedTabs';
import { SoaPanel, SoaTypography, SoaReveal } from '@/components/ui';
import { GeneralOverviewTab } from '../DepartmentTabs/GeneralOverviewTab';
import { ReportsTab } from '../DepartmentTabs/ReportsTab';
import { TemplatesTab } from '../DepartmentTabs/TemplatesTab';
import { TrainingDashboard } from '../DepartmentTabs/Training/TrainingDashboard';
import { KMPADashboard } from '../DepartmentTabs/KMPA';
import { BrandDashboard } from '../DepartmentTabs/Brand';

interface GenericDepartmentPanelProps {
  selectedDepartment: string;
}

export const GenericDepartmentPanel: React.FC<GenericDepartmentPanelProps> = ({ 
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
      <SoaPanel className="text-center">
        <SoaTypography variant="title" className="mb-2">{tab}</SoaTypography>
        <SoaTypography variant="body" className="text-soabra-ink-60">محتوى تبويب {tab} سيتم تطويره هنا</SoaTypography>
      </SoaPanel>
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
      <SoaReveal>
        <div className="flex items-center justify-between px-6 py-6 my-6">
          <SoaTypography variant="display-m" className="whitespace-nowrap px-6">
            {content.title}
          </SoaTypography>
          <div className="w-fit">
            <AnimatedTabs 
              tabs={tabItems}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>
        </div>
      </SoaReveal>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 pb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" dir="rtl">
          {content.tabs.map(tab => (
            <TabsContent key={tab} value={tab} className="space-y-6">
              <SoaReveal delay={0.2}>
                {renderTabContent(tab, selectedDepartment)}
              </SoaReveal>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};
