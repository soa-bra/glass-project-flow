import React from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { AnimatedTabs } from '@/components/ui/AnimatedTabs';
import { SoaTypography, SoaReveal } from '@/components/ui';
import { SPACING, TYPOGRAPHY, COLORS, LAYOUT } from './design-system/constants';

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
    <div className="h-full flex flex-col bg-soabra-surface">
      {/* Header with Title and Tabs */}
      <div className={`${LAYOUT.FLEX_BETWEEN} my-0 py-12 px-6`}>
        <SoaReveal delay={0}>
          <SoaTypography variant="display-m" className="whitespace-nowrap px-6">
            {title}
          </SoaTypography>
        </SoaReveal>
        <SoaReveal delay={0.15}>
          <div className="w-fit">
            <AnimatedTabs tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />
          </div>
        </SoaReveal>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto pb-6 px-6 bg-soabra-surface">
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full" dir="rtl">
          {children}
        </Tabs>
      </div>
    </div>
  );
};