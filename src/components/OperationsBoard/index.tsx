
import React, { useState, useMemo } from 'react';
import { Tabs } from '@/components/ui/tabs';
import { TAB_ITEMS } from './types';
import { useTabData } from './useTabData';
import { TabNavigation } from './TabNavigation';
import { TabContentWrapper } from './TabContentWrapper';

interface OperationsBoardProps {
  isSidebarCollapsed: boolean;
}

const OperationsBoard: React.FC<OperationsBoardProps> = ({ isSidebarCollapsed }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const { tabData, loading } = useTabData(activeTab, true);

  const boardClasses = useMemo(() => 
    `fixed transition-all duration-500 ease-in-out ${
      isSidebarCollapsed ? 'operations-board-collapsed' : 'operations-board-expanded'
    }`, 
    [isSidebarCollapsed]
  );

  const boardStyles = useMemo(() => ({
    height: 'calc(100vh - 60px)',
    top: 'var(--sidebar-top-offset)',
    borderRadius: '20px',
    background: 'linear-gradient(135deg, #e7fde4 0%, #eafae1 50%, #beedd6 100%)',
    backdropFilter: 'blur(20px)',
    overflow: 'hidden' as const,
    zIndex: 30
  }), []);

  return (
    <div className={boardClasses} style={boardStyles}>
      <div className="w-full h-full rounded-t-[20px] bg-white/40 backdrop-blur-sm flex flex-col mx-0 px-0">
        <div className="text-right px-6 py-[24px] my-[24px]">
          <h2 className="font-medium text-[#2A3437] font-arabic text-3xl">
            لوحة الإدارة والتشغيل
          </h2>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} dir="rtl" className="w-full h-full flex flex-col mx-0 px-0">
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

export { OperationsBoard };
export default OperationsBoard;
