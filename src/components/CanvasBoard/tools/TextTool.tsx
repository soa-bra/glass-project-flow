import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ToolPanelContainer } from '@/components/custom/ToolPanelContainer';
import { Type, Palette } from 'lucide-react';

interface TextToolProps {
  selectedTool: string;
  elementId: string | null;
  onTextUpdate?: (elementId: string, text: string, style?: any) => void;
}

export const TextTool: React.FC<TextToolProps> = ({ 
  selectedTool, 
  elementId, 
  onTextUpdate 
}) => {
  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState(14);
  const [color, setColor] = useState('#000000');
  const [isBold, setIsBold] = useState(false);

  if (selectedTool !== 'text') return null;

  const handleApplyText = () => {
    if (!elementId || !onTextUpdate) return;
    
    const style = {
      fontSize: `${fontSize}px`,
      color,
      fontWeight: isBold ? 'bold' : 'normal'
    };
    
    onTextUpdate(elementId, text, style);
  };

  const presetTexts = [
    'عنوان رئيسي',
    'عنوان فرعي', 
    'نص وصفي',
    'ملاحظة مهمة',
    'تنبيه'
  ];

  return (
    <ToolPanelContainer title="أداة النص">
      <div className="space-y-4">
        {/* النص */}
        <div>
          <label className="text-sm font-medium font-arabic mb-2 block">المحتوى</label>
          <Input 
            placeholder="أدخل النص هنا" 
            value={text} 
            onChange={(e) => setText(e.target.value)}
            className="font-arabic"
          />
        </div>

        {/* نصوص جاهزة */}
        <div>
          <label className="text-sm font-medium font-arabic mb-2 block">نصوص جاهزة</label>
          <div className="grid grid-cols-1 gap-1">
            {presetTexts.map((preset, index) => (
              <button
                key={index}
                onClick={() => setText(preset)}
                className="text-xs p-2 bg-gray-50 hover:bg-gray-100 rounded text-right font-arabic border border-gray-200"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* حجم الخط */}
        <div>
          <label className="text-sm font-medium font-arabic mb-2 block">حجم الخط</label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="8"
              max="72"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-20"
            />
            <span className="text-xs text-gray-500">بكسل</span>
          </div>
        </div>

        {/* اللون */}
        <div>
          <label className="text-sm font-medium font-arabic mb-2 block">لون النص</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-10 h-8 rounded border border-gray-300 cursor-pointer"
            />
            <Input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="flex-1 text-xs"
              placeholder="#000000"
            />
          </div>
        </div>

        {/* تنسيق */}
        <div>
          <label className="text-sm font-medium font-arabic mb-2 block">التنسيق</label>
          <Button
            variant={isBold ? "default" : "outline"}
            size="sm"
            onClick={() => setIsBold(!isBold)}
            className="rounded-full"
          >
            <Type className="w-4 h-4 mr-2" />
            {isBold ? 'عريض' : 'عادي'}
          </Button>
        </div>

        {/* تطبيق */}
        <Button 
          onClick={handleApplyText}
          disabled={!elementId || !text.trim()}
          className="w-full rounded-full"
        >
          <Type className="w-4 h-4 mr-2" />
          تطبيق النص
        </Button>

        {!elementId && (
          <p className="text-xs text-gray-500 font-arabic text-center">
            حدد عنصراً لتطبيق النص عليه
          </p>
        )}
      </div>
    </ToolPanelContainer>
  );
};