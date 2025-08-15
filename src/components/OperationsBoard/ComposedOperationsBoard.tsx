import React, { useState } from 'react';
import { Tabs } from '@/components/ui/tabs';
import { TAB_ITEMS } from './types';
import { useTabData } from './useTabData';
import { TabNavigation } from './TabNavigation';
import { TabContentWrapper } from './TabContentWrapper';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
export const ComposedOperationsBoard = ({
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
        background: 'var(--sb-bg-00)',
        overflow: 'hidden',
        zIndex: 30
      }}
    >
      <DashboardLayout
        title="لوحة الإدارة والتشغيل"
        tabs={TAB_ITEMS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        <TabContentWrapper tabData={tabData} loading={loading} />
      </DashboardLayout>
    </div>
  );
};
export default ComposedOperationsBoard;