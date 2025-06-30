
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FinancialOverviewTab, BudgetManagementTab, PaymentsInvoicesTab, FinancialAnalysisTab } from './DepartmentTabs/Financial';
import { GeneralOverviewTab } from './DepartmentTabs/GeneralOverviewTab';

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

  const getDepartmentContent = (department: string) => {
    const departmentData = {
      financial: {
        title: 'إدارة الأوضاع المالية',
        tabs: ['النظرة العامة', 'إدارة الميزانيات', 'المدفوعات والفواتير', 'التحليل المالي']
      },
      legal: {
        title: 'إدارة الأحوال القانونية',
        tabs: ['النظرة العامة', 'العقود', 'القضايا', 'الاستشارات', 'التراخيص']
      },
      marketing: {
        title: 'إدارة الأنشطة التسويقية',
        tabs: ['النظرة العامة', 'الحملات', 'التحليلات', 'المحتوى', 'العلاقات العامة']
      },
      projects: {
        title: 'إدارة المشاريع',
        tabs: ['النظرة العامة', 'المشاريع النشطة', 'التخطيط', 'الموارد', 'التقارير']
      },
      hr: {
        title: 'إدارة الطاقات البشرية',
        tabs: ['النظرة العامة', 'الموظفين', 'التوظيف', 'التدريب', 'الأداء']
      },
      clients: {
        title: 'إدارة علاقات العملاء',
        tabs: ['النظرة العامة', 'قاعدة العملاء', 'الخدمات', 'الشكاوى', 'الرضا']
      },
      social: {
        title: 'إدارة المسؤولية الاجتماعية',
        tabs: ['النظرة العامة', 'المبادرات', 'التطوع', 'المجتمع', 'التقارير']
      },
      training: {
        title: 'إدارة التدريب',
        tabs: ['النظرة العامة', 'البرامج', 'المدربين', 'المتدربين', 'التقييم']
      },
      research: {
        title: 'إدارة المعرفة والنشر والبحث العلمي',
        tabs: ['النظرة العامة', 'الأبحاث', 'المنشورات', 'المعرفة', 'المؤتمرات']
      },
      brand: {
        title: 'إدارة العلامة التجارية',
        tabs: ['النظرة العامة', 'الهوية', 'التسويق', 'المحتوى', 'الشراكات']
      }
    };

    return departmentData[department as keyof typeof departmentData] || {
      title: 'إدارة غير محددة',
      tabs: ['النظرة العامة', 'عام']
    };
  };

  const content = getDepartmentContent(selectedDepartment);

  const renderTabContent = (tab: string, department: string) => {
    // تبويب النظرة العامة لجميع الإدارات
    if (tab === 'النظرة العامة') {
      return <GeneralOverviewTab departmentTitle={content.title} />;
    }

    // محتوى خاص بالإدارة المالية
    if (department === 'financial') {
      switch (tab) {
        case 'إدارة الميزانيات':
          return <BudgetManagementTab />;
        case 'المدفوعات والفواتير':
          return <PaymentsInvoicesTab />;
        case 'التحليل المالي':
          return <FinancialAnalysisTab />;
        default:
          return <div className="text-center text-gray-600 font-arabic p-8">
              <h3 className="text-xl font-semibold mb-2">{tab}</h3>
              <p className="text-base">محتوى تبويب {tab} سيتم تطويره هنا</p>
            </div>;
      }
    }

    // محتوى افتراضي للإدارات الأخرى
    return <div className="text-center text-gray-600 font-arabic p-8">
        <h3 className="text-xl font-semibold mb-2">{tab}</h3>
        <p className="text-base">محتوى تبويب {tab} سيتم تطويره هنا</p>
      </div>;
  };

  return <div style={{
    background: 'var(--backgrounds-admin-ops-board-bg)'
  }} className="h-full rounded-3xl overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Header - متماشي مع تصميم لوحة الإدارة والتشغيل */}
        <div className="flex items-center justify-between px-6 py-[24px] my-[24px]">
          <h2 className="font-medium text-black font-arabic text-3xl whitespace-nowrap px-[24px]">
            {content.title}
          </h2>
          <div className="w-fit">
            <Tabs defaultValue={content.tabs[0]} dir="rtl" className="w-full">
              <TabsList className="grid w-full bg-white/20 rounded-full p-1" style={{
              gridTemplateColumns: `repeat(${content.tabs.length}, 1fr)`
            }}>
                {content.tabs.map(tab => <TabsTrigger key={tab} value={tab} className="rounded-full font-arabic text-sm whitespace-nowrap px-4 data-[state=active]:bg-black data-[state=active]:text-white">
                    {tab}
                  </TabsTrigger>)}
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Content - متماشي مع تصميم باقي اللوحات */}
        <Tabs defaultValue={content.tabs[0]} className="flex-1 flex flex-col px-0 mx-0" dir="rtl">
          <div className="px-0 my-0">
            {content.tabs.map(tab => <TabsContent key={tab} value={tab} className="flex-1 mt-0 overflow-auto px-0 mx-0">
                <div style={{
              background: 'var(--backgrounds-cards-admin-ops)'
            }} className="h-full mx-6 mb-6 rounded-2xl overflow-hidden bg-transparent">
                  {renderTabContent(tab, selectedDepartment)}
                </div>
              </TabsContent>)}
          </div>
        </Tabs>
      </div>
    </div>;
};

export default DepartmentPanel;
