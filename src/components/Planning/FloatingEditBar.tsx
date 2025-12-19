import React, { useState, useEffect, useMemo } from 'react';
import { ToggleGroup } from '@ark-ui/react/toggle-group';
import { 
  RotateCcw, 
  RotateCw, 
  ArrowUp, 
  ArrowDown,
  Sparkles,
  Lock,
  Unlock,
  Palette,
  Square,
  Trash2,
  Copy,
  ClipboardPaste
} from 'lucide-react';
import { useCanvasStore } from '@/stores/canvasStore';

const FloatingEditBar: React.FC = () => {
  const { 
    elements, 
    selectedElementIds, 
    updateElement 
  } = useCanvasStore();
  
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  
  // Get selected elements (memoized to prevent infinite re-renders)
  const selectedElements = useMemo(
    () => elements.filter(el => selectedElementIds.includes(el.id)),
    [elements, selectedElementIds]
  );
  const hasSelection = selectedElements.length > 0;
  const firstElement = selectedElements[0];
  
  // Calculate position above selected elements
  useEffect(() => {
    if (!hasSelection) return;
    
    // Find bounds of selected elements
    let minX = Infinity, minY = Infinity, maxX = -Infinity;
    selectedElements.forEach(el => {
      if (el.position.x < minX) minX = el.position.x;
      if (el.position.y < minY) minY = el.position.y;
      if (el.position.x + (el.size?.width || 200) > maxX) maxX = el.position.x + (el.size?.width || 200);
    });
    
    setPosition({ 
      x: (minX + maxX) / 2, 
      y: minY - 60
    });
  }, [selectedElementIds, hasSelection, selectedElements]);
  
  if (!hasSelection) return null;
  
  const handleColorChange = (type: 'fill' | 'stroke', color: string) => {
    selectedElementIds.forEach(id => {
      updateElement(id, {
        style: {
          ...elements.find(el => el.id === id)?.style,
          [type === 'fill' ? 'backgroundColor' : 'borderColor']: color
        }
      });
    });
    setIsColorPickerOpen(false);
  };
  
  const handleRotate = (angle: number) => {
    selectedElementIds.forEach(id => {
      const current = elements.find(el => el.id === id);
      const currentRotation = typeof current?.rotation === 'number' ? current.rotation : 0;
      updateElement(id, {
        rotation: (currentRotation + angle) % 360
      });
    });
  };
  
  const toggleLock = () => {
    selectedElementIds.forEach(id => {
      const current = elements.find(el => el.id === id);
      updateElement(id, { locked: !current?.locked });
    });
  };
  
  const quickColors = [
    '#FFFFFF', '#000000', '#3DBE8B', '#F6C445', '#E5564D', 
    '#3DA8F5', '#9B87F5', '#F1B5B9'
  ];

  const toggleItemClass = `
    flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200
    text-[hsl(var(--ink-60))] hover:text-[hsl(var(--ink))] hover:bg-[hsl(var(--panel))]
    data-[state=on]:bg-[hsl(var(--ink))] data-[state=on]:text-white
    focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ink))] focus-visible:ring-offset-1
  `;

  const separatorClass = "w-px h-6 bg-[hsl(var(--border))] mx-1";
  
  return (
    <div 
      className="fixed z-50 pointer-events-auto"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translateX(-50%)'
      }}
    >
      <div className="relative bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.12)] border border-[hsl(var(--border))] p-1.5">
        <div className="flex items-center gap-1">
          
          {/* Colors Section */}
          <div className="relative">
            <button
              onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
              className={`${toggleItemClass} relative`}
              title="الألوان"
            >
              <div 
                className="w-4 h-4 rounded border border-[hsl(var(--border))]"
                style={{ backgroundColor: firstElement?.style?.backgroundColor || '#FFFFFF' }}
              />
            </button>
            
            {isColorPickerOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsColorPickerOpen(false)}
                />
                <div className="absolute top-full right-0 mt-2 p-3 bg-white rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.15)] border border-[hsl(var(--border))] z-50">
                  <div className="grid grid-cols-4 gap-2">
                    {quickColors.map(color => (
                      <button
                        key={color}
                        onClick={() => handleColorChange('fill', color)}
                        className="w-8 h-8 rounded-lg border border-[hsl(var(--border))] hover:scale-110 transition-transform shadow-sm"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-[hsl(var(--border))]">
                    <input
                      type="color"
                      value={firstElement?.style?.backgroundColor || '#FFFFFF'}
                      onChange={(e) => handleColorChange('fill', e.target.value)}
                      className="w-full h-8 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          <div className={separatorClass} />
          
          {/* Rotation Controls */}
          <ToggleGroup.Root className="flex items-center gap-0.5">
            <ToggleGroup.Item
              value="rotate-ccw"
              className={toggleItemClass}
              onClick={() => handleRotate(-15)}
              title="تدوير لليسار"
            >
              <RotateCcw size={16} />
            </ToggleGroup.Item>
            
            <span className="text-[11px] text-[hsl(var(--ink-60))] min-w-[32px] text-center font-medium">
              {Math.round(typeof firstElement?.rotation === 'number' ? firstElement.rotation : 0)}°
            </span>
            
            <ToggleGroup.Item
              value="rotate-cw"
              className={toggleItemClass}
              onClick={() => handleRotate(15)}
              title="تدوير لليمين"
            >
              <RotateCw size={16} />
            </ToggleGroup.Item>
          </ToggleGroup.Root>

          <div className={separatorClass} />
          
          {/* Layer Controls */}
          <ToggleGroup.Root className="flex items-center gap-0.5">
            <ToggleGroup.Item
              value="bring-forward"
              className={toggleItemClass}
              title="رفع للأمام"
            >
              <ArrowUp size={16} />
            </ToggleGroup.Item>
            
            <ToggleGroup.Item
              value="send-backward"
              className={toggleItemClass}
              title="خفض للخلف"
            >
              <ArrowDown size={16} />
            </ToggleGroup.Item>
          </ToggleGroup.Root>

          <div className={separatorClass} />

          {/* Quick Actions */}
          <ToggleGroup.Root className="flex items-center gap-0.5">
            <ToggleGroup.Item
              value="copy"
              className={toggleItemClass}
              title="نسخ"
            >
              <Copy size={16} />
            </ToggleGroup.Item>
            
            <ToggleGroup.Item
              value="delete"
              className={`${toggleItemClass} hover:text-[hsl(var(--accent-red))] hover:bg-red-50`}
              title="حذف"
            >
              <Trash2 size={16} />
            </ToggleGroup.Item>
          </ToggleGroup.Root>

          <div className={separatorClass} />

          {/* Lock Toggle */}
          <button
            onClick={toggleLock}
            className={`${toggleItemClass} ${
              firstElement?.locked 
                ? 'bg-[hsl(var(--ink))] text-white' 
                : ''
            }`}
            title={firstElement?.locked ? 'إلغاء القفل' : 'قفل'}
          >
            {firstElement?.locked ? <Lock size={16} /> : <Unlock size={16} />}
          </button>

          <div className={separatorClass} />
          
          {/* AI Button */}
          <div className="relative">
            <button
              onClick={() => setIsAIOpen(!isAIOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-br from-[hsl(var(--accent-green))] to-[hsl(var(--accent-blue))] text-white rounded-lg hover:opacity-90 transition-all shadow-sm"
              title="ذكاء صناعي"
            >
              <Sparkles size={14} className="animate-pulse" />
              <span className="text-[11px] font-semibold">AI</span>
            </button>
            
            {isAIOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsAIOpen(false)}
                />
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.15)] border border-[hsl(var(--border))] p-2 z-50">
                  <div className="space-y-1">
                    {[
                      { icon: '💡', label: 'تحسين التصميم' },
                      { icon: '🎨', label: 'بدائل لونية' },
                      { icon: '📝', label: 'محتوى مقترح' },
                      { icon: '🔍', label: 'تحليل التباين' },
                    ].map((item) => (
                      <button 
                        key={item.label}
                        className="w-full flex items-center gap-2 px-3 py-2 text-right text-[12px] text-[hsl(var(--ink-80))] hover:bg-[hsl(var(--panel))] rounded-lg transition-colors"
                      >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingEditBar;
