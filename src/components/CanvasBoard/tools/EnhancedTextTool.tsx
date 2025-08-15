import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { 
  Type, AlignLeft, AlignCenter, AlignRight, 
  Bold, Italic, Underline, Palette, 
  Square, CornerRightUp
} from 'lucide-react';

interface EnhancedTextToolProps {
  selectedTool: string;
  onAddText: (config: {
    type: 'text' | 'text-box';
    content: string;
    style: {
      fontSize: number;
      fontFamily: string;
      color: string;
      backgroundColor?: string;
      borderColor?: string;
      borderWidth?: number;
      textAlign: 'left' | 'center' | 'right';
      fontWeight: 'normal' | 'bold';
      fontStyle: 'normal' | 'italic';
      textDecoration: 'none' | 'underline';
      padding?: number;
    };
  }) => void;
}

export const EnhancedTextTool: React.FC<EnhancedTextToolProps> = ({
  selectedTool,
  onAddText
}) => {
  const [textContent, setTextContent] = useState('');
  const [textType, setTextType] = useState<'text' | 'text-box'>('text');
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('Inter');
  const [textColor, setTextColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [borderColor, setBorderColor] = useState('#cccccc');
  const [borderWidth, setBorderWidth] = useState(1);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('right');
  const [fontWeight, setFontWeight] = useState<'normal' | 'bold'>('normal');
  const [fontStyle, setFontStyle] = useState<'normal' | 'italic'>('normal');
  const [textDecoration, setTextDecoration] = useState<'none' | 'underline'>('none');
  const [padding, setPadding] = useState(12);

  if (selectedTool !== 'text') return null;

  const fontFamilies = [
    { value: 'Inter', label: 'Inter' },
    { value: 'Cairo', label: 'Cairo (عربي)' },
    { value: 'Amiri', label: 'Amiri (عربي)' },
    { value: 'Roboto', label: 'Roboto' },
    { value: 'Open Sans', label: 'Open Sans' },
    { value: 'Montserrat', label: 'Montserrat' }
  ];

  const presetTexts = [
    'عنوان رئيسي',
    'عنوان فرعي',
    'نص وصفي',
    'ملاحظة مهمة',
    'تنبيه',
    'نص تجريبي للاختبار'
  ];

  const textPresets = [
    {
      name: 'عنوان كبير',
      config: { fontSize: 24, fontWeight: 'bold' as const, color: '#1f2937' }
    },
    {
      name: 'عنوان متوسط',
      config: { fontSize: 18, fontWeight: 'bold' as const, color: '#374151' }
    },
    {
      name: 'نص عادي',
      config: { fontSize: 14, fontWeight: 'normal' as const, color: '#6b7280' }
    },
    {
      name: 'نص صغير',
      config: { fontSize: 12, fontWeight: 'normal' as const, color: '#9ca3af' }
    }
  ];

  const handleAddText = () => {
    if (!textContent.trim()) return;

    const config = {
      type: textType,
      content: textContent,
      style: {
        fontSize,
        fontFamily,
        color: textColor,
        backgroundColor: textType === 'text-box' ? backgroundColor : undefined,
        borderColor: textType === 'text-box' ? borderColor : undefined,
        borderWidth: textType === 'text-box' ? borderWidth : undefined,
        textAlign,
        fontWeight,
        fontStyle,
        textDecoration,
        padding: textType === 'text-box' ? padding : undefined,
      }
    };

    onAddText(config);
    setTextContent(''); // مسح النص بعد الإضافة
  };

  const applyPreset = (preset: typeof textPresets[0]) => {
    setFontSize(preset.config.fontSize);
    setFontWeight(preset.config.fontWeight);
    setTextColor(preset.config.color);
  };

  return (
    <Card className="w-80 bg-white/95 backdrop-blur-xl shadow-lg border border-white/20 rounded-[24px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-arabic flex items-center gap-2">
          <Type className="w-5 h-5 text-purple-500" />
          أداة النص المتقدمة
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* نوع النص */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">نوع النص</h4>
          <div className="flex gap-2">
            <Button
              onClick={() => setTextType('text')}
              variant={textType === 'text' ? "default" : "outline"}
              size="sm"
              className="flex-1 text-xs font-arabic rounded-xl"
            >
              <Type className="w-3 h-3 mr-1" />
              نص حر
            </Button>
            <Button
              onClick={() => setTextType('text-box')}
              variant={textType === 'text-box' ? "default" : "outline"}
              size="sm"
              className="flex-1 text-xs font-arabic rounded-xl"
            >
              <Square className="w-3 h-3 mr-1" />
              صندوق نص
            </Button>
          </div>
          <p className="text-xs text-gray-500 font-arabic mt-1 text-center">
            {textType === 'text' ? 'نص بدون خلفية أو حدود' : 'نص مع خلفية وحدود'}
          </p>
        </div>

        {/* محتوى النص */}
        <div>
          <Label className="text-sm font-medium font-arabic mb-2 block">محتوى النص</Label>
          <Textarea
            placeholder="أدخل النص هنا..."
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            className="font-arabic text-right resize-none"
            rows={3}
          />
        </div>

        {/* نصوص جاهزة */}
        <div>
          <Label className="text-sm font-medium font-arabic mb-2 block">نصوص جاهزة</Label>
          <div className="grid grid-cols-2 gap-1">
            {presetTexts.map((preset, index) => (
              <button
                key={index}
                onClick={() => setTextContent(preset)}
                className="text-xs p-2 bg-gray-50 hover:bg-gray-100 rounded text-right font-arabic border border-gray-200 transition-colors"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        <Separator />

        {/* إعدادات مسبقة للتنسيق */}
        <div>
          <Label className="text-sm font-medium font-arabic mb-2 block">إعدادات مسبقة</Label>
          <div className="grid grid-cols-2 gap-2">
            {textPresets.map((preset, index) => (
              <Button
                key={index}
                onClick={() => applyPreset(preset)}
                variant="outline"
                size="sm"
                className="text-xs font-arabic rounded-lg"
              >
                {preset.name}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* تنسيق النص */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-3">تنسيق النص</h4>
          
          {/* حجم ونوع الخط */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <Label className="text-xs font-arabic mb-1 block">حجم الخط</Label>
              <Input
                type="number"
                min="8"
                max="72"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="text-center"
              />
            </div>
            <div>
              <Label className="text-xs font-arabic mb-1 block">نوع الخط</Label>
              <Select value={fontFamily} onValueChange={setFontFamily}>
                <SelectTrigger className="text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fontFamilies.map((font) => (
                    <SelectItem key={font.value} value={font.value} className="text-xs">
                      {font.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* أزرار التنسيق */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <Button
              onClick={() => setFontWeight(fontWeight === 'bold' ? 'normal' : 'bold')}
              variant={fontWeight === 'bold' ? "default" : "outline"}
              size="sm"
              className="text-xs rounded-lg"
            >
              <Bold className="w-3 h-3" />
            </Button>
            <Button
              onClick={() => setFontStyle(fontStyle === 'italic' ? 'normal' : 'italic')}
              variant={fontStyle === 'italic' ? "default" : "outline"}
              size="sm"
              className="text-xs rounded-lg"
            >
              <Italic className="w-3 h-3" />
            </Button>
            <Button
              onClick={() => setTextDecoration(textDecoration === 'underline' ? 'none' : 'underline')}
              variant={textDecoration === 'underline' ? "default" : "outline"}
              size="sm"
              className="text-xs rounded-lg"
            >
              <Underline className="w-3 h-3" />
            </Button>
          </div>

          {/* المحاذاة */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <Button
              onClick={() => setTextAlign('left')}
              variant={textAlign === 'left' ? "default" : "outline"}
              size="sm"
              className="text-xs rounded-lg"
            >
              <AlignLeft className="w-3 h-3" />
            </Button>
            <Button
              onClick={() => setTextAlign('center')}
              variant={textAlign === 'center' ? "default" : "outline"}
              size="sm"
              className="text-xs rounded-lg"
            >
              <AlignCenter className="w-3 h-3" />
            </Button>
            <Button
              onClick={() => setTextAlign('right')}
              variant={textAlign === 'right' ? "default" : "outline"}
              size="sm"
              className="text-xs rounded-lg"
            >
              <AlignRight className="w-3 h-3" />
            </Button>
          </div>

          {/* لون النص */}
          <div className="mb-3">
            <Label className="text-xs font-arabic mb-1 block">لون النص</Label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-8 h-8 rounded border cursor-pointer"
              />
              <Input
                type="text"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="flex-1 text-xs font-mono"
                placeholder="#000000"
              />
            </div>
          </div>
        </div>

        {/* إعدادات صندوق النص */}
        {textType === 'text-box' && (
          <>
            <Separator />
            <div>
              <h4 className="text-sm font-medium font-arabic mb-3">إعدادات الصندوق</h4>
              
              {/* لون الخلفية */}
              <div className="mb-3">
                <Label className="text-xs font-arabic mb-1 block">لون الخلفية</Label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-8 h-8 rounded border cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="flex-1 text-xs font-mono"
                    placeholder="#ffffff"
                  />
                </div>
              </div>

              {/* لون الحدود */}
              <div className="mb-3">
                <Label className="text-xs font-arabic mb-1 block">لون الحدود</Label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={borderColor}
                    onChange={(e) => setBorderColor(e.target.value)}
                    className="w-8 h-8 rounded border cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={borderColor}
                    onChange={(e) => setBorderColor(e.target.value)}
                    className="flex-1 text-xs font-mono"
                    placeholder="#cccccc"
                  />
                </div>
              </div>

              {/* سُمك الحدود والحشو */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs font-arabic mb-1 block">سُمك الحدود</Label>
                  <Input
                    type="number"
                    min="0"
                    max="10"
                    value={borderWidth}
                    onChange={(e) => setBorderWidth(Number(e.target.value))}
                    className="text-center"
                  />
                </div>
                <div>
                  <Label className="text-xs font-arabic mb-1 block">الحشو الداخلي</Label>
                  <Input
                    type="number"
                    min="0"
                    max="50"
                    value={padding}
                    onChange={(e) => setPadding(Number(e.target.value))}
                    className="text-center"
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* معاينة */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <h4 className="text-sm font-medium font-arabic mb-2">معاينة:</h4>
          <div className="bg-white rounded-lg border p-4 min-h-[60px] flex items-center justify-center">
            <div
              style={{
                fontSize: `${fontSize}px`,
                fontFamily,
                color: textColor,
                backgroundColor: textType === 'text-box' ? backgroundColor : 'transparent',
                borderColor: textType === 'text-box' ? borderColor : 'transparent',
                borderWidth: textType === 'text-box' ? `${borderWidth}px` : '0',
                borderStyle: 'solid',
                textAlign,
                fontWeight,
                fontStyle,
                textDecoration,
                padding: textType === 'text-box' ? `${padding}px` : '0',
                borderRadius: '4px',
                maxWidth: '200px',
                wordWrap: 'break-word'
              }}
            >
              {textContent || 'نص تجريبي للمعاينة'}
            </div>
          </div>
        </div>

        {/* إضافة النص */}
        <Button 
          onClick={handleAddText}
          disabled={!textContent.trim()}
          className="w-full rounded-xl font-arabic"
        >
          <Type className="w-4 h-4 mr-2" />
          {textType === 'text' ? 'إضافة النص' : 'إضافة صندوق النص'}
        </Button>

        {/* نصائح الاستخدام */}
        <div className="bg-purple-50 p-3 rounded-xl border border-purple-200">
          <div className="text-xs text-purple-800 font-arabic space-y-1">
            <div>📝 نقر واحد لإضافة نص حر</div>
            <div>🎯 سحب لإنشاء صندوق نص</div>
            <div>✏️ انقر مرتين لتعديل النص</div>
            <div>⚙️ استخدم الإعدادات المسبقة للسرعة</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedTextTool;