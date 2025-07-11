
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Palette, X } from 'lucide-react';

interface AppearancePanelProps {
  selectedElementId: string | null;
  onClose: () => void;
}

export const AppearancePanel: React.FC<AppearancePanelProps> = ({
  selectedElementId,
  onClose
}) => {
  const colors = [
    '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff',
    '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#800080'
  ];

  return (
    <Card className="w-64 shadow-xl border animate-scale-in">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Palette className="w-4 h-4 text-pink-600" />
            المظهر
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {selectedElementId ? (
          <>
            {/* Color Picker */}
            <div className="space-y-2">
              <label className="text-xs font-medium">اللون</label>
              <div className="grid grid-cols-5 gap-1">
                {colors.map((color) => (
                  <button
                    key={color}
                    className="w-8 h-8 rounded border-2 border-muted hover:border-primary transition-colors"
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      // Apply color to selected element
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Opacity */}
            <div className="space-y-2">
              <label className="text-xs font-medium">الشفافية</label>
              <Slider
                defaultValue={[100]}
                max={100}
                min={0}
                step={1}
                className="w-full"
              />
            </div>

            {/* Stroke Width */}
            <div className="space-y-2">
              <label className="text-xs font-medium">سمك الحد</label>
              <Slider
                defaultValue={[2]}
                max={10}
                min={0}
                step={1}
                className="w-full"
              />
            </div>
          </>
        ) : (
          <div className="text-center text-xs text-muted-foreground py-8">
            اختر عنصراً لتخصيص مظهره
          </div>
        )}
      </CardContent>
    </Card>
  );
};
