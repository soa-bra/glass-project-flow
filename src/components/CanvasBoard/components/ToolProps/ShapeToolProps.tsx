import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Square, Circle, Triangle, Minus } from 'lucide-react';

const ShapeToolProps: React.FC = () => {
  const [selectedShape, setSelectedShape] = useState('rectangle');

  const shapes = [
    { id: 'rectangle', label: 'مستطيل', icon: Square },
    { id: 'circle', label: 'دائرة', icon: Circle },
    { id: 'triangle', label: 'مثلث', icon: Triangle },
    { id: 'line', label: 'خط', icon: Minus }
  ];

  return (
    <div className="space-y-3">
      <h4 className="font-medium font-arabic">خصائص الشكل</h4>
      <div className="space-y-2">
        <div className="flex gap-1">
          {shapes.map((shape) => {
            const Icon = shape.icon;
            return (
              <Button
                key={shape.id}
                variant={selectedShape === shape.id ? "default" : "outline"}
                size="sm"
                className={`flex-1 rounded-full ${selectedShape === shape.id ? 'bg-black text-white' : 'border-gray-300'}`}
                onClick={() => setSelectedShape(shape.id)}
                title={shape.label}
              >
                <Icon className="w-4 h-4" />
              </Button>
            );
          })}
        </div>
        <Input type="number" placeholder="سمك الحد" />
      </div>
    </div>
  );
};

export default ShapeToolProps;