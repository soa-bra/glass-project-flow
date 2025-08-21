import React from 'react';

export default function ShapesPanel() {
  return (
    <div className="shapes-panel p-4 space-y-3">
      <h4 className="text-sm font-medium">الأشكال</h4>
      <div className="space-y-2">
        <div className="grid grid-cols-3 gap-2">
          <button className="p-2 border rounded hover:bg-gray-100">□</button>
          <button className="p-2 border rounded hover:bg-gray-100">○</button>
          <button className="p-2 border rounded hover:bg-gray-100">△</button>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs">لون التعبئة:</label>
          <input type="color" defaultValue="#ffffff" className="w-8 h-8 rounded" />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs">لون الحدود:</label>
          <input type="color" defaultValue="#000000" className="w-8 h-8 rounded" />
        </div>
      </div>
    </div>
  );
}