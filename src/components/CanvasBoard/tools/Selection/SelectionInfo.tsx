import React from 'react';
import { MousePointer } from 'lucide-react';

interface SelectionInfoProps {
  selectedElementsCount: number;
}

export const SelectionInfo: React.FC<SelectionInfoProps> = ({ selectedElementsCount }) => {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-2">
        <MousePointer className="w-4 h-4" />
        <span className="text-sm font-medium font-arabic">العناصر المحددة</span>
      </div>
      <div className="text-sm font-arabic">
        {selectedElementsCount > 0 ? (
          <span>تم تحديد <strong>{selectedElementsCount}</strong> عنصر</span>
        ) : (
          <span className="text-gray-500">لا توجد عناصر محددة</span>
        )}
      </div>
    </div>
  );
};