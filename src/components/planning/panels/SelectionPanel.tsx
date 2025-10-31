import React from "react";
import { Move, RotateCw, Maximize2 } from "lucide-react";

export default function SelectionPanel() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-[hsl(var(--ink))]">أداة التحديد</h3>
      
      <div className="space-y-3">
        <div className="p-3 bg-[hsl(var(--panel))] rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Move className="w-4 h-4" />
            <span className="text-sm font-medium">الموضع</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-[hsl(var(--ink-60))]">X</label>
              <input type="number" className="w-full px-2 py-1 text-sm border border-[hsl(var(--border))] rounded" defaultValue={0} />
            </div>
            <div>
              <label className="text-xs text-[hsl(var(--ink-60))]">Y</label>
              <input type="number" className="w-full px-2 py-1 text-sm border border-[hsl(var(--border))] rounded" defaultValue={0} />
            </div>
          </div>
        </div>

        <div className="p-3 bg-[hsl(var(--panel))] rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Maximize2 className="w-4 h-4" />
            <span className="text-sm font-medium">الحجم</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-[hsl(var(--ink-60))]">العرض</label>
              <input type="number" className="w-full px-2 py-1 text-sm border border-[hsl(var(--border))] rounded" defaultValue={100} />
            </div>
            <div>
              <label className="text-xs text-[hsl(var(--ink-60))]">الارتفاع</label>
              <input type="number" className="w-full px-2 py-1 text-sm border border-[hsl(var(--border))] rounded" defaultValue={100} />
            </div>
          </div>
        </div>

        <div className="p-3 bg-[hsl(var(--panel))] rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <RotateCw className="w-4 h-4" />
            <span className="text-sm font-medium">الدوران</span>
          </div>
          <input type="range" min="0" max="360" className="w-full" defaultValue={0} />
        </div>
      </div>
    </div>
  );
}
