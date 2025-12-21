import React from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Lock, Unlock, Eye, EyeOff, Trash2 } from 'lucide-react';

export const ElementPropertiesPanel: React.FC = () => {
  const { elements, selectedElementIds, updateElement, deleteElements, lockElements, unlockElements } = useCanvasStore();
  
  const selectedElements = elements.filter(el => selectedElementIds.includes(el.id));
  
  if (selectedElements.length === 0) {
    return (
      <div className="p-5 text-center text-[hsl(var(--ink-60))] text-[14px]">
        حدد عنصرًا لتعديل خصائصه
      </div>
    );
  }

  const isSingleSelection = selectedElements.length === 1;
  const element = selectedElements[0];

  const handlePositionChange = (axis: 'x' | 'y', value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;
    
    selectedElements.forEach(el => {
      updateElement(el.id, {
        position: {
          ...el.position,
          [axis]: numValue
        }
      });
    });
  };

  const handleSizeChange = (dimension: 'width' | 'height', value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue <= 0) return;
    
    selectedElements.forEach(el => {
      updateElement(el.id, {
        size: {
          ...el.size,
          [dimension]: numValue
        }
      });
    });
  };

  const handleOpacityChange = (value: number[]) => {
    selectedElements.forEach(el => {
      updateElement(el.id, {
        style: {
          ...el.style,
          opacity: value[0]
        }
      });
    });
  };

  const toggleLock = () => {
    const isLocked = selectedElements.some(el => el.locked);
    if (isLocked) {
      unlockElements(selectedElementIds);
    } else {
      lockElements(selectedElementIds);
    }
  };

  const toggleVisibility = () => {
    const isVisible = selectedElements.every(el => el.visible !== false);
    selectedElements.forEach(el => {
      updateElement(el.id, { visible: !isVisible });
    });
  };

  const handleDelete = () => {
    deleteElements(selectedElementIds);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-3 border-b border-[hsl(var(--border))]">
        <h4 className="text-[14px] font-semibold text-[hsl(var(--ink))]">
          {isSingleSelection ? 'خصائص العنصر' : `${selectedElements.length} عناصر محددة`}
        </h4>
        {isSingleSelection && (
          <p className="text-[12px] text-[hsl(var(--ink-60))] mt-1">
            {element.type === 'text' && 'نص'}
            {element.type === 'shape' && 'شكل'}
            {element.type === 'sticky' && 'ملاحظة لاصقة'}
            {element.type === 'image' && 'صورة'}
            {element.type === 'frame' && 'إطار'}
            {element.type === 'file' && 'ملف'}
            {element.type === 'pen_path' && 'رسم بالقلم'}
            {element.type === 'smart' && 'عنصر ذكي'}
          </p>
        )}
      </div>

      {/* Position */}
      {isSingleSelection && (
        <div className="space-y-3">
          <Label className="text-[12px] text-[hsl(var(--ink))]">الموقع</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-[11px] text-[hsl(var(--ink-60))]">X</Label>
              <Input
                type="number"
                value={element.position.x.toFixed(0)}
                onChange={(e) => handlePositionChange('x', e.target.value)}
                className="h-8 text-[12px]"
              />
            </div>
            <div>
              <Label className="text-[11px] text-[hsl(var(--ink-60))]">Y</Label>
              <Input
                type="number"
                value={element.position.y.toFixed(0)}
                onChange={(e) => handlePositionChange('y', e.target.value)}
                className="h-8 text-[12px]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Size */}
      {isSingleSelection && (
        <div className="space-y-3">
          <Label className="text-[12px] text-[hsl(var(--ink))]">الحجم</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-[11px] text-[hsl(var(--ink-60))]">العرض</Label>
              <Input
                type="number"
                value={element.size.width.toFixed(0)}
                onChange={(e) => handleSizeChange('width', e.target.value)}
                className="h-8 text-[12px]"
              />
            </div>
            <div>
              <Label className="text-[11px] text-[hsl(var(--ink-60))]">الارتفاع</Label>
              <Input
                type="number"
                value={element.size.height.toFixed(0)}
                onChange={(e) => handleSizeChange('height', e.target.value)}
                className="h-8 text-[12px]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Opacity */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-[12px] text-[hsl(var(--ink))]">الشفافية</Label>
          <span className="text-[11px] text-[hsl(var(--ink-60))]">
            {((element?.style?.opacity ?? 1) * 100).toFixed(0)}%
          </span>
        </div>
        <Slider
          value={[(element?.style?.opacity ?? 1)]}
          onValueChange={handleOpacityChange}
          min={0}
          max={1}
          step={0.01}
          className="w-full"
        />
      </div>

      {/* Actions */}
      <div className="pt-3 border-t border-[hsl(var(--border))] space-y-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2"
          onClick={toggleLock}
        >
          {selectedElements.some(el => el.locked) ? (
            <>
              <Unlock size={14} />
              <span>إلغاء القفل</span>
            </>
          ) : (
            <>
              <Lock size={14} />
              <span>قفل العنصر</span>
            </>
          )}
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2"
          onClick={toggleVisibility}
        >
          {selectedElements.every(el => el.visible !== false) ? (
            <>
              <EyeOff size={14} />
              <span>إخفاء</span>
            </>
          ) : (
            <>
              <Eye size={14} />
              <span>إظهار</span>
            </>
          )}
        </Button>

        <Button
          variant="destructive"
          size="sm"
          className="w-full justify-start gap-2"
          onClick={handleDelete}
        >
          <Trash2 size={14} />
          <span>حذف</span>
        </Button>
      </div>
    </div>
  );
};
