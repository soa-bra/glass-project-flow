
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
      className={`fixed transition-all duration-500 ease-in-out ${isSidebarCollapsed ? 'operations-board-collapsed' : 'operations-board-expanded'}`} 
      style={{
        height: 'calc(100vh - 60px)',
        top: 'var(--sidebar-top-offset)',
        borderRadius: '20px',
        background: 'linear-gradient(135deg, #e8f1f9 0%, #f1f1f1 50%, #c8eddf 100%)',
        backdropFilter: 'blur(20px)',
        overflow: 'hidden',
        zIndex: 30
      }}
    >
      <div className="w-full h-full rounded-t-[20px] bg-white/40 backdrop-blur-sm flex flex-col">
        {/* عنوان اللوحة */}
        <div className="text-right px-6 pt-6 pb-2">
          <h1 className="text-3xl font-arabic font-medium text-gray-800">
            لوحة الإدارة والتشغيل
          </h1>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} dir="rtl" className="w-full h-full flex flex-col">
          <TabNavigation tabItems={TAB_ITEMS} activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="flex-1 overflow-hidden">
            <TabContentWrapper tabData={tabData} loading={loading} />
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default OperationsBoard;
