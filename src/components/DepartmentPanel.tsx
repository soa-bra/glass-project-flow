
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FinancialOverviewTab, BudgetManagementTab, PaymentsInvoicesTab, FinancialAnalysisTab, FinancialDashboard } from './DepartmentTabs/Financial';
import { GeneralOverviewTab } from './DepartmentTabs/GeneralOverviewTab';
import { ReportsTab } from './DepartmentTabs/ReportsTab';
import { TemplatesTab } from './DepartmentTabs/TemplatesTab';
import { LegalDashboard } from './DepartmentTabs/Legal';
import { MarketingDashboard } from './DepartmentTabs/Marketing';
import { HRDashboard } from './DepartmentTabs/HR';
import { CRMDashboard } from './DepartmentTabs/CRM';

interface DepartmentPanelProps {
  selectedDepartment: string | null;
  isMainSidebarCollapsed: boolean;
  isDepartmentsSidebarCollapsed: boolean;
}

const DepartmentPanel: React.FC<DepartmentPanelProps> = ({
  selectedDepartment,
  isMainSidebarCollapsed,
  isDepartmentsSidebarCollapsed
}) => {
  const [activeTab, setActiveTab] = useState('');

  if (!selectedDepartment) {
    return <div style={{
      background: 'var(--backgrounds-admin-ops-board-bg)'
    }} className="h-full rounded-3xl flex items-center justify-center">
        <div className="text-center text-gray-600 font-arabic">
          <h3 className="text-2xl font-semibold mb-2">اختر إدارة للبدء</h3>
          <p className="text-lg">قم بتحديد إدارة من القائمة الجانبية لعرض المحتوى</p>
        </div>
      </div>;
  }

  // Special handling for financial department
  if (selectedDepartment === 'financial') {
    return <div style={{
      background: 'var(--backgrounds-admin-ops-board-bg)'
    }} className="h-full rounded-3xl overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-auto px-0 mx-0">
            <div className="h-full mx-6 my-6 rounded-2xl overflow-hidden bg-transparent">
              <FinancialDashboard />
            </div>
          </div>
        </div>
      </div>;
  }

  // Special handling for legal department
  if (selectedDepartment === 'legal') {
    return <div style={{
      background: 'var(--backgrounds-admin-ops-board-bg)'
    }} className="h-full rounded-3xl overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-auto px-0 mx-0">
            <div className="h-full mx-6 my-6 rounded-2xl overflow-hidden bg-transparent">
              <LegalDashboard />
            </div>
          </div>
        </div>
      </div>;
  }

  // Special handling for marketing department
  if (selectedDepartment === 'marketing') {
    return <div style={{
      background: 'var(--backgrounds-admin-ops-board-bg)'
    }} className="h-full rounded-3xl overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-auto px-0 mx-0">
            <div className="h-full mx-6 my-6 rounded-2xl overflow-hidden bg-transparent">
              <MarketingDashboard />
            </div>
          </div>
        </div>
      </div>;
  }

  // Special handling for HR department
  if (selectedDepartment === 'hr') {
    return <div style={{
      background: 'var(--backgrounds-admin-ops-board-bg)'
    }} className="h-full rounded-3xl overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-auto px-0 mx-0">
            <div className="h-full mx-6 my-6 rounded-2xl overflow-hidden bg-transparent">
              <HRDashboard />
            </div>
          </div>
        </div>
      </div>;
  }

  // Special handling for CRM department
  if (selectedDepartment === 'crm') {
    return <div style={{
      background: 'var(--backgrounds-admin-ops-board-bg)'
    }} className="h-full rounded-3xl overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-auto px-0 mx-0">
            <div className="h-full mx-6 my-6 rounded-2xl overflow-hidden bg-transparent">
              <CRMDashboard />
            </div>
          </div>
        </div>
      </div>;
  }

  const getDepartmentContent = (department: string) => {
    const departmentData = {
      clients: {
        title: 'إدارة علاقات العملاء',
        tabs: ['النظرة العامة', 'قاعدة العملاء', 'الخدمات', 'الشكاوى', 'الرضا', 'النماذج والقوالب', 'التقارير']
      },
      social: {
        title: 'إدارة المسؤولية الاجتماعية',
        tabs: ['النظرة العامة', 'المبادرات', 'التطوع', 'المجتمع', 'النماذج والقوالب', 'التقارير']
      },
      training: {
        title: 'إدارة التدريب',
        tabs: ['النظرة العامة', 'البرامج', 'المدربين', 'المتدربين', 'التقييم', 'النماذج والقوالب', 'التقارير']
      },
      research: {
        title: 'إدارة المعرفة والنشر والبحث العلمي',
        tabs: ['النظرة العامة', 'الأبحاث', 'المنشورات', 'المعرفة', 'المؤتمرات', 'النماذج والقوالب', 'التقارير']
      },
      brand: {
        title: 'إدارة العلامة التجارية',
        tabs: ['النظرة العامة', 'الهوية', 'التسويق', 'المحتوى', 'الشراكات', 'النماذج والقوالب', 'التقارير']
      }
    };
    return departmentData[department as keyof typeof departmentData] || {
      title: 'إدارة غير محددة',
      tabs: ['النظرة العامة', 'النماذج والقوالب', 'التقارير']
    };
  };

  const content = getDepartmentContent(selectedDepartment);
  
  // Initialize active tab if not set
  if (!activeTab && content.tabs.length > 0) {
    setActiveTab(content.tabs[0]);
  }

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
    
    return <div className="text-center text-gray-600 font-arabic p-8">
        <h3 className="text-xl font-semibold mb-2">{tab}</h3>
        <p className="text-base">محتوى تبويب {tab} سيتم تطويره هنا</p>
      </div>;
  };

  return <div style={{
    background: 'var(--backgrounds-admin-ops-board-bg)'
  }} className="h-full rounded-3xl overflow-hidden">
      <div className="h-full flex flex-col bg-transparent">
        {/* Header with Title and Tabs - matching Legal and Financial dashboards */}
        <div className="flex items-center justify-between px-6 py-[24px] my-[24px]">
          <h2 className="font-medium text-black font-arabic text-3xl whitespace-nowrap px-[24px]">
            {content.title}
          </h2>
          <div className="w-fit">
            <Tabs value={activeTab} onValueChange={setActiveTab} dir="rtl" className="w-full">
              <TabsList className="grid w-full bg-transparent rounded-full p-1" style={{
                gridTemplateColumns: `repeat(${content.tabs.length}, 1fr)`
              }}>
                {content.tabs.map(tab => (
                  <TabsTrigger 
                    key={tab} 
                    value={tab} 
                    className="text-sm font-arabic rounded-full py-2 px-6 transition-all duration-300 data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-700 data-[state=inactive]:border data-[state=inactive]:border-black hover:bg-gray-100 hover:text-gray-800 whitespace-nowrap data-[state=active]:bg-black"
                  >
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
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
    </div>;
};

export default DepartmentPanel;
