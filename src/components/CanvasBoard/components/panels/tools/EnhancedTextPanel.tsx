import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Type, 
  Bold, 
  Italic, 
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Palette,
  Highlighter,
  MoreHorizontal,
  Strikethrough,
  Subscript,
  Superscript,
  Quote,
  List,
  ListOrdered,
  Indent,
  Outdent,
  Link,
  Hash,
  AtSign,
  Sparkles,
  Languages,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

interface TextStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  fontStyle: 'normal' | 'italic';
  textDecoration: 'none' | 'underline' | 'line-through' | 'overline';
  textAlign: 'left' | 'center' | 'right' | 'justify';
  color: string;
  backgroundColor?: string;
  lineHeight: number;
  letterSpacing: number;
  textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
}

interface EnhancedTextPanelProps {
  selectedText?: string;
  textStyle?: Partial<TextStyle>;
  onTextUpdate?: (text: string) => void;
  onStyleUpdate?: (style: Partial<TextStyle>) => void;
  onAddText?: (text: string, style: TextStyle) => void;
}

const fontFamilies = [
  { name: 'Tajawal', label: 'تجوال', category: 'arabic' },
  { name: 'Amiri', label: 'أميري', category: 'arabic' },
  { name: 'Noto Sans Arabic', label: 'نوتو سانز', category: 'arabic' },
  { name: 'Cairo', label: 'القاهرة', category: 'arabic' },
  { name: 'Inter', label: 'إنتر', category: 'latin' },
  { name: 'Roboto', label: 'روبوتو', category: 'latin' },
  { name: 'Open Sans', label: 'أوبن سانز', category: 'latin' },
  { name: 'Poppins', label: 'بوبينز', category: 'latin' }
];

const presetStyles = [
  { name: 'عنوان رئيسي', fontSize: 32, fontWeight: 'bold', color: '#1a1a1a' },
  { name: 'عنوان فرعي', fontSize: 24, fontWeight: '600', color: '#374151' },
  { name: 'نص عادي', fontSize: 16, fontWeight: 'normal', color: '#6b7280' },
  { name: 'نص صغير', fontSize: 14, fontWeight: 'normal', color: '#9ca3af' },
  { name: 'تسمية توضيحية', fontSize: 12, fontWeight: '500', color: '#6b7280' },
  { name: 'اقتباس', fontSize: 18, fontWeight: 'normal', fontStyle: 'italic', color: '#4b5563' }
];

const colorPalette = [
  '#000000', '#374151', '#6b7280', '#9ca3af',
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4'
];

export const EnhancedTextPanel: React.FC<EnhancedTextPanelProps> = ({
  selectedText = '',
  textStyle = {},
  onTextUpdate,
  onStyleUpdate,
  onAddText
}) => {
  const [activeTab, setActiveTab] = useState('content');
  const [textContent, setTextContent] = useState(selectedText);
  const [currentStyle, setCurrentStyle] = useState<TextStyle>({
    fontFamily: 'Tajawal',
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    textDecoration: 'none',
    textAlign: 'right',
    color: '#000000',
    lineHeight: 1.5,
    letterSpacing: 0,
    textTransform: 'none',
    ...textStyle
  });

  const updateStyle = (updates: Partial<TextStyle>) => {
    const newStyle = { ...currentStyle, ...updates };
    setCurrentStyle(newStyle);
    onStyleUpdate?.(updates);
  };

  const handleAddText = () => {
    if (textContent.trim() && onAddText) {
      onAddText(textContent, currentStyle);
      toast.success('تم إضافة النص إلى الكانفاس');
      setTextContent('');
    }
  };

  const applyPresetStyle = (preset: any) => {
    const presetStyle = {
      fontSize: preset.fontSize,
      fontWeight: preset.fontWeight,
      color: preset.color,
      fontStyle: preset.fontStyle || 'normal'
    };
    updateStyle(presetStyle);
    toast.success(`تم تطبيق نمط ${preset.name}`);
  };

  return (
    <Card className="h-full flex flex-col bg-background/95 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Type className="w-4 h-4" />
          أدوات النص
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 mb-3">
            <TabsTrigger value="content" className="text-xs">المحتوى</TabsTrigger>
            <TabsTrigger value="style" className="text-xs">التنسيق</TabsTrigger>
            <TabsTrigger value="advanced" className="text-xs">متقدم</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-auto">
            <TabsContent value="content" className="mt-0 space-y-4">
              {/* إدخال النص */}
              <div>
                <Label className="text-xs font-medium mb-2 block">محتوى النص</Label>
                <Textarea
                  placeholder="اكتب النص هنا..."
                  value={textContent}
                  onChange={(e) => {
                    setTextContent(e.target.value);
                    onTextUpdate?.(e.target.value);
                  }}
                  className="min-h-[100px] text-sm"
                  dir="auto"
                />
              </div>

              {/* أنماط جاهزة */}
              <div>
                <Label className="text-xs font-medium mb-2 block">أنماط جاهزة</Label>
                <div className="grid grid-cols-2 gap-2">
                  {presetStyles.map((preset, index) => (
                    <Button
                      key={index}
                      size="sm"
                      variant="outline"
                      onClick={() => applyPresetStyle(preset)}
                      className="text-xs h-auto p-2 text-right"
                    >
                      <div>
                        <div className="font-medium">{preset.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {preset.fontSize}px
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* إضافة النص */}
              <Button
                onClick={handleAddText}
                className="w-full text-xs"
                disabled={!textContent.trim()}
              >
                <Type className="w-3 h-3 mr-2" />
                إضافة النص إلى الكانفاس
              </Button>
            </TabsContent>

            <TabsContent value="style" className="mt-0 space-y-4">
              {/* عائلة الخط */}
              <div>
                <Label className="text-xs font-medium mb-2 block">نوع الخط</Label>
                <div className="grid grid-cols-1 gap-1">
                  {fontFamilies.slice(0, 4).map((font) => (
                    <Button
                      key={font.name}
                      size="sm"
                      variant={currentStyle.fontFamily === font.name ? 'default' : 'outline'}
                      onClick={() => updateStyle({ fontFamily: font.name })}
                      className="text-xs justify-start"
                      style={{ fontFamily: font.name }}
                    >
                      {font.label}
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {font.category === 'arabic' ? 'عربي' : 'لاتيني'}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* حجم الخط */}
              <div>
                <Label className="text-xs font-medium mb-2 block">
                  حجم الخط: {currentStyle.fontSize}px
                </Label>
                <Slider
                  value={[currentStyle.fontSize]}
                  onValueChange={([value]) => updateStyle({ fontSize: value })}
                  max={72}
                  min={8}
                  step={1}
                  className="mb-2"
                />
                <div className="grid grid-cols-4 gap-1">
                  {[12, 16, 20, 24].map(size => (
                    <Button
                      key={size}
                      size="sm"
                      variant={currentStyle.fontSize === size ? 'default' : 'outline'}
                      onClick={() => updateStyle({ fontSize: size })}
                      className="text-xs"
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* أدوات التنسيق */}
              <div>
                <Label className="text-xs font-medium mb-2 block">تنسيق</Label>
                <div className="grid grid-cols-4 gap-1 mb-2">
                  <Button
                    size="sm"
                    variant={currentStyle.fontWeight === 'bold' ? 'default' : 'outline'}
                    onClick={() => updateStyle({ 
                      fontWeight: currentStyle.fontWeight === 'bold' ? 'normal' : 'bold' 
                    })}
                    className="h-8 p-0"
                  >
                    <Bold className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant={currentStyle.fontStyle === 'italic' ? 'default' : 'outline'}
                    onClick={() => updateStyle({ 
                      fontStyle: currentStyle.fontStyle === 'italic' ? 'normal' : 'italic' 
                    })}
                    className="h-8 p-0"
                  >
                    <Italic className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant={currentStyle.textDecoration === 'underline' ? 'default' : 'outline'}
                    onClick={() => updateStyle({ 
                      textDecoration: currentStyle.textDecoration === 'underline' ? 'none' : 'underline' 
                    })}
                    className="h-8 p-0"
                  >
                    <Underline className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant={currentStyle.textDecoration === 'line-through' ? 'default' : 'outline'}
                    onClick={() => updateStyle({ 
                      textDecoration: currentStyle.textDecoration === 'line-through' ? 'none' : 'line-through' 
                    })}
                    className="h-8 p-0"
                  >
                    <Strikethrough className="w-3 h-3" />
                  </Button>
                </div>

                {/* محاذاة النص */}
                <div className="grid grid-cols-4 gap-1">
                  <Button
                    size="sm"
                    variant={currentStyle.textAlign === 'left' ? 'default' : 'outline'}
                    onClick={() => updateStyle({ textAlign: 'left' })}
                    className="h-8 p-0"
                  >
                    <AlignLeft className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant={currentStyle.textAlign === 'center' ? 'default' : 'outline'}
                    onClick={() => updateStyle({ textAlign: 'center' })}
                    className="h-8 p-0"
                  >
                    <AlignCenter className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant={currentStyle.textAlign === 'right' ? 'default' : 'outline'}
                    onClick={() => updateStyle({ textAlign: 'right' })}
                    className="h-8 p-0"
                  >
                    <AlignRight className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant={currentStyle.textAlign === 'justify' ? 'default' : 'outline'}
                    onClick={() => updateStyle({ textAlign: 'justify' })}
                    className="h-8 p-0"
                  >
                    <AlignJustify className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <Separator />

              {/* ألوان */}
              <div>
                <Label className="text-xs font-medium mb-2 block">لون النص</Label>
                <div className="grid grid-cols-6 gap-1">
                  {colorPalette.map((color) => (
                    <Button
                      key={color}
                      size="sm"
                      variant={currentStyle.color === color ? 'default' : 'outline'}
                      onClick={() => updateStyle({ color })}
                      className="h-8 p-0"
                      style={{ backgroundColor: color }}
                    >
                      {currentStyle.color === color && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </Button>
                  ))}
                </div>
                <Input
                  type="color"
                  value={currentStyle.color}
                  onChange={(e) => updateStyle({ color: e.target.value })}
                  className="h-8 mt-2"
                />
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="mt-0 space-y-4">
              {/* تباعد الأسطر */}
              <div>
                <Label className="text-xs font-medium mb-2 block">
                  تباعد الأسطر: {currentStyle.lineHeight}
                </Label>
                <Slider
                  value={[currentStyle.lineHeight]}
                  onValueChange={([value]) => updateStyle({ lineHeight: value })}
                  max={3}
                  min={0.8}
                  step={0.1}
                  className="mb-2"
                />
                <div className="grid grid-cols-4 gap-1">
                  {[1, 1.2, 1.5, 2].map(height => (
                    <Button
                      key={height}
                      size="sm"
                      variant={Math.abs(currentStyle.lineHeight - height) < 0.01 ? 'default' : 'outline'}
                      onClick={() => updateStyle({ lineHeight: height })}
                      className="text-xs"
                    >
                      {height}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* تباعد الأحرف */}
              <div>
                <Label className="text-xs font-medium mb-2 block">
                  تباعد الأحرف: {currentStyle.letterSpacing}px
                </Label>
                <Slider
                  value={[currentStyle.letterSpacing]}
                  onValueChange={([value]) => updateStyle({ letterSpacing: value })}
                  max={10}
                  min={-2}
                  step={0.5}
                  className="mb-2"
                />
              </div>

              <Separator />

              {/* تحويل النص */}
              <div>
                <Label className="text-xs font-medium mb-2 block">تحويل النص</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant={currentStyle.textTransform === 'uppercase' ? 'default' : 'outline'}
                    onClick={() => updateStyle({ 
                      textTransform: currentStyle.textTransform === 'uppercase' ? 'none' : 'uppercase' 
                    })}
                    className="text-xs"
                  >
                    أحرف كبيرة
                  </Button>
                  <Button
                    size="sm"
                    variant={currentStyle.textTransform === 'lowercase' ? 'default' : 'outline'}
                    onClick={() => updateStyle({ 
                      textTransform: currentStyle.textTransform === 'lowercase' ? 'none' : 'lowercase' 
                    })}
                    className="text-xs"
                  >
                    أحرف صغيرة
                  </Button>
                  <Button
                    size="sm"
                    variant={currentStyle.textTransform === 'capitalize' ? 'default' : 'outline'}
                    onClick={() => updateStyle({ 
                      textTransform: currentStyle.textTransform === 'capitalize' ? 'none' : 'capitalize' 
                    })}
                    className="text-xs"
                  >
                    أول حرف كبير
                  </Button>
                  <Button
                    size="sm"
                    variant={currentStyle.textTransform === 'none' ? 'default' : 'outline'}
                    onClick={() => updateStyle({ textTransform: 'none' })}
                    className="text-xs"
                  >
                    عادي
                  </Button>
                </div>
              </div>

              <Separator />

              {/* أدوات إضافية */}
              <div>
                <Label className="text-xs font-medium mb-2 block">أدوات إضافية</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" variant="outline" className="text-xs">
                    <Link className="w-3 h-3 mr-1" />
                    إضافة رابط
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs">
                    <Sparkles className="w-3 h-3 mr-1" />
                    تحسين بـ AI
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs">
                    <Languages className="w-3 h-3 mr-1" />
                    ترجمة
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs">
                    <Hash className="w-3 h-3 mr-1" />
                    هاشتاغ
                  </Button>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};