import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowUp, 
  ArrowDown,
  Sparkles,
  Lock,
  Unlock,
  Trash2,
  Eye,
  EyeOff,
  Group,
  Ungroup,
  AlignVerticalJustifyCenter,
  AlignHorizontalJustifyCenter,
  MoreHorizontal,
  Copy,
  Scissors,
  ClipboardPaste,
  Square
} from 'lucide-react';
import { useCanvasStore } from '@/stores/canvasStore';

const FloatingEditBar: React.FC = () => {
  const { 
    elements, 
    selectedElementIds, 
    updateElement 
  } = useCanvasStore();
  
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [colorMode, setColorMode] = useState<'fill' | 'stroke'>('fill');
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isGrouped, setIsGrouped] = useState(false);
  
  const selectedElements = useMemo(
    () => elements.filter(el => selectedElementIds.includes(el.id)),
    [elements, selectedElementIds]
  );
  const hasSelection = selectedElements.length > 0;
  const firstElement = selectedElements[0];
  
  useEffect(() => {
    if (!hasSelection) return;
    
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
  
  const handleFillColorChange = (color: string) => {
    selectedElementIds.forEach(id => {
      updateElement(id, {
        style: {
          ...elements.find(el => el.id === id)?.style,
          backgroundColor: color
        }
      });
    });
  };

  const handleStrokeColorChange = (color: string) => {
    selectedElementIds.forEach(id => {
      updateElement(id, {
        style: {
          ...elements.find(el => el.id === id)?.style,
          borderColor: color
        }
      });
    });
  };
  
  const toggleLock = () => {
    selectedElementIds.forEach(id => {
      const current = elements.find(el => el.id === id);
      updateElement(id, { locked: !current?.locked });
    });
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
    // Add visibility toggle logic here
  };

  const toggleGroup = () => {
    setIsGrouped(!isGrouped);
    // Add group/ungroup logic here
  };
  
  const quickColors = [
    '#FFFFFF', '#000000', '#3DBE8B', '#F6C445', '#E5564D', 
    '#3DA8F5', '#9B87F5', '#F1B5B9'
  ];

  const btnClass = `
    flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200
    text-black hover:bg-[hsl(var(--panel))]
    focus:outline-none
  `;

  const separatorClass = "w-px h-6 bg-[hsl(var(--border))]";

  const currentFillColor = firstElement?.style?.backgroundColor || '#FFFFFF';
  const currentStrokeColor = firstElement?.style?.borderColor || '#000000';
  
  return (
    <div 
      className="fixed z-50 pointer-events-auto"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translateX(-50%)'
      }}
    >
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.12)] border border-[hsl(var(--border))] p-1.5">
        <div className="flex items-center gap-1">
          
          {/* More Menu (3 dots) */}
          <div className="relative">
            <button
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              className={btnClass}
              title="المزيد"
            >
              <MoreHorizontal size={16} />
            </button>
            
            {isMoreMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsMoreMenuOpen(false)} />
                <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.15)] border border-[hsl(var(--border))] p-1.5 z-50">
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-black hover:bg-[hsl(var(--panel))] rounded-lg">
                    <Copy size={14} />
                    <span>نسخ</span>
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-black hover:bg-[hsl(var(--panel))] rounded-lg">
                    <Scissors size={14} />
                    <span>قص</span>
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-black hover:bg-[hsl(var(--panel))] rounded-lg">
                    <ClipboardPaste size={14} />
                    <span>لصق</span>
                  </button>
                </div>
              </>
            )}
          </div>

          <div className={separatorClass} />

          {/* Color Picker with Fill/Stroke */}
          <div className="relative">
            <button
              onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
              className={`${btnClass} relative`}
              title="الألوان"
            >
              {/* Stroke color box (back) */}
              <div 
                className="absolute w-4 h-4 rounded border-2 border-white"
                style={{ 
                  backgroundColor: currentStrokeColor,
                  top: '10px',
                  right: '10px'
                }}
              />
              {/* Fill color box (front) */}
              <div 
                className="absolute w-4 h-4 rounded border border-[hsl(var(--border))]"
                style={{ 
                  backgroundColor: currentFillColor,
                  top: '6px',
                  right: '14px'
                }}
              />
            </button>
            
            {isColorPickerOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsColorPickerOpen(false)} />
                <div className="absolute top-full right-0 mt-2 p-3 bg-white rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.15)] border border-[hsl(var(--border))] z-50 min-w-[200px]">
                  {/* Fill/Stroke Toggle */}
                  <div className="flex gap-2 mb-3">
                    <button
                      onClick={() => setColorMode('fill')}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] flex-1 justify-center ${
                        colorMode === 'fill' 
                          ? 'bg-[hsl(var(--ink))] text-white' 
                          : 'bg-[hsl(var(--panel))] text-black'
                      }`}
                    >
                      <div 
                        className="w-4 h-4 rounded border border-white/50"
                        style={{ backgroundColor: currentFillColor }}
                      />
                      <span>التعبئة</span>
                    </button>
                    <button
                      onClick={() => setColorMode('stroke')}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] flex-1 justify-center ${
                        colorMode === 'stroke' 
                          ? 'bg-[hsl(var(--ink))] text-white' 
                          : 'bg-[hsl(var(--panel))] text-black'
                      }`}
                    >
                      <Square size={14} style={{ color: currentStrokeColor }} />
                      <span>الحد</span>
                    </button>
                  </div>
                  
                  {/* Color Grid */}
                  <div className="grid grid-cols-4 gap-2">
                    {quickColors.map(color => (
                      <button
                        key={color}
                        onClick={() => colorMode === 'fill' ? handleFillColorChange(color) : handleStrokeColorChange(color)}
                        className="w-8 h-8 rounded-lg border border-[hsl(var(--border))] hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  
                  {/* Custom Color Picker */}
                  <div className="mt-3 pt-3 border-t border-[hsl(var(--border))]">
                    <input
                      type="color"
                      value={colorMode === 'fill' ? currentFillColor : currentStrokeColor}
                      onChange={(e) => colorMode === 'fill' ? handleFillColorChange(e.target.value) : handleStrokeColorChange(e.target.value)}
                      className="w-full h-8 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          <div className={separatorClass} />
          
          {/* Layer Controls */}
          <div className="flex items-center gap-0.5">
            <button className={btnClass} title="رفع للأمام">
              <ArrowUp size={16} />
            </button>
            <button className={btnClass} title="خفض للخلف">
              <ArrowDown size={16} />
            </button>
          </div>

          <div className={separatorClass} />

          {/* Alignment */}
          <div className="flex items-center gap-0.5">
            <button className={btnClass} title="محاذاة عمودية">
              <AlignVerticalJustifyCenter size={16} />
            </button>
            <button className={btnClass} title="محاذاة أفقية">
              <AlignHorizontalJustifyCenter size={16} />
            </button>
          </div>

          <div className={separatorClass} />

          {/* Show/Hide */}
          <button
            onClick={toggleVisibility}
            className={btnClass}
            title={isVisible ? 'إخفاء' : 'إظهار'}
          >
            {isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>

          {/* Group/Ungroup */}
          <button
            onClick={toggleGroup}
            className={btnClass}
            title={isGrouped ? 'فك التجميع' : 'تجميع'}
          >
            {isGrouped ? <Ungroup size={16} /> : <Group size={16} />}
          </button>

          <div className={separatorClass} />

          {/* Delete */}
          <button className={`${btnClass} hover:text-red-500 hover:bg-red-50`} title="حذف">
            <Trash2 size={16} />
          </button>

          {/* Lock */}
          <button
            onClick={toggleLock}
            className={`${btnClass} ${firstElement?.locked ? 'bg-[hsl(var(--ink))] text-white' : ''}`}
            title={firstElement?.locked ? 'إلغاء القفل' : 'قفل'}
          >
            {firstElement?.locked ? <Lock size={16} /> : <Unlock size={16} />}
          </button>

          <div className={separatorClass} />
          
          {/* AI Button (Disabled, icon only) */}
          <button
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[hsl(var(--accent-green))] to-[hsl(var(--accent-blue))] opacity-50 cursor-not-allowed"
            title="الذكاء الاصطناعي (قريباً)"
            disabled
          >
            <Sparkles size={16} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FloatingEditBar;
