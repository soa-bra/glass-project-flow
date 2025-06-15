
import React, { useRef, useEffect } from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TabItem } from './types';

interface TabNavigationProps {
  tabItems: TabItem[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

// تم تجميل أزرار التبويبات لتكون زجاجية أكثر وذات ظل خفيف ولون مميز للتبويب النشط
export const TabNavigation: React.FC<TabNavigationProps> = ({
  tabItems,
  activeTab,
  onTabChange
}) => {
  const listRef = useRef<HTMLDivElement>(null);

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
      className="
        w-full overflow-x-auto overflow-y-hidden no-scrollbar px-0 mb-1
      "
      dir="rtl"
      ref={listRef}
      style={{
        WebkitOverflowScrolling: 'touch',
        maxHeight: 'unset',
        height: 'auto'
      }}
    >
      <TabsList
        style={{ direction: "rtl", width: "fit-content" }}
        className="gap-2 justify-start mr-[20px] bg-transparent min-w-max flex-nowrap py-[8px] px-2"
      >
        {tabItems.map(tab => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className={`
              text-base font-arabic rounded-full py-2 px-[38px]
              border-[1.2px] 
              transition-all duration-200
              bg-white/55 shadow backdrop-blur-[8px]
              hover:bg-black/10 hover:text-black/80 hover:shadow-md
              data-[state=active]:bg-black/90 data-[state=active]:text-white
              data-[state=inactive]:text-[#2A3437]
              data-[state=inactive]:border-white/60
              data-[state=active]:shadow-lg
              data-[state=active]:border-black/60
              whitespace-nowrap
              mx-0
            `}
            style={{
              fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
              fontWeight: activeTab === tab.value ? 700 : 500,
              minWidth: 148,
              boxShadow: activeTab === tab.value ? '0 3px 18px 0 rgba(53,90,202,0.15)' : 'none',
              letterSpacing: '-0.5px'
            }}
            onClick={() => onTabChange(tab.value)}
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
