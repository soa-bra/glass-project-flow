import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Grid, AlignJustify } from 'lucide-react';

interface GridPanelProps {
  showGrid: boolean;
  snapEnabled: boolean;
  gridSize: number;
  gridShape: string;
  onGridToggle: () => void;
  onSnapToggle: () => void;
  onGridSizeChange: (size: number) => void;
  onGridShapeChange: (shape: string) => void;
  onAlignToGrid: () => void;
}

const GridPanel: React.FC<GridPanelProps> = ({
  showGrid,
  snapEnabled,
  gridSize,
  gridShape,
  onGridToggle,
  onSnapToggle,
  onGridSizeChange,
  onGridShapeChange,
  onAlignToGrid
}) => {
  return (
    <Card className="w-64">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Grid size={16} />
          الشبكة
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm">إظهار الشبكة</span>
          <Switch checked={showGrid} onCheckedChange={onGridToggle} />
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm">الالتصاق</span>
          <Switch checked={snapEnabled} onCheckedChange={onSnapToggle} />
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">حجم الشبكة</p>
          <Slider
            value={[gridSize]}
            onValueChange={(values) => onGridSizeChange(values[0])}
            max={50}
            min={5}
            step={5}
          />
          <div className="text-xs text-muted-foreground text-center">
            {gridSize}px
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">شكل الشبكة</p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={gridShape === 'square' ? 'default' : 'outline'}
              onClick={() => onGridShapeChange('square')}
              size="sm"
            >
              مربعة
            </Button>
            <Button
              variant={gridShape === 'dots' ? 'default' : 'outline'}
              onClick={() => onGridShapeChange('dots')}
              size="sm"
            >
              نقاط
            </Button>
          </div>
        </div>
        
        <Button
          variant="outline"
          className="w-full"
          onClick={onAlignToGrid}
        >
          <AlignJustify size={14} className="mr-2" />
          محاذاة للشبكة
        </Button>
      </CardContent>
    </Card>
  );
};

export default GridPanel;