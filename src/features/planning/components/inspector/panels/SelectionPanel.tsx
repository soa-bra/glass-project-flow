import React from 'react';

export default function SelectionPanel() {
  return (
    <div className="selection-panel p-4 space-y-3">
      <h4 className="text-sm font-medium">التحديد</h4>
      <div className="text-xs text-muted-foreground">
        لا يوجد عنصر محدد
      </div>
    </div>
  );
}