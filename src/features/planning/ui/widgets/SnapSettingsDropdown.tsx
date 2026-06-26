/**
 * SnapSettingsDropdown - قائمة منسدلة لخيارات السناب المتقدمة
 */

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Magnet, Grid3X3, AlignHorizontalJustifyCenter, AlignVerticalJustifyCenter, Columns, Check, Circle, LayoutGrid, Triangle } from 'lucide-react';
import { useCanvasStore } from '@/stores/canvasStore';
import { cn } from '@/lib/utils';
import {
  supraCompactMenuOptionClassName,
  supraMenuSelectedOptionClassName,
  supraMenuSurfaceClassName,
} from '@/features/planning/ui/toolbars/floating-bar/components/SupraMenuOption';

const SnapSettingsDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ right: 0, bottom: 0 });
  const { 
    settings, 
    toggleSnapToGrid,
    updateSettings 
  } = useCanvasStore();

  const gridSizes = [10, 15, 20, 25, 30, 40, 50];

  const gridTypes = [
    { id: 'grid' as const, label: 'خطوط', icon: LayoutGrid },
    { id: 'dots' as const, label: 'نقاط', icon: Circle },
    { id: 'isometric' as const, label: 'أيزومتري', icon: Triangle },
  ];

  useEffect(() => {
    if (!isOpen) return;

    const updateDropdownPosition = () => {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (!rect) return;

      setDropdownPosition({
        right: Math.max(8, window.innerWidth - rect.right),
        bottom: Math.max(8, window.innerHeight - rect.top + 8),
      });
    };

    updateDropdownPosition();
    window.addEventListener('resize', updateDropdownPosition);
    window.addEventListener('scroll', updateDropdownPosition, true);

    return () => {
      window.removeEventListener('resize', updateDropdownPosition);
      window.removeEventListener('scroll', updateDropdownPosition, true);
    };
  }, [isOpen]);

  const handleGridSizeChange = (size: number) => {
    updateSettings({ gridSize: size });
  };

  const handleGridTypeChange = (type: 'dots' | 'grid' | 'isometric' | 'hex') => {
    updateSettings({ gridType: type });
  };

  const toggleSnapOption = (option: 'snapToEdges' | 'snapToCenter' | 'snapToDistribution') => {
    updateSettings({ [option]: !settings[option] });
  };

  const dropdown = isOpen && typeof document !== 'undefined'
    ? createPortal(
        <>
          <div
            className="fixed inset-0 z-toolbar"
            onClick={() => setIsOpen(false)}
          />
          <div
            className={cn(supraMenuSurfaceClassName, "fixed py-3 px-3 z-dropdown min-w-[220px]")}
            style={{ right: dropdownPosition.right, bottom: dropdownPosition.bottom }}
            dir="rtl"
          >
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-sb-border">
              <span className="text-[13px] font-semibold text-sb-ink">المحاذاة التلقائية</span>
              <button
                onClick={toggleSnapToGrid}
                className={`w-11 h-6 rounded-full transition-all duration-200 relative shadow-inner ${
                  settings.snapToGrid 
                    ? 'bg-sb-ink' 
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

            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <Grid3X3 size={14} className="text-sb-ink-60" />
                <span className="text-[12px] text-sb-ink-60">نمط الشبكة</span>
              </div>
              <div className="grid grid-cols-4 gap-1">
                {gridTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = settings.gridType === type.id;
                  return (
                    <button
                      key={type.id}
                      onClick={() => handleGridTypeChange(type.id)}
                      className={cn(
                        'flex flex-col items-center gap-1 p-2 text-[10px]',
                        supraCompactMenuOptionClassName,
                        isSelected && supraMenuSelectedOptionClassName,
                      )}
                      title={type.label}
                    >
                      <Icon size={16} />
                      <span>{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

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
                    className={cn(
                      'px-2 py-1 text-[11px]',
                      supraCompactMenuOptionClassName,
                      settings.gridSize === size && supraMenuSelectedOptionClassName,
                    )}
                  >
                    {size}px
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-sb-border my-3" />

            <div className="space-y-2">
              <span className="text-[12px] text-sb-ink-60 block mb-2">نوع المحاذاة</span>
              
              <button
                onClick={() => toggleSnapOption('snapToEdges')}
                className={cn(
                  'w-full flex items-center gap-2 p-2 text-right',
                  supraCompactMenuOptionClassName,
                  settings.snapToEdges && 'bg-black/5',
                )}
              >
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                  settings.snapToEdges 
                    ? 'border-sb-ink bg-sb-ink' 
                    : 'border-[#9CA3AF] bg-white'
                }`}>
                  {settings.snapToEdges && (
                    <Check size={14} className="text-white" strokeWidth={3} />
                  )}
                </div>
                <AlignHorizontalJustifyCenter size={14} className="text-sb-ink-60" />
                <span className="text-[12px] text-sb-ink">الحواف</span>
              </button>

              <button
                onClick={() => toggleSnapOption('snapToCenter')}
                className={cn(
                  'w-full flex items-center gap-2 p-2 text-right',
                  supraCompactMenuOptionClassName,
                  settings.snapToCenter && 'bg-black/5',
                )}
              >
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                  settings.snapToCenter 
                    ? 'border-sb-ink bg-sb-ink' 
                    : 'border-[#9CA3AF] bg-white'
                }`}>
                  {settings.snapToCenter && (
                    <Check size={14} className="text-white" strokeWidth={3} />
                  )}
                </div>
                <AlignVerticalJustifyCenter size={14} className="text-sb-ink-60" />
                <span className="text-[12px] text-sb-ink">المركز</span>
              </button>

              <button
                onClick={() => toggleSnapOption('snapToDistribution')}
                className={cn(
                  'w-full flex items-center gap-2 p-2 text-right',
                  supraCompactMenuOptionClassName,
                  settings.snapToDistribution && 'bg-black/5',
                )}
              >
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                  settings.snapToDistribution 
                    ? 'border-sb-ink bg-sb-ink' 
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
        </>,
        document.body,
      )
    : null;

  return (
    <div className="relative">
      <button
        ref={buttonRef}
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
      {dropdown}
    </div>
  );
};

export default SnapSettingsDropdown;
