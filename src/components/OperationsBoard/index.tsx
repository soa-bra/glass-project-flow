
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
      className={`fixed transition-all duration-500 ease-in-out ${isSidebarCollapsed ? 'operations-board-collapsed' : 'operations-board-expanded'} glass-enhanced`}
      style={{
        height: 'calc(100vh - 60px)',
        top: 'var(--sidebar-top-offset)',
        borderRadius: '24px',
        boxShadow: '0 10px 38px 0 rgba(53,90,202,0.09), 0 2px 16px 0 rgba(53,90,202,.04)',
        background: 'linear-gradient(135deg, #e7fde4 0%, #eafae1 50%, #beedd6 100%)',
        backdropFilter: 'blur(20px) saturate(130%)',
        WebkitBackdropFilter: 'blur(20px) saturate(130%)',
        overflow: 'hidden',
        zIndex: 30
      }}
    >
      <div className="w-full h-full rounded-t-[24px] glass-enhanced bg-white/40 backdrop-blur-md flex flex-col mx-0 px-0 transition-all transition-shadow font-arabic">
        {/* عنوان اللوحة */}
        <div className="text-right px-8 py-4 my-2 sticky top-0 bg-white/15 z-10 rounded-t-[22px] shadow-md" style={{
          fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
          backdropFilter: 'blur(14px) saturate(110%)',
          borderBottom: '1.5px solid rgba(0,0,0,0.02)'
        }}>
          <h2 className="font-bold text-[#143729] text-[2.1rem] drop-shadow-sm tracking-tight leading-tight"
            style={{textShadow: '0 2px 6px rgba(70,130,130,0.08)'}}
          >
            لوحة الإدارة والتشغيل
          </h2>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} dir="rtl" className="w-full h-full flex flex-col mx-0 px-0">
          <TabNavigation tabItems={TAB_ITEMS} activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="flex-1 overflow-y-auto my-0 px-0">
            <TabContentWrapper tabData={tabData} loading={loading} />
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default OperationsBoard;

