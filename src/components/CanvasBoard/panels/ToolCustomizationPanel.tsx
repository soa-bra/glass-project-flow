import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Palette, 
  Settings, 
  Save, 
  RotateCcw,
  Brush,
  Type,
  MousePointer2
} from 'lucide-react';

export const ToolCustomizationPanel: React.FC = () => {
  const [brushSize, setBrushSize] = useState([2]);
  const [brushOpacity, setBrushOpacity] = useState([100]);
  const [fontSize, setFontSize] = useState([16]);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [showRulers, setShowRulers] = useState(false);
  const [autoSave, setAutoSave] = useState(true);

  const handleReset = () => {
    setBrushSize([2]);
    setBrushOpacity([100]);
    setFontSize([16]);
    setSnapToGrid(true);
    setShowRulers(false);
    setAutoSave(true);
  };

  return (
    <div className="space-y-4">
      {/* Brush Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Brush className="w-4 h-4" />
            إعدادات الفرشاة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm">حجم الفرشاة</Label>
            <Slider
              value={brushSize}
              onValueChange={setBrushSize}
              min={1}
              max={50}
              step={1}
              className="w-full"
            />
            <div className="text-xs text-muted-foreground">
              {brushSize[0]} بكسل
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">شفافية الفرشاة</Label>
            <Slider
              value={brushOpacity}
              onValueChange={setBrushOpacity}
              min={10}
              max={100}
              step={5}
              className="w-full"
            />
            <div className="text-xs text-muted-foreground">
              {brushOpacity[0]}%
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Text Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Type className="w-4 h-4" />
            إعدادات النص
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm">حجم الخط الافتراضي</Label>
            <Slider
              value={fontSize}
              onValueChange={setFontSize}
              min={8}
              max={72}
              step={2}
              className="w-full"
            />
            <div className="text-xs text-muted-foreground">
              {fontSize[0]} نقطة
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">خط افتراضي</Label>
            <Input
              defaultValue="Arial"
              placeholder="اسم الخط"
              className="text-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Canvas Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <MousePointer2 className="w-4 h-4" />
            إعدادات اللوحة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm">التوجيه للشبكة</Label>
            <Switch
              checked={snapToGrid}
              onCheckedChange={setSnapToGrid}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-sm">إظهار المساطر</Label>
            <Switch
              checked={showRulers}
              onCheckedChange={setShowRulers}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-sm">حفظ تلقائي</Label>
            <Switch
              checked={autoSave}
              onCheckedChange={setAutoSave}
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Presets */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Palette className="w-4 h-4" />
            الإعدادات المحفوظة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Badge variant="outline" className="justify-center p-2 cursor-pointer hover:bg-accent">
              رسم دقيق
            </Badge>
            <Badge variant="outline" className="justify-center p-2 cursor-pointer hover:bg-accent">
              رسم سريع
            </Badge>
            <Badge variant="outline" className="justify-center p-2 cursor-pointer hover:bg-accent">
              تصميم
            </Badge>
            <Badge variant="outline" className="justify-center p-2 cursor-pointer hover:bg-accent">
              تخطيط
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4">
        <Button size="sm" className="flex-1">
          <Save className="w-4 h-4 mr-2" />
          حفظ الإعدادات
        </Button>
        <Button variant="outline" size="sm" onClick={handleReset}>
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Tips */}
      <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
        <div>💡 استخدم Ctrl+S للحفظ السريع</div>
        <div>🎨 اضغط Tab لإخفاء الأدوات</div>
        <div>⚡ Space+drag للتحريك السريع</div>
      </div>
    </div>
  );
};