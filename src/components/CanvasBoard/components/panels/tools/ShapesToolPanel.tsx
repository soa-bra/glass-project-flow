import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Square, 
  Circle, 
  Triangle, 
  Diamond, 
  Hexagon, 
  Star, 
  Heart, 
  ArrowRight,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  Plus,
  Minus,
  X
} from 'lucide-react';

export const ShapesToolPanel: React.FC = () => {
  const basicShapes = [
    { icon: Square, name: 'مربع', id: 'rectangle' },
    { icon: Circle, name: 'دائرة', id: 'circle' },
    { icon: Triangle, name: 'مثلث', id: 'triangle' },
    { icon: Diamond, name: 'معين', id: 'diamond' },
    { icon: Hexagon, name: 'سداسي', id: 'hexagon' },
    { icon: Star, name: 'نجمة', id: 'star' },
    { icon: Heart, name: 'قلب', id: 'heart' },
    { icon: Plus, name: 'علامة زائد', id: 'plus' }
  ];

  const arrowShapes = [
    { icon: ArrowRight, name: 'سهم يمين', id: 'arrow-right' },
    { icon: ArrowLeft, name: 'سهم يسار', id: 'arrow-left' },
    { icon: ArrowUp, name: 'سهم أعلى', id: 'arrow-up' },
    { icon: ArrowDown, name: 'سهم أسفل', id: 'arrow-down' }
  ];

  const flowchartShapes = [
    { icon: Square, name: 'عملية', id: 'process' },
    { icon: Diamond, name: 'قرار', id: 'decision' },
    { icon: Circle, name: 'بداية/نهاية', id: 'terminator' },
    { icon: Hexagon, name: 'إعداد', id: 'preparation' }
  ];

  const mathShapes = [
    { icon: Plus, name: 'جمع', id: 'add' },
    { icon: Minus, name: 'طرح', id: 'subtract' },
    { icon: X, name: 'ضرب', id: 'multiply' },
    { icon: Circle, name: 'قسمة', id: 'divide' }
  ];

  const handleShapeSelect = (shapeId: string) => {
    console.log('تم اختيار الشكل:', shapeId);
  };

  const renderShapeGrid = (shapes: typeof basicShapes, colorClass: string) => (
    <div className="grid grid-cols-4 gap-2">
      {shapes.map((shape) => {
        const Icon = shape.icon;
        return (
          <Button
            key={shape.id}
            onClick={() => handleShapeSelect(shape.id)}
            size="sm"
            className={`aspect-square rounded-[12px] ${colorClass} text-black border-none hover:opacity-80 transition-opacity`}
            title={shape.name}
          >
            <Icon className="w-4 h-4" />
          </Button>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Basic Shapes */}
      <div>
        <h4 className="text-sm font-medium font-arabic mb-3 text-black">الأشكال الأساسية</h4>
        {renderShapeGrid(basicShapes, 'bg-[#96d8d0] hover:bg-[#96d8d0]/80')}
      </div>

      <Separator className="bg-[#d1e1ea]" />

      {/* Arrow Shapes */}
      <div>
        <h4 className="text-sm font-medium font-arabic mb-3 text-black">الأسهم</h4>
        {renderShapeGrid(arrowShapes, 'bg-[#a4e2f6] hover:bg-[#a4e2f6]/80')}
      </div>

      <Separator className="bg-[#d1e1ea]" />

      {/* Flowchart Shapes */}
      <div>
        <h4 className="text-sm font-medium font-arabic mb-3 text-black">أشكال المخططات الانسيابية</h4>
        {renderShapeGrid(flowchartShapes, 'bg-[#bdeed3] hover:bg-[#bdeed3]/80')}
      </div>

      <Separator className="bg-[#d1e1ea]" />

      {/* Mathematical Symbols */}
      <div>
        <h4 className="text-sm font-medium font-arabic mb-3 text-black">الرموز الرياضية</h4>
        {renderShapeGrid(mathShapes, 'bg-[#d9d2fd] hover:bg-[#d9d2fd]/80')}
      </div>

      <Separator className="bg-[#d1e1ea]" />

      {/* Additional Shape Categories */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium font-arabic mb-3 text-black">فئات إضافية</h4>
        
        <div className="grid grid-cols-2 gap-2">
          <Button
            size="sm"
            className="rounded-[12px] bg-[#fbe2aa] hover:bg-[#fbe2aa]/80 text-black border-none font-arabic text-xs"
          >
            خطوط الاتصال
          </Button>
          <Button
            size="sm"
            className="rounded-[12px] bg-[#f1b5b9] hover:bg-[#f1b5b9]/80 text-black border-none font-arabic text-xs"
          >
            إطارات النص
          </Button>
          <Button
            size="sm"
            className="rounded-[12px] bg-[#e9eff4] hover:bg-[#e9eff4]/80 text-black border-none font-arabic text-xs"
          >
            أشكال ثلاثية الأبعاد
          </Button>
          <Button
            size="sm"
            className="rounded-[12px] bg-[#d1e1ea] hover:bg-[#d1e1ea]/80 text-black border-none font-arabic text-xs"
          >
            رموز تقنية
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-[#e9eff4]/50 p-3 rounded-[16px] border border-[#d1e1ea]">
        <h5 className="text-xs font-medium font-arabic mb-2 text-black">إجراءات سريعة</h5>
        <div className="space-y-2">
          <Button
            size="sm"
            className="w-full rounded-[12px] bg-[#96d8d0] hover:bg-[#96d8d0]/80 text-black border-none font-arabic text-xs"
          >
            إنشاء شكل مخصص
          </Button>
          <Button
            size="sm"
            className="w-full rounded-[12px] bg-[#a4e2f6] hover:bg-[#a4e2f6]/80 text-black border-none font-arabic text-xs"
          >
            استيراد شكل SVG
          </Button>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-[#bdeed3]/30 p-3 rounded-[16px] border border-[#bdeed3]/50">
        <div className="text-xs text-black font-arabic space-y-1">
          <div>🖱️ انقر واسحب لإنشاء الشكل</div>
          <div>⌨️ اضغط Shift للحفاظ على النسب</div>
          <div>🎨 استخدم لوحة المظهر لتخصيص الألوان</div>
          <div>🔄 انقر مرتين لتحرير الشكل</div>
        </div>
      </div>
    </div>
  );
};