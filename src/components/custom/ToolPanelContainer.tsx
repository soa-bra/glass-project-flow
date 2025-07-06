import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ToolPanelContainerProps {
  title: string;
  children: React.ReactNode;
}

export const ToolPanelContainer: React.FC<ToolPanelContainerProps> = ({ title, children }) => {
  return (
    <Card className="bg-white/95 backdrop-blur-md shadow-sm border border-gray-300 rounded-[20px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-arabic font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {children}
      </CardContent>
    </Card>
  );
};