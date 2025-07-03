import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';

interface ToolPropsBarProps {
  tool: string;
  elementId: string | null;
}

export const ToolPropsBar: React.FC<ToolPropsBarProps> = ({ tool, elementId }) => {
  return (
    <BaseCard variant="operations" className="p-3">
      <div className="text-sm">
        <div className="font-medium mb-2">خصائص الأداة</div>
        <div className="text-gray-600">الأداة: {tool}</div>
        {elementId && <div className="text-gray-600">العنصر: {elementId}</div>}
      </div>
    </BaseCard>
  );
};