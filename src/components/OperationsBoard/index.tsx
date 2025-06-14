
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
      className={`fixed transition-all duration-500 ease-in-out shadow-lg
        ${isSidebarCollapsed ? 'operations-board-collapsed' : 'operations-board-expanded'}
        glass-enhanced`}
      style={{
        height: 'calc(100vh - 60px)',
        top: 'var(--sidebar-top-offset)',
        borderRadius: '28px',
        background: 'rgba(255,255,255,0.35)',
        backdropFilter: 'blur(20px) saturate(180%)',
        overflow: 'hidden',
        zIndex: 30,
        border: '1px solid rgba(255,255,255,0.16)'
      }}
    >
      <div className="w-full h-full rounded-t-[28px] bg-white/40 backdrop-blur-sm flex flex-col mx-0 px-0">
        {/* عنوان اللوحة */}
        <div className="text-right px-6 py-[20px] mb-[10px]">
          <h2 className="font-bold text-[#284155] font-arabic text-3xl tracking-tight">
            لوحة الإدارة والتشغيل
          </h2>
        </div>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          dir="rtl"
          className="w-full h-full flex flex-col mx-0 px-0"
        >
          <TabNavigation
            tabItems={TAB_ITEMS}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          <div className="flex-1 overflow-hidden my-0 px-0">
            <TabContentWrapper tabData={tabData} loading={loading} />
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default OperationsBoard;
