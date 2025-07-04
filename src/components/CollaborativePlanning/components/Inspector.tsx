import React, { useState } from 'react';
import { X, Palette, Type, Move, Layers, Lock, Unlock, Trash2, Copy } from 'lucide-react';

interface CanvasElement {
  id: string;
  type: 'sticky-note' | 'shape' | 'text' | 'connection' | 'mindmap-node';
  position: { x: number; y: number };
  size: { width: number; height: number };
  content: string;
  color: string;
  locked?: boolean;
  userId?: string;
  layer: number;
}

interface InspectorProps {
  element: CanvasElement;
  onClose: () => void;
  onChange: (element: CanvasElement) => void;
}

const colorOptions = [
  { name: 'أصفر', value: '#FEF3C7' },
  { name: 'أزرق', value: '#DBEAFE' },
  { name: 'أخضر', value: '#D1FAE5' },
  { name: 'وردي', value: '#FCE7F3' },
  { name: 'بنفسجي', value: '#E9D5FF' },
  { name: 'برتقالي', value: '#FED7AA' },
  { name: 'رمادي', value: '#F3F4F6' },
  { name: 'أحمر', value: '#FEE2E2' }
];

export const Inspector: React.FC<InspectorProps> = ({
  element,
  onClose,
  onChange
}) => {
  const [activeTab, setActiveTab] = useState<'style' | 'position' | 'content'>('content');

  const handleChange = (field: keyof CanvasElement, value: any) => {
    onChange({ ...element, [field]: value });
  };

  const handlePositionChange = (axis: 'x' | 'y', value: number) => {
    onChange({
      ...element,
      position: { ...element.position, [axis]: value }
    });
  };

  const handleSizeChange = (dimension: 'width' | 'height', value: number) => {
    onChange({
      ...element,
      size: { ...element.size, [dimension]: value }
    });
  };

  const tabs = [
    { id: 'content', label: 'المحتوى', icon: Type },
    { id: 'style', label: 'التصميم', icon: Palette },
    { id: 'position', label: 'الموقع', icon: Move }
  ];

  return (
    <div className="fixed left-4 top-1/2 transform -translate-y-1/2 w-80 glass-modal rounded-2xl overflow-hidden z-50 animate-slide-in-right">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/20">
        <h3 className="text-lg font-bold text-black">محرر العنصر</h3>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/20 text-gray-600"
        >
          <X size={18} />
        </button>
      </div>

      {/* Element Info */}
      <div className="p-4 border-b border-white/20 bg-white/10">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-gray-800">
              {element.type === 'sticky-note' && 'ملاحظة لاصقة'}
              {element.type === 'shape' && 'شكل'}
              {element.type === 'text' && 'نص'}
              {element.type === 'mindmap-node' && 'عقدة خريطة ذهنية'}
            </div>
            <div className="text-xs text-gray-600">ID: {element.id.slice(-8)}</div>
          </div>
          <div className="flex space-x-1 space-x-reverse">
            <button
              onClick={() => handleChange('locked', !element.locked)}
              className={`p-2 rounded-lg transition-colors ${
                element.locked ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
              }`}
              title={element.locked ? 'إلغاء القفل' : 'قفل'}
            >
              {element.locked ? <Lock size={14} /> : <Unlock size={14} />}
            </button>
            <button className="p-2 rounded-lg bg-blue-100 text-blue-600" title="نسخ">
              <Copy size={14} />
            </button>
            <button className="p-2 rounded-lg bg-red-100 text-red-600" title="حذف">
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/20">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 space-x-reverse py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="p-4 max-h-96 overflow-y-auto">
        {activeTab === 'content' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                النص
              </label>
              <textarea
                value={element.content}
                onChange={(e) => handleChange('content', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="أدخل النص..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الطبقة
              </label>
              <input
                type="number"
                value={element.layer}
                onChange={(e) => handleChange('layer', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                max="10"
              />
            </div>
          </div>
        )}

        {activeTab === 'style' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اللون
              </label>
              <div className="grid grid-cols-4 gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => handleChange('color', color.value)}
                    className={`w-12 h-12 rounded-lg border-2 transition-all ${
                      element.color === color.value
                        ? 'border-blue-500 scale-110'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                لون مخصص
              </label>
              <input
                type="color"
                value={element.color}
                onChange={(e) => handleChange('color', e.target.value)}
                className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        )}

        {activeTab === 'position' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الموقع الأفقي (X)
                </label>
                <input
                  type="number"
                  value={Math.round(element.position.x)}
                  onChange={(e) => handlePositionChange('x', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الموقع العمودي (Y)
                </label>
                <input
                  type="number"
                  value={Math.round(element.position.y)}
                  onChange={(e) => handlePositionChange('y', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  العرض
                </label>
                <input
                  type="number"
                  value={Math.round(element.size.width)}
                  onChange={(e) => handleSizeChange('width', parseInt(e.target.value) || 100)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الارتفاع
                </label>
                <input
                  type="number"
                  value={Math.round(element.size.height)}
                  onChange={(e) => handleSizeChange('height', parseInt(e.target.value) || 50)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="30"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};