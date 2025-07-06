import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ToolPanelContainer } from '@/components/custom/ToolPanelContainer';
import { MessageSquare, MapPin, Tag, AlertCircle } from 'lucide-react';

interface AnnotationToolProps {
  selectedTool: string;
  selectedElementId: string | null;
  onAddAnnotation: (annotation: {
    type: 'comment' | 'pin' | 'label' | 'highlight';
    content: string;
    color: string;
    elementId?: string;
  }) => void;
}

export const AnnotationTool: React.FC<AnnotationToolProps> = ({ 
  selectedTool, 
  selectedElementId,
  onAddAnnotation 
}) => {
  const [annotationType, setAnnotationType] = useState<'comment' | 'pin' | 'label' | 'highlight'>('comment');
  const [content, setContent] = useState('');
  const [selectedColor, setSelectedColor] = useState('#fbbf24');

  if (selectedTool !== 'annotation') return null;

  const annotationTypes = [
    {
      type: 'comment',
      label: 'تعليق',
      description: 'إضافة تعليق أو ملاحظة',
      icon: MessageSquare,
      colors: ['#fbbf24', '#fb7185', '#60a5fa', '#34d399']
    },
    {
      type: 'pin',
      label: 'دبوس',
      description: 'وضع علامة أو إشارة',
      icon: MapPin,
      colors: ['#ef4444', '#f97316', '#eab308', '#22c55e']
    },
    {
      type: 'label',
      label: 'تسمية',
      description: 'إضافة تسمية أو وسم',
      icon: Tag,
      colors: ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b']
    },
    {
      type: 'highlight',
      label: 'تمييز',
      description: 'تمييز منطقة مهمة',
      icon: AlertCircle,
      colors: ['#fef3c7', '#fed7d7', '#dbeafe', '#d1fae5']
    }
  ];

  const currentType = annotationTypes.find(t => t.type === annotationType);

  const handleAddAnnotation = () => {
    if (!content.trim()) return;

    onAddAnnotation({
      type: annotationType,
      content: content.trim(),
      color: selectedColor,
      elementId: selectedElementId || undefined
    });

    setContent('');
  };

  return (
    <ToolPanelContainer title="أدوات التعليق والتوضيح">
      <div className="space-y-4">
        {/* نوع التعليق */}
        <div>
          <label className="text-sm font-medium font-arabic mb-2 block">نوع التعليق</label>
          <div className="grid gap-2">
            {annotationTypes.map(type => {
              const Icon = type.icon;
              return (
                <button
                  key={type.type}
                  onClick={() => setAnnotationType(type.type as any)}
                  className={`p-3 rounded-lg border text-sm text-right font-arabic transition-colors ${
                    annotationType === type.type 
                      ? 'bg-black text-white border-black' 
                      : 'bg-white border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-xs opacity-80">{type.description}</div>
                    </div>
                    <Icon className="w-4 h-4" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* اللون */}
        {currentType && (
          <div>
            <label className="text-sm font-medium font-arabic mb-2 block">اللون</label>
            <div className="flex gap-2">
              {currentType.colors.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    selectedColor === color 
                      ? 'border-black scale-110' 
                      : 'border-gray-300 hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        )}

        {/* المحتوى */}
        <div>
          <label className="text-sm font-medium font-arabic mb-2 block">المحتوى</label>
          {annotationType === 'comment' ? (
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="اكتب تعليقك هنا..."
              className="font-arabic text-sm"
              rows={3}
            />
          ) : (
            <Input
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                annotationType === 'pin' ? 'نص الدبوس...' :
                annotationType === 'label' ? 'نص التسمية...' :
                'نص التمييز...'
              }
              className="font-arabic text-sm"
            />
          )}
        </div>

        {/* معلومات العنصر المحدد */}
        {selectedElementId && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm font-arabic text-green-800">
              ✓ سيتم ربط التعليق بالعنصر المحدد
            </p>
          </div>
        )}

        {/* إضافة التعليق */}
        <Button 
          onClick={handleAddAnnotation}
          disabled={!content.trim()}
          className="w-full rounded-full"
        >
          {currentType && <currentType.icon className="w-4 h-4 mr-2" />}
          إضافة {currentType?.label}
        </Button>

        {/* إرشادات */}
        <div className="border-t pt-3">
          <div className="text-xs text-gray-500 font-arabic space-y-1">
            <div>• حدد عنصراً أولاً لربط التعليق به</div>
            <div>• يمكن إضافة عدة تعليقات لنفس العنصر</div>
            <div>• استخدم الألوان للتصنيف والتنظيم</div>
          </div>
        </div>
      </div>
    </ToolPanelContainer>
  );
};