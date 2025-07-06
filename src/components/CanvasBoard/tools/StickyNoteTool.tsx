import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ToolPanelContainer } from '@/components/custom/ToolPanelContainer';
import { StickyNote, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface StickyNoteToolProps {
  selectedTool: string;
  onAddSticky: (note: { text: string; color: string; size: 'small' | 'medium' | 'large' }) => void;
}

export const StickyNoteTool: React.FC<StickyNoteToolProps> = ({ 
  selectedTool, 
  onAddSticky 
}) => {
  const [text, setText] = useState('');
  const [color, setColor] = useState('#fef3c7'); // أصفر فاتح
  const [size, setSize] = useState<'small' | 'medium' | 'large'>('medium');

  if (selectedTool !== 'sticky') return null;

  const predefinedColors = [
    { name: 'أصفر', value: '#fef3c7' },
    { name: 'وردي', value: '#fce7f3' },
    { name: 'أزرق', value: '#dbeafe' },
    { name: 'أخضر', value: '#d1fae5' },
    { name: 'برتقالي', value: '#fed7aa' },
    { name: 'بنفسجي', value: '#e9d5ff' }
  ];

  const sizes = [
    { value: 'small', label: 'صغير', dimensions: '100×80' },
    { value: 'medium', label: 'متوسط', dimensions: '150×120' },
    { value: 'large', label: 'كبير', dimensions: '200×160' }
  ];

  const templates = [
    'فكرة جديدة',
    'مهمة مهمة',
    'تذكير',
    'سؤال مهم',
    'ملاحظة سريعة'
  ];

  const handleAdd = () => {
    if (!text.trim()) {
      toast.error('يرجى كتابة نص الملاحظة');
      return;
    }
    
    onAddSticky({ text: text.trim(), color, size });
    setText('');
    toast.success('تم إضافة الملاحظة اللاصقة');
  };

  return (
    <ToolPanelContainer title="ملاحظة لاصقة">
      <div className="space-y-4">
        {/* النص */}
        <div>
          <label className="text-sm font-medium font-arabic mb-2 block">نص الملاحظة</label>
          <Textarea
            placeholder="أدخل نص الملاحظة..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="resize-none font-arabic"
            rows={3}
            maxLength={200}
          />
          <div className="text-xs text-gray-500 mt-1 text-left">
            {text.length}/200
          </div>
        </div>

        {/* قوالب سريعة */}
        <div>
          <label className="text-sm font-medium font-arabic mb-2 block">قوالب سريعة</label>
          <div className="grid grid-cols-1 gap-1">
            {templates.map((template, index) => (
              <button
                key={index}
                onClick={() => setText(template)}
                className="text-xs p-2 bg-gray-50 hover:bg-gray-100 rounded text-right font-arabic border border-gray-200"
              >
                {template}
              </button>
            ))}
          </div>
        </div>

        {/* الحجم */}
        <div>
          <label className="text-sm font-medium font-arabic mb-2 block">حجم الملاحظة</label>
          <div className="grid grid-cols-1 gap-2">
            {sizes.map(s => (
              <button
                key={s.value}
                onClick={() => setSize(s.value as any)}
                className={`p-2 rounded border text-sm font-arabic ${
                  size === s.value 
                    ? 'bg-black text-white border-black' 
                    : 'bg-white border-gray-300 hover:bg-gray-50'
                }`}
              >
                {s.label} ({s.dimensions} بكسل)
              </button>
            ))}
          </div>
        </div>

        {/* اللون */}
        <div>
          <label className="text-sm font-medium font-arabic mb-2 block">لون الملاحظة</label>
          <div className="grid grid-cols-3 gap-2 mb-2">
            {predefinedColors.map(colorOption => (
              <button
                key={colorOption.value}
                onClick={() => setColor(colorOption.value)}
                className={`w-full h-8 rounded border-2 ${
                  color === colorOption.value ? 'border-black' : 'border-gray-300'
                }`}
                style={{ backgroundColor: colorOption.value }}
                title={colorOption.name}
              />
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
            />
            <Input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="flex-1 text-xs"
              placeholder="#fef3c7"
            />
          </div>
        </div>

        {/* معاينة */}
        <div>
          <label className="text-sm font-medium font-arabic mb-2 block">معاينة</label>
          <div 
            className="p-3 rounded shadow-sm border"
            style={{ 
              backgroundColor: color,
              minHeight: size === 'small' ? '60px' : size === 'medium' ? '80px' : '100px'
            }}
          >
            <div className="text-sm font-arabic">
              {text || 'معاينة النص...'}
            </div>
          </div>
        </div>

        {/* إضافة */}
        <Button 
          className="w-full rounded-full" 
          onClick={handleAdd}
          disabled={!text.trim()}
        >
          <Plus className="w-4 h-4 mr-2" />
          إضافة ملاحظة
        </Button>
      </div>
    </ToolPanelContainer>
  );
};