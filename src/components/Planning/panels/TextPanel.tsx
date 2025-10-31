import React from 'react';
import { Type, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline } from 'lucide-react';
import { useCanvasStore } from '@/stores/canvasStore';
import { toast } from 'sonner';

const TextPanel: React.FC = () => {
  const { toolSettings, updateToolSettings, setActiveTool } = useCanvasStore();
  const { fontSize, fontWeight, color, alignment, fontFamily } = toolSettings.text;

  const handleActivateTextTool = () => {
    setActiveTool('text_tool');
    toast.info('انقر على أي مكان في الكانفاس لإضافة نص');
  };

  return (
    <div className="space-y-6">
      {/* Font Family */}
      <div>
        <label className="text-[13px] font-semibold text-[hsl(var(--ink))] mb-2 block">
          نوع الخط
        </label>
        <select 
          value={fontFamily}
          onChange={(e) => updateToolSettings('text', { fontFamily: e.target.value })}
          className="w-full px-3 py-2 text-[12px] border border-[#DADCE0] rounded-[10px] outline-none focus:border-[hsl(var(--accent-green))] transition-colors bg-white"
        >
          <option value="IBM Plex Sans Arabic">IBM Plex Sans Arabic</option>
          <option value="Cairo">Cairo</option>
          <option value="Tajawal">Tajawal</option>
          <option value="Almarai">Almarai</option>
        </select>
      </div>

      {/* Font Weight */}
      <div>
        <label className="text-[13px] font-semibold text-[hsl(var(--ink))] mb-3 block">
          وزن الخط
        </label>
        <div className="grid grid-cols-4 gap-2">
          {[
            { value: 'normal', label: 'عادي' },
            { value: '500', label: 'متوسط' },
            { value: '600', label: 'نصف عريض' },
            { value: '700', label: 'عريض' },
          ].map((weight) => (
            <button
              key={weight.value}
              onClick={() => updateToolSettings('text', { fontWeight: weight.value })}
              className={`px-3 py-2 rounded-[10px] text-[11px] font-medium transition-colors ${
                fontWeight === weight.value
                  ? 'bg-[hsl(var(--accent-green))] text-white'
                  : 'bg-[hsl(var(--panel))] text-[hsl(var(--ink))] hover:bg-[rgba(217,231,237,0.8)]'
              }`}
              style={{ fontWeight: weight.value }}
            >
              {weight.label}
            </button>
          ))}
        </div>
      </div>

      {/* Font Size */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-[13px] font-semibold text-[hsl(var(--ink))]">
            حجم الخط
          </label>
          <span className="text-[12px] text-[hsl(var(--ink-60))]">
            {fontSize}px
          </span>
        </div>
        <input
          type="range"
          min={8}
          max={72}
          value={fontSize}
          onChange={(e) => updateToolSettings('text', { fontSize: Number(e.target.value) })}
          className="w-full h-2 bg-[hsl(var(--panel))] rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-[hsl(var(--accent-green))]
            [&::-webkit-slider-thumb]:cursor-pointer"
        />
        
        {/* Size Presets */}
        <div className="flex items-center gap-2 mt-3">
          {[12, 14, 16, 20, 24, 32, 40].map((size) => (
            <button
              key={size}
              onClick={() => updateToolSettings('text', { fontSize: size })}
              className={`px-2 py-1 text-[10px] rounded transition-colors ${
                fontSize === size
                  ? 'bg-[hsl(var(--accent-green))] text-white'
                  : 'bg-[hsl(var(--panel))] text-[hsl(var(--ink))] hover:bg-[rgba(217,231,237,0.8)]'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Text Alignment */}
      <div>
        <label className="text-[13px] font-semibold text-[hsl(var(--ink))] mb-3 block">
          المحاذاة
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => updateToolSettings('text', { alignment: 'right' })}
            className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-[10px] transition-colors ${
              alignment === 'right'
                ? 'bg-[hsl(var(--accent-green))] text-white'
                : 'bg-[hsl(var(--panel))] text-[hsl(var(--ink))] hover:bg-[rgba(217,231,237,0.8)]'
            }`}
          >
            <AlignRight size={16} />
            <span className="text-[11px] font-medium">يمين</span>
          </button>
          <button
            onClick={() => updateToolSettings('text', { alignment: 'center' })}
            className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-[10px] transition-colors ${
              alignment === 'center'
                ? 'bg-[hsl(var(--accent-green))] text-white'
                : 'bg-[hsl(var(--panel))] text-[hsl(var(--ink))] hover:bg-[rgba(217,231,237,0.8)]'
            }`}
          >
            <AlignCenter size={16} />
            <span className="text-[11px] font-medium">وسط</span>
          </button>
          <button
            onClick={() => updateToolSettings('text', { alignment: 'left' })}
            className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-[10px] transition-colors ${
              alignment === 'left'
                ? 'bg-[hsl(var(--accent-green))] text-white'
                : 'bg-[hsl(var(--panel))] text-[hsl(var(--ink))] hover:bg-[rgba(217,231,237,0.8)]'
            }`}
          >
            <AlignLeft size={16} />
            <span className="text-[11px] font-medium">يسار</span>
          </button>
        </div>
      </div>

      {/* Text Color */}
      <div>
        <label className="text-[13px] font-semibold text-[hsl(var(--ink))] mb-3 block">
          لون النص
        </label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={color}
            onChange={(e) => updateToolSettings('text', { color: e.target.value })}
            className="w-12 h-12 rounded-[10px] cursor-pointer border-2 border-[#DADCE0]"
          />
          <div className="flex-1">
            <input
              type="text"
              value={color}
              onChange={(e) => updateToolSettings('text', { color: e.target.value })}
              className="w-full px-3 py-2 text-[12px] border border-[#DADCE0] rounded-[10px] outline-none focus:border-[hsl(var(--accent-green))] transition-colors"
              placeholder="#0B0F12"
            />
          </div>
        </div>

        {/* Color Presets */}
        <div className="grid grid-cols-6 gap-2 mt-3">
          {['#0B0F12', '#3DBE8B', '#F6C445', '#E5564D', '#3DA8F5', '#9333EA'].map((c) => (
            <button
              key={c}
              onClick={() => updateToolSettings('text', { color: c })}
              style={{ backgroundColor: c }}
              className={`w-full h-8 rounded-lg border-2 transition-all ${
                color === c ? 'border-[hsl(var(--ink))] scale-105' : 'border-[#DADCE0]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Activate Tool Button */}
      <button
        onClick={handleActivateTextTool}
        className="w-full py-3 bg-[hsl(var(--accent-green))] text-white rounded-[10px] hover:opacity-90 transition-opacity text-[13px] font-semibold"
      >
        تفعيل أداة النص
      </button>

      {/* Keyboard Shortcuts */}
      <div className="pt-4 border-t border-[#DADCE0]">
        <h4 className="text-[12px] font-semibold text-[hsl(var(--ink-60))] mb-2">
          اختصارات الكيبورد
        </h4>
        <div className="space-y-1.5 text-[11px] text-[hsl(var(--ink-60))]">
          <div className="flex justify-between">
            <span>تفعيل الأداة</span>
            <code className="bg-[hsl(var(--panel))] px-1.5 py-0.5 rounded">T</code>
          </div>
          <div className="flex justify-between">
            <span>إبراز</span>
            <code className="bg-[hsl(var(--panel))] px-1.5 py-0.5 rounded">Cmd+B</code>
          </div>
          <div className="flex justify-between">
            <span>مائل</span>
            <code className="bg-[hsl(var(--panel))] px-1.5 py-0.5 rounded">Cmd+I</code>
          </div>
          <div className="flex justify-between">
            <span>تسطير</span>
            <code className="bg-[hsl(var(--panel))] px-1.5 py-0.5 rounded">Cmd+U</code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextPanel;
