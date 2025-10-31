import React from "react";
import { Palette, Sliders } from "lucide-react";

export default function SmartPenPanel() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-[hsl(var(--ink))]">القلم الذكي</h3>
      
      <div className="space-y-3">
        <div className="p-3 bg-[hsl(var(--panel))] rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Palette className="w-4 h-4" />
            <span className="text-sm font-medium">اللون</span>
          </div>
          <div className="flex gap-2">
            <button className="w-8 h-8 rounded-full bg-[hsl(var(--ink))] border-2 border-white shadow" />
            <button className="w-8 h-8 rounded-full bg-[hsl(var(--accent-green))]" />
            <button className="w-8 h-8 rounded-full bg-[hsl(var(--accent-blue))]" />
            <button className="w-8 h-8 rounded-full bg-[hsl(var(--accent-red))]" />
            <button className="w-8 h-8 rounded-full bg-[hsl(var(--accent-yellow))]" />
          </div>
        </div>

        <div className="p-3 bg-[hsl(var(--panel))] rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Sliders className="w-4 h-4" />
            <span className="text-sm font-medium">سمك الخط</span>
          </div>
          <input type="range" min="1" max="20" className="w-full" defaultValue={3} />
        </div>

        <div className="p-3 bg-[hsl(var(--panel))] rounded-lg">
          <span className="text-sm font-medium mb-2 block">نمط الرسم</span>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="radio" name="penMode" value="free" defaultChecked />
              <span className="text-sm">رسم حر</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="penMode" value="straight" />
              <span className="text-sm">خطوط مستقيمة</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="penMode" value="smart" />
              <span className="text-sm">تصحيح ذكي</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
