import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { SPACING } from './design-system/constants';

interface UnifiedTabContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export const UnifiedTabContent: React.FC<UnifiedTabContentProps> = ({
  value,
  children,
  className = '',
}) => {
  return (
    <TabsContent 
      value={value} 
      className={`space-y-6 ${SPACING.SECTION_MARGIN} ${className}`}
    >
      {children}
    </TabsContent>
  );
};