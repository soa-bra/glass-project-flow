import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface DepartmentPanelProps {
  selectedDepartment: string | null;
  isSidebarCollapsed: boolean;
  isDepartmentsSidebarCollapsed: boolean;
}

const DepartmentPanel: React.FC<DepartmentPanelProps> = ({
  selectedDepartment,
  isSidebarCollapsed,
  isDepartmentsSidebarCollapsed
}) => {
  // Calculate width based on both sidebars' states
  const getPanelWidth = () => {
    const mainSidebarWidth = isSidebarCollapsed ? 'var(--sidebar-width-collapsed)' : 'var(--sidebar-width-expanded)';
    const deptSidebarWidth = isDepartmentsSidebarCollapsed ? 'var(--departments-sidebar-width-collapsed)' : 'var(--departments-sidebar-width-expanded)';
    return `calc(100vw - ${mainSidebarWidth} - ${deptSidebarWidth} - 40px)`;
  };

  const getPanelLeft = () => {
    const mainSidebarWidth = isSidebarCollapsed ? 'var(--sidebar-width-collapsed)' : 'var(--sidebar-width-expanded)';
    const deptSidebarWidth = isDepartmentsSidebarCollapsed ? 'var(--departments-sidebar-width-collapsed)' : 'var(--departments-sidebar-width-expanded)';
    return `calc(${mainSidebarWidth} + ${deptSidebarWidth} + 20px)`;
  };

  if (!selectedDepartment) {
    return (
      <div 
        style={{
          background: 'var(--backgrounds-admin-ops-board-bg)',
          width: getPanelWidth(),
          left: getPanelLeft(),
          transition: 'width var(--animation-duration-main) var(--animation-easing)'
        }} 
        className="h-full rounded-3xl flex items-center justify-center bg-slate-400 absolute"
      >
        <div className="text-center text-gray-600 font-arabic">
          <h3 className="text-2xl font-semibold mb-2">اختر إدارة للبدء</h3>
          <p className="text-lg">قم بتحديد إدارة من القائمة الجانبية لعرض المحتوى</p>
        </div>
      </div>
    );
  }

  const getDepartmentContent = (department: string) => {
    const departmentData = {
      financial: {
        title: 'إدارة الأوضاع المالية',
        tabs: ['الميزانية', 'التقارير المالية', 'التدفق النقدي', 'الاستثمارات']
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

  return (
    <div 
      style={{
        background: 'var(--backgrounds-project-mgmt-board-bg)',
        width: getPanelWidth(),
        left: getPanelLeft(),
        transition: 'width var(--animation-duration-main) var(--animation-easing)'
      }} 
      className="h-full rounded-3xl p-6 overflow-hidden bg-[soabra-new-admin-ops-board] bg-slate-400 absolute"
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-right text-soabra-text-primary mb-2 font-arabic my-[39px]">
            {content.title}
          </h1>
        </div>

        {/* Tabs */}
        <Tabs defaultValue={content.tabs[0]} className="flex-1 flex flex-col" dir="rtl">
          <TabsList className="grid w-full grid-cols-4 mb-6 bg-white/20 rounded-full p-1">
            {content.tabs.map(tab => 
              <TabsTrigger key={tab} value={tab} className="rounded-full font-arabic text-sm data-[state=active]:bg-black data-[state=active]:text-white">
                {tab}
              </TabsTrigger>
            )}
          </TabsList>

          {content.tabs.map(tab => 
            <TabsContent key={tab} value={tab} className="flex-1 mt-0">
              <div className="h-full rounded-2xl p-6 operations-board-card" style={{
                background: 'var(--backgrounds-cards-admin-ops)'
              }}>
                <div className="text-center text-gray-600 font-arabic">
                  <h3 className="text-xl font-semibold mb-2">{tab}</h3>
                  <p className="text-base">محتوى تبويب {tab} سيتم تطويره هنا</p>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default DepartmentPanel;
