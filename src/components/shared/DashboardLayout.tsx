import React from 'react';
import { Tabs } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AnimatedTabs } from '@/components/ui/AnimatedTabs';
import { TYPOGRAPHY, COLORS, LAYOUT } from './design-system/constants';
import { Reveal } from './motion';

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
  headerSlot?: React.ReactNode;
  contentSlot?: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  title,
  tabs,
  activeTab,
  onTabChange,
  children,
  headerSlot,
  contentSlot,
}) => {
  return (
    <div className="flex h-full min-h-0 flex-col" style={{ background: 'var(--sb-column-3-bg)' }}>
      <div dir="rtl" className={`${LAYOUT.FLEX_BETWEEN} sticky top-0 z-20 my-0 flex-shrink-0 px-6 py-[45px]`} style={{ background: 'var(--sb-column-3-bg)' }}>
        <Reveal delay={0}>
          <h2 className={`whitespace-nowrap px-[24px] text-3xl font-medium ${COLORS.PRIMARY_TEXT} ${TYPOGRAPHY.ARABIC_FONT}`}>
            {title}
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="w-fit">
            {headerSlot ?? <AnimatedTabs tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />}
          </div>
        </Reveal>
      </div>

      <Tabs value={activeTab} onValueChange={onTabChange} className="flex min-h-0 flex-1 flex-col overflow-auto px-6 pb-6" dir="rtl">
        {children}
      </Tabs>
    </div>
  );
};
