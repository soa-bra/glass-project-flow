import React from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { AnimatedTabs } from '@/components/ui/AnimatedTabs';
import { SPACING, TYPOGRAPHY, COLORS, LAYOUT } from './design-system/constants';
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
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  title,
  tabs,
  activeTab,
  onTabChange,
  children,
}) => {
  return (
    <div className="h-full flex flex-col bg-transparent">
      {/* Header with Title and Tabs */}
      <div className={`${LAYOUT.FLEX_BETWEEN} my-[24px] py-[17px] px-6`}>
        <Reveal delay={0}>
          <h2 className={`font-medium ${COLORS.PRIMARY_TEXT} ${TYPOGRAPHY.ARABIC_FONT} text-3xl whitespace-nowrap px-[10px]`}>
            {title}
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="w-fit">
            <AnimatedTabs tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />
          </div>
        </Reveal>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto pb-6 px-0 my-[24px]">
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full" dir="rtl">
          {children}
        </Tabs>
      </div>
    </div>
  );
};