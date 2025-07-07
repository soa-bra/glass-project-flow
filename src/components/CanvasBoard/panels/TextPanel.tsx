import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Type, Square, Sparkles, AlignLeft, AlignCenter, AlignRight, Bold, Italic } from 'lucide-react';

interface TextPanelProps {
  onAddText: (type: 'text' | 'textBox' | 'textToShape', config: any) => void;
}

const TextPanel: React.FC<TextPanelProps> = ({ onAddText }) => {
  const [textType, setTextType] = useState<'text' | 'textBox' | 'textToShape'>('text');
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('IBM Plex Sans Arabic');
  const [fontWeight, setFontWeight] = useState('400');
  const [textColor, setTextColor] = useState('#000000');
  const [textAlign, setTextAlign] = useState('right');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);

  const googleFonts = [
    'IBM Plex Sans Arabic',
    'Noto Sans Arabic',
    'Cairo',
    'Amiri',
    'Rubik',
    'Inter',
    'Open Sans',
    'Roboto'
  ];

  const textTypes = [
    { id: 'text', label: 'نص', icon: Type, description: 'نص بسيط' },
    { id: 'textBox', label: 'مربع نص', icon: Square, description: 'نص داخل إطار' },
    { id: 'textToShape', label: 'نص إلى شكل', icon: Sparkles, description: 'تحويل النص لشكل هندسي' }
  ];

  const handleAddText = () => {
    const config = {
      fontSize,
      fontFamily,
      fontWeight: isBold ? '700' : fontWeight,
      color: textColor,
      align: textAlign,
      italic: isItalic
    };
    onAddText(textType, config);
  };

  return (
    <Card className="w-80 bg-white/95 backdrop-blur-xl shadow-lg border border-white/20 rounded-[24px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-arabic flex items-center gap-2">
          <Type className="w-5 h-5 text-green-500" />
          أداة النصوص
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* نوع النص */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">نوع النص</h4>
          <div className="space-y-2">
            {textTypes.map(type => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setTextType(type.id as any)}
                  className={`w-full p-3 rounded-xl border text-sm text-right font-arabic transition-colors ${
                    textType === type.id 
                      ? 'bg-green-500 text-white border-green-500' 
                      : 'bg-white border-gray-200 hover:bg-gray-50'
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

        <Separator />

        {/* إعدادات الخط */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-3">إعدادات الخط</h4>
          
          {/* نوع الخط */}
          <div className="space-y-2">
            <label className="text-xs font-arabic">نوع الخط</label>
            <Select value={fontFamily} onValueChange={setFontFamily}>
              <SelectTrigger className="rounded-xl border-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {googleFonts.map(font => (
                  <SelectItem key={font} value={font} className="font-arabic">
                    {font}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* حجم الخط */}
          <div className="space-y-2">
            <label className="text-xs font-arabic">حجم الخط: {fontSize}px</label>
            <Slider
              value={[fontSize]}
              onValueChange={(value) => setFontSize(value[0])}
              max={72}
              min={8}
              step={1}
              className="w-full"
            />
          </div>

          {/* لون النص */}
          <div className="space-y-2">
            <label className="text-xs font-arabic">لون النص</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-8 h-8 rounded-xl border border-gray-200"
              />
              <Input
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="text-xs rounded-xl border-gray-200"
                placeholder="#000000"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* أدوات التنسيق */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">التنسيق</h4>
          
          {/* المحاذاة */}
          <div className="flex gap-1 mb-3">
            <Button
              size="sm"
              variant={textAlign === 'left' ? 'default' : 'outline'}
              onClick={() => setTextAlign('left')}
              className="rounded-xl"
            >
              <AlignLeft className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant={textAlign === 'center' ? 'default' : 'outline'}
              onClick={() => setTextAlign('center')}
              className="rounded-xl"
            >
              <AlignCenter className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant={textAlign === 'right' ? 'default' : 'outline'}
              onClick={() => setTextAlign('right')}
              className="rounded-xl"
            >
              <AlignRight className="w-3 h-3" />
            </Button>
          </div>

          {/* التأثيرات */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={isBold ? 'default' : 'outline'}
              onClick={() => setIsBold(!isBold)}
              className="rounded-xl"
            >
              <Bold className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant={isItalic ? 'default' : 'outline'}
              onClick={() => setIsItalic(!isItalic)}
              className="rounded-xl"
            >
              <Italic className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* معاينة النص */}
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
          <h4 className="text-sm font-medium font-arabic mb-2">معاينة</h4>
          <div 
            className="p-2 bg-white rounded-lg border"
            style={{
              fontFamily,
              fontSize: `${fontSize}px`,
              color: textColor,
              textAlign: textAlign as any,
              fontWeight: isBold ? '700' : fontWeight,
              fontStyle: isItalic ? 'italic' : 'normal'
            }}
          >
            نص تجريبي للمعاينة
          </div>
        </div>

        {/* إضافة النص */}
        <Button
          onClick={handleAddText}
          className="w-full text-sm font-arabic rounded-xl"
        >
          <Type className="w-4 h-4 mr-2" />
          إضافة النص
        </Button>

        {/* نصائح */}
        <div className="bg-green-50 p-3 rounded-xl border border-green-200">
          <div className="text-xs text-green-800 font-arabic space-y-1">
            <div>📝 انقر على الكانفس لإضافة النص</div>
            <div>🎨 استخدم الألوان والخطوط المختلفة</div>
            <div>✨ نص إلى شكل يحول النص لعنصر بصري</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TextPanel;