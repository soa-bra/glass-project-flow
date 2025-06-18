
import React, { useRef, useEffect } from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TabItem } from './types';

interface TabNavigationProps {
  tabItems: TabItem[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  tabItems,
  activeTab,
  onTabChange
}) => {
  const listRef = useRef<HTMLDivElement>(null);

  // التمرير إلى التبويب النشط
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    
    const active = list.querySelector('[data-state="active"]');
    if (active && (active as HTMLElement).offsetLeft !== undefined) {
      const el = active as HTMLElement;
      list.scrollTo({
        left: el.offsetLeft - list.offsetWidth / 2 + el.offsetWidth / 2,
        behavior: 'smooth'
      });
    }
  }, [activeTab]);

  return (
    <div 
      className="w-full overflow-x-auto overflow-y-hidden no-scrollbar px-0" 
      dir="rtl" 
      ref={listRef} 
      style={{
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}
    >
      <TabsList 
        style={{
          direction: "rtl",
          width: "fit-content"
        }} 
        className="gap-1 justify-start bg-transparent min-w-max flex-nowrap py-0 h-auto"
      >
        {tabItems.map(tab => (
          <TabsTrigger 
            key={tab.value} 
            value={tab.value} 
            className="text-sm font-arabic rounded-full py-2 px-6 transition-all duration-300 data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-700 data-[state=inactive]:border data-[state=inactive]:border-gray-400 hover:bg-gray-100 hover:text-gray-800 whitespace-nowrap data-[state=active]:bg-black"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      
      <style>{`
        .no-scrollbar {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none !important;
        }
      `}</style>
    </div>
  );
};
