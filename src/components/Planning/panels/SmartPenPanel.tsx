import React from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import { Minus, MoreHorizontal } from 'lucide-react';

export default function SmartPenPanel() {
  const { pen, setPen, setActiveTool } = useCanvasStore();

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPen({ width: parseInt(e.target.value) });
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPen({ color: e.target.value });
  };

  const handleStyleChange = (style: 'solid' | 'dashed' | 'dotted' | 'double') => {
    setPen({ style });
  };

  const handleSmartModeToggle = () => {
    setPen({ smartMode: !pen.smartMode });
  };

  const handleActivatePen = () => {
    setActiveTool('smart_pen');
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-[13px] font-semibold text-[hsl(var(--ink))] mb-3">
          القلم الذكي
        </h4>
        
        {/* الوضع الذكي */}
        <div className="flex items-center justify-between mb-4 p-3 bg-[hsl(var(--panel))] rounded-lg">
          <span className="text-[12px] text-[hsl(var(--ink-80))]">الوضع الذكي</span>
          <input
            type="checkbox"
            checked={pen.smartMode}
            onChange={handleSmartModeToggle}
            className="w-10 h-5 accent-[hsl(var(--accent-green))]"
          />
        </div>
        
        {/* سمك الخط */}
        <div className="mb-4">
          <label className="text-[12px] text-[hsl(var(--ink-60))] mb-2 block">
            سمك الخط: {pen.width}px
          </label>
          <input
            type="range"
            min="1"
            max="20"
            value={pen.width}
            onChange={handleWidthChange}
            className="w-full accent-[hsl(var(--ink))]"
          />
        </div>

        {/* اللون */}
        <div className="mb-4">
          <label className="text-[12px] text-[hsl(var(--ink-60))] mb-2 block">
            اللون
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={pen.color}
              onChange={handleColorChange}
              className="w-12 h-10 rounded-lg border border-[hsl(var(--border))] cursor-pointer"
            />
            <input
              type="text"
              value={pen.color}
              onChange={handleColorChange}
              className="flex-1 px-3 py-2 bg-[hsl(var(--panel))] rounded-lg text-[12px] font-mono"
            />
          </div>
        </div>

        {/* نمط الخط */}
        <div className="mb-4">
          <label className="text-[12px] text-[hsl(var(--ink-60))] mb-2 block">
            نمط الخط
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleStyleChange('solid')}
              className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                pen.style === 'solid'
                  ? 'bg-[hsl(var(--ink))] text-white'
                  : 'bg-[hsl(var(--panel))] hover:bg-[rgba(217,231,237,0.8)]'
              }`}
            >
              <Minus size={16} />
              <span className="text-[11px]">صلب</span>
            </button>
            
            <button
              onClick={() => handleStyleChange('dashed')}
              className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                pen.style === 'dashed'
                  ? 'bg-[hsl(var(--ink))] text-white'
                  : 'bg-[hsl(var(--panel))] hover:bg-[rgba(217,231,237,0.8)]'
              }`}
            >
              <MoreHorizontal size={16} />
              <span className="text-[11px]">متقطع</span>
            </button>
            
            <button
              onClick={() => handleStyleChange('dotted')}
              className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                pen.style === 'dotted'
                  ? 'bg-[hsl(var(--ink))] text-white'
                  : 'bg-[hsl(var(--panel))] hover:bg-[rgba(217,231,237,0.8)]'
              }`}
            >
              <span className="text-[16px] leading-none">···</span>
              <span className="text-[11px]">نقطي</span>
            </button>
            
            <button
              onClick={() => handleStyleChange('double')}
              className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                pen.style === 'double'
                  ? 'bg-[hsl(var(--ink))] text-white'
                  : 'bg-[hsl(var(--panel))] hover:bg-[rgba(217,231,237,0.8)]'
              }`}
            >
              <span className="text-[14px] leading-none">=</span>
              <span className="text-[11px]">مزدوج</span>
            </button>
          </div>
        </div>

        {/* زر تفعيل القلم */}
        <button
          onClick={handleActivatePen}
          className="w-full py-2.5 bg-[hsl(var(--accent-blue))] hover:bg-[hsl(var(--accent-blue))]/90 text-white rounded-lg transition-colors text-[13px] font-medium"
        >
          تفعيل القلم الذكي
        </button>
      </div>

      {/* معلومات إضافية */}
      <div className="pt-4 border-t border-[#DADCE0]">
        <h5 className="text-[12px] font-semibold text-[hsl(var(--ink-60))] mb-2">
          نصائح الاستخدام
        </h5>
        <ul className="space-y-1.5 text-[11px] text-[hsl(var(--ink-60))]">
          <li>• اسحب الماوس للرسم الحر</li>
          <li>• <kbd className="px-1 bg-[hsl(var(--panel))] rounded">Shift</kbd> للخط المستقيم</li>
          <li>• <kbd className="px-1 bg-[hsl(var(--panel))] rounded">Alt</kbd> للوضع الذكي المؤقت</li>
          <li>• <kbd className="px-1 bg-[hsl(var(--panel))] rounded">ESC</kbd> للإلغاء</li>
          <li>• ارسم دائرة أو مربع وسيتم تحويله تلقائياً</li>
          <li>• ارسم خطاً بين عنصرين لإنشاء موصل</li>
          <li>• ارسم حلقة حول عناصر لتجميعها</li>
          <li>• اخربش على عنصر لحذفه</li>
        </ul>
      </div>
    </div>
  );
}
