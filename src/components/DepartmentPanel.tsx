
import React, { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { DepartmentPanelStage } from '@/hooks/useDepartmentPanelAnimation';

interface DepartmentPanelProps {
  selectedDepartment: string | null;
  panelStage: DepartmentPanelStage;
  onClose: () => void;
}

const FADE_DURATION = 350;

const DepartmentPanel: React.FC<DepartmentPanelProps> = ({
  selectedDepartment,
  panelStage,
  onClose
}) => {
  // محليًّا لإدارة تبديل تلاشي المحتوى
  const [fadeVisible, setFadeVisible] = useState(true);
  const [renderedDepartment, setRenderedDepartment] = useState<string | null>(selectedDepartment);

  // Crossfade effect when switching departments inside open panel
  useEffect(() => {
    // Only fade if crossfade requested and new department is different
    if (panelStage === "changing-content" && renderedDepartment && selectedDepartment && renderedDepartment !== selectedDepartment) {
      setFadeVisible(false);
      // After fade out
      const timer = setTimeout(() => {
        setRenderedDepartment(selectedDepartment);
        setFadeVisible(true);
      }, FADE_DURATION);
      return () => clearTimeout(timer);
    } else if (selectedDepartment && (!renderedDepartment || renderedDepartment !== selectedDepartment)) {
      setRenderedDepartment(selectedDepartment);
      setFadeVisible(true);
    }
  }, [selectedDepartment, panelStage, renderedDepartment]);

  // When fully closed, don't render panel at all unless animating out
  if (!selectedDepartment && !renderedDepartment) return null;

  if (!renderedDepartment) {
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

  const content = getDepartmentContent(renderedDepartment);
  const showFull = panelStage === "open" || panelStage === "sliding-in" || panelStage === "changing-content";

  return (
    <div 
      style={{
        background: 'var(--backgrounds-project-mgmt-board-bg)',
        opacity: showFull && fadeVisible ? 1 : 0,
        transition: 'opacity 0.3s ease'
      }} 
      className="h-full rounded-3xl p-6 overflow-hidden bg-slate-400 relative"
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-right text-soabra-text-primary mb-2 font-arabic my-[39px]">
              {content.title}
            </h1>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition-colors"
            >
              <span className="text-lg font-bold">×</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue={content.tabs[0]} className="flex-1 flex flex-col" dir="rtl">
          <TabsList className="grid w-full grid-cols-4 mb-6 bg-white/20 rounded-full p-1">
            {content.tabs.map(tab => (
              <TabsTrigger key={tab} value={tab} className="rounded-full font-arabic text-sm data-[state=active]:bg-black data-[state=active]:text-white">
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          {content.tabs.map(tab => (
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
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default DepartmentPanel;
