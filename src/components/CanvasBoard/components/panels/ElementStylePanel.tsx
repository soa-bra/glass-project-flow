import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CanvasElement } from '../../types';
import { Palette, Square, Eye, EyeOff, Lock, Unlock } from 'lucide-react';

interface ElementStylePanelProps {
  selectedElement: CanvasElement | null;
  onUpdateElement: (elementId: string, updates: any) => void;
}

export const ElementStylePanel: React.FC<ElementStylePanelProps> = ({
  selectedElement,
  onUpdateElement
}) => {
  if (!selectedElement) {
    return (
      <Card className="w-full h-full bg-[#f2f9fb]/95 backdrop-blur-xl shadow-sm border border-white/20 rounded-[32px] overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-arabic flex items-center gap-2 text-black">
            <Palette className="w-5 h-5 text-[#96d8d0]" />
            تنسيق العنصر
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 h-[calc(100%-4rem)] flex items-center justify-center">
          <div className="text-center text-black/60">
            <Square className="w-12 h-12 mx-auto mb-2 text-black/30" />
            <p className="text-sm">لا يوجد عنصر محدد</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full bg-[#f2f9fb]/95 backdrop-blur-xl shadow-sm border border-white/20 rounded-[32px] overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-arabic flex items-center gap-2 text-black">
          <Palette className="w-5 h-5 text-[#96d8d0]" />
          تنسيق العنصر
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 h-[calc(100%-4rem)] overflow-y-auto">
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-black">الألوان</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs text-black/70">لون التعبئة</Label>
              <Input
                type="color"
                value={(selectedElement as any).fillColor || '#000000'}
                onChange={(e) => onUpdateElement(selectedElement.id, { fillColor: e.target.value })}
                className="w-full h-8 rounded-[8px] border border-[#d1e1ea]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-black/70">لون الحد</Label>
              <Input
                type="color"
                value={(selectedElement as any).strokeColor || '#000000'}
                onChange={(e) => onUpdateElement(selectedElement.id, { strokeColor: e.target.value })}
                className="w-full h-8 rounded-[8px] border border-[#d1e1ea]"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};