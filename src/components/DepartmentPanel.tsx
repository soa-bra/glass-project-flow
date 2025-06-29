
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useDepartmentsPanel } from '@/contexts/DepartmentsPanelContext';

interface DepartmentPanelProps {
  selectedDepartment: string | null;
  isSidebarCollapsed: boolean;
}

const DepartmentPanel: React.FC<DepartmentPanelProps> = ({
  selectedDepartment,
  isSidebarCollapsed
}) => {
  const { isPanelOpen } = useDepartmentsPanel();

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

  if (!isPanelOpen || !selectedDepartment) {
    return (
      <motion.div 
        initial={false}
        animate={{ 
          width: '0%',
          opacity: 0 
        }}
        transition={{ 
          width: { duration: 0.25, ease: 'circOut' },
          opacity: { duration: 0.15 }
        }}
        className="h-full overflow-hidden"
      />
    );
  }

  const content = getDepartmentContent(selectedDepartment);

  return (
    <motion.div 
      initial={false}
      animate={{ 
        width: '100%',
        opacity: 1 
      }}
      transition={{ 
        width: { duration: 0.3, ease: 'circOut' },
        opacity: { duration: 0.2, delay: 0.1 }
      }}
      style={{
        background: 'var(--backgrounds-project-mgmt-board-bg)'
      }}
      className="h-full rounded-3xl p-6 overflow-hidden bg-[soabra-new-admin-ops-board] bg-slate-400"
    >
      <AnimatePresence mode="wait">
        <motion.div 
          key={selectedDepartment}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="h-full flex flex-col"
        >
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-right text-soabra-text-primary mb-2 font-arabic my-[39px]">
              {content.title}
            </h1>
          </div>

          {/* Tabs */}
          <Tabs defaultValue={content.tabs[0]} className="flex-1 flex flex-col" dir="rtl">
            <TabsList className="grid w-full grid-cols-4 mb-6 bg-white/20 rounded-full p-1">
              {content.tabs.map(tab => (
                <TabsTrigger 
                  key={tab} 
                  value={tab} 
                  className="rounded-full font-arabic text-sm data-[state=active]:bg-black data-[state=active]:text-white"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>

            {content.tabs.map(tab => (
              <TabsContent key={tab} value={tab} className="flex-1 mt-0">
                <div 
                  className="h-full rounded-2xl p-6 operations-board-card" 
                  style={{
                    background: 'var(--backgrounds-cards-admin-ops)'
                  }}
                >
                  <div className="text-center text-gray-600 font-arabic">
                    <h3 className="text-xl font-semibold mb-2">{tab}</h3>
                    <p className="text-base">محتوى تبويب {tab} سيتم تطويره هنا</p>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default DepartmentPanel;
