
import React from 'react';
import { TAB_ITEMS } from './types';

const tabClass = (active: boolean) =>
  `font-arabic rounded-full px-7 py-2.5 text-base transition-all 
   ${active ? 'bg-black text-white shadow-sm' : 'bg-white/0 border border-gray-300 text-black'} 
   font-semibold`;

interface OperationsBoardHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const OperationsBoardHeader: React.FC<OperationsBoardHeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="w-full px-8 pt-8 pb-2 flex items-center justify-between">
      <div>
        <h2 className="text-[2rem] md:text-[2.1rem] font-black tracking-tight m-0 pb-1 font-arabic"
          style={{
            color: '#181b29',
            fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif'
          }}>لوحة الإدارة والتشغيل</h2>
      </div>
      {/* أزرار التبويبات */}
      <div className="flex gap-2.5 mt-1 mb-1">
        {TAB_ITEMS.map(tab =>
          <button
            type="button"
            key={tab.value}
            className={tabClass(activeTab === tab.value)}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </button>
        )}
      </div>
    </div>
  );
};
