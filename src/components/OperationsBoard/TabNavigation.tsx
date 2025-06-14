
import React, { useRef, useEffect } from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TabItem } from './types';

interface TabNavigationProps {
  tabItems: TabItem[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

// تعطيل التمرير الرأسي نهائيًا + إخفاء الشريط البصري بشكل كامل، والسماح بالتمرير الأفقي فقط بدون الـScrollbar
export const TabNavigation: React.FC<TabNavigationProps> = ({
  tabItems,
  activeTab,
  onTabChange
}) => {
  const listRef = useRef<HTMLDivElement>(null);

  // Scroll to the active tab (عند الحاجة مستقبلاً لتجربة وأفضلية)
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    // العثور على العنصر النشط
    const active = list.querySelector('[data-state="active"]');
    if (active && (active as HTMLElement).offsetLeft !== undefined) {
      const el = active as HTMLElement;
      // تأكد أن العنصر النشط يظهر في المنتصف تقريباً إذا خرج عن الرؤية
      list.scrollTo({
        left: el.offsetLeft - list.offsetWidth / 2 + el.offsetWidth / 2,
        behavior: 'smooth'
      });
    }
  }, [activeTab]);
  
  return (
    <div
      className="
        w-full
        overflow-x-auto
        overflow-y-hidden
        no-scrollbar
        px-0
      "
      dir="rtl"
      ref={listRef}
      style={{
        WebkitOverflowScrolling: 'touch',
        marginBottom: 2,
        // غلق صريح للتمرير الرأسي
        maxHeight: 'unset',
        height: 'auto'
      }}
    >
      <TabsList 
        className="
          gap-1 justify-start mr-[20px] bg-transparent
          min-w-max flex-nowrap
        "
        style={{
          direction: "rtl",
          width: "fit-content"
        }}
      >
        {tabItems.map(tab => (
          <TabsTrigger 
            key={tab.value} 
            value={tab.value} 
            className="text-sm font-arabic rounded-full py-3 transition-all duration-300 data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-700 data-[state=inactive]:border data-[state=inactive]:border-gray-400 hover:bg-gray-100 hover:text-gray-800 whitespace-nowrap px-[30px] data-[state=active]:bg-black"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <style>{`
        /* تعطيل السحب الرأسي وإخفاء أي شريط تمرير للقائمة داخل التبويبات */
        .no-scrollbar {
          scrollbar-width: none !important; /* Firefox */
          -ms-overflow-style: none !important; /* IE و Edge */
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none !important; /* Chrome و Safari */
        }
      `}</style>
    </div>
  );
};
