import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { PenTool, Minus } from 'lucide-react';

interface SmartPenPanelProps {
  selectedPenMode: string;
  lineWidth: number;
  lineStyle: string;
  onPenModeSelect: (mode: string) => void;
  onLineWidthChange: (width: number) => void;
  onLineStyleChange: (style: string) => void;
}

const SmartPenPanel: React.FC<SmartPenPanelProps> = ({
  selectedPenMode,
  lineWidth,
  lineStyle,
  onPenModeSelect,
  onLineWidthChange,
  onLineStyleChange
}) => {
  const penModes = [
    { id: 'pen', name: 'قلم', icon: PenTool },
    { id: 'highlighter', name: 'قلم تمييز', icon: Minus },
    { id: 'marker', name: 'قلم فلوماستر', icon: PenTool },
    { id: 'pencil', name: 'قلم رصاص', icon: PenTool }
  ];

  const lineStyles = [
    { id: 'solid', name: 'مستمر' },
    { id: 'dashed', name: 'متقطع' },
    { id: 'dotted', name: 'منقط' }
  ];

  return (
    <Card className="w-64">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PenTool size={16} />
          القلم الذكي
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">نوع القلم</p>
          <div className="grid grid-cols-2 gap-2">
            {penModes.map((mode) => {
              const IconComponent = mode.icon;
              return (
                <Button
                  key={mode.id}
                  variant={selectedPenMode === mode.id ? 'default' : 'outline'}
                  onClick={() => onPenModeSelect(mode.id)}
                  size="sm"
                  className={`h-16 flex-col transition-all ${
                    selectedPenMode === mode.id ? 'canvas-tool-active' : ''
                  }`}
                >
                  <IconComponent size={16} />
                  <span className="text-xs mt-1">{mode.name}</span>
                </Button>
              );
            })}
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">سماكة الخط</p>
          <Slider
            value={[lineWidth]}
            onValueChange={(values) => onLineWidthChange(values[0])}
            max={20}
            min={1}
            step={1}
          />
          <div className="text-xs text-muted-foreground text-center">
            {lineWidth}px
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">نمط الخط</p>
          <div className="space-y-1">
            {lineStyles.map((style) => (
              <Button
                key={style.id}
                variant={lineStyle === style.id ? 'default' : 'outline'}
                onClick={() => onLineStyleChange(style.id)}
                size="sm"
                className="w-full justify-start"
              >
                {style.name}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartPenPanel;