
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface DepartmentPanelProps {
  selectedDepartment: string | null;
  isSidebarCollapsed: boolean;
}

const DepartmentPanel: React.FC<DepartmentPanelProps> = ({ selectedDepartment, isSidebarCollapsed }) => {
  if (!selectedDepartment) {
    return (
      <div 
        className="h-full rounded-3xl flex items-center justify-center"
        style={{ background: 'var(--backgrounds-admin-ops-board-bg)' }}
      >
        <div className="text-center text-gray-600 font-arabic">
          <div className="text-6xl mb-4">🏢</div>
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
      className="h-full rounded-3xl p-6 overflow-hidden"
      style={{ background: 'var(--backgrounds-project-mgmt-board-bg)' }}
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-right text-soabra-text-primary mb-2 font-arabic">
            {content.title}
          </h1>
          <div className="h-1 bg-gradient-to-l from-blue-500 to-purple-500 rounded-full w-32 mr-auto"></div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue={content.tabs[0]} className="flex-1 flex flex-col" dir="rtl">
          <TabsList className="grid w-full grid-cols-4 mb-6 bg-white/20 rounded-full p-1">
            {content.tabs.map((tab) => (
              <TabsTrigger 
                key={tab} 
                value={tab}
                className="rounded-full font-arabic text-sm data-[state=active]:bg-black data-[state=active]:text-white"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          {content.tabs.map((tab) => (
            <TabsContent key={tab} value={tab} className="flex-1 mt-0">
              <div 
                className="h-full rounded-2xl p-6 operations-board-card"
                style={{ background: 'var(--backgrounds-cards-admin-ops)' }}
              >
                <div className="text-center text-gray-600 font-arabic">
                  <div className="text-4xl mb-4">📊</div>
                  <h3 className="text-xl font-semibold mb-2">{tab}</h3>
                  <p className="text-base">محتوى تبويب {tab} سيتم تطويره هنا</p>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default DepartmentPanel;
