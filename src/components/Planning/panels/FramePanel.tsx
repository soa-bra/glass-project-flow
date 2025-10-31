import React, { useState } from 'react';
import { Square, Circle, RectangleHorizontal } from 'lucide-react';

const FramePanel: React.FC = () => {
  const [frameColor, setFrameColor] = useState('#d9e7ed');
  const [frameOpacity, setFrameOpacity] = useState(0.3);
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [frameTitle, setFrameTitle] = useState('');

  return (
    <div className="space-y-6">
      {/* Frame Info */}
      <div className="p-3 bg-[hsl(var(--panel))] rounded-[10px]">
        <p className="text-[11px] text-[hsl(var(--ink-60))]">
          استخدم الأداة لرسم إطار حول العناصر لتجميعها كسياق واحد
        </p>
      </div>

      {/* Frame Title */}
      <div>
        <label className="text-[13px] font-semibold text-[hsl(var(--ink))] mb-2 block">
          عنوان الإطار
        </label>
        <input
          type="text"
          value={frameTitle}
          onChange={(e) => setFrameTitle(e.target.value)}
          placeholder="اختياري..."
          className="w-full px-3 py-2 text-[12px] border border-[#DADCE0] rounded-[10px] outline-none focus:border-[hsl(var(--accent-green))] transition-colors"
        />
      </div>

      {/* Frame Style */}
      <div>
        <label className="text-[13px] font-semibold text-[hsl(var(--ink))] mb-3 block">
          نمط الإطار
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button className="flex flex-col items-center gap-2 px-3 py-3 bg-[hsl(var(--accent-green))] text-white rounded-[10px]">
            <RectangleHorizontal size={20} />
            <span className="text-[10px] font-medium">مستطيل</span>
          </button>
          <button className="flex flex-col items-center gap-2 px-3 py-3 bg-[hsl(var(--panel))] text-[hsl(var(--ink))] rounded-[10px] hover:bg-[rgba(217,231,237,0.8)] transition-colors">
            <Square size={20} />
            <span className="text-[10px] font-medium">مربع</span>
          </button>
          <button className="flex flex-col items-center gap-2 px-3 py-3 bg-[hsl(var(--panel))] text-[hsl(var(--ink))] rounded-[10px] hover:bg-[rgba(217,231,237,0.8)] transition-colors">
            <Circle size={20} />
            <span className="text-[10px] font-medium">دائري</span>
          </button>
        </div>
      </div>

      {/* Frame Color */}
      <div>
        <label className="text-[13px] font-semibold text-[hsl(var(--ink))] mb-3 block">
          لون الإطار
        </label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={frameColor}
            onChange={(e) => setFrameColor(e.target.value)}
            className="w-12 h-12 rounded-[10px] cursor-pointer border-2 border-[#DADCE0]"
          />
          <div className="flex-1">
            <input
              type="text"
              value={frameColor}
              onChange={(e) => setFrameColor(e.target.value)}
              className="w-full px-3 py-2 text-[12px] border border-[#DADCE0] rounded-[10px] outline-none focus:border-[hsl(var(--accent-green))] transition-colors"
              placeholder="#d9e7ed"
            />
          </div>
        </div>

        {/* Color Presets */}
        <div className="grid grid-cols-6 gap-2 mt-3">
          {['#d9e7ed', '#BFE7D5', '#FFF4CC', '#FFE1E0', '#E0E7FF', '#F3E8FF'].map((c) => (
            <button
              key={c}
              onClick={() => setFrameColor(c)}
              style={{ backgroundColor: c }}
              className={`w-full h-8 rounded-lg border-2 transition-all ${
                frameColor === c ? 'border-[hsl(var(--ink))] scale-105' : 'border-[#DADCE0]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Frame Opacity */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-[13px] font-semibold text-[hsl(var(--ink))]">
            شفافية الخلفية
          </label>
          <span className="text-[12px] text-[hsl(var(--ink-60))]">
            {Math.round(frameOpacity * 100)}%
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={frameOpacity}
          onChange={(e) => setFrameOpacity(Number(e.target.value))}
          className="w-full h-2 bg-[hsl(var(--panel))] rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-[hsl(var(--accent-green))]
            [&::-webkit-slider-thumb]:cursor-pointer"
        />
        
        {/* Preview */}
        <div className="mt-3 h-16 rounded-[10px] border-2 border-[#DADCE0]" style={{ 
          backgroundColor: frameColor,
          opacity: frameOpacity
        }} />
      </div>

      {/* Stroke Width */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-[13px] font-semibold text-[hsl(var(--ink))]">
            سمك الحافة
          </label>
          <span className="text-[12px] text-[hsl(var(--ink-60))]">
            {strokeWidth}px
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={8}
          value={strokeWidth}
          onChange={(e) => setStrokeWidth(Number(e.target.value))}
          className="w-full h-2 bg-[hsl(var(--panel))] rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-[hsl(var(--accent-green))]
            [&::-webkit-slider-thumb]:cursor-pointer"
        />
      </div>

      {/* Features */}
      <div>
        <h4 className="text-[13px] font-semibold text-[hsl(var(--ink))] mb-3">
          خيارات
        </h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <span className="text-[12px] text-[hsl(var(--ink))]">
              إظهار العنوان
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <span className="text-[12px] text-[hsl(var(--ink))]">
              تجميع تلقائي للعناصر
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4" />
            <span className="text-[12px] text-[hsl(var(--ink))]">
              قفل الإطار بعد الإنشاء
            </span>
          </label>
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="pt-4 border-t border-[#DADCE0]">
        <h4 className="text-[12px] font-semibold text-[hsl(var(--ink-60))] mb-2">
          اختصارات الكيبورد
        </h4>
        <div className="space-y-1.5 text-[11px] text-[hsl(var(--ink-60))]">
          <div className="flex justify-between">
            <span>نسبة ثابتة</span>
            <code className="bg-[hsl(var(--panel))] px-1.5 py-0.5 rounded">Shift</code>
          </div>
          <div className="flex justify-between">
            <span>من المركز</span>
            <code className="bg-[hsl(var(--panel))] px-1.5 py-0.5 rounded">Alt</code>
          </div>
          <div className="flex justify-between">
            <span>إلغاء</span>
            <code className="bg-[hsl(var(--panel))] px-1.5 py-0.5 rounded">Esc</code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FramePanel;
