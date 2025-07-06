import React, { useState } from 'react';
import { Palette, Settings, Type, Square, X } from 'lucide-react';

interface CanvasElement {
  id: string;
  type: string;
  color: string;
  content: string;
  size: { width: number; height: number };
}

interface ToolPropsBarProps {
  currentTool: string;
  selectedElements: CanvasElement[];
  onClose: () => void;
}

const colorPalette = [
  '#FEF3C7', '#DBEAFE', '#E0E7FF', '#F3E8FF', '#DCFCE7',
  '#FEE2E2', '#F3F4F6', '#E5E7EB', '#D1D5DB', '#9CA3AF'
];

export const ToolPropsBar: React.FC<ToolPropsBarProps> = ({
  currentTool,
  selectedElements,
  onClose
}) => {
  const [selectedColor, setSelectedColor] = useState('#FEF3C7');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [fontSize, setFontSize] = useState(14);
  const [opacity, setOpacity] = useState(100);

  const getToolLabel = (tool: string) => {
    switch (tool) {
      case 'select': return 'أداة التحديد';
      case 'sticky-note': return 'ملاحظة لاصقة';
      case 'text': return 'نص';
      case 'shape': return 'شكل';
      case 'smart-element': return 'عنصر ذكي';
      case 'root-connector': return 'موصل رئيسي';
      default: return 'أداة';
    }
  };

  const renderToolSpecificProps = () => {
    switch (currentTool) {
      case 'text':
        return (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">حجم الخط</label>
              <input
                type="range"
                min="8"
                max="32"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-xs text-gray-500">{fontSize}px</span>
            </div>
          </div>
        );
      
      case 'shape':
        return (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">سمك الحدود</label>
              <input
                type="range"
                min="1"
                max="8"
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-xs text-gray-500">{strokeWidth}px</span>
            </div>
          </div>
        );
      
      case 'sticky-note':
        return (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">الشفافية</label>
              <input
                type="range"
                min="20"
                max="100"
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-xs text-gray-500">{opacity}%</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="absolute bottom-6 left-20 glass-section rounded-lg p-4 min-w-72 z-40">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2 space-x-reverse">
          <Settings size={16} className="text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            خصائص {getToolLabel(currentTool)}
          </span>
        </div>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-white/30 rounded"
        >
          <X size={14} className="text-gray-500" />
        </button>
      </div>

      {selectedElements.length > 0 && (
        <div className="mb-4 p-2 bg-blue-50 rounded-lg">
          <div className="text-xs text-blue-600 font-medium">
            {selectedElements.length} عنصر محدد
          </div>
          <div className="text-xs text-blue-500 mt-1">
            اضغط على العناصر لتحديد أو تعديل خصائصها
          </div>
        </div>
      )}

      {/* Color Palette */}
      <div className="mb-4">
        <label className="text-xs font-medium text-gray-600 block mb-2">الألوان</label>
        <div className="grid grid-cols-5 gap-2">
          {colorPalette.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`w-8 h-8 rounded-lg border-2 transition-all ${
                selectedColor === color ? 'border-gray-400 scale-110' : 'border-gray-200'
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Tool-specific properties */}
      {renderToolSpecificProps()}

      {/* Quick Actions */}
      <div className="flex items-center space-x-2 space-x-reverse pt-3 border-t border-gray-200">
        <button className="flex-1 text-xs py-2 px-3 bg-gray-50 hover:bg-gray-100 rounded text-gray-600 transition-colors">
          إعادة تعيين
        </button>
        <button className="flex-1 text-xs py-2 px-3 bg-blue-50 hover:bg-blue-100 rounded text-blue-600 transition-colors">
          تطبيق
        </button>
      </div>

      {/* Tool Tips */}
      <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600">
        <div className="font-medium mb-1">نصائح:</div>
        <ul className="space-y-1">
          <li>• استخدم Shift للاحتفاظ بالنسب</li>
          <li>• اضغط مطولاً للوصول للخيارات المتقدمة</li>
          <li>• استخدم Ctrl+D للنسخ السريع</li>
        </ul>
      </div>
    </div>
  );
};