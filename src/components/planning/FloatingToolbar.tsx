import React from "react";
import { 
  Palette, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  Sparkles,
  Copy,
  Trash2
} from "lucide-react";

interface FloatingToolbarProps {
  selectedElements: string[];
}

export default function FloatingToolbar({ selectedElements }: FloatingToolbarProps) {
  if (selectedElements.length === 0) return null;

  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30">
      <div className="bg-white/90 backdrop-blur-md border border-[hsl(var(--border))] rounded-2xl p-2 shadow-lg flex items-center gap-1">
        {/* Color Picker */}
        <button
          className="p-2 hover:bg-[hsl(var(--panel))] rounded-lg transition-colors"
          title="الألوان"
        >
          <Palette className="w-4 h-4" />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-[hsl(var(--border))]" />

        {/* Alignment */}
        <button
          className="p-2 hover:bg-[hsl(var(--panel))] rounded-lg transition-colors"
          title="محاذاة لليسار"
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          className="p-2 hover:bg-[hsl(var(--panel))] rounded-lg transition-colors"
          title="محاذاة للوسط"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          className="p-2 hover:bg-[hsl(var(--panel))] rounded-lg transition-colors"
          title="محاذاة لليمين"
        >
          <AlignRight className="w-4 h-4" />
        </button>
        <button
          className="p-2 hover:bg-[hsl(var(--panel))] rounded-lg transition-colors"
          title="ضبط متساوي"
        >
          <AlignJustify className="w-4 h-4" />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-[hsl(var(--border))]" />

        {/* AI Integration */}
        <button
          className="flex items-center gap-2 px-3 py-2 bg-[hsl(var(--accent-green))] text-white rounded-lg hover:opacity-90 transition-opacity"
          title="تحسين بالذكاء الصناعي"
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-sm">تحسين</span>
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-[hsl(var(--border))]" />

        {/* Copy */}
        <button
          className="p-2 hover:bg-[hsl(var(--panel))] rounded-lg transition-colors"
          title="نسخ"
        >
          <Copy className="w-4 h-4" />
        </button>

        {/* Delete */}
        <button
          className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
          title="حذف"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
