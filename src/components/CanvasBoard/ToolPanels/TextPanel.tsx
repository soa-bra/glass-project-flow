import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
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
  Plus,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  List
} from 'lucide-react';

interface TextPanelProps {
  onAddText: (config: any) => void;
  selectedText?: any;
  onUpdateText?: (updates: any) => void;
}

export const TextPanel: React.FC<TextPanelProps> = ({
  onAddText,
  selectedText,
  onUpdateText
}) => {
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [textColor, setTextColor] = useState('#000000');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [alignment, setAlignment] = useState('left');

  const fontFamilies = [
    { value: 'Arial', label: 'Arial' },
    { value: 'Helvetica', label: 'Helvetica' },
    { value: 'Times New Roman', label: 'Times New Roman' },
    { value: 'Courier New', label: 'Courier New' },
    { value: 'Georgia', label: 'Georgia' },
    { value: 'Verdana', label: 'Verdana' },
    { value: 'Tahoma', label: 'Tahoma' },
    { value: 'Impact', label: 'Impact' },
    { value: 'Comic Sans MS', label: 'Comic Sans MS' },
    { value: 'Trebuchet MS', label: 'Trebuchet MS' },
  ];

  const textPresets = [
    {
      name: 'عنوان رئيسي',
      icon: Heading1,
      config: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        type: 'heading'
      }
    },
    {
      name: 'عنوان فرعي',
      icon: Heading2,
      config: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'right',
        type: 'subheading'
      }
    },
    {
      name: 'نص عادي',
      icon: Type,
      config: {
        fontSize: 16,
        fontWeight: 'normal',
        textAlign: 'right',
        type: 'paragraph'
      }
    },
    {
      name: 'اقتباس',
      icon: Quote,
      config: {
        fontSize: 18,
        fontStyle: 'italic',
        textAlign: 'center',
        type: 'quote'
      }
    },
    {
      name: 'قائمة',
      icon: List,
      config: {
        fontSize: 16,
        listStyle: 'bullet',
        textAlign: 'right',
        type: 'list'
      }
    }
  ];

  const handleAddTextPreset = (preset: any) => {
    onAddText({
      type: 'text',
      content: 'نص جديد',
      style: {
        ...preset.config,
        fontFamily,
        color: textColor,
        bold: isBold,
        italic: isItalic,
        underline: isUnderline,
        alignment
      }
    });
  };

  const handleFontSizeChange = (value: number[]) => {
    setFontSize(value[0]);
    if (selectedText && onUpdateText) {
      onUpdateText({ fontSize: value[0] });
    }
  };

  const toggleFormatting = (format: string) => {
    switch (format) {
      case 'bold':
        setIsBold(!isBold);
        if (selectedText && onUpdateText) {
          onUpdateText({ bold: !isBold });
        }
        break;
      case 'italic':
        setIsItalic(!isItalic);
        if (selectedText && onUpdateText) {
          onUpdateText({ italic: !isItalic });
        }
        break;
      case 'underline':
        setIsUnderline(!isUnderline);
        if (selectedText && onUpdateText) {
          onUpdateText({ underline: !isUnderline });
        }
        break;
    }
  };

  const handleAlignmentChange = (newAlignment: string) => {
    setAlignment(newAlignment);
    if (selectedText && onUpdateText) {
      onUpdateText({ alignment: newAlignment });
    }
  };

  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Type className="w-5 h-5" />
          النصوص
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Text Presets */}
        <div className="space-y-2">
          <label className="text-sm font-medium">قوالب النصوص</label>
          <div className="grid grid-cols-2 gap-2">
            {textPresets.map((preset) => {
              const Icon = preset.icon;
              return (
                <Button
                  key={preset.name}
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddTextPreset(preset)}
                  className="h-auto p-2 flex-col gap-1"
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs">{preset.name}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Font Settings */}
        <div className="space-y-3">
          <label className="text-sm font-medium">إعدادات الخط</label>
          
          {/* Font Family */}
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">نوع الخط</label>
            <Select value={fontFamily} onValueChange={setFontFamily}>
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
          </div>

          {/* Font Size */}
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">
              حجم الخط: {fontSize}px
            </label>
            <Slider
              value={[fontSize]}
              onValueChange={handleFontSizeChange}
              max={72}
              min={8}
              step={1}
              className="w-full"
            />
          </div>

          {/* Color */}
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">لون النص</label>
            <div className="flex items-center gap-2">
              <Input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-12 h-8 p-1 border rounded"
              />
              <Input
                type="text"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="flex-1 text-xs"
                placeholder="#000000"
              />
            </div>
          </div>
        </div>

        {/* Formatting Controls */}
        <div className="space-y-2">
          <label className="text-sm font-medium">التنسيق</label>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={isBold ? "default" : "outline"}
              size="sm"
              onClick={() => toggleFormatting('bold')}
            >
              <Bold className="w-4 h-4" />
            </Button>
            <Button
              variant={isItalic ? "default" : "outline"}
              size="sm"
              onClick={() => toggleFormatting('italic')}
            >
              <Italic className="w-4 h-4" />
            </Button>
            <Button
              variant={isUnderline ? "default" : "outline"}
              size="sm"
              onClick={() => toggleFormatting('underline')}
            >
              <Underline className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Text Alignment */}
        <div className="space-y-2">
          <label className="text-sm font-medium">محاذاة النص</label>
          <div className="grid grid-cols-4 gap-2">
            <Button
              variant={alignment === 'left' ? "default" : "outline"}
              size="sm"
              onClick={() => handleAlignmentChange('left')}
            >
              <AlignLeft className="w-4 h-4" />
            </Button>
            <Button
              variant={alignment === 'center' ? "default" : "outline"}
              size="sm"
              onClick={() => handleAlignmentChange('center')}
            >
              <AlignCenter className="w-4 h-4" />
            </Button>
            <Button
              variant={alignment === 'right' ? "default" : "outline"}
              size="sm"
              onClick={() => handleAlignmentChange('right')}
            >
              <AlignRight className="w-4 h-4" />
            </Button>
            <Button
              variant={alignment === 'justify' ? "default" : "outline"}
              size="sm"
              onClick={() => handleAlignmentChange('justify')}
            >
              <AlignJustify className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <label className="text-sm font-medium">إجراءات سريعة</label>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => onAddText({
              type: 'text',
              content: 'نص جديد',
              style: {
                fontSize,
                fontFamily,
                color: textColor,
                bold: isBold,
                italic: isItalic,
                underline: isUnderline,
                alignment
              }
            })}
          >
            <Plus className="w-4 h-4 mr-1" />
            إضافة نص مخصص
          </Button>
        </div>

        {/* Tips */}
        <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
          <div>💡 انقر مرتين لتحرير النص</div>
          <div>🎨 استخدم أدوات التنسيق للتخصيص</div>
          <div>⚡ Ctrl+B/I/U للتنسيق السريع</div>
        </div>
      </CardContent>
    </Card>
  );
};