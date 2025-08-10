import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ToolPanelContainerProps {
  title: string;
  children: React.ReactNode;
}

export const ToolPanelContainer: React.FC<ToolPanelContainerProps> = ({ title, children }) => {
  return (
    <Card className="bg-[var(--sb-surface-00)] ring-1 ring-[var(--sb-border)] shadow-[var(--sb-shadow-soft)] rounded-t-[24px] rounded-b-[6px] backdrop-blur-[2px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-arabic font-medium text-[var(--sb-ink)]">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {children}
      </CardContent>
    </Card>
  );
};