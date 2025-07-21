import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Square, Circle, Triangle, Minus, ArrowRight, Star } from 'lucide-react';

interface ShapePanelProps {
  onAddShape: (type: string, data: any) => void;
}

const ShapePanel: React.FC<ShapePanelProps> = ({ onAddShape }) => {
  return (
    <Card className="w-64">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Square size={16} />
          الأشكال
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            onClick={() => onAddShape('rectangle', { width: 100, height: 60 })}
          >
            <Square size={16} />
          </Button>
          <Button
            variant="outline"
            onClick={() => onAddShape('circle', { radius: 40 })}
          >
            <Circle size={16} />
          </Button>
          <Button
            variant="outline"
            onClick={() => onAddShape('triangle', { size: 60 })}
          >
            <Triangle size={16} />
          </Button>
          <Button
            variant="outline"
            onClick={() => onAddShape('line', { length: 100 })}
          >
            <Minus size={16} />
          </Button>
          <Button
            variant="outline"
            onClick={() => onAddShape('arrow', { length: 100, direction: 'right' })}
          >
            <ArrowRight size={16} />
          </Button>
          <Button
            variant="outline"
            onClick={() => onAddShape('star', { points: 5, size: 50 })}
          >
            <Star size={16} />
          </Button>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">أشكال مخصصة</p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={() => onAddShape('hexagon', { size: 50 })}
            >
              سداسي
            </Button>
            <Button
              variant="outline"
              onClick={() => onAddShape('diamond', { size: 50 })}
            >
              معين
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShapePanel;