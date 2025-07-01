
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { GeneralOverviewTab } from '../DepartmentTabs/GeneralOverviewTab';
import { ReportsTab } from '../DepartmentTabs/ReportsTab';
import { TemplatesTab } from '../DepartmentTabs/TemplatesTab';

interface GenericDepartmentPanelProps {
  selectedDepartment: string;
}

export const GenericDepartmentPanel: React.FC<GenericDepartmentPanelProps> = ({ 
  selectedDepartment 
}) => {
  const [activeTab, setActiveTab] = useState('');

  const getDepartmentContent = (department: string) => {
    const departmentData = {
      clients: {
        title: 'إدارة علاقات العملاء',
        tabs: ['النظرة العامة', 'قاعدة العملاء', 'الخدمات', 'الشكاوى', 'الرضا', 'النماذج والقوالب', 'التقارير']
      },
      social: {
        title: 'إدارة المسؤولية الاجتماعية',
        tabs: ['النظرة العامة', 'المبادرات', 'الشراكات والموارد', 'المراقبة والتقييم', 'قصص الأثر', 'النماذج والقوالب', 'التقارير']
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
      <div className="text-center text-gray-600 font-arabic p-8">
        <h3 className="text-xl font-semibold mb-2">{tab}</h3>
        <p className="text-base">محتوى تبويب {tab} سيتم تطويره هنا</p>
      </div>
    );
  };

  const content = getDepartmentContent(selectedDepartment);
  
  // Initialize active tab if not set
  if (!activeTab && content.tabs.length > 0) {
    setActiveTab(content.tabs[0]);
  }

  return (
    <div className="h-full flex flex-col bg-transparent">
      {/* Header with Title and Tabs */}
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
  );
};
