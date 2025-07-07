import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ToolPanelContainer } from '@/components/custom/ToolPanelContainer';
import { Square, Circle, Triangle , Hexagon } from 'lucide-react';

interface ShapeToolProps {
  selectedTool: string;
  onAddShape: (shape: {
    type: 'rectangle' | 'circle' | 'triangle' | 'hexagon';
    width: number;
    height: number;
    color: string;
    strokeColor: string;
    strokeWidth: number;
  }) => void;
}

export const ShapeTool: React.FC<ShapeToolProps> = ({ 
  selectedTool, 
  onAddShape 
}) => {
  const [shapeType, setShapeType] = useState<'rectangle' | 'circle' | 'triangle' | 'hexagon'>('rectangle');
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);
  const [fillColor, setFillColor] = useState('#3b82f6');
  const [strokeColor, setStrokeColor] = useState('#1e40af');
  const [strokeWidth, setStrokeWidth] = useState(2);

  if (selectedTool !== 'shape') return null;

  const shapes = [
    {
      type: 'rectangle',
      label: 'مستطيل',
      icon: Square,
      color: 'bg-blue-50 border-blue-200'
    },
    {
      type: 'circle',
      label: 'دائرة',
      icon: Circle,
      color: 'bg-green-50 border-green-200'
    },
    {
      type: 'triangle',
      label: 'مثلث', 
      icon: Triangle,
      color: 'bg-yellow-50 border-yellow-200'
    },
    {
      type: 'hexagon',
      label: 'سداسي',
      icon: Hexagon,
      color: 'bg-purple-50 border-purple-200'
    }
  ];

  const handleAddShape = () => {
    onAddShape({
      type: shapeType,
      width,
      height: shapeType === 'circle' ? width : height, // للدائرة نستخدم نفس القيمة
      color: fillColor,
      strokeColor,
      strokeWidth
    });
  };

  return (
    <ToolPanelContainer title="أداة الأشكال الهندسية">
      <div className="space-y-4">
        {/* اختيار نوع الشكل */}
        <div>
          <label className="text-sm font-medium font-arabic mb-2 block">نوع الشكل</label>
          <div className="grid grid-cols-2 gap-2">
            {shapes.map(shape => {
              const Icon = shape.icon;
              return (
                <button
                  key={shape.type}
                  onClick={() => setShapeType(shape.type as any)}
                  className={`p-3 rounded-lg border text-sm font-arabic transition-colors ${
                    shapeType === shape.type 
                      ? 'bg-black text-white border-black' 
                      : `${shape.color} hover:opacity-80`
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <Icon className="w-5 h-5" />
                    <span>{shape.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* الأبعاد */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium font-arabic mb-1 block">العرض</label>
            <Input
              type="number"
              value={width}
              onChange={(e) => setWidth(Math.max(20, Number(e.target.value)))}
              min={20}
              max={500}
              className="font-mono"
            />
          </div>
          
          {shapeType !== 'circle' && (
            <div>
              <label className="text-sm font-medium font-arabic mb-1 block">الارتفاع</label>
              <Input
                type="number"
                value={height}
                onChange={(e) => setHeight(Math.max(20, Number(e.target.value)))}
                min={20}
                max={500}
                className="font-mono"
              />
            </div>
          )}
        </div>

        {/* الألوان */}
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium font-arabic mb-2 block">لون التعبئة</label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={fillColor}
                onChange={(e) => setFillColor(e.target.value)}
                className="w-12 h-8 rounded border cursor-pointer"
              />
              <Input
                type="text"
                value={fillColor}
                onChange={(e) => setFillColor(e.target.value)}
                className="font-mono text-sm"
                placeholder="#3b82f6"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium font-arabic mb-2 block">لون الحدود</label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={strokeColor}
                onChange={(e) => setStrokeColor(e.target.value)}
                className="w-12 h-8 rounded border cursor-pointer"
              />
              <Input
                type="text"
                value={strokeColor}
                onChange={(e) => setStrokeColor(e.target.value)}
                className="font-mono text-sm"
                placeholder="#1e40af"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium font-arabic mb-2 block">سُمك الحدود</label>
            <Input
              type="number"
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(Math.max(0, Number(e.target.value)))}
              min={0}
              max={10}
              className="font-mono"
            />
          </div>
        </div>

        {/* معاينة */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-medium font-arabic mb-2">معاينة:</h4>
          <div className="flex justify-center">
            <div
              className="border rounded"
              style={{
                width: Math.min(width, 80),
                height: shapeType === 'circle' ? Math.min(width, 80) : Math.min(height, 80),
                backgroundColor: fillColor,
                borderColor: strokeColor,
                borderWidth: strokeWidth,
                borderRadius: shapeType === 'circle' ? '50%' : 
                           shapeType === 'rectangle' ? '4px' : '0'
              }}
            />
          </div>
        </div>

        {/* إضافة الشكل */}
        <Button 
          onClick={handleAddShape}
          className="w-full rounded-full"
        >
          <Square className="w-4 h-4 mr-2" />
          إضافة الشكل
        </Button>
      </div>
    </ToolPanelContainer>
  );
};