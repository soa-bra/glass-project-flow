import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { SPACING } from './design-system/constants';
import { Reveal } from './motion';

interface UnifiedTabContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export const BaseTabContent: React.FC<UnifiedTabContentProps> = ({
  value,
  children,
  className = '',
}) => {
  return (
    <TabsContent
      value={value}
      className={cn('mt-0 w-full focus-visible:ring-0', SPACING.SECTION_MARGIN, className)}
    >
      <Reveal delay={0.2}>
        <div className="w-full">{children}</div>
      </Reveal>
    </TabsContent>
  );
};
