import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
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
      className={`space-y-6 ${SPACING.SECTION_MARGIN} ${className}`}
    >
      <Reveal delay={0.2}>
        {children}
      </Reveal>
    </TabsContent>
  );
};