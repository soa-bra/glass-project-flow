import React from 'react';

export default function SmartPenPanel() {
  return (
    <div className="smart-pen-panel p-4 space-y-3">
      <h4 className="text-sm font-medium">القلم الذكي</h4>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <label className="text-xs">سمك الخط:</label>
          <input type="range" min="1" max="10" defaultValue="2" className="flex-1" />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs">اللون:</label>
          <input type="color" defaultValue="#000000" className="w-8 h-8 rounded" />
        </div>
      </div>
    </div>
  );
}