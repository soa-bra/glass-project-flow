import React from 'react';

interface SelectionPanelInfoProps {
  selectedElementsCount: number;
}

export const SelectionPanelInfo: React.FC<SelectionPanelInfoProps> = ({
  selectedElementsCount
}) => {
  const hasSelection = selectedElementsCount > 0;

  return (
    <div className="bg-[#e9eff4] p-3 rounded-[16px]">
      <div className="text-sm font-arabic text-black">
        {hasSelection 
          ? `تم تحديد ${selectedElementsCount} عنصر` 
          : 'لم يتم تحديد أي عنصر'
        }
      </div>
      {hasSelection && (
        <div className="text-xs text-black/70 mt-1">
          اختر من الأدوات أدناه للتحكم في العناصر المحددة
        </div>
      )}
    </div>
  );
};