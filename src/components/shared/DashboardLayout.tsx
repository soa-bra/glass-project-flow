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
    <div className="h-full flex flex-col overflow-hidden" style={{ background: 'var(--sb-column-3-bg)' }}>
      {/* Header — fixed */}
      <div className={`${LAYOUT.FLEX_BETWEEN} my-0 py-[45px] px-6 flex-shrink-0`}>
        <Reveal delay={0}>
          <h2 className={`font-medium ${COLORS.PRIMARY_TEXT} ${TYPOGRAPHY.ARABIC_FONT} text-3xl whitespace-nowrap px-[24px]`}>
            {title}
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="w-fit">
            <AnimatedTabs tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />
          </div>
        </Reveal>
      </div>

      {/* Content — scrollable via ScrollArea */}
      <div className="flex-1 min-h-0 overflow-hidden" style={{ background: 'var(--sb-column-3-bg)' }}>
        <ScrollArea className="h-full w-full">
          <div className="pb-6 px-6">
            <Tabs value={activeTab} onValueChange={onTabChange} className="w-full" dir="rtl">
              {children}
            </Tabs>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
