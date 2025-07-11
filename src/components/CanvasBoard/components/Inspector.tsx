import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Settings, Palette, Move, RotateCw, Layers } from 'lucide-react';

interface InspectorProps {
  selectedElementId?: string;
}

export const Inspector: React.FC<InspectorProps> = ({ selectedElementId }) => {
  if (!selectedElementId) {
    return (
      <Card className="w-64">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Settings className="h-4 w-4" />
            خصائص العنصر
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            اختر عنصراً لعرض خصائصه
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-64">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Settings className="h-4 w-4" />
          خصائص العنصر
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Position */}
        <div>
          <Label className="flex items-center gap-2 text-xs font-medium mb-2">
            <Move className="h-3 w-3" />
            الموقع
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-muted-foreground">X</Label>
              <Input type="number" defaultValue="100" className="h-8" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Y</Label>
              <Input type="number" defaultValue="100" className="h-8" />
            </div>
          </div>
        </div>

        <Separator />

        {/* Size */}
        <div>
          <Label className="text-xs font-medium mb-2">الحجم</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-muted-foreground">العرض</Label>
              <Input type="number" defaultValue="120" className="h-8" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">الارتفاع</Label>
              <Input type="number" defaultValue="80" className="h-8" />
            </div>
          </div>
        </div>

        <Separator />

        {/* Opacity */}
        <div>
          <Label className="flex items-center gap-2 text-xs font-medium mb-2">
            <Layers className="h-3 w-3" />
            الشفافية
          </Label>
          <Slider defaultValue={[100]} max={100} step={1} className="w-full" />
        </div>

        <Separator />

        {/* Rotation */}
        <div>
          <Label className="flex items-center gap-2 text-xs font-medium mb-2">
            <RotateCw className="h-3 w-3" />
            الدوران
          </Label>
          <Input type="number" defaultValue="0" className="h-8" />
        </div>

        <Separator />

        {/* Style */}
        <div>
          <Label className="flex items-center gap-2 text-xs font-medium mb-2">
            <Palette className="h-3 w-3" />
            النمط
          </Label>
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start h-8">
              لون الخلفية
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start h-8">
              لون الحدود
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};