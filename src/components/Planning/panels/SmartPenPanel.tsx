import React from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import { Minus, MoreHorizontal, Sparkles, Trash2 } from 'lucide-react';

export default function SmartPenPanel() {
  const { toolSettings, updateToolSettings, setActiveTool, setPenSettings, toggleSmartMode, clearAllStrokes } = useCanvasStore();
  const penSettings = toolSettings.pen;

  const handleStrokeWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPenSettings({ strokeWidth: parseInt(e.target.value) });
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPenSettings({ color: e.target.value });
  };

  const handleStyleChange = (style: 'solid' | 'dashed' | 'dotted' | 'double') => {
    setPenSettings({ style });
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
        
        {/* سمك الخط */}
        <div className="mb-4">
          <label className="text-[12px] text-[hsl(var(--ink-60))] mb-2 block">
            سمك الخط: {penSettings.strokeWidth}px
          </label>
          <input
            type="range"
            min="1"
            max="20"
            value={penSettings.strokeWidth}
            onChange={handleStrokeWidthChange}
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
              value={penSettings.color}
              onChange={handleColorChange}
              className="w-12 h-10 rounded-lg border border-[hsl(var(--border))] cursor-pointer"
            />
            <input
              type="text"
              value={penSettings.color}
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
          <div className="grid grid-cols-2 gap-2 mb-2">
            <button
              onClick={() => handleStyleChange('solid')}
              className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                penSettings.style === 'solid'
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
                penSettings.style === 'dashed'
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
                penSettings.style === 'dotted'
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
                penSettings.style === 'double'
                  ? 'bg-[hsl(var(--ink))] text-white'
                  : 'bg-[hsl(var(--panel))] hover:bg-[rgba(217,231,237,0.8)]'
              }`}
            >
              <span className="text-[14px] font-bold leading-none">=</span>
              <span className="text-[11px]">مزدوج</span>
            </button>
          </div>
        </div>

        {/* الوضع الذكي */}
        <div className="mb-4 p-3 bg-[hsl(var(--panel))] rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-[hsl(var(--accent-blue))]" />
              <label className="text-[12px] font-medium text-[hsl(var(--ink))]">
                الوضع الذكي
              </label>
            </div>
            <button
              onClick={toggleSmartMode}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
                penSettings.smartMode
                  ? 'bg-[hsl(var(--accent-green))] text-white'
                  : 'bg-white border border-[hsl(var(--border))] text-[hsl(var(--ink-60))]'
              }`}
            >
              {penSettings.smartMode ? 'مُفعّل' : 'معطّل'}
            </button>
          </div>
          <p className="text-[10px] text-[hsl(var(--ink-60))] leading-relaxed">
            يحوّل الرسومات اليدوية إلى أشكال منتظمة تلقائياً
          </p>
        </div>

        {/* زر تفعيل القلم */}
        <button
          onClick={handleActivatePen}
          className="w-full py-2.5 bg-[hsl(var(--accent-blue))] hover:bg-[hsl(var(--accent-blue))]/90 text-white rounded-lg transition-colors text-[13px] font-medium mb-2"
        >
          تفعيل القلم الذكي
        </button>

        {/* زر مسح المسارات */}
        <button
          onClick={clearAllStrokes}
          className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors text-[12px] font-medium flex items-center justify-center gap-2"
        >
          <Trash2 size={14} />
          مسح جميع المسارات
        </button>
      </div>

      {/* معلومات إضافية */}
      <div className="pt-4 border-t border-[#DADCE0]">
        <h5 className="text-[12px] font-semibold text-[hsl(var(--ink-60))] mb-2">
          نصائح الاستخدام
        </h5>
        <ul className="space-y-1.5 text-[11px] text-[hsl(var(--ink-60))]">
          <li>• اسحب الماوس للرسم الحر</li>
          <li>• فعّل الوضع الذكي للتحويل التلقائي للأشكال</li>
          <li>• ارسم دائرة أو مربع وسيتم تحويله تلقائياً</li>
          <li>• جرّب الأنماط المختلفة للخطوط</li>
        </ul>
      </div>
    </div>
  );
}
