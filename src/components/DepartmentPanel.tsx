
import React from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface DepartmentPanelProps {
  selectedDepartment: string | null;
  isSidebarCollapsed: boolean;
}

const DepartmentPanel: React.FC<DepartmentPanelProps> = ({
  selectedDepartment,
  isSidebarCollapsed
}) => {
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

  if (!selectedDepartment) return null;

  const content = getDepartmentContent(selectedDepartment);

  // متغيرات الحركة
  const variants = {
    open: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: 'circOut' }
    },
    closed: {
      x: '100%',
      opacity: 0,
      transition: { duration: 0.25, ease: 'circIn' }
    }
  };

  return (
    <motion.section
      className="absolute inset-0 p-6 rounded-3xl overflow-hidden"
      style={{ background: 'var(--backgrounds-project-mgmt-board-bg)' }}
      variants={variants}
      initial={false}
      animate={isSidebarCollapsed ? 'closed' : 'open'}
    >
      <div className="h-full flex flex-col font-arabic">
        <h1 className="text-3xl font-bold text-right text-soabra-text-primary my-[39px]">
          {content.title}
        </h1>

        <Tabs defaultValue={content.tabs[0]} className="flex-1 flex flex-col" dir="rtl">
          <TabsList className="grid w-full grid-cols-4 mb-6 bg-white/20 rounded-full p-1">
            {content.tabs.map(tab => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="rounded-full text-sm data-[state=active]:bg-black data-[state=active]:text-white"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          {content.tabs.map(tab => (
            <TabsContent key={tab} value={tab} className="flex-1 mt-0">
              <div
                className="h-full rounded-2xl p-6 operations-board-card"
                style={{ background: 'var(--backgrounds-cards-admin-ops)' }}
              >
                <div className="text-center text-gray-600 font-arabic">
                  <h3 className="text-xl font-semibold mb-2">{tab}</h3>
                  <p className="text-base">محتوى تبويب {tab} سيتم تطويره هنا</p>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </motion.section>
  );
};

export default DepartmentPanel;
