import React from "react";
import { Square, Circle, Triangle, Star, Hexagon } from "lucide-react";

export default function ShapesPanel() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-[hsl(var(--ink))]">الأشكال</h3>
      
      <div className="grid grid-cols-3 gap-2">
        <button className="aspect-square p-4 bg-[hsl(var(--panel))] hover:bg-[hsl(var(--ink-30))] rounded-lg transition-colors flex items-center justify-center">
          <Square className="w-6 h-6" />
        </button>
        <button className="aspect-square p-4 bg-[hsl(var(--panel))] hover:bg-[hsl(var(--ink-30))] rounded-lg transition-colors flex items-center justify-center">
          <Circle className="w-6 h-6" />
        </button>
        <button className="aspect-square p-4 bg-[hsl(var(--panel))] hover:bg-[hsl(var(--ink-30))] rounded-lg transition-colors flex items-center justify-center">
          <Triangle className="w-6 h-6" />
        </button>
        <button className="aspect-square p-4 bg-[hsl(var(--panel))] hover:bg-[hsl(var(--ink-30))] rounded-lg transition-colors flex items-center justify-center">
          <Star className="w-6 h-6" />
        </button>
        <button className="aspect-square p-4 bg-[hsl(var(--panel))] hover:bg-[hsl(var(--ink-30))] rounded-lg transition-colors flex items-center justify-center">
          <Hexagon className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-3 mt-4">
        <div className="p-3 bg-[hsl(var(--panel))] rounded-lg">
          <span className="text-sm font-medium mb-2 block">لون التعبئة</span>
          <div className="flex gap-2">
            <button className="w-8 h-8 rounded-full bg-[hsl(var(--accent-green))]" />
            <button className="w-8 h-8 rounded-full bg-[hsl(var(--accent-blue))]" />
            <button className="w-8 h-8 rounded-full bg-[hsl(var(--accent-red))]" />
            <button className="w-8 h-8 rounded-full bg-[hsl(var(--accent-yellow))]" />
          </div>
        </div>

        <div className="p-3 bg-[hsl(var(--panel))] rounded-lg">
          <span className="text-sm font-medium mb-2 block">لون الحدود</span>
          <div className="flex gap-2">
            <button className="w-8 h-8 rounded-full bg-[hsl(var(--ink))]" />
            <button className="w-8 h-8 rounded-full border-2 border-[hsl(var(--border))]" />
          </div>
        </div>

        <div className="p-3 bg-[hsl(var(--panel))] rounded-lg">
          <span className="text-sm font-medium mb-2 block">سمك الحدود</span>
          <input type="range" min="0" max="10" className="w-full" defaultValue={2} />
        </div>
      </div>
    </div>
  );
}
