/**
 * SnapSettingsDropdown - قائمة منسدلة لخيارات السناب المتقدمة
 */

import React, { useState } from 'react';
import { Magnet, Grid3X3, AlignHorizontalJustifyCenter, AlignVerticalJustifyCenter, Columns, Check } from 'lucide-react';
import { useCanvasStore } from '@/stores/canvasStore';

const SnapSettingsDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    settings, 
    toggleSnapToGrid,
    updateSettings 
  } = useCanvasStore();

  const gridSizes = [10, 15, 20, 25, 30, 40, 50];

  const handleGridSizeChange = (size: number) => {
    updateSettings({ gridSize: size });
  };

  const toggleSnapOption = (option: 'snapToEdges' | 'snapToCenter' | 'snapToDistribution') => {
    updateSettings({ [option]: !settings[option] });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-1 rounded-lg transition-colors ${
          settings.snapToGrid 
            ? 'bg-sb-panel-bg text-sb-ink' 
            : 'hover:bg-sb-panel-bg text-sb-ink-40'
        }`}
        title="إعدادات المحاذاة التلقائية"
      >
        <Magnet size={12} />
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div 
            className="absolute bottom-full right-0 mb-2 bg-white rounded-[12px] shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-sb-border py-3 px-3 z-[9999] min-w-[200px]"
            dir="rtl"
          >
            {/* تفعيل/تعطيل السناب */}
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-sb-border">
              <span className="text-[13px] font-semibold text-sb-ink">المحاذاة التلقائية</span>
              <button
                onClick={toggleSnapToGrid}
                className={`w-11 h-6 rounded-full transition-all duration-200 relative shadow-inner ${
                  settings.snapToGrid 
                    ? 'bg-[#3DBE8B]' 
                    : 'bg-[#D1D5DB]'
                }`}
              >
                <span 
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-200 ${
                    settings.snapToGrid ? 'right-1' : 'right-6'
                  }`}
                />
              </button>
            </div>

            {/* حجم الشبكة */}
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <Grid3X3 size={14} className="text-sb-ink-60" />
                <span className="text-[12px] text-sb-ink-60">حجم الشبكة</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {gridSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => handleGridSizeChange(size)}
                    className={`px-2 py-1 text-[11px] rounded-md transition-colors ${
                      settings.gridSize === size 
                        ? 'bg-sb-ink text-white' 
                        : 'bg-sb-panel-bg text-sb-ink hover:bg-sb-ink-30'
                    }`}
                  >
                    {size}px
                  </button>
                ))}
              </div>
            </div>

            {/* خط فاصل */}
            <div className="h-px bg-sb-border my-3" />

            {/* أنواع المحاذاة */}
            <div className="space-y-2">
              <span className="text-[12px] text-sb-ink-60 block mb-2">نوع المحاذاة</span>
              
              {/* محاذاة للحواف */}
              <button
                onClick={() => toggleSnapOption('snapToEdges')}
                className={`w-full flex items-center gap-2 p-2 rounded-lg transition-colors ${
                  settings.snapToEdges 
                    ? 'bg-sb-panel-bg' 
                    : 'hover:bg-sb-panel-bg/50'
                }`}
              >
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                  settings.snapToEdges 
                    ? 'border-[#3DBE8B] bg-[#3DBE8B]' 
                    : 'border-[#9CA3AF] bg-white'
                }`}>
                  {settings.snapToEdges && (
                    <Check size={14} className="text-white" strokeWidth={3} />
                  )}
                </div>
                <AlignHorizontalJustifyCenter size={14} className="text-sb-ink-60" />
                <span className="text-[12px] text-sb-ink">الحواف</span>
              </button>

              {/* محاذاة للمركز */}
              <button
                onClick={() => toggleSnapOption('snapToCenter')}
                className={`w-full flex items-center gap-2 p-2 rounded-lg transition-colors ${
                  settings.snapToCenter 
                    ? 'bg-sb-panel-bg' 
                    : 'hover:bg-sb-panel-bg/50'
                }`}
              >
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                  settings.snapToCenter 
                    ? 'border-[#3DA8F5] bg-[#3DA8F5]' 
                    : 'border-[#9CA3AF] bg-white'
                }`}>
                  {settings.snapToCenter && (
                    <Check size={14} className="text-white" strokeWidth={3} />
                  )}
                </div>
                <AlignVerticalJustifyCenter size={14} className="text-sb-ink-60" />
                <span className="text-[12px] text-sb-ink">المركز</span>
              </button>

              {/* توزيع متساوي */}
              <button
                onClick={() => toggleSnapOption('snapToDistribution')}
                className={`w-full flex items-center gap-2 p-2 rounded-lg transition-colors ${
                  settings.snapToDistribution 
                    ? 'bg-sb-panel-bg' 
                    : 'hover:bg-sb-panel-bg/50'
                }`}
              >
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                  settings.snapToDistribution 
                    ? 'border-[#F6C445] bg-[#F6C445]' 
                    : 'border-[#9CA3AF] bg-white'
                }`}>
                  {settings.snapToDistribution && (
                    <Check size={14} className="text-white" strokeWidth={3} />
                  )}
                </div>
                <Columns size={14} className="text-sb-ink-60" />
                <span className="text-[12px] text-sb-ink">التوزيع</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SnapSettingsDropdown;
