import React from 'react';
import { Settings } from 'lucide-react';
import { useCanvasStore } from '@/stores/canvasStore';

interface CanvasPropertiesPopoverProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CanvasPropertiesPopover: React.FC<CanvasPropertiesPopoverProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings, toggleGrid, toggleSnapToGrid } = useCanvasStore();
  
  if (!isOpen) return null;
  
  const gridTypes = [
    { value: 'dots', label: 'نقاط', icon: '⋅⋅⋅' },
    { value: 'grid', label: 'شبكة', icon: '☐' },
    { value: 'isometric', label: 'إيزومتريك', icon: '◇' },
    { value: 'hex', label: 'سداسي', icon: '⬡' },
  ];
  
  const gridSizes = [4, 8, 16, 32, 64];
  
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-[18px] shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-sb-border p-4 z-50">
        <div className="flex items-center gap-2 mb-4">
          <Settings size={16} className="text-sb-ink-40" />
          <h3 className="text-[14px] font-semibold text-sb-ink">خصائص الكانفاس</h3>
        </div>
        
        <div className="space-y-4">
          {/* Grid Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-[13px] text-sb-ink">إظهار الشبكة</label>
            <button
              onClick={toggleGrid}
              className={`w-12 h-6 rounded-full transition-colors ${
                settings.gridEnabled ? 'bg-[#3DBE8B]' : 'bg-sb-ink-20'
              }`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                settings.gridEnabled ? 'translate-x-[-6px]' : 'translate-x-[6px]'
              }`} />
            </button>
          </div>
          
          {/* Snap to Grid */}
          <div className="flex items-center justify-between">
            <label className="text-[13px] text-sb-ink">المحاذاة التلقائية</label>
            <button
              onClick={toggleSnapToGrid}
              className={`w-12 h-6 rounded-full transition-colors ${
                settings.snapToGrid ? 'bg-[#3DBE8B]' : 'bg-sb-ink-20'
              }`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                settings.snapToGrid ? 'translate-x-[-6px]' : 'translate-x-[6px]'
              }`} />
            </button>
          </div>
          
          {/* Grid Type */}
          <div>
            <label className="text-[13px] text-sb-ink block mb-2">شكل الشبكة</label>
            <div className="grid grid-cols-2 gap-2">
              {gridTypes.map(type => (
                <button
                  key={type.value}
                  onClick={() => updateSettings({ gridType: type.value as any })}
                  className={`p-3 rounded-lg border transition-colors ${
                    settings.gridType === type.value
                      ? 'border-sb-ink bg-sb-panel-bg'
                      : 'border-sb-border hover:bg-sb-panel-bg'
                  }`}
                >
                  <div className="text-[20px] mb-1">{type.icon}</div>
                  <div className="text-[11px] text-sb-ink">{type.label}</div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Grid Size */}
          <div>
            <label className="text-[13px] text-sb-ink block mb-2">حجم الشبكة</label>
            <div className="flex gap-2">
              {gridSizes.map(size => (
                <button
                  key={size}
                  onClick={() => updateSettings({ gridSize: size })}
                  className={`flex-1 py-2 rounded-lg text-[12px] font-medium transition-colors ${
                    settings.gridSize === size
                      ? 'bg-sb-ink text-white'
                      : 'bg-sb-panel-bg text-sb-ink hover:bg-sb-ink-20'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          
          {/* Background Color */}
          <div>
            <label className="text-[13px] text-sb-ink block mb-2">لون الخلفية</label>
            <input
              type="color"
              value={settings.backgroundColor}
              onChange={(e) => updateSettings({ backgroundColor: e.target.value })}
              className="w-full h-10 rounded-lg cursor-pointer"
            />
          </div>
          
          {/* Theme */}
          <div>
            <label className="text-[13px] text-sb-ink block mb-2">المظهر</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => updateSettings({ theme: 'light' })}
                className={`py-2 rounded-lg text-[12px] font-medium transition-colors ${
                  settings.theme === 'light'
                    ? 'bg-sb-ink text-white'
                    : 'bg-sb-panel-bg text-sb-ink hover:bg-sb-ink-20'
                }`}
              >
                ☀️ فاتح
              </button>
              <button
                onClick={() => updateSettings({ theme: 'dark' })}
                className={`py-2 rounded-lg text-[12px] font-medium transition-colors ${
                  settings.theme === 'dark'
                    ? 'bg-sb-ink text-white'
                    : 'bg-sb-panel-bg text-sb-ink hover:bg-sb-ink-20'
                }`}
              >
                🌙 داكن
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
