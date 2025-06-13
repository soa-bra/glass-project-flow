
import React, { useState } from 'react';
import { Tabs } from '@/components/ui/tabs';
import { TAB_ITEMS } from './types';
import { useTabData } from './useTabData';
import { TabNavigation } from './TabNavigation';
import { TabContentWrapper } from './TabContentWrapper';

export const OperationsBoard = ({
  isSidebarCollapsed
}: {
  isSidebarCollapsed: boolean;
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const {
    tabData,
    loading
  } = useTabData(activeTab, true);

  return (
    <div 
      className={`fixed transition-all duration-500 ease-in-out ${
        isSidebarCollapsed ? 'operations-board-collapsed' : 'operations-board-expanded'
      }`} 
      style={{
        height: 'calc(100vh - 60px)',
        top: 'var(--sidebar-top-offset)',
        borderRadius: '20px',
        // خلفية داكنة متدرجة تطابق النمط في الصور
        background: 'linear-gradient(135deg, rgba(15,15,20,0.95) 0%, rgba(25,25,35,0.95) 50%, rgba(20,20,30,0.95) 100%)',
        backdropFilter: 'blur(20px)',
        overflow: 'hidden',
        zIndex: 30
      }}
    >
      <div className="w-full h-full rounded-t-[20px] backdrop-blur-sm flex flex-col mx-0 px-0">
        {/* عنوان اللوحة */}
        <div className="text-right px-6 py-[24px] my-[24px]">
          <h2 className="font-medium text-white font-arabic text-3xl">
            لوحة الإدارة والتشغيل
          </h2>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} dir="rtl" className="w-full h-full flex flex-col mx-0 px-0">
          <TabNavigation tabItems={TAB_ITEMS} activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="flex-1 overflow-hidden my-0 px-[10px]">
            <TabContentWrapper tabData={tabData} loading={loading} />
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default OperationsBoard;
