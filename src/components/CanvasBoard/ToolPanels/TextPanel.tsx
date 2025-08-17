import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Toggle } from '@/components/ui/toggle';
import { Separator } from '@/components/ui/separator';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { 
  Type, 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Palette,
  Highlighter,
  Quote,
  List,
  ListOrdered,
  Link,
  Subscript,
  Superscript,
  RotateCcw
} from 'lucide-react';

interface TextStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  fontStyle: 'normal' | 'italic';
  textDecoration: 'none' | 'underline' | 'line-through' | 'underline line-through';
  textAlign: 'left' | 'center' | 'right' | 'justify';
  color: string;
  backgroundColor: string;
  lineHeight: number;
  letterSpacing: number;
  textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
}

interface TextPanelProps {
  selectedText?: string;
  currentStyle: Partial<TextStyle>;
  onStyleChange: (style: Partial<TextStyle>) => void;
  onAddText: (text: string, style: Partial<TextStyle>) => void;
  presets?: { name: string; style: Partial<TextStyle> }[];
}

export const TextPanel: React.FC<TextPanelProps> = ({
  selectedText = '',
  currentStyle = {},
  onStyleChange,
  onAddText,
  presets = []
}) => {
  const [newText, setNewText] = useState('');
  const [activeTab, setActiveTab] = useState<'add' | 'format'>('add');

  const fontFamilies = [
    { value: 'Cairo', label: 'Cairo (عربي)' },
    { value: 'Amiri', label: 'Amiri (عربي)' },
    { value: 'Tajawal', label: 'Tajawal (عربي)' },
    { value: 'Inter', label: 'Inter' },
    { value: 'Roboto', label: 'Roboto' },
    { value: 'Arial', label: 'Arial' },
    { value: 'Georgia', label: 'Georgia' },
    { value: 'Times New Roman', label: 'Times New Roman' },
    { value: 'Courier New', label: 'Courier New' }
  ];

  const fontSizePresets = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64, 72];

  const colorPresets = [
    '#000000', '#333333', '#666666', '#999999', '#CCCCCC', '#FFFFFF',
    '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
    '#FFA500', '#800080', '#008000', '#000080', '#800000', '#808000'
  ];

  const defaultPresets = [
    {
      name: 'عنوان رئيسي',
      style: {
        fontSize: 32,
        fontWeight: 'bold' as const,
        fontFamily: 'Cairo',
        color: '#1a1a1a'
      }
    },
    {
      name: 'عنوان فرعي',
      style: {
        fontSize: 24,
        fontWeight: '600' as const,
        fontFamily: 'Cairo',
        color: '#333333'
      }
    },
    {
      name: 'نص عادي',
      style: {
        fontSize: 16,
        fontWeight: 'normal' as const,
        fontFamily: 'Cairo',
        color: '#666666'
      }
    },
    {
      name: 'تسمية توضيحية',
      style: {
        fontSize: 12,
        fontWeight: 'normal' as const,
        fontFamily: 'Cairo',
        fontStyle: 'italic' as const,
        color: '#999999'
      }
    }
  ];

  const allPresets = [...defaultPresets, ...presets];

  const updateStyle = (updates: Partial<TextStyle>) => {
    const newStyle = { ...currentStyle, ...updates };
    onStyleChange(newStyle);
  };

  const handleAddText = () => {
    if (newText.trim()) {
      onAddText(newText, currentStyle);
      setNewText('');
    }
  };

  const resetStyle = () => {
    onStyleChange({
      fontFamily: 'Cairo',
      fontSize: 16,
      fontWeight: 'normal',
      fontStyle: 'normal',
      textDecoration: 'none',
      textAlign: 'left',
      color: '#000000',
      backgroundColor: 'transparent',
      lineHeight: 1.4,
      letterSpacing: 0,
      textTransform: 'none'
    });
  };

  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Type className="w-5 h-5" />
          أداة النص
        </CardTitle>
        
        {/* Tab Buttons */}
        <div className="flex gap-1 p-1 bg-muted rounded-lg">
          <Button
            variant={activeTab === 'add' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('add')}
            className="flex-1"
          >
            إضافة نص
          </Button>
          <Button
            variant={activeTab === 'format' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('format')}
            className="flex-1"
          >
            تنسيق
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {activeTab === 'add' && (
          <>
            {/* Text Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">النص الجديد</label>
              <Textarea
                placeholder="اكتب النص هنا..."
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                className="min-h-[100px]"
              />
              <Button onClick={handleAddText} className="w-full">
                إضافة إلى اللوحة
              </Button>
            </div>

            <Separator />

            {/* Style Presets */}
            <div className="space-y-2">
              <label className="text-sm font-medium">الأنماط المعدة مسبقاً</label>
              <div className="grid grid-cols-1 gap-2">
                {allPresets.map((preset, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => updateStyle(preset.style)}
                    className="h-auto p-3 text-left justify-start"
                  >
                    <div>
                      <div className="font-medium text-sm">{preset.name}</div>
                      <div 
                        className={`text-xs text-muted-foreground font-[${preset.style.fontWeight}] ${
                          preset.style.fontStyle === 'italic' ? 'italic' : 'not-italic'
                        } font-[${preset.style.fontFamily}] text-[${Math.min(preset.style.fontSize || 16, 12)}px]`}
                      >
                        مثال على النص
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'format' && (
          <>
            {/* Font Settings */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">الخط والحجم</label>
                <Button variant="ghost" size="sm" onClick={resetStyle}>
                  <RotateCcw className="w-3 h-3 mr-1" />
                  إعادة تعيين
                </Button>
              </div>
              
              <Select
                value={currentStyle.fontFamily || 'Cairo'}
                onValueChange={(value) => updateStyle({ fontFamily: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fontFamilies.map((font) => (
                    <SelectItem key={font.value} value={font.value}>
                      {font.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <Slider
                  value={[currentStyle.fontSize || 16]}
                  onValueChange={([value]) => updateStyle({ fontSize: value })}
                  max={72}
                  min={8}
                  step={1}
                  className="flex-1"
                />
                <span className="text-sm w-12 text-center">{currentStyle.fontSize || 16}px</span>
              </div>

              <div className="grid grid-cols-4 gap-1">
                {fontSizePresets.map((size) => (
                  <Button
                    key={size}
                    variant={currentStyle.fontSize === size ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateStyle({ fontSize: size })}
                    className="text-xs"
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Text Style Toggles */}
            <div className="space-y-3">
              <label className="text-sm font-medium">نمط النص</label>
              
              <div className="flex flex-wrap gap-1">
                <Toggle
                  pressed={currentStyle.fontWeight === 'bold'}
                  onPressedChange={(pressed) => 
                    updateStyle({ fontWeight: pressed ? 'bold' : 'normal' })
                  }
                >
                  <Bold className="w-4 h-4" />
                </Toggle>
                
                <Toggle
                  pressed={currentStyle.fontStyle === 'italic'}
                  onPressedChange={(pressed) => 
                    updateStyle({ fontStyle: pressed ? 'italic' : 'normal' })
                  }
                >
                  <Italic className="w-4 h-4" />
                </Toggle>
                
                <Toggle
                  pressed={currentStyle.textDecoration?.includes('underline')}
                  onPressedChange={(pressed) => {
                    const hasStrike = currentStyle.textDecoration?.includes('line-through');
                    let newDecoration = 'none';
                    if (pressed && hasStrike) newDecoration = 'underline line-through';
                    else if (pressed) newDecoration = 'underline';
                    else if (hasStrike) newDecoration = 'line-through';
                    updateStyle({ textDecoration: newDecoration as any });
                  }}
                >
                  <Underline className="w-4 h-4" />
                </Toggle>
                
                <Toggle
                  pressed={currentStyle.textDecoration?.includes('line-through')}
                  onPressedChange={(pressed) => {
                    const hasUnderline = currentStyle.textDecoration?.includes('underline');
                    let newDecoration = 'none';
                    if (pressed && hasUnderline) newDecoration = 'underline line-through';
                    else if (pressed) newDecoration = 'line-through';
                    else if (hasUnderline) newDecoration = 'underline';
                    updateStyle({ textDecoration: newDecoration as any });
                  }}
                >
                  <Strikethrough className="w-4 h-4" />
                </Toggle>
              </div>
            </div>

            <Separator />

            {/* Text Alignment */}
            <div className="space-y-3">
              <label className="text-sm font-medium">المحاذاة</label>
              <div className="flex gap-1">
                <Toggle
                  pressed={currentStyle.textAlign === 'left'}
                  onPressedChange={() => updateStyle({ textAlign: 'left' })}
                >
                  <AlignLeft className="w-4 h-4" />
                </Toggle>
                <Toggle
                  pressed={currentStyle.textAlign === 'center'}
                  onPressedChange={() => updateStyle({ textAlign: 'center' })}
                >
                  <AlignCenter className="w-4 h-4" />
                </Toggle>
                <Toggle
                  pressed={currentStyle.textAlign === 'right'}
                  onPressedChange={() => updateStyle({ textAlign: 'right' })}
                >
                  <AlignRight className="w-4 h-4" />
                </Toggle>
                <Toggle
                  pressed={currentStyle.textAlign === 'justify'}
                  onPressedChange={() => updateStyle({ textAlign: 'justify' })}
                >
                  <AlignJustify className="w-4 h-4" />
                </Toggle>
              </div>
            </div>

            <Separator />

            {/* Colors */}
            <div className="space-y-3">
              <label className="text-sm font-medium">الألوان</label>
              
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">لون النص</div>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={currentStyle.color || '#000000'}
                    onChange={(e) => updateStyle({ color: e.target.value })}
                    className="w-12 h-8 p-1"
                  />
                  <Input
                    value={currentStyle.color || '#000000'}
                    onChange={(e) => updateStyle({ color: e.target.value })}
                    className="flex-1 text-xs"
                  />
                </div>
                
                <div className="grid grid-cols-6 gap-1">
                  {colorPresets.map((color) => (
                     <button
                       key={color}
                       onClick={() => updateStyle({ color })}
                       className={`w-6 h-6 rounded cursor-pointer border-2 border-gray-300 bg-[${color}] hover:scale-110 transition-transform`}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">لون الخلفية</div>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={currentStyle.backgroundColor || 'white'}
                    onChange={(e) => updateStyle({ backgroundColor: e.target.value })}
                    className="w-12 h-8 p-1"
                  />
                  <Input
                    value={currentStyle.backgroundColor || 'transparent'}
                    onChange={(e) => updateStyle({ backgroundColor: e.target.value })}
                    className="flex-1 text-xs"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Advanced Typography */}
            <div className="space-y-3">
              <label className="text-sm font-medium">تايبوجرافي متقدم</label>
              
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">المسافة بين الأسطر</div>
                <Slider
                  value={[currentStyle.lineHeight || 1.4]}
                  onValueChange={([value]) => updateStyle({ lineHeight: value })}
                  max={3}
                  min={0.5}
                  step={0.1}
                />
                <div className="text-xs text-center">{currentStyle.lineHeight || 1.4}</div>
              </div>

              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">المسافة بين الحروف</div>
                <Slider
                  value={[currentStyle.letterSpacing || 0]}
                  onValueChange={([value]) => updateStyle({ letterSpacing: value })}
                  max={10}
                  min={-2}
                  step={0.1}
                />
                <div className="text-xs text-center">{currentStyle.letterSpacing || 0}px</div>
              </div>

              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">تحويل النص</div>
                <Select
                  value={currentStyle.textTransform || 'none'}
                  onValueChange={(value: any) => updateStyle({ textTransform: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">عادي</SelectItem>
                    <SelectItem value="uppercase">أحرف كبيرة</SelectItem>
                    <SelectItem value="lowercase">أحرف صغيرة</SelectItem>
                    <SelectItem value="capitalize">أول حرف كبير</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        )}

        {/* Preview */}
        <div className="bg-muted/50 rounded-lg p-3 border">
          <div className="text-xs text-muted-foreground mb-2">معاينة</div>
          <div
            className={`p-2 rounded font-[${currentStyle.fontFamily || 'Cairo'}] text-[${currentStyle.fontSize || 16}px] font-[${currentStyle.fontWeight || 'normal'}] ${
              currentStyle.fontStyle === 'italic' ? 'italic' : 'not-italic'
            } ${
              currentStyle.textDecoration === 'underline' ? 'underline' :
              currentStyle.textDecoration === 'line-through' ? 'line-through' :
              currentStyle.textDecoration === 'underline line-through' ? 'underline line-through' : 'no-underline'
            } text-[${currentStyle.color || '#000000'}] bg-[${currentStyle.backgroundColor || 'transparent'}] ${
              currentStyle.textAlign === 'center' ? 'text-center' :
              currentStyle.textAlign === 'right' ? 'text-right' :
              currentStyle.textAlign === 'justify' ? 'text-justify' : 'text-left'
            } ${
              currentStyle.textTransform === 'uppercase' ? 'uppercase' :
              currentStyle.textTransform === 'lowercase' ? 'lowercase' :
              currentStyle.textTransform === 'capitalize' ? 'capitalize' : 'normal-case'
            }`}
            style={{
              lineHeight: currentStyle.lineHeight || 1.4,
              letterSpacing: `${currentStyle.letterSpacing || 0}px`
            }}
          >
            {selectedText || newText || 'مثال على النص العربي ABC 123'}
          </div>
        </div>

        {/* Usage Tips */}
        <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
          <div>✏️ اكتب النص ثم اختر النمط</div>
          <div>🎨 استخدم الألوان لتمييز المحتوى</div>
          <div>📏 اضبط المسافات للوضوح</div>
        </div>
      </CardContent>
    </Card>
  );
};