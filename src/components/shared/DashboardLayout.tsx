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
    <div className="sb-surface-panel flex h-full min-h-0 flex-col overflow-hidden">
      <div
        dir="rtl"
        data-dashboard-slot="header"
        className={`${LAYOUT.FLEX_BETWEEN} z-20 my-0 flex-shrink-0 px-6 py-[45px]`}
      >
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

      <div data-dashboard-slot="scroll-content" className="min-h-0 flex-1 overflow-hidden">
        <ScrollArea className="h-full w-full">
          {contentSlot ?? (
            <Tabs
              value={activeTab}
              onValueChange={onTabChange}
              className="flex min-h-0 w-full flex-col px-6 pb-6"
              dir="rtl"
            >
              {children}
            </Tabs>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};
