import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  MousePointer, Copy, Scissors, Clipboard, Trash2, 
  Group, Lock, Unlock, RotateCcw, FlipHorizontal, 
  FlipVertical, AlignLeft, AlignCenter, AlignRight, Move3D
} from 'lucide-react';
import { CanvasElement } from '../../types';

interface EnhancedSelectionPanelProps {
  selectedElements: CanvasElement[];
  onUpdateElement: (elementId: string, updates: any) => void;
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
  layers: any[];
  onLayerReorder: (layers: any[]) => void;
}

const EnhancedSelectionPanel: React.FC<EnhancedSelectionPanelProps> = ({
  selectedElements,
  onUpdateElement,
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
  onDistribute,
  layers,
  onLayerReorder
}) => {
  const [lockAspectRatio, setLockAspectRatio] = useState(false);
  const selectedElement = selectedElements[0];
  const multipleSelected = selectedElements.length > 1;

  const handlePositionChange = (axis: 'x' | 'y', value: number) => {
    if (selectedElement) {
      onUpdateElement(selectedElement.id, {
        position: { ...selectedElement.position, [axis]: value }
      });
    }
  };

  const handleSizeChange = (dimension: 'width' | 'height', value: number) => {
    if (!selectedElement) return;
    
    if (lockAspectRatio && selectedElement.size.width && selectedElement.size.height) {
      const aspectRatio = selectedElement.size.width / selectedElement.size.height;
      if (dimension === 'width') {
        onUpdateElement(selectedElement.id, {
          size: { width: value, height: value / aspectRatio }
        });
      } else {
        onUpdateElement(selectedElement.id, {
          size: { width: value * aspectRatio, height: value }
        });
      }
    } else {
      onUpdateElement(selectedElement.id, {
        size: { ...selectedElement.size, [dimension]: value }
      });
    }
  };

  return (
    <Card className="w-80 bg-white/95 backdrop-blur-xl shadow-lg border border-white/20 rounded-[24px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-arabic flex items-center gap-2">
          <MousePointer className="w-5 h-5 text-blue-500" />
          أداة التحديد المتقدمة
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="transform" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="transform" className="text-xs font-arabic">تحويل</TabsTrigger>
            <TabsTrigger value="arrange" className="text-xs font-arabic">ترتيب</TabsTrigger>
            <TabsTrigger value="layers" className="text-xs font-arabic">طبقات</TabsTrigger>
          </TabsList>
          
          <TabsContent value="transform" className="space-y-4">
            {/* معلومات التحديد */}
            <div>
              <h4 className="text-sm font-medium font-arabic mb-2">التحديد الحالي</h4>
              <div className="text-xs text-gray-600 font-arabic">
                {selectedElements.length === 0 && "لا توجد عناصر محددة"}
                {selectedElements.length === 1 && `عنصر واحد محدد: ${selectedElement?.type}`}
                {selectedElements.length > 1 && `${selectedElements.length} عناصر محددة`}
              </div>
            </div>

            {selectedElement && !multipleSelected && (
              <>
                <Separator />
                
                {/* الموقع والمقاس */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium font-arabic">الموقع والمقاس</h4>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={lockAspectRatio}
                        onCheckedChange={setLockAspectRatio}
                        id="aspect-ratio"
                      />
                      <Label htmlFor="aspect-ratio" className="text-xs font-arabic">قفل النسبة</Label>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs font-arabic">س (X)</Label>
                      <Input
                        type="number"
                        value={Math.round(selectedElement.position.x)}
                        onChange={(e) => handlePositionChange('x', parseInt(e.target.value) || 0)}
                        className="h-8 text-xs rounded-xl"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-arabic">ص (Y)</Label>
                      <Input
                        type="number"
                        value={Math.round(selectedElement.position.y)}
                        onChange={(e) => handlePositionChange('y', parseInt(e.target.value) || 0)}
                        className="h-8 text-xs rounded-xl"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-arabic">العرض</Label>
                      <Input
                        type="number"
                        value={Math.round(selectedElement.size.width)}
                        onChange={(e) => handleSizeChange('width', parseInt(e.target.value) || 0)}
                        className="h-8 text-xs rounded-xl"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-arabic">الارتفاع</Label>
                      <Input
                        type="number"
                        value={Math.round(selectedElement.size.height)}
                        onChange={(e) => handleSizeChange('height', parseInt(e.target.value) || 0)}
                        className="h-8 text-xs rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* التحويلات */}
                <div>
                  <h4 className="text-sm font-medium font-arabic mb-2">التحويلات</h4>
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
                    <Button
                      onClick={() => onRotate(90)}
                      size="sm"
                      variant="outline"
                      className="text-xs font-arabic rounded-xl"
                    >
                      <RotateCcw className="w-3 h-3 mr-1" />
                      دوران 90°
                    </Button>
                    <Button
                      onClick={() => onRotate(-90)}
                      size="sm"
                      variant="outline"
                      className="text-xs font-arabic rounded-xl"
                    >
                      <RotateCcw className="w-3 h-3 mr-1" />
                      دوران -90°
                    </Button>
                  </div>
                </div>
              </>
            )}

            <Separator />

            {/* أدوات التحرير */}
            <div>
              <h4 className="text-sm font-medium font-arabic mb-2">أدوات التحرير</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={onCut} size="sm" variant="outline" className="text-xs font-arabic rounded-xl">
                  <Scissors className="w-3 h-3 mr-1" />
                  قص
                </Button>
                <Button onClick={onCopy} size="sm" variant="outline" className="text-xs font-arabic rounded-xl">
                  <Copy className="w-3 h-3 mr-1" />
                  نسخ
                </Button>
                <Button onClick={onPaste} size="sm" variant="outline" className="text-xs font-arabic rounded-xl">
                  <Clipboard className="w-3 h-3 mr-1" />
                  لصق
                </Button>
                <Button onClick={onDuplicate} size="sm" variant="outline" className="text-xs font-arabic rounded-xl">
                  <Copy className="w-3 h-3 mr-1" />
                  تكرار
                </Button>
                <Button onClick={onLock} size="sm" variant="outline" className="text-xs font-arabic rounded-xl">
                  <Lock className="w-3 h-3 mr-1" />
                  قفل
                </Button>
                <Button onClick={onUnlock} size="sm" variant="outline" className="text-xs font-arabic rounded-xl">
                  <Unlock className="w-3 h-3 mr-1" />
                  إلغاء القفل
                </Button>
                <Button 
                  onClick={onDelete} 
                  size="sm" 
                  variant="destructive" 
                  className="text-xs font-arabic rounded-xl col-span-2"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  حذف ({selectedElements.length})
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="arrange" className="space-y-4">
            {/* المحاذاة */}
            <div>
              <h4 className="text-sm font-medium font-arabic mb-2">المحاذاة</h4>
              <div className="grid grid-cols-3 gap-1">
                <Button onClick={() => onAlign('left')} size="sm" variant="outline" className="text-xs rounded-lg">
                  <AlignLeft className="w-3 h-3" />
                </Button>
                <Button onClick={() => onAlign('center')} size="sm" variant="outline" className="text-xs rounded-lg">
                  <AlignCenter className="w-3 h-3" />
                </Button>
                <Button onClick={() => onAlign('right')} size="sm" variant="outline" className="text-xs rounded-lg">
                  <AlignRight className="w-3 h-3" />
                </Button>
                <Button onClick={() => onAlign('top')} size="sm" variant="outline" className="text-xs rounded-lg">
                  <AlignLeft className="w-3 h-3" />
                </Button>
                <Button onClick={() => onAlign('middle')} size="sm" variant="outline" className="text-xs rounded-lg">
                  <AlignCenter className="w-3 h-3" />
                </Button>
                <Button onClick={() => onAlign('bottom')} size="sm" variant="outline" className="text-xs rounded-lg">
                  <AlignRight className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <Separator />

            {/* التوزيع */}
            {multipleSelected && (
              <>
                <div>
                  <h4 className="text-sm font-medium font-arabic mb-2">التوزيع</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      onClick={() => onDistribute('horizontal')} 
                      size="sm" 
                      variant="outline" 
                      className="text-xs font-arabic rounded-xl"
                    >
                      <Move3D className="w-3 h-3 mr-1" />
                      أفقي
                    </Button>
                    <Button 
                      onClick={() => onDistribute('vertical')} 
                      size="sm" 
                      variant="outline" 
                      className="text-xs font-arabic rounded-xl"
                    >
                      <Move3D className="w-3 h-3 mr-1" />
                      عمودي
                    </Button>
                  </div>
                </div>

                <Separator />
              </>
            )}

            {/* التجميع */}
            <div>
              <h4 className="text-sm font-medium font-arabic mb-2">التجميع</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={onGroup} size="sm" variant="outline" className="text-xs font-arabic rounded-xl">
                  <Group className="w-3 h-3 mr-1" />
                  تجميع
                </Button>
                <Button onClick={onUngroup} size="sm" variant="outline" className="text-xs font-arabic rounded-xl">
                  <Group className="w-3 h-3 mr-1" />
                  إلغاء التجميع
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="layers" className="space-y-4">
            {/* قائمة الطبقات */}
            <div>
              <h4 className="text-sm font-medium font-arabic mb-2">الطبقات ({layers.length})</h4>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {layers.map((layer, index) => (
                  <div
                    key={layer.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-xl text-xs border border-gray-200"
                  >
                    <span className="font-arabic">{layer.name || `طبقة ${index + 1}`}</span>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-blue-500 rounded-full opacity-80"></div>
                      <span className="text-gray-500">{layer.elements?.length || 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* نصائح الاستخدام */}
        <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
          <div className="text-xs text-blue-800 font-arabic space-y-1">
            <div>⚡ Ctrl + النقر للتحديد المتعدد</div>
            <div>🔒 العناصر المقفلة لا يمكن تحديدها</div>
            <div>📐 قفل النسبة يحافظ على شكل العنصر</div>
            <div>🎯 المحاذاة تعمل مع عدة عناصر</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedSelectionPanel;