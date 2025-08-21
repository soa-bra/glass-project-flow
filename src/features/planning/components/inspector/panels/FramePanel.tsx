import React from 'react';

export default function FramePanel() {
  return (
    <div className="frame-panel p-4 space-y-3">
      <h4 className="text-sm font-medium">الإطار</h4>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <label className="text-xs">العرض:</label>
          <input type="number" min="100" defaultValue="800" className="flex-1 text-xs p-1 border rounded" />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs">الارتفاع:</label>
          <input type="number" min="100" defaultValue="600" className="flex-1 text-xs p-1 border rounded" />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs">لون الخلفية:</label>
          <input type="color" defaultValue="#ffffff" className="w-8 h-8 rounded" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="showGrid" />
          <label htmlFor="showGrid" className="text-xs">إظهار الشبكة</label>
        </div>
      </div>
    </div>
  );
}