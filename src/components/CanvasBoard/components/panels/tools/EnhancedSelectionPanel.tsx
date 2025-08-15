import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MousePointer, 
  Copy, 
  Scissors, 
  Clipboard,
  Trash2,
  Group,
  Ungroup,
  Lock,
  Unlock,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical,
  Move,
  RotateCcw,
  Maximize,
  Minimize,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Grid3X3,
  Layers,
  Eye,
  EyeOff,
  Settings,
  Zap,
  Magnet
} from 'lucide-react';
import { CanvasElement } from '../../../types';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { toast } from 'sonner';

interface EnhancedSelectionPanelProps {
  selectedElements: CanvasElement[];
  onCopy: () => void;
  onCut: () => void;
  onPaste: () => void;
  onDelete: () => void;
  onGroup: () => void;
  onUngroup: () => void;
  onLock: () => void;
  onUnlock: () => void;
  onRotate: () => void;
  onFlipHorizontal: () => void;
  onFlipVertical: () => void;
  onAlign: (direction: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
  onUpdateElement: (elementId: string, updates: any) => void;
  // Enhanced functions
  onMoveElement?: (elementId: string, direction: 'up' | 'down' | 'left' | 'right', distance: number) => void;
  onRotateElement?: (elementId: string, angle: number) => void;
  onDistribute?: (direction: 'horizontal' | 'vertical') => void;
  onArrange?: (arrangement: 'front' | 'back' | 'forward' | 'backward') => void;
  onSnapToGrid?: () => void;
  onSelectAll?: () => void;
  onSelectNone?: () => void;
}

export const EnhancedSelectionPanel: React.FC<EnhancedSelectionPanelProps> = ({
  selectedElements,
  onCopy,
  onCut,
  onPaste,
  onDelete,
  onGroup,
  onUngroup,
  onLock,
  onUnlock,
  onRotate,
  onFlipHorizontal,
  onFlipVertical,
  onAlign,
  onUpdateElement,
  onMoveElement,
  onRotateElement,
  onDistribute,
  onArrange,
  onSnapToGrid,
  onSelectAll,
  onSelectNone
}) => {
  const [moveDistance, setMoveDistance] = useState([10]);
  const [rotationAngle, setRotationAngle] = useState([15]);
  const [activeTab, setActiveTab] = useState('basic');

  const handleMove = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (selectedElements.length > 0 && onMoveElement) {
      selectedElements.forEach(element => {
        onMoveElement(element.id, direction, moveDistance[0]);
      });
      toast.success(`تم تحريك ${selectedElements.length} عنصر`);
    }
  };

  const handleRotateCustom = (angle: number) => {
    if (selectedElements.length > 0 && onRotateElement) {
      selectedElements.forEach(element => {
        onRotateElement(element.id, angle);
      });
      toast.success(`تم تدوير ${selectedElements.length} عنصر`);
    }
  };

  const hasSelection = selectedElements.length > 0;
  const multipleSelected = selectedElements.length > 1;
  const isLocked = selectedElements.some(el => el.locked);
  const isGrouped = selectedElements.some(el => el.parentId);

  return (
    <Card className="h-full flex flex-col bg-background/95 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <MousePointer className="w-4 h-4" />
          أدوات التحديد
          {hasSelection && (
            <BaseBadge variant="secondary" className="text-xs">
              {selectedElements.length}
            </BaseBadge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-4">
        {hasSelection ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3 mb-3">
              <TabsTrigger value="basic" className="text-xs">أساسي</TabsTrigger>
              <TabsTrigger value="transform" className="text-xs">تحويل</TabsTrigger>
              <TabsTrigger value="arrange" className="text-xs">ترتيب</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-auto">
              <TabsContent value="basic" className="mt-0 space-y-4">
                {/* عمليات الحافظة */}
                <div>
                  <Label className="text-xs font-medium mb-2 block">الحافظة</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button size="sm" onClick={onCopy} className="text-xs">
                      <Copy className="w-3 h-3 mr-1" />
                      نسخ
                    </Button>
                    <Button size="sm" onClick={onCut} className="text-xs">
                      <Scissors className="w-3 h-3 mr-1" />
                      قص
                    </Button>
                    <Button size="sm" onClick={onPaste} className="text-xs">
                      <Clipboard className="w-3 h-3 mr-1" />
                      لصق
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* عمليات التجميع والقفل */}
                <div>
                  <Label className="text-xs font-medium mb-2 block">إدارة</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {multipleSelected && (
                      <Button size="sm" onClick={onGroup} className="text-xs">
                        <Group className="w-3 h-3 mr-1" />
                        تجميع
                      </Button>
                    )}
                    {isGrouped && (
                      <Button size="sm" onClick={onUngroup} className="text-xs">
                        <Ungroup className="w-3 h-3 mr-1" />
                        إلغاء تجميع
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      onClick={isLocked ? onUnlock : onLock} 
                      variant={isLocked ? 'destructive' : 'outline'}
                      className="text-xs"
                    >
                      {isLocked ? <Unlock className="w-3 h-3 mr-1" /> : <Lock className="w-3 h-3 mr-1" />}
                      {isLocked ? 'إلغاء قفل' : 'قفل'}
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* حذف */}
                <Button 
                  size="sm" 
                  variant="destructive" 
                  onClick={onDelete}
                  className="w-full text-xs"
                >
                  <Trash2 className="w-3 h-3 mr-2" />
                  حذف العناصر المحددة
                </Button>
              </TabsContent>

              <TabsContent value="transform" className="mt-0 space-y-4">
                {/* تحريك دقيق */}
                <div>
                  <Label className="text-xs font-medium mb-2 block">تحريك دقيق</Label>
                  <div className="space-y-2">
                    <div>
                      <Label className="text-xs text-muted-foreground">المسافة: {moveDistance[0]}px</Label>
                      <Slider
                        value={moveDistance}
                        onValueChange={setMoveDistance}
                        max={50}
                        min={1}
                        step={1}
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <div></div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleMove('up')}
                        className="h-8 p-0"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </Button>
                      <div></div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleMove('left')}
                        className="h-8 p-0"
                      >
                        <ArrowLeft className="w-3 h-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={onSnapToGrid}
                        className="h-8 p-0"
                      >
                        <Magnet className="w-3 h-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleMove('right')}
                        className="h-8 p-0"
                      >
                        <ArrowRight className="w-3 h-3" />
                      </Button>
                      <div></div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleMove('down')}
                        className="h-8 p-0"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </Button>
                      <div></div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* تدوير وقلب */}
                <div>
                  <Label className="text-xs font-medium mb-2 block">تدوير وقلب</Label>
                  <div className="space-y-2">
                    <div>
                      <Label className="text-xs text-muted-foreground">زاوية التدوير: {rotationAngle[0]}°</Label>
                      <Slider
                        value={rotationAngle}
                        onValueChange={setRotationAngle}
                        max={180}
                        min={1}
                        step={1}
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleRotateCustom(-rotationAngle[0])}
                        className="text-xs"
                      >
                        <RotateCcw className="w-3 h-3 mr-1" />
                        يسار
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => handleRotateCustom(rotationAngle[0])}
                        className="text-xs"
                      >
                        <RotateCw className="w-3 h-3 mr-1" />
                        يمين
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => handleRotateCustom(90)}
                        variant="outline"
                        className="text-xs"
                      >
                        90°
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button size="sm" onClick={onFlipHorizontal} className="text-xs">
                        <FlipHorizontal className="w-3 h-3 mr-1" />
                        قلب أفقي
                      </Button>
                      <Button size="sm" onClick={onFlipVertical} className="text-xs">
                        <FlipVertical className="w-3 h-3 mr-1" />
                        قلب عمودي
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="arrange" className="mt-0 space-y-4">
                {/* محاذاة */}
                {multipleSelected && (
                  <div>
                    <Label className="text-xs font-medium mb-2 block">محاذاة</Label>
                    <div className="grid grid-cols-3 gap-1 mb-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => onAlign('left')}
                        className="text-xs h-8"
                      >
                        <AlignLeft className="w-3 h-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => onAlign('center')}
                        className="text-xs h-8"
                      >
                        <AlignCenter className="w-3 h-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => onAlign('right')}
                        className="text-xs h-8"
                      >
                        <AlignRight className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => onAlign('top')}
                        className="text-xs h-8"
                      >
                        <AlignStartVertical className="w-3 h-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => onAlign('middle')}
                        className="text-xs h-8"
                      >
                        <AlignCenterVertical className="w-3 h-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => onAlign('bottom')}
                        className="text-xs h-8"
                      >
                        <AlignEndVertical className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )}

                {multipleSelected && (
                  <>
                    <Separator />

                    {/* توزيع */}
                    <div>
                      <Label className="text-xs font-medium mb-2 block">توزيع</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => onDistribute?.('horizontal')}
                          className="text-xs"
                        >
                          أفقي
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => onDistribute?.('vertical')}
                          className="text-xs"
                        >
                          عمودي
                        </Button>
                      </div>
                    </div>

                    <Separator />
                  </>
                )}

                {/* ترتيب الطبقات */}
                <div>
                  <Label className="text-xs font-medium mb-2 block">ترتيب الطبقات</Label>
                  <div className="grid grid-cols-2 gap-1">
                    <Button 
                      size="sm" 
                      onClick={() => onArrange?.('front')}
                      className="text-xs"
                    >
                      للأمام
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => onArrange?.('back')}
                      className="text-xs"
                    >
                      للخلف
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onArrange?.('forward')}
                      className="text-xs"
                    >
                      خطوة للأمام
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onArrange?.('backward')}
                      className="text-xs"
                    >
                      خطوة للخلف
                    </Button>
                  </div>
                </div>

                {/* أدوات التحديد */}
                <Separator />
                <div>
                  <Label className="text-xs font-medium mb-2 block">التحديد</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={onSelectAll}
                      className="text-xs"
                    >
                      تحديد الكل
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={onSelectNone}
                      className="text-xs"
                    >
                      إلغاء التحديد
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <MousePointer className="w-12 h-12 text-muted-foreground mb-3" />
            <h3 className="text-sm font-medium mb-2">لا توجد عناصر محددة</h3>
            <p className="text-xs text-muted-foreground mb-4">
              حدد عنصراً أو أكثر لعرض أدوات التحويل
            </p>
            <Button 
              size="sm" 
              variant="outline"
              onClick={onSelectAll}
              className="text-xs"
            >
              <Zap className="w-3 h-3 mr-1" />
              تحديد الكل
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};