
import React, { useState } from 'react';
import { Tabs } from '@/components/ui/tabs';
import { TAB_ITEMS } from './types';
import { useTabData } from './useTabData';
import { TabNavigation } from './TabNavigation';
import { TabContentWrapper } from './TabContentWrapper';
import { InstantStats } from './InstantStats';
import { QuickActions } from './QuickActions';

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
        background: 'linear-gradient(135deg, #e7fde4 0%, #eafae1 50%, #beedd6 100%)',
        backdropFilter: 'blur(20px)',
        overflow: 'hidden',
        zIndex: 30
      }}
    >
      <div className="w-full h-full rounded-t-[20px] bg-white/40 backdrop-blur-sm flex flex-col mx-0 px-0">
        {/* Header section */}
        <div className="flex justify-between items-start px-6 pt-6 pb-2">
          <div className="flex flex-col items-start gap-y-4">
            <h2 className="font-medium text-[#2A3437] font-arabic text-3xl">
              لوحة الإدارة والتشغيل
            </h2>
            <InstantStats />
          </div>
          <QuickActions />
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} dir="rtl" className="w-full h-full flex flex-col mx-0 px-0 mt-2">
          <TabNavigation tabItems={TAB_ITEMS} activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="flex-1 overflow-hidden my-0 px-0">
            <TabContentWrapper tabData={tabData} loading={loading} />
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default OperationsBoard;
