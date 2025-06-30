
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FinancialOverviewTab, BudgetManagementTab, PaymentsInvoicesTab, FinancialAnalysisTab } from './DepartmentTabs/Financial';

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
    }} className="h-full rounded-3xl flex items-center justify-center bg-slate-400">
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
        tabs: ['العقود', 'القضايا', 'الاستشارات', 'التراخيص']
      },
      marketing: {
        title: 'إدارة الأنشطة التسويقية',
        tabs: ['الحملات', 'التحليلات', 'المحتوى', 'العلاقات العامة']
      },
      projects: {
        title: 'إدارة المشاريع',
        tabs: ['المشاريع النشطة', 'التخطيط', 'الموارد', 'التقارير']
      },
      hr: {
        title: 'إدارة الطاقات البشرية',
        tabs: ['الموظفين', 'التوظيف', 'التدريب', 'الأداء']
      },
      clients: {
        title: 'إدارة علاقات العملاء',
        tabs: ['قاعدة العملاء', 'الخدمات', 'الشكاوى', 'الرضا']
      },
      social: {
        title: 'إدارة المسؤولية الاجتماعية',
        tabs: ['المبادرات', 'التطوع', 'المجتمع', 'التقارير']
      },
      training: {
        title: 'إدارة التدريب',
        tabs: ['البرامج', 'المدربين', 'المتدربين', 'التقييم']
      },
      research: {
        title: 'إدارة المعرفة والنشر والبحث العلمي',
        tabs: ['الأبحاث', 'المنشورات', 'المعرفة', 'المؤتمرات']
      },
      brand: {
        title: 'إدارة العلامة التجارية',
        tabs: ['الهوية', 'التسويق', 'المحتوى', 'الشراكات']
      }
    };

    return departmentData[department as keyof typeof departmentData] || {
      title: 'إدارة غير محددة',
      tabs: ['عام']
    };
  };

  const content = getDepartmentContent(selectedDepartment);

  const renderTabContent = (tab: string, department: string) => {
    if (department === 'financial') {
      switch (tab) {
        case 'النظرة العامة':
          return <FinancialOverviewTab />;
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
    background: 'var(--backgrounds-project-mgmt-board-bg)'
  }} className="h-full rounded-3xl overflow-hidden bg-slate-400">
      <div className="h-full flex flex-col">
        {/* Header with Title and Tabs */}
        <div className="p-6 pb-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl text-right text-soabra-text-primary font-arabic font-medium">
              {content.title}
            </h1>
            
            {/* Tab Navigation */}
            <div className="w-full overflow-x-auto overflow-y-hidden no-scrollbar px-0" dir="rtl">
              <Tabs defaultValue={content.tabs[0]} className="flex-1 flex flex-col" dir="rtl">
                <TabsList 
                  style={{
                    direction: "rtl",
                    width: "fit-content"
                  }} 
                  className="gap-1 justify-end bg-transparent min-w-max flex-nowrap py-0 h-auto mb-6"
                >
                  {content.tabs.map(tab => 
                    <TabsTrigger 
                      key={tab} 
                      value={tab} 
                      className="text-sm font-arabic rounded-full py-2 px-6 transition-all duration-300 data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-700 data-[state=inactive]:border data-[state=inactive]:border-black hover:bg-gray-100 hover:text-gray-800 whitespace-nowrap data-[state=active]:bg-black"
                    >
                      {tab}
                    </TabsTrigger>
                  )}
                </TabsList>

                {content.tabs.map(tab => 
                  <TabsContent key={tab} value={tab} className="flex-1 mt-0 overflow-auto">
                    <div className="h-full rounded-2xl operations-board-card" style={{
                      background: 'var(--backgrounds-cards-admin-ops)'
                    }}>
                      {renderTabContent(tab, selectedDepartment)}
                    </div>
                  </TabsContent>
                )}
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .no-scrollbar {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none !important;
        }
      `}</style>
    </div>;
};

export default DepartmentPanel;
