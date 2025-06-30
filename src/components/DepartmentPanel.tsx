import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FinancialOverviewTab, BudgetManagementTab, PaymentsInvoicesTab, FinancialAnalysisTab, FinancialDashboard } from './DepartmentTabs/Financial';
import { GeneralOverviewTab } from './DepartmentTabs/GeneralOverviewTab';
import { ReportsTab } from './DepartmentTabs/ReportsTab';
import { TemplatesTab } from './DepartmentTabs/TemplatesTab';

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
          {/* Content - Financial Dashboard */}
          <div className="flex-1 overflow-auto px-0 mx-0">
            <div className="h-full mx-6 my-6 rounded-2xl overflow-hidden bg-transparent">
              <FinancialDashboard />
            </div>
          </div>
        </div>
      </div>;
  }

  const getDepartmentContent = (department: string) => {
    const departmentData = {
      legal: {
        title: 'إدارة الأحوال القانونية',
        tabs: ['النظرة العامة', 'العقود', 'القضايا', 'الاستشارات', 'التراخيص', 'النماذج والقوالب', 'التقارير']
      },
      marketing: {
        title: 'إدارة الأنشطة التسويقية',
        tabs: ['النظرة العامة', 'الحملات', 'التحليلات', 'المحتوى', 'العلاقات العامة', 'النماذج والقوالب', 'التقارير']
      },
      projects: {
        title: 'إدارة المشاريع',
        tabs: ['النظرة العامة', 'المشاريع النشطة', 'التخطيط', 'الموارد', 'النماذج والقوالب', 'التقارير']
      },
      hr: {
        title: 'إدارة الطاقات البشرية',
        tabs: ['النظرة العامة', 'الموظفين', 'التوظيف', 'التدريب', 'الأداء', 'النماذج والقوالب', 'التقارير']
      },
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
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-[24px] my-[24px]">
          <h2 className="font-medium text-black font-arabic text-3xl whitespace-nowrap px-[24px]">
            {content.title}
          </h2>
          <div className="w-fit">
            <Tabs defaultValue={content.tabs[0]} dir="rtl" className="w-full">
              <TabsList className="grid w-full bg-transparent rounded-full p-1" style={{
              gridTemplateColumns: `repeat(${content.tabs.length}, 1fr)`
            }}>
                {content.tabs.map(tab => <TabsTrigger key={tab} value={tab} className="text-sm font-arabic rounded-full py-2 px-6 transition-all duration-300 data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-700 data-[state=inactive]:border data-[state=inactive]:border-black hover:bg-gray-100 hover:text-gray-800 whitespace-nowrap data-[state=active]:bg-black">
                    {tab}
                  </TabsTrigger>)}
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Content - بخلفية شفافة */}
        <Tabs defaultValue={content.tabs[0]} className="flex-1 flex flex-col px-0 mx-0" dir="rtl">
          <div className="px-0 my-0">
            {content.tabs.map(tab => <TabsContent key={tab} value={tab} className="flex-1 mt-0 overflow-auto px-0 mx-0">
                <div className="h-full mx-6 mb-6 rounded-2xl overflow-hidden bg-transparent">
                  {renderTabContent(tab, selectedDepartment)}
                </div>
              </TabsContent>)}
          </div>
        </Tabs>
      </div>
    </div>;
};

export default DepartmentPanel;
