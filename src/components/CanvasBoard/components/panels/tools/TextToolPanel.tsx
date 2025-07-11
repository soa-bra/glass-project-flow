import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Type, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

export const TextToolPanel: React.FC = () => {
  const [fontSize, setFontSize] = useState('16');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [textAlign, setTextAlign] = useState('left');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  const fontSizes = ['12', '14', '16', '18', '20', '24', '28', '32', '36', '48', '64'];
  const fontFamilies = [
    'Arial',
    'Times New Roman',
    'Helvetica',
    'Georgia',
    'Verdana',
    'Courier New',
    'Impact',
    'Comic Sans MS'
  ];

  const handleAddHeading = (level: number) => {
    console.log(`إضافة عنوان مستوى ${level}`);
  };

  const handleAddParagraph = () => {
    console.log('إضافة فقرة');
  };

  const handleAddList = (type: 'bullet' | 'numbered') => {
    console.log(`إضافة قائمة ${type === 'bullet' ? 'نقطية' : 'مرقمة'}`);
  };

  return (
    <div className="space-y-4">
      {/* Text Type Quick Actions */}
      <div>
        <h4 className="text-sm font-medium font-arabic mb-3 text-black">أنواع النصوص</h4>
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => handleAddHeading(1)}
            size="sm"
            className="rounded-[12px] bg-[#96d8d0] hover:bg-[#96d8d0]/80 text-black border-none font-arabic"
          >
            <Type className="w-4 h-4 mr-2" />
            عنوان رئيسي
          </Button>
          <Button
            onClick={() => handleAddHeading(2)}
            size="sm"
            className="rounded-[12px] bg-[#a4e2f6] hover:bg-[#a4e2f6]/80 text-black border-none font-arabic"
          >
            <Type className="w-3 h-3 mr-2" />
            عنوان فرعي
          </Button>
          <Button
            onClick={handleAddParagraph}
            size="sm"
            className="rounded-[12px] bg-[#bdeed3] hover:bg-[#bdeed3]/80 text-black border-none font-arabic"
          >
            فقرة
          </Button>
          <Button
            onClick={() => handleAddList('bullet')}
            size="sm"
            className="rounded-[12px] bg-[#fbe2aa] hover:bg-[#fbe2aa]/80 text-black border-none font-arabic"
          >
            قائمة نقطية
          </Button>
        </div>
      </div>

      <Separator className="bg-[#d1e1ea]" />

      {/* Font Settings */}
      <div>
        <h4 className="text-sm font-medium font-arabic mb-3 text-black">إعدادات الخط</h4>
        
        {/* Font Family */}
        <div className="mb-3">
          <label className="text-xs font-arabic text-black/70 mb-1 block">نوع الخط</label>
          <Select value={fontFamily} onValueChange={setFontFamily}>
            <SelectTrigger className="rounded-[12px] border-[#d1e1ea] text-black">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fontFamilies.map((font) => (
                <SelectItem key={font} value={font}>
                  <span style={{ fontFamily: font }}>{font}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Font Size */}
        <div className="mb-3">
          <label className="text-xs font-arabic text-black/70 mb-1 block">حجم الخط</label>
          <Select value={fontSize} onValueChange={setFontSize}>
            <SelectTrigger className="rounded-[12px] border-[#d1e1ea] text-black">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fontSizes.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}px
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator className="bg-[#d1e1ea]" />

      {/* Text Formatting */}
      <div>
        <h4 className="text-sm font-medium font-arabic mb-3 text-black">تنسيق النص</h4>
        <div className="grid grid-cols-3 gap-2 mb-3">
          <Button
            onClick={() => setIsBold(!isBold)}
            variant={isBold ? "default" : "outline"}
            size="sm"
            className={`rounded-[12px] ${
              isBold 
                ? 'bg-[#96d8d0] text-black hover:bg-[#96d8d0]/80 border-none' 
                : 'border-[#d1e1ea] text-black hover:bg-[#e9eff4]/50'
            }`}
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => setIsItalic(!isItalic)}
            variant={isItalic ? "default" : "outline"}
            size="sm"
            className={`rounded-[12px] ${
              isItalic 
                ? 'bg-[#a4e2f6] text-black hover:bg-[#a4e2f6]/80 border-none' 
                : 'border-[#d1e1ea] text-black hover:bg-[#e9eff4]/50'
            }`}
          >
            <Italic className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => setIsUnderline(!isUnderline)}
            variant={isUnderline ? "default" : "outline"}
            size="sm"
            className={`rounded-[12px] ${
              isUnderline 
                ? 'bg-[#bdeed3] text-black hover:bg-[#bdeed3]/80 border-none' 
                : 'border-[#d1e1ea] text-black hover:bg-[#e9eff4]/50'
            }`}
          >
            <Underline className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Separator className="bg-[#d1e1ea]" />

      {/* Text Alignment */}
      <div>
        <h4 className="text-sm font-medium font-arabic mb-3 text-black">محاذاة النص</h4>
        <div className="grid grid-cols-3 gap-2">
          <Button
            onClick={() => setTextAlign('left')}
            variant={textAlign === 'left' ? "default" : "outline"}
            size="sm"
            className={`rounded-[12px] ${
              textAlign === 'left'
                ? 'bg-[#d9d2fd] text-black hover:bg-[#d9d2fd]/80 border-none'
                : 'border-[#d1e1ea] text-black hover:bg-[#e9eff4]/50'
            }`}
          >
            <AlignLeft className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => setTextAlign('center')}
            variant={textAlign === 'center' ? "default" : "outline"}
            size="sm"
            className={`rounded-[12px] ${
              textAlign === 'center'
                ? 'bg-[#fbe2aa] text-black hover:bg-[#fbe2aa]/80 border-none'
                : 'border-[#d1e1ea] text-black hover:bg-[#e9eff4]/50'
            }`}
          >
            <AlignCenter className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => setTextAlign('right')}
            variant={textAlign === 'right' ? "default" : "outline"}
            size="sm"
            className={`rounded-[12px] ${
              textAlign === 'right'
                ? 'bg-[#f1b5b9] text-black hover:bg-[#f1b5b9]/80 border-none'
                : 'border-[#d1e1ea] text-black hover:bg-[#e9eff4]/50'
            }`}
          >
            <AlignRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Separator className="bg-[#d1e1ea]" />

      {/* Text Color */}
      <div>
        <h4 className="text-sm font-medium font-arabic mb-3 text-black">لون النص</h4>
        <div className="grid grid-cols-5 gap-2">
          {['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#800080'].map((color) => (
            <Button
              key={color}
              className="w-8 h-8 rounded-[8px] border-2 border-[#d1e1ea] p-0"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-[#e9eff4]/50 p-3 rounded-[16px] border border-[#d1e1ea]">
        <div className="text-xs text-black font-arabic space-y-1">
          <div>💡 انقر على الكانفس لإضافة نص جديد</div>
          <div>✏️ انقر مرتين على النص لتحريره</div>
          <div>🎨 اختر الإعدادات قبل إضافة النص</div>
        </div>
      </div>
    </div>
  );
};