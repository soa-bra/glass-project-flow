import React, { useState, useEffect, useMemo } from 'react';
import { 
  Paintbrush, 
  Type, 
  Move, 
  RotateCw, 
  ArrowUp, 
  ArrowDown,
  Sparkles,
  Lock,
  Unlock
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
    let minX = Infinity, minY = Infinity;
    selectedElements.forEach(el => {
      if (el.position.x < minX) minX = el.position.x;
      if (el.position.y < minY) minY = el.position.y;
    });
    
    setPosition({ 
      x: minX, 
      y: minY - 80 // 80px above
    });
  }, [selectedElementIds, hasSelection]);
  
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
  };
  
  const handleSizeChange = (dimension: 'width' | 'height', value: number) => {
    selectedElementIds.forEach(id => {
      updateElement(id, {
        size: {
          ...elements.find(el => el.id === id)?.size || { width: 200, height: 100 },
          [dimension]: value
        }
      });
    });
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
    '#3DA8F5', '#D9D2FE', '#F1B5B9'
  ];
  
  return (
    <div 
      className="fixed z-50 bg-white rounded-[18px] shadow-[0_1px_1px_rgba(0,0,0,0.04),0_12px_28px_rgba(0,0,0,0.10)] border border-sb-border p-3"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translateX(-50%)'
      }}
    >
      <div className="flex items-center gap-4">
        {/* Colors Section */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <label className="text-[11px] text-sb-ink-40">تعبئة</label>
            <input
              type="color"
              value={firstElement?.style?.backgroundColor || '#FFFFFF'}
              onChange={(e) => handleColorChange('fill', e.target.value)}
              className="w-8 h-8 rounded cursor-pointer"
              title="لون التعبئة"
            />
          </div>
          
          <div className="flex items-center gap-1">
            <label className="text-[11px] text-sb-ink-40">حدود</label>
            <input
              type="color"
              value={firstElement?.style?.borderColor || '#000000'}
              onChange={(e) => handleColorChange('stroke', e.target.value)}
              className="w-8 h-8 rounded cursor-pointer"
              title="لون الحدود"
            />
          </div>
          
          {/* Quick Palette */}
          <div className="flex gap-1">
            {quickColors.map(color => (
              <button
                key={color}
                onClick={() => handleColorChange('fill', color)}
                className="w-6 h-6 rounded border border-sb-border hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
        
        <div className="h-8 w-px bg-sb-border" />
        
        {/* Size Section */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <label className="text-[11px] text-sb-ink-40">عرض</label>
            <input
              type="number"
              value={Math.round(firstElement?.size?.width || 200)}
              onChange={(e) => handleSizeChange('width', parseFloat(e.target.value))}
              className="w-16 h-7 px-2 text-[12px] border border-sb-border rounded"
            />
          </div>
          
          <div className="flex items-center gap-1">
            <label className="text-[11px] text-sb-ink-40">ارتفاع</label>
            <input
              type="number"
              value={Math.round(firstElement?.size?.height || 100)}
              onChange={(e) => handleSizeChange('height', parseFloat(e.target.value))}
              className="w-16 h-7 px-2 text-[12px] border border-sb-border rounded"
            />
          </div>
        </div>
        
        <div className="h-8 w-px bg-sb-border" />
        
        {/* Position & Rotation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleRotate(-15)}
            className="p-2 hover:bg-sb-panel-bg rounded-lg transition-colors"
            title="تدوير عكس عقارب الساعة"
          >
            <RotateCw size={16} className="text-sb-ink transform scale-x-[-1]" />
          </button>
          
          <span className="text-[12px] text-sb-ink-40 min-w-[40px] text-center">
            {Math.round(typeof firstElement?.rotation === 'number' ? firstElement.rotation : 0)}°
          </span>
          
          <button
            onClick={() => handleRotate(15)}
            className="p-2 hover:bg-sb-panel-bg rounded-lg transition-colors"
            title="تدوير مع عقارب الساعة"
          >
            <RotateCw size={16} className="text-sb-ink" />
          </button>
        </div>
        
        <div className="h-8 w-px bg-sb-border" />
        
        {/* Layer Controls */}
        <div className="flex items-center gap-1">
          <button
            className="p-2 hover:bg-sb-panel-bg rounded-lg transition-colors"
            title="رفع للأمام"
          >
            <ArrowUp size={16} className="text-sb-ink" />
          </button>
          
          <button
            className="p-2 hover:bg-sb-panel-bg rounded-lg transition-colors"
            title="خفض للخلف"
          >
            <ArrowDown size={16} className="text-sb-ink" />
          </button>
        </div>
        
        <div className="h-8 w-px bg-sb-border" />
        
        {/* Lock */}
        <button
          onClick={toggleLock}
          className={`p-2 rounded-lg transition-colors ${
            firstElement?.locked 
              ? 'bg-sb-panel-bg text-sb-ink' 
              : 'hover:bg-sb-panel-bg text-sb-ink-40'
          }`}
          title={firstElement?.locked ? 'إلغاء القفل' : 'قفل'}
        >
          {firstElement?.locked ? <Lock size={16} /> : <Unlock size={16} />}
        </button>
        
        <div className="h-8 w-px bg-sb-border" />
        
        {/* Element AI */}
        <div className="relative">
          <button
            onClick={() => setIsAIOpen(!isAIOpen)}
            className="flex items-center gap-2 px-3 py-2 bg-gradient-to-br from-[#3DBE8B] to-[#3DA8F5] text-white rounded-lg hover:opacity-90 transition-opacity"
            title="ذكاء صناعي للعنصر"
          >
            <Sparkles size={14} />
            <span className="text-[12px] font-medium">AI</span>
          </button>
          
          {isAIOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsAIOpen(false)}
              />
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-[12px] shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-sb-border p-3 z-50">
                <h4 className="text-[13px] font-semibold text-sb-ink mb-3">
                  اقتراحات ذكية
                </h4>
                
                <div className="space-y-2">
                  <button className="w-full px-3 py-2 text-right text-[12px] hover:bg-sb-panel-bg rounded-lg transition-colors">
                    💡 تحسين التصميم
                  </button>
                  <button className="w-full px-3 py-2 text-right text-[12px] hover:bg-sb-panel-bg rounded-lg transition-colors">
                    🎨 توليد بدائل لونية
                  </button>
                  <button className="w-full px-3 py-2 text-right text-[12px] hover:bg-sb-panel-bg rounded-lg transition-colors">
                    📝 إضافة محتوى مقترح
                  </button>
                  <button className="w-full px-3 py-2 text-right text-[12px] hover:bg-sb-panel-bg rounded-lg transition-colors">
                    🔍 تحليل التباين اللوني
                  </button>
                  <button className="w-full px-3 py-2 text-right text-[12px] hover:bg-sb-panel-bg rounded-lg transition-colors">
                    ♿ اقتراحات إمكانية الوصول
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FloatingEditBar;
