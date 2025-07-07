import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  MousePointer, Copy, Scissors, Clipboard, Trash2, 
  Group, Ungroup, Lock, Unlock, RotateCw,
  FlipHorizontal, FlipVertical, AlignLeft, 
  AlignCenter, AlignRight, Move3d
} from 'lucide-react';
import { CanvasElement } from '../types';

interface EnhancedSelectionToolProps {
  selectedTool: string;
  selectedElements: CanvasElement[];
  onCopy: () => void;
  onCut: () => void;
  onPaste: () => void;
  onDelete: () => void;
  onGroup: () => void;
  onUngroup: () => void;
  onLock: () => void;
  onUnlock: () => void;
  onDuplicate: () => void;
  onFlipHorizontal: () => void;
  onFlipVertical: () => void;
  onRotate: (angle: number) => void;
  onAlign: (type: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
  onDistribute: (type: 'horizontal' | 'vertical') => void;
}

export const EnhancedSelectionTool: React.FC<EnhancedSelectionToolProps> = ({ 
  selectedTool,
  selectedElements,
  onCopy,
  onCut,
  onPaste,
  onDelete,
  onGroup,
  onUngroup,
  onLock,
  onUnlock,
  onDuplicate,
  onFlipHorizontal,
  onFlipVertical,
  onRotate,
  onAlign,
  onDistribute
}) => {
  const [selectionMode, setSelectionMode] = useState<'single' | 'multiple'>('single');

  if (selectedTool !== 'select') return null;

  const hasSelection = selectedElements.length > 0;
  const multipleSelection = selectedElements.length > 1;
  const singleSelection = selectedElements.length === 1;

  return (
    <Card className="w-80 bg-white/95 backdrop-blur-xl shadow-lg border border-white/20 rounded-[24px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-arabic flex items-center gap-2">
          <MousePointer className="w-5 h-5 text-blue-500" />
          أداة التحديد المتقدمة
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* معلومات التحديد */}
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-arabic text-gray-600">العناصر المحددة:</span>
            <Badge variant={hasSelection ? "default" : "secondary"} className="font-arabic">
              {selectedElements.length}
            </Badge>
          </div>
          {hasSelection && (
            <div className="mt-2 text-xs text-gray-500 font-arabic">
              الأنواع: {[...new Set(selectedElements.map(el => el.type))].join(', ')}
            </div>
          )}
        </div>

        {/* نمط التحديد */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">نمط التحديد</h4>
          <div className="flex gap-2">
            <Button
              onClick={() => setSelectionMode('single')}
              variant={selectionMode === 'single' ? "default" : "outline"}
              size="sm"
              className="flex-1 text-xs font-arabic rounded-xl"
            >
              فردي
            </Button>
            <Button
              onClick={() => setSelectionMode('multiple')}
              variant={selectionMode === 'multiple' ? "default" : "outline"}
              size="sm"
              className="flex-1 text-xs font-arabic rounded-xl"
            >
              متعدد
            </Button>
          </div>
          <p className="text-xs text-gray-500 font-arabic mt-1 text-center">
            {selectionMode === 'multiple' ? 'Ctrl + نقر للتحديد المتعدد' : 'نقر واحد للتحديد'}
          </p>
        </div>

        <Separator />

        {/* العمليات الأساسية */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">العمليات الأساسية</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={onCopy}
              disabled={!hasSelection}
              size="sm"
              variant="outline"
              className="text-xs font-arabic rounded-xl"
            >
              <Copy className="w-3 h-3 mr-1" />
              نسخ
            </Button>
            <Button
              onClick={onCut}
              disabled={!hasSelection}
              size="sm"
              variant="outline"
              className="text-xs font-arabic rounded-xl"
            >
              <Scissors className="w-3 h-3 mr-1" />
              قص
            </Button>
            <Button
              onClick={onPaste}
              size="sm"
              variant="outline"
              className="text-xs font-arabic rounded-xl"
            >
              <Clipboard className="w-3 h-3 mr-1" />
              لصق
            </Button>
            <Button
              onClick={onDelete}
              disabled={!hasSelection}
              size="sm"
              variant="destructive"
              className="text-xs font-arabic rounded-xl"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              حذف
            </Button>
          </div>
        </div>

        <Separator />

        {/* عمليات التجميع */}
        {multipleSelection && (
          <>
            <div>
              <h4 className="text-sm font-medium font-arabic mb-2">عمليات التجميع</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={onGroup}
                  size="sm"
                  variant="outline"
                  className="text-xs font-arabic rounded-xl"
                >
                  <Group className="w-3 h-3 mr-1" />
                  تجميع
                </Button>
                <Button
                  onClick={onUngroup}
                  size="sm"
                  variant="outline"
                  className="text-xs font-arabic rounded-xl"
                >
                  <Ungroup className="w-3 h-3 mr-1" />
                  إلغاء التجميع
                </Button>
              </div>
            </div>
            <Separator />
          </>
        )}

        {/* العمليات المتقدمة */}
        {hasSelection && (
          <div>
            <h4 className="text-sm font-medium font-arabic mb-2">عمليات متقدمة</h4>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={onLock}
                  size="sm"
                  variant="outline"
                  className="text-xs font-arabic rounded-xl"
                >
                  <Lock className="w-3 h-3 mr-1" />
                  قفل
                </Button>
                <Button
                  onClick={onUnlock}
                  size="sm"
                  variant="outline"
                  className="text-xs font-arabic rounded-xl"
                >
                  <Unlock className="w-3 h-3 mr-1" />
                  إلغاء القفل
                </Button>
              </div>
              
              <Button
                onClick={onDuplicate}
                size="sm"
                variant="outline"
                className="w-full text-xs font-arabic rounded-xl"
              >
                <Copy className="w-3 h-3 mr-2" />
                تكرار العناصر
              </Button>
            </div>
          </div>
        )}

        {/* التحويلات */}
        {singleSelection && (
          <>
            <Separator />
            <div>
              <h4 className="text-sm font-medium font-arabic mb-2">التحويلات</h4>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={onFlipHorizontal}
                    size="sm"
                    variant="outline"
                    className="text-xs font-arabic rounded-xl"
                  >
                    <FlipHorizontal className="w-3 h-3 mr-1" />
                    قلب أفقي
                  </Button>
                  <Button
                    onClick={onFlipVertical}
                    size="sm"
                    variant="outline"
                    className="text-xs font-arabic rounded-xl"
                  >
                    <FlipVertical className="w-3 h-3 mr-1" />
                    قلب عمودي
                  </Button>
                </div>
                
                <div className="grid grid-cols-3 gap-1">
                  <Button
                    onClick={() => onRotate(90)}
                    size="sm"
                    variant="outline"
                    className="text-xs font-arabic rounded-lg"
                  >
                    <RotateCw className="w-3 h-3" />
                    90°
                  </Button>
                  <Button
                    onClick={() => onRotate(180)}
                    size="sm"
                    variant="outline"
                    className="text-xs font-arabic rounded-lg"
                  >
                    <RotateCw className="w-3 h-3" />
                    180°
                  </Button>
                  <Button
                    onClick={() => onRotate(270)}
                    size="sm"
                    variant="outline"
                    className="text-xs font-arabic rounded-lg"
                  >
                    <RotateCw className="w-3 h-3" />
                    270°
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* المحاذاة والتوزيع */}
        {multipleSelection && (
          <>
            <Separator />
            <div>
              <h4 className="text-sm font-medium font-arabic mb-2">المحاذاة</h4>
              <div className="grid grid-cols-3 gap-1 mb-2">
                <Button
                  onClick={() => onAlign('left')}
                  size="sm"
                  variant="outline"
                  className="text-xs font-arabic rounded-lg"
                >
                  <AlignLeft className="w-3 h-3" />
                </Button>
                <Button
                  onClick={() => onAlign('center')}
                  size="sm"
                  variant="outline"
                  className="text-xs font-arabic rounded-lg"
                >
                  <AlignCenter className="w-3 h-3" />
                </Button>
                <Button
                  onClick={() => onAlign('right')}
                  size="sm"
                  variant="outline"
                  className="text-xs font-arabic rounded-lg"
                >
                  <AlignRight className="w-3 h-3" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => onDistribute('horizontal')}
                  size="sm"
                  variant="outline"
                  className="text-xs font-arabic rounded-xl"
                >
                  <Move3d className="w-3 h-3 mr-1" />
                  توزيع أفقي
                </Button>
                <Button
                  onClick={() => onDistribute('vertical')}
                  size="sm"
                  variant="outline"
                  className="text-xs font-arabic rounded-xl"
                >
                  <Move3d className="w-3 h-3 mr-1" />
                  توزيع عمودي
                </Button>
              </div>
            </div>
          </>
        )}

        {/* نصائح الاستخدام */}
        <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
          <div className="text-xs text-blue-800 font-arabic space-y-1">
            <div>🖱️ نقر لتحديد عنصر واحد</div>
            <div>⌨️ Ctrl + نقر للتحديد المتعدد</div>
            <div>🔲 سحب لتحديد منطقة</div>
            <div>🎯 السحب لتحريك العناصر</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedSelectionTool;