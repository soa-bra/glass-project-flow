import React from 'react';
interface SelectionPanelInfoProps {
  selectedElementsCount: number;
}
export const SelectionPanelInfo: React.FC<SelectionPanelInfoProps> = ({
  selectedElementsCount
}) => {
  const hasSelection = selectedElementsCount > 0;
  return (
    <div className="bg-muted border border-border rounded-lg p-3">
      <div className="text-sm font-arabic">
        {hasSelection ? (
          <span>تم تحديد <strong>{selectedElementsCount}</strong> عنصر</span>
        ) : (
          <span className="text-muted-foreground">لا توجد عناصر محددة</span>
        )}
      </div>
    </div>
  );
};