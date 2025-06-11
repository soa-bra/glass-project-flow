
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
        background: 'linear-gradient(135deg, #e8f1f9 0%, #f1f1f1 50%, #c8eddf 100%)',
        backdropFilter: 'blur(20px)',
        overflow: 'hidden',
        zIndex: 30
      }}
    >
      <div className="w-full h-full rounded-t-[20px] bg-white/40 backdrop-blur-sm flex flex-col py-0 my-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} dir="rtl" className="w-full h-full px-0 py-0 my-0">
          <TabNavigation tabItems={TAB_ITEMS} activeTab={activeTab} onTabChange={setActiveTab} />
          <TabContentWrapper tabData={tabData} loading={loading} />
        </Tabs>
      </div>
    </div>
  );
};

export default OperationsBoard;
