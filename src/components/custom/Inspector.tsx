import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';

interface InspectorProps {
  elementId: string | null;
}

export const Inspector: React.FC<InspectorProps> = ({ elementId }) => {
  return (
    <BaseCard variant="operations" className="p-4">
      <div className="text-sm">
        <div className="font-medium mb-3">المفتش</div>
        {elementId ? (
          <div className="space-y-2">
            <div className="text-gray-600">العنصر المحدد: {elementId}</div>
            <div className="space-y-1">
              <div className="text-xs text-gray-500">الخصائص:</div>
              <div className="text-xs text-gray-600">العرض: 100px</div>
              <div className="text-xs text-gray-600">الارتفاع: 100px</div>
            </div>
          </div>
        ) : (
          <div className="text-gray-500">لا يوجد عنصر محدد</div>
        )}
      </div>
    </BaseCard>
  );
};