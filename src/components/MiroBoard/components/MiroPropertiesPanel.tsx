import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { X, Palette, Type, Move, Copy, Trash2 } from 'lucide-react';

interface MiroPropertiesPanelProps {
  selectedElement: string;
  onClose: () => void;
}

const colors = [
  '#ffd966', '#9fc5e8', '#b6d7a8', '#f4cccc', '#d5a6bd',
  '#fce5cd', '#c9daf8', '#a4c2f4', '#ff9900', '#34a853'
];

export const MiroPropertiesPanel: React.FC<MiroPropertiesPanelProps> = ({
  selectedElement,
  onClose
}) => {
  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 bg-white rounded-lg shadow-lg border border-border w-80 max-h-[80vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-semibold text-lg" dir="rtl">خصائص العنصر</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Element Info */}
        <div className="space-y-3">
          <Label htmlFor="element-text" className="text-right block">النص</Label>
          <Textarea
            id="element-text"
            placeholder="أدخل النص..."
            className="min-h-[100px]"
            dir="rtl"
            defaultValue="مرحباً بكم في لوحة التخطيط التشاركي"
          />
        </div>

        <Separator />

        {/* Colors */}
        <div className="space-y-3">
          <Label className="text-right block">
            <Palette className="w-4 h-4 inline ml-2" />
            اللون
          </Label>
          <div className="grid grid-cols-5 gap-2">
            {colors.map((color) => (
              <button
                key={color}
                className="w-8 h-8 rounded-full border-2 border-gray-200 hover:border-gray-400 transition-colors"
                style={{ backgroundColor: color }}
                onClick={() => {}}
              />
            ))}
          </div>
        </div>

        <Separator />

        {/* Typography */}
        <div className="space-y-3">
          <Label className="text-right block">
            <Type className="w-4 h-4 inline ml-2" />
            النص
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm">عادي</Button>
            <Button variant="outline" size="sm">عريض</Button>
            <Button variant="outline" size="sm">مائل</Button>
            <Button variant="outline" size="sm">تحته خط</Button>
          </div>
        </div>

        <Separator />

        {/* Position */}
        <div className="space-y-3">
          <Label className="text-right block">
            <Move className="w-4 h-4 inline ml-2" />
            الموضع والحجم
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="x" className="text-xs text-muted-foreground">X</Label>
              <Input id="x" type="number" defaultValue="200" />
            </div>
            <div>
              <Label htmlFor="y" className="text-xs text-muted-foreground">Y</Label>
              <Input id="y" type="number" defaultValue="150" />
            </div>
            <div>
              <Label htmlFor="width" className="text-xs text-muted-foreground">العرض</Label>
              <Input id="width" type="number" defaultValue="200" />
            </div>
            <div>
              <Label htmlFor="height" className="text-xs text-muted-foreground">الارتفاع</Label>
              <Input id="height" type="number" defaultValue="200" />
            </div>
          </div>
        </div>

        <Separator />

        {/* Actions */}
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start" dir="rtl">
            <Copy className="w-4 h-4 ml-2" />
            نسخ
          </Button>
          <Button variant="outline" className="w-full justify-start" dir="rtl">
            <Move className="w-4 h-4 ml-2" />
            نقل للأمام
          </Button>
          <Button variant="destructive" className="w-full justify-start" dir="rtl">
            <Trash2 className="w-4 h-4 ml-2" />
            حذف
          </Button>
        </div>
      </div>
    </div>
  );
};