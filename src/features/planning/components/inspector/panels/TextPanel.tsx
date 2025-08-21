import React from 'react';

export default function TextPanel() {
  return (
    <div className="text-panel p-4 space-y-3">
      <h4 className="text-sm font-medium">النص</h4>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <label className="text-xs">الخط:</label>
          <select className="flex-1 text-xs p-1 border rounded">
            <option>IBM Plex Sans Arabic</option>
            <option>Arial</option>
            <option>Cairo</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs">الحجم:</label>
          <input type="number" min="8" max="72" defaultValue="14" className="flex-1 text-xs p-1 border rounded" />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs">اللون:</label>
          <input type="color" defaultValue="#000000" className="w-8 h-8 rounded" />
        </div>
      </div>
    </div>
  );
}