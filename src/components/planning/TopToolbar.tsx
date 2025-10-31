import React, { useState } from "react";
import { Undo, Redo, History, Share2, Layers, Settings, File, ChevronDown } from "lucide-react";

export default function TopToolbar() {
  const [boardName, setBoardName] = useState("لوحة تخطيط جديدة");
  const [isEditingName, setIsEditingName] = useState(false);

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
      <div className="bg-white/90 backdrop-blur-md border border-[hsl(var(--border))] rounded-2xl px-4 py-2 shadow-lg flex items-center gap-2">
        {/* Undo/Redo */}
        <div className="flex items-center gap-1 border-l border-[hsl(var(--border))] pl-2">
          <button
            className="p-2 hover:bg-[hsl(var(--panel))] rounded-lg transition-colors"
            title="تراجع (Ctrl+Z)"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            className="p-2 hover:bg-[hsl(var(--panel))] rounded-lg transition-colors"
            title="إعادة (Ctrl+Y)"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>

        {/* History */}
        <button
          className="p-2 hover:bg-[hsl(var(--panel))] rounded-lg transition-colors"
          title="سجل العمليات"
        >
          <History className="w-4 h-4" />
        </button>

        {/* Board Name */}
        <div className="border-r border-[hsl(var(--border))] pr-2">
          {isEditingName ? (
            <input
              type="text"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              onBlur={() => setIsEditingName(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
              className="px-2 py-1 text-sm font-medium bg-transparent border-b border-[hsl(var(--accent-green))] focus:outline-none"
              autoFocus
            />
          ) : (
            <button
              onClick={() => setIsEditingName(true)}
              className="px-2 py-1 text-sm font-medium hover:bg-[hsl(var(--panel))] rounded"
            >
              {boardName}
            </button>
          )}
        </div>

        {/* Share */}
        <button
          className="flex items-center gap-2 px-3 py-2 hover:bg-[hsl(var(--panel))] rounded-lg transition-colors"
        >
          <Share2 className="w-4 h-4" />
          <span className="text-sm">مشاركة</span>
        </button>

        {/* Layers */}
        <button
          className="flex items-center gap-2 px-3 py-2 hover:bg-[hsl(var(--panel))] rounded-lg transition-colors"
        >
          <Layers className="w-4 h-4" />
          <span className="text-sm">الطبقات</span>
        </button>

        {/* Canvas Properties */}
        <button
          className="flex items-center gap-2 px-3 py-2 hover:bg-[hsl(var(--panel))] rounded-lg transition-colors"
        >
          <Settings className="w-4 h-4" />
          <span className="text-sm">خصائص</span>
        </button>

        {/* File Menu */}
        <button
          className="flex items-center gap-2 px-3 py-2 hover:bg-[hsl(var(--panel))] rounded-lg transition-colors"
        >
          <File className="w-4 h-4" />
          <span className="text-sm">ملف</span>
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
