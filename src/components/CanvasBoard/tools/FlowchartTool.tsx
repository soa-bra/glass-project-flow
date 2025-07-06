import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToolPanelContainer } from '@/components/custom/ToolPanelContainer';
import { Workflow, Square, Circle, Diamond, ArrowRight } from 'lucide-react';

interface FlowchartToolProps {
  selectedTool: string;
  onAddFlowchartElement: (element: {
    type: 'flowchart';
    shapeType: 'process' | 'decision' | 'start-end' | 'connector';
    text: string;
  }) => void;
}

export const FlowchartTool: React.FC<FlowchartToolProps> = ({ 
  selectedTool, 
  onAddFlowchartElement 
}) => {
  const [shapeType, setShapeType] = useState<'process' | 'decision' | 'start-end' | 'connector'>('process');
  const [text, setText] = useState('');

  if (selectedTool !== 'flowchart') return null;

  const flowchartShapes = [
    {
      type: 'process',
      label: 'عملية',
      description: 'خطوة أو عملية في المخطط',
      icon: Square,
      color: 'bg-blue-100 border-blue-300'
    },
    {
      type: 'decision',
      label: 'قرار',
      description: 'نقطة اتخاذ قرار',
      icon: Diamond,
      color: 'bg-yellow-100 border-yellow-300'
    },
    {
      type: 'start-end',
      label: 'بداية/نهاية',
      description: 'نقطة البداية أو النهاية',
      icon: Circle,
      color: 'bg-green-100 border-green-300'
    },
    {
      type: 'connector',
      label: 'رابط',
      description: 'سهم أو خط ربط',
      icon: ArrowRight,
      color: 'bg-gray-100 border-gray-300'
    }
  ];

  const handleAddShape = () => {
    onAddFlowchartElement({
      type: 'flowchart',
      shapeType,
      text: text || getDefaultText(shapeType)
    });
    setText('');
  };

  const getDefaultText = (type: string) => {
    switch (type) {
      case 'process': return 'عملية جديدة';
      case 'decision': return 'قرار؟';
      case 'start-end': return 'البداية';
      case 'connector': return '';
      default: return 'نص';
    }
  };

  return (
    <ToolPanelContainer title="أدوات المخطط الانسيابي">
      <div className="space-y-4">
        {/* اختيار نوع الشكل */}
        <div>
          <label className="text-sm font-medium font-arabic mb-2 block">نوع الشكل</label>
          <div className="grid gap-2">
            {flowchartShapes.map(shape => {
              const Icon = shape.icon;
              return (
                <button
                  key={shape.type}
                  onClick={() => setShapeType(shape.type as any)}
                  className={`p-3 rounded-lg border text-sm text-right font-arabic transition-colors ${
                    shapeType === shape.type 
                      ? 'bg-black text-white border-black' 
                      : `${shape.color} hover:opacity-80`
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{shape.label}</div>
                      <div className="text-xs opacity-80">{shape.description}</div>
                    </div>
                    <Icon className="w-5 h-5" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* النص */}
        {shapeType !== 'connector' && (
          <div>
            <label className="text-sm font-medium font-arabic mb-2 block">النص</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={getDefaultText(shapeType)}
              className="w-full p-2 border border-gray-300 rounded-lg font-arabic text-sm"
            />
          </div>
        )}

        {/* إضافة الشكل */}
        <Button 
          onClick={handleAddShape}
          className="w-full rounded-full"
        >
          <Workflow className="w-4 h-4 mr-2" />
          إضافة شكل
        </Button>

        {/* نصائح */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h4 className="text-sm font-medium font-arabic mb-2">💡 نصائح:</h4>
          <ul className="text-xs font-arabic text-blue-800 space-y-1">
            <li>• استخدم الأشكال الدائرية للبداية والنهاية</li>
            <li>• استخدم المعين لنقاط اتخاذ القرار</li>
            <li>• استخدم المستطيل للعمليات والخطوات</li>
            <li>• استخدم الأسهم لربط الأشكال</li>
          </ul>
        </div>
      </div>
    </ToolPanelContainer>
  );
};