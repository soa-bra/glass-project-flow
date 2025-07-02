
import React, { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { AnimatedTabs } from '@/components/ui/AnimatedTabs';
import { GeneralArchiveTab } from '../ArchiveTabs/GeneralArchiveTab';
import { SearchArchiveTab } from '../ArchiveTabs/SearchArchiveTab';
import { StatsArchiveTab } from '../ArchiveTabs/StatsArchiveTab';

interface GenericArchivePanelProps {
  selectedCategory: string;
}

export const GenericArchivePanel: React.FC<GenericArchivePanelProps> = ({ 
  selectedCategory 
}) => {
  const [activeTab, setActiveTab] = useState('');

  const getCategoryContent = (category: string) => {
    const categoryData = {
      videos: {
        title: 'أرشيف الفيديوهات',
        tabs: ['النظرة العامة', 'البحث والفلترة', 'الإحصائيات']
      },
      audio: {
        title: 'أرشيف التسجيلات الصوتية',
        tabs: ['النظرة العامة', 'البحث والفلترة', 'الإحصائيات']
      },
      hr: {
        title: 'أرشيف سجلات الموارد البشرية',
        tabs: ['النظرة العامة', 'البحث والفلترة', 'الإحصائيات']
      },
      reports: {
        title: 'أرشيف التقارير السنوية',
        tabs: ['النظرة العامة', 'البحث والفلترة', 'الإحصائيات']
      },
      departments: {
        title: 'أرشيف الإدارات',
        tabs: ['النظرة العامة', 'البحث والفلترة', 'الإحصائيات']
      },
      'old-systems': {
        title: 'أرشيف الأنظمة القديمة',
        tabs: ['النظرة العامة', 'البحث والفلترة', 'الإحصائيات']
      }
    };
    return categoryData[category as keyof typeof categoryData] || {
      title: 'أرشيف غير محدد',
      tabs: ['النظرة العامة', 'البحث والفلترة', 'الإحصائيات']
    };
  };

  const renderTabContent = (tab: string, category: string) => {
    if (tab === 'النظرة العامة') {
      return <GeneralArchiveTab categoryTitle={content.title} categoryType={category} />;
    }
    if (tab === 'البحث والفلترة') {
      return <SearchArchiveTab categoryTitle={content.title} categoryType={category} />;
    }
    if (tab === 'الإحصائيات') {
      return <StatsArchiveTab categoryTitle={content.title} categoryType={category} />;
    }
    
    return (
      <div className="text-center text-gray-600 font-arabic p-8">
        <h3 className="text-xl font-semibold mb-2">{tab}</h3>
        <p className="text-base">محتوى تبويب {tab} سيتم تطويره هنا</p>
      </div>
    );
  };

  const content = getCategoryContent(selectedCategory);
  
  // Initialize active tab if not set
  if (!activeTab && content.tabs.length > 0) {
    setActiveTab(content.tabs[0]);
  }

  const tabItems = content.tabs.map(tab => ({ value: tab, label: tab }));

  return (
    <div className="h-full flex flex-col bg-transparent">
      {/* Header with Title and Tabs */}
      <div className="flex items-center justify-between px-6 py-[24px] my-[24px]">
        <h2 className="font-medium text-black font-arabic text-3xl whitespace-nowrap px-[24px]">
          {content.title}
        </h2>
        <div className="w-fit">
          <AnimatedTabs 
            tabs={tabItems}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 pb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" dir="rtl">
          {content.tabs.map(tab => (
            <TabsContent key={tab} value={tab} className="space-y-6">
              {renderTabContent(tab, selectedCategory)}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};
