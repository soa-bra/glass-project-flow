import React, { useState } from 'react';
import { Circle, Square, Triangle, Hexagon, Star, Heart } from 'lucide-react';

const ShapesPanel: React.FC = () => {
  const [shapeCategory, setShapeCategory] = useState<'basic' | 'artistic' | 'icons' | 'sticky'>('basic');
  const [fillColor, setFillColor] = useState('#3DBE8B');
  const [strokeColor, setStrokeColor] = useState('#0B0F12');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [opacity, setOpacity] = useState(1);

  const basicShapes = [
    { icon: <Square size={24} />, name: 'مربع' },
    { icon: <Circle size={24} />, name: 'دائرة' },
    { icon: <Triangle size={24} />, name: 'مثلث' },
    { icon: <Hexagon size={24} />, name: 'سداسي' },
    { icon: <Star size={24} />, name: 'نجمة' },
    { icon: <Heart size={24} />, name: 'قلب' },
  ];

  return (
    <div className="space-y-6">
      {/* Shape Categories */}
      <div>
        <h4 className="text-[13px] font-semibold text-[hsl(var(--ink))] mb-3">
          فئة الأشكال
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setShapeCategory('basic')}
            className={`px-3 py-2.5 rounded-[10px] text-[11px] font-medium transition-colors ${
              shapeCategory === 'basic'
                ? 'bg-[hsl(var(--accent-green))] text-white'
                : 'bg-[hsl(var(--panel))] text-[hsl(var(--ink))] hover:bg-[rgba(217,231,237,0.8)]'
            }`}
          >
            أساسية
          </button>
          <button
            onClick={() => setShapeCategory('artistic')}
            className={`px-3 py-2.5 rounded-[10px] text-[11px] font-medium transition-colors ${
              shapeCategory === 'artistic'
                ? 'bg-[hsl(var(--accent-green))] text-white'
                : 'bg-[hsl(var(--panel))] text-[hsl(var(--ink))] hover:bg-[rgba(217,231,237,0.8)]'
            }`}
          >
            فنية
          </button>
          <button
            onClick={() => setShapeCategory('icons')}
            className={`px-3 py-2.5 rounded-[10px] text-[11px] font-medium transition-colors ${
              shapeCategory === 'icons'
                ? 'bg-[hsl(var(--accent-green))] text-white'
                : 'bg-[hsl(var(--panel))] text-[hsl(var(--ink))] hover:bg-[rgba(217,231,237,0.8)]'
            }`}
          >
            أيقونات
          </button>
          <button
            onClick={() => setShapeCategory('sticky')}
            className={`px-3 py-2.5 rounded-[10px] text-[11px] font-medium transition-colors ${
              shapeCategory === 'sticky'
                ? 'bg-[hsl(var(--accent-green))] text-white'
                : 'bg-[hsl(var(--panel))] text-[hsl(var(--ink))] hover:bg-[rgba(217,231,237,0.8)]'
            }`}
          >
            ستيكي نوت
          </button>
        </div>
      </div>

      {/* Shapes Grid */}
      <div>
        <h4 className="text-[13px] font-semibold text-[hsl(var(--ink))] mb-3">
          اختر شكل
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {basicShapes.map((shape, index) => (
            <button
              key={index}
              className="group flex flex-col items-center gap-2 p-4 bg-[hsl(var(--panel))] hover:bg-[hsl(var(--accent-green))] hover:text-white rounded-[10px] transition-all"
            >
              <span className="text-[hsl(var(--ink))] group-hover:text-white transition-colors">
                {shape.icon}
              </span>
              <span className="text-[10px] font-medium text-[hsl(var(--ink))] group-hover:text-white transition-colors">
                {shape.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Fill Color */}
      <div>
        <label className="text-[13px] font-semibold text-[hsl(var(--ink))] mb-3 block">
          لون التعبئة
        </label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={fillColor}
            onChange={(e) => setFillColor(e.target.value)}
            className="w-12 h-12 rounded-[10px] cursor-pointer border-2 border-[#DADCE0]"
          />
          <div className="flex-1">
            <input
              type="text"
              value={fillColor}
              onChange={(e) => setFillColor(e.target.value)}
              className="w-full px-3 py-2 text-[12px] border border-[#DADCE0] rounded-[10px] outline-none focus:border-[hsl(var(--accent-green))] transition-colors"
              placeholder="#3DBE8B"
            />
          </div>
        </div>

        {/* Color Presets */}
        <div className="grid grid-cols-6 gap-2 mt-3">
          {['#3DBE8B', '#F6C445', '#E5564D', '#3DA8F5', '#9333EA', '#0B0F12'].map((c) => (
            <button
              key={c}
              onClick={() => setFillColor(c)}
              style={{ backgroundColor: c }}
              className={`w-full h-8 rounded-lg border-2 transition-all ${
                fillColor === c ? 'border-[hsl(var(--ink))] scale-105' : 'border-[#DADCE0]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Stroke Color */}
      <div>
        <label className="text-[13px] font-semibold text-[hsl(var(--ink))] mb-3 block">
          لون الحواف
        </label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={strokeColor}
            onChange={(e) => setStrokeColor(e.target.value)}
            className="w-12 h-12 rounded-[10px] cursor-pointer border-2 border-[#DADCE0]"
          />
          <div className="flex-1">
            <input
              type="text"
              value={strokeColor}
              onChange={(e) => setStrokeColor(e.target.value)}
              className="w-full px-3 py-2 text-[12px] border border-[#DADCE0] rounded-[10px] outline-none focus:border-[hsl(var(--accent-green))] transition-colors"
              placeholder="#0B0F12"
            />
          </div>
        </div>
      </div>

      {/* Stroke Width */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-[13px] font-semibold text-[hsl(var(--ink))]">
            سمك الحواف
          </label>
          <span className="text-[12px] text-[hsl(var(--ink-60))]">
            {strokeWidth}px
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={12}
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

      {/* Opacity */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-[13px] font-semibold text-[hsl(var(--ink))]">
            الشفافية
          </label>
          <span className="text-[12px] text-[hsl(var(--ink-60))]">
            {Math.round(opacity * 100)}%
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={opacity}
          onChange={(e) => setOpacity(Number(e.target.value))}
          className="w-full h-2 bg-[hsl(var(--panel))] rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-[hsl(var(--accent-green))]
            [&::-webkit-slider-thumb]:cursor-pointer"
        />

        {/* Preview */}
        <div className="mt-3 flex justify-center">
          <div 
            className="w-24 h-24 rounded-[10px]" 
            style={{ 
              backgroundColor: fillColor,
              border: `${strokeWidth}px solid ${strokeColor}`,
              opacity: opacity
            }} 
          />
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="pt-4 border-t border-[#DADCE0]">
        <h4 className="text-[12px] font-semibold text-[hsl(var(--ink-60))] mb-2">
          اختصارات الكيبورد
        </h4>
        <div className="space-y-1.5 text-[11px] text-[hsl(var(--ink-60))]">
          <div className="flex justify-between">
            <span>نسبة متساوية</span>
            <code className="bg-[hsl(var(--panel))] px-1.5 py-0.5 rounded">Shift</code>
          </div>
          <div className="flex justify-between">
            <span>من المركز</span>
            <code className="bg-[hsl(var(--panel))] px-1.5 py-0.5 rounded">Alt</code>
          </div>
          <div className="flex justify-between">
            <span>إدراج</span>
            <code className="bg-[hsl(var(--panel))] px-1.5 py-0.5 rounded">Enter</code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShapesPanel;
