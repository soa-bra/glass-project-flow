import React from 'react';
import { Tabs } from '@/components/ui/tabs';
import { AnimatedTabs } from '@/components/ui/AnimatedTabs';
import { TYPOGRAPHY, COLORS, LAYOUT } from './design-system/constants';
import { Reveal } from './motion';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TabItem {
  value: string;
  label: string;
}

interface DashboardLayoutProps {
  title: string;
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  title,
  tabs,
  activeTab,
  onTabChange,
  children,
}) => {
  return (
    <div className="flex h-full flex-col overflow-hidden" style={{ background: 'var(--sb-column-3-bg)' }}>
      <div dir="rtl" className={`${LAYOUT.FLEX_BETWEEN} my-0 flex-shrink-0 px-6 py-[45px]`}>
        <Reveal delay={0}>
          <h2 className={`font-medium ${COLORS.PRIMARY_TEXT} ${TYPOGRAPHY.ARABIC_FONT} whitespace-nowrap px-[24px] text-3xl`}>
            {title}
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="w-fit">
            <AnimatedTabs tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />
          </div>
        </Reveal>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden" style={{ background: 'var(--sb-column-3-bg)' }}>
        <ScrollArea className="h-full w-full">
          <div className="px-6 pb-6">
            <Tabs value={activeTab} onValueChange={onTabChange} className="w-full" dir="rtl">
              {children}
            </Tabs>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
