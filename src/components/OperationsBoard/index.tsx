
import React, { useState } from 'react';
import { Tabs } from '@/components/ui/tabs';
import { TAB_ITEMS } from './types';
import { useTabData } from './useTabData';
import { TabNavigation } from './TabNavigation';
import { TabContentWrapper } from './TabContentWrapper';
import { X } from 'lucide-react';

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
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)',
        backdropFilter: 'blur(20px)',
        overflow: 'hidden',
        zIndex: 30
      }}
    >
      <div className="w-full h-full rounded-t-[20px] bg-white/40 backdrop-blur-sm flex flex-col mx-0 px-0">
        {/* رأس اللوحة مع زر الإغلاق */}
        <div className="flex items-center justify-between px-6 py-[24px] my-[24px]">
          <h2 className="font-medium text-[#2A3437] font-arabic text-3xl">
            لوحة إدارة المشروع
          </h2>
          <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} dir="rtl" className="w-full h-full flex flex-col mx-0 px-0">
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
