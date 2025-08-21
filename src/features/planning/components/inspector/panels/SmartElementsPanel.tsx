import React from 'react';

export default function SmartElementsPanel() {
  return (
    <div className="smart-elements-panel p-4 space-y-3">
      <h4 className="text-sm font-medium">العناصر الذكية</h4>
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <button className="p-2 border rounded text-xs hover:bg-gray-100">مخطط</button>
          <button className="p-2 border rounded text-xs hover:bg-gray-100">جدول</button>
          <button className="p-2 border rounded text-xs hover:bg-gray-100">قائمة</button>
          <button className="p-2 border rounded text-xs hover:bg-gray-100">رابط</button>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs">النمط:</label>
          <select className="flex-1 text-xs p-1 border rounded">
            <option>افتراضي</option>
            <option>حديث</option>
            <option>كلاسيكي</option>
          </select>
        </div>
      </div>
    </div>
  );
}