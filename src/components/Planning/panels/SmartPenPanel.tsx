import React, { useState } from 'react';
import { Palette, Minus, Circle, Square, ArrowRight } from 'lucide-react';

const SmartPenPanel: React.FC = () => {
  const [mode, setMode] = useState<'free' | 'smart'>('smart');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [color, setColor] = useState('#0B0F12');
  const [strokeStyle, setStrokeStyle] = useState<'solid' | 'dashed' | 'dotted'>('solid');

  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      <div>
        <h4 className="text-[13px] font-semibold text-[hsl(var(--ink))] mb-3">
          وضع الرسم
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setMode('free')}
            className={`px-4 py-2.5 rounded-[10px] text-[12px] font-medium transition-colors ${
              mode === 'free'
                ? 'bg-[hsl(var(--accent-green))] text-white'
                : 'bg-[hsl(var(--panel))] text-[hsl(var(--ink))] hover:bg-[rgba(217,231,237,0.8)]'
            }`}
          >
            رسم حر
          </button>
          <button
            onClick={() => setMode('smart')}
            className={`px-4 py-2.5 rounded-[10px] text-[12px] font-medium transition-colors ${
              mode === 'smart'
                ? 'bg-[hsl(var(--accent-green))] text-white'
                : 'bg-[hsl(var(--panel))] text-[hsl(var(--ink))] hover:bg-[rgba(217,231,237,0.8)]'
            }`}
          >
            رسم ذكي
          </button>
        </div>
      </div>

      {/* Smart Mode Features */}
      {mode === 'smart' && (
        <div className="p-3 bg-[hsl(var(--panel))] rounded-[10px]">
          <p className="text-[11px] text-[hsl(var(--ink-60))] mb-2">
            يتعرف تلقائياً على:
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1 text-[11px] bg-white px-2 py-1 rounded">
              <Circle size={12} /> دائرة
            </span>
            <span className="flex items-center gap-1 text-[11px] bg-white px-2 py-1 rounded">
              <Square size={12} /> مربع
            </span>
            <span className="flex items-center gap-1 text-[11px] bg-white px-2 py-1 rounded">
              <ArrowRight size={12} /> سهم
            </span>
            <span className="flex items-center gap-1 text-[11px] bg-white px-2 py-1 rounded">
              <Minus size={12} /> خط
            </span>
          </div>
        </div>
      )}

      {/* Stroke Width */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-[13px] font-semibold text-[hsl(var(--ink))]">
            سمك الخط
          </label>
          <span className="text-[12px] text-[hsl(var(--ink-60))]">
            {strokeWidth}px
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={16}
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
        
        {/* Preview Line */}
        <div className="mt-3 flex justify-center">
          <div 
            style={{ 
              height: `${strokeWidth}px`,
              width: '100%',
              backgroundColor: color,
              borderRadius: strokeWidth >= 8 ? '999px' : '2px'
            }}
          />
        </div>
      </div>

      {/* Color Picker */}
      <div>
        <label className="text-[13px] font-semibold text-[hsl(var(--ink))] mb-3 block">
          لون القلم
        </label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-12 h-12 rounded-[10px] cursor-pointer border-2 border-[#DADCE0]"
          />
          <div className="flex-1">
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full px-3 py-2 text-[12px] border border-[#DADCE0] rounded-[10px] outline-none focus:border-[hsl(var(--accent-green))] transition-colors"
              placeholder="#000000"
            />
          </div>
        </div>

        {/* Color Presets */}
        <div className="grid grid-cols-6 gap-2 mt-3">
          {['#0B0F12', '#3DBE8B', '#F6C445', '#E5564D', '#3DA8F5', '#FFFFFF'].map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              style={{ backgroundColor: c }}
              className={`w-full h-8 rounded-lg border-2 transition-all ${
                color === c ? 'border-[hsl(var(--ink))] scale-105' : 'border-[#DADCE0]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Stroke Style */}
      <div>
        <label className="text-[13px] font-semibold text-[hsl(var(--ink))] mb-3 block">
          نمط الخط
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setStrokeStyle('solid')}
            className={`px-3 py-2.5 rounded-[10px] text-[11px] font-medium transition-colors ${
              strokeStyle === 'solid'
                ? 'bg-[hsl(var(--accent-green))] text-white'
                : 'bg-[hsl(var(--panel))] text-[hsl(var(--ink))] hover:bg-[rgba(217,231,237,0.8)]'
            }`}
          >
            متصل
          </button>
          <button
            onClick={() => setStrokeStyle('dashed')}
            className={`px-3 py-2.5 rounded-[10px] text-[11px] font-medium transition-colors ${
              strokeStyle === 'dashed'
                ? 'bg-[hsl(var(--accent-green))] text-white'
                : 'bg-[hsl(var(--panel))] text-[hsl(var(--ink))] hover:bg-[rgba(217,231,237,0.8)]'
            }`}
          >
            متقطع
          </button>
          <button
            onClick={() => setStrokeStyle('dotted')}
            className={`px-3 py-2.5 rounded-[10px] text-[11px] font-medium transition-colors ${
              strokeStyle === 'dotted'
                ? 'bg-[hsl(var(--accent-green))] text-white'
                : 'bg-[hsl(var(--panel))] text-[hsl(var(--ink))] hover:bg-[rgba(217,231,237,0.8)]'
            }`}
          >
            نقطي
          </button>
        </div>
      </div>

      {/* Smart Features */}
      <div>
        <h4 className="text-[13px] font-semibold text-[hsl(var(--ink))] mb-3">
          ميزات ذكية
        </h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <span className="text-[12px] text-[hsl(var(--ink))]">
              تحويل الأشكال تلقائياً
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <span className="text-[12px] text-[hsl(var(--ink))]">
              ربط العناصر بالخطوط
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4" />
            <span className="text-[12px] text-[hsl(var(--ink))]">
              تجميع بالحلقة
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
            <span>خط مستقيم</span>
            <code className="bg-[hsl(var(--panel))] px-1.5 py-0.5 rounded">Shift</code>
          </div>
          <div className="flex justify-between">
            <span>الوضع الذكي</span>
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

export default SmartPenPanel;
