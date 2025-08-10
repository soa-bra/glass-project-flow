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
  return <div className={`fixed transition-all duration-500 ease-in-out ${isSidebarCollapsed ? 'operations-board-collapsed' : 'operations-board-expanded'}`} style={{
    height: 'calc(100vh - 60px)',
    top: 'var(--sidebar-top-offset)',
    borderRadius: '20px',
    background: 'var(--sb-bg-00)',
    overflow: 'hidden',
    zIndex: 30
  }}>
      <div className="mx-0 px-0 py-0 my-0">
        {/* رأس اللوحة مع العنوان والتبويبات */}
        <div className="flex items-center justify-between px-6 my-0 py-[45px]">
          <h2 className="font-medium text-black font-arabic text-3xl whitespace-nowrap px-[24px]">
            لوحة الإدارة والتشغيل
          </h2>
          <div className="w-fit">
            <Tabs value={activeTab} onValueChange={setActiveTab} dir="rtl" className="w-full">
              <TabNavigation tabItems={TAB_ITEMS} activeTab={activeTab} onTabChange={setActiveTab} />
            </Tabs>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} dir="rtl" className=" mx-0 px-0">
          <div className=" px-0 my-0">
            <TabContentWrapper tabData={tabData} loading={loading} />
          </div>
        </Tabs>
      </div>
    </div>;
};
export default OperationsBoard;