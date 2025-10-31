import React from "react";
import { Type, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from "lucide-react";

export default function TextPanel() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-[hsl(var(--ink))]">أداة النص</h3>
      
      <div className="space-y-3">
        <div className="p-3 bg-[hsl(var(--panel))] rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Type className="w-4 h-4" />
            <span className="text-sm font-medium">الخط</span>
          </div>
          <select className="w-full px-2 py-1 text-sm border border-[hsl(var(--border))] rounded">
            <option>IBM Plex Sans Arabic</option>
            <option>Arial</option>
            <option>Times New Roman</option>
          </select>
        </div>

        <div className="p-3 bg-[hsl(var(--panel))] rounded-lg">
          <span className="text-sm font-medium mb-2 block">حجم الخط</span>
          <input type="number" className="w-full px-2 py-1 text-sm border border-[hsl(var(--border))] rounded" defaultValue={16} />
        </div>

        <div className="p-3 bg-[hsl(var(--panel))] rounded-lg">
          <span className="text-sm font-medium mb-2 block">التنسيق</span>
          <div className="flex gap-1">
            <button className="p-2 hover:bg-white rounded">
              <Bold className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-white rounded">
              <Italic className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-white rounded">
              <Underline className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-3 bg-[hsl(var(--panel))] rounded-lg">
          <span className="text-sm font-medium mb-2 block">المحاذاة</span>
          <div className="flex gap-1">
            <button className="p-2 hover:bg-white rounded">
              <AlignRight className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-white rounded">
              <AlignCenter className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-white rounded">
              <AlignLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
