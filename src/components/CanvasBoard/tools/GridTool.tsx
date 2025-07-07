import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { ToolPanelContainer } from '@/components/custom/ToolPanelContainer';
import { Grid3X3, Ruler, AlignCenter, Move } from 'lucide-react';

interface GridToolProps {
  selectedTool: string;
  showGrid: boolean;
  snapEnabled: boolean;
  gridSize: number;
  onGridToggle: () => void;
  onSnapToggle: () => void;
  onGridSizeChange: (size: number) => void;
  onAlignToGrid: () => void;
}

export const GridTool: React.FC<GridToolProps> = ({ 
  selectedTool,
  showGrid,
  snapEnabled,
  gridSize,
  onGridToggle,
  onSnapToggle,
  onGridSizeChange,
  onAlignToGrid
}) => {
  const [customSize, setCustomSize] = useState(gridSize);

  if (selectedTool !== 'grid') return null;

  const predefinedSizes = [10, 20, 25, 30, 50];

  const handleSizeChange = (size: number) => {
    setCustomSize(size);
    onGridSizeChange(size);
  };

  return (
    <ToolPanelContainer title="إعدادات الشبكة والمحاذاة">
      <div className="space-y-4">
        {/* تبديل الشبكة */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Grid3X3 className="w-4 h-4" />
            <span className="text-sm font-arabic">إظهار الشبكة</span>
          </div>
          <Switch checked={showGrid} onCheckedChange={onGridToggle} />
        </div>

        {/* تبديل المحاذاة التلقائية */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Move className="w-4 h-4" />
            <span className="text-sm font-arabic">المحاذاة التلقائية</span>
          </div>
          <Switch checked={snapEnabled} onCheckedChange={onSnapToggle} />
        </div>

        <div className="border-t pt-3">
          {/* حجم الشبكة */}
          <div className="space-y-3">
            <label className="text-sm font-medium font-arabic">حجم الشبكة (بكسل)</label>
            
            {/* الأحجام المحددة مسبقاً */}
            <div className="grid grid-cols-3 gap-2">
              {predefinedSizes.map(size => (
                <Button
                  key={size}
                  variant={gridSize === size ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSizeChange(size)}
                  className="text-sm"
                >
                  {size}px
                </Button>
              ))}
            </div>

            {/* حجم مخصص */}
            <div className="flex gap-2 items-center">
              <Input
                type="number"
                value={customSize}
                onChange={(e) => setCustomSize(Number(e.target.value))}
                min={5}
                max={100}
                className="font-mono text-sm"
              />
              <Button
                onClick={() => handleSizeChange(customSize)}
                size="sm"
                variant="outline"
              >
                تطبيق
              </Button>
            </div>
          </div>
        </div>

        {/* محاذاة العناصر للشبكة */}
        <div className="border-t pt-3">
          <Button 
            onClick={onAlignToGrid}
            className="w-full rounded-full"
            variant="outline"
          >
            <AlignCenter className="w-4 h-4 mr-2" />
            محاذاة جميع العناصر للشبكة
          </Button>
        </div>

        {/* معاينة الشبكة */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <h4 className="text-sm font-medium font-arabic mb-2">معاينة الشبكة:</h4>
          <div 
            className="w-full h-20 border rounded relative"
            style={{
              backgroundImage: showGrid 
                ? `linear-gradient(to right, #e5e5e5 1px, transparent 1px),
                   linear-gradient(to bottom, #e5e5e5 1px, transparent 1px)`
                : 'none',
              backgroundSize: `${Math.max(gridSize / 2, 10)}px ${Math.max(gridSize / 2, 10)}px`
            }}
          >
            {showGrid && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                  {gridSize}px
                </div>
              </div>
            )}
          </div>
        </div>

        {/* معلومات إضافية */}
        <div className="text-xs text-gray-500 font-arabic space-y-1">
          <div>💡 استخدم Shift + السحب لتجاهل المحاذاة مؤقتاً</div>
          <div>📐 المحاذاة التلقائية تعمل مع الحركة والتحجيم</div>
        </div>
      </div>
    </ToolPanelContainer>
  );
};