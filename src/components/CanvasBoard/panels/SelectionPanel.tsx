import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Copy, Scissors, Clipboard, Trash2, Group, MousePointer } from 'lucide-react';
import { CanvasElement } from '../types';

interface SelectionPanelProps {
  selectedElements: CanvasElement[];
  onUpdateElement: (elementId: string, updates: any) => void;
  onCopy: () => void;
  onCut: () => void;
  onPaste: () => void;
  onDelete: () => void;
  onGroup: () => void;
  layers: any[];
  onLayerReorder: (layers: any[]) => void;
}

const SelectionPanel: React.FC<SelectionPanelProps> = ({
  selectedElements,
  onUpdateElement,
  onCopy,
  onCut,
  onPaste,
  onDelete,
  onGroup,
  layers,
  onLayerReorder
}) => {
  const selectedElement = selectedElements[0];
  const multipleSelected = selectedElements.length > 1;

  return (
    <Card className="w-80 bg-white/95 backdrop-blur-sm border-black/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-arabic flex items-center gap-2">
          <MousePointer className="w-5 h-5 text-blue-500" />
          أداة التحديد
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedElement && !multipleSelected && (
          <>
            {/* موقع ومقاس العنصر */}
            <div>
              <h4 className="text-sm font-medium font-arabic mb-2">الموقع والمقاس</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs font-arabic">س (X)</Label>
                  <Input
                    type="number"
                    value={selectedElement.position.x}
                    onChange={(e) => onUpdateElement(selectedElement.id, {
                      position: { ...selectedElement.position, x: parseInt(e.target.value) || 0 }
                    })}
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs font-arabic">ص (Y)</Label>
                  <Input
                    type="number"
                    value={selectedElement.position.y}
                    onChange={(e) => onUpdateElement(selectedElement.id, {
                      position: { ...selectedElement.position, y: parseInt(e.target.value) || 0 }
                    })}
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs font-arabic">العرض</Label>
                  <Input
                    type="number"
                    value={selectedElement.size.width}
                    onChange={(e) => onUpdateElement(selectedElement.id, {
                      size: { ...selectedElement.size, width: parseInt(e.target.value) || 0 }
                    })}
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs font-arabic">الارتفاع</Label>
                  <Input
                    type="number"
                    value={selectedElement.size.height}
                    onChange={(e) => onUpdateElement(selectedElement.id, {
                      size: { ...selectedElement.size, height: parseInt(e.target.value) || 0 }
                    })}
                    className="h-8 text-xs"
                  />
                </div>
              </div>
            </div>

            <Separator />
          </>
        )}

        {/* أدوات التحرير */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">أدوات التحرير</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={onCut} size="sm" variant="outline" className="text-xs font-arabic">
              <Scissors className="w-3 h-3 mr-1" />
              قص
            </Button>
            <Button onClick={onCopy} size="sm" variant="outline" className="text-xs font-arabic">
              <Copy className="w-3 h-3 mr-1" />
              نسخ
            </Button>
            <Button onClick={onPaste} size="sm" variant="outline" className="text-xs font-arabic">
              <Clipboard className="w-3 h-3 mr-1" />
              لصق
            </Button>
            <Button onClick={onDelete} size="sm" variant="destructive" className="text-xs font-arabic">
              <Trash2 className="w-3 h-3 mr-1" />
              حذف
            </Button>
          </div>
        </div>

        {multipleSelected && (
          <>
            <Separator />
            {/* تجميع العناصر */}
            <div>
              <h4 className="text-sm font-medium font-arabic mb-2">تجميع العناصر</h4>
              <Button onClick={onGroup} className="w-full text-xs font-arabic">
                <Group className="w-3 h-3 mr-1" />
                تجميع ({selectedElements.length} عناصر)
              </Button>
            </div>
          </>
        )}

        <Separator />

        {/* قائمة الطبقات */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">الطبقات</h4>
          <div className="max-h-48 overflow-y-auto space-y-1">
            {layers.map((layer, index) => (
              <div
                key={layer.id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs cursor-move"
                draggable
              >
                <span className="font-arabic">{layer.name || `طبقة ${index + 1}`}</span>
                <div className="flex items-center gap-1">
                  <button className="w-4 h-4 bg-blue-500 rounded-full opacity-80"></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* معلومات إضافية */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <h4 className="text-sm font-medium font-arabic mb-1">التحديد:</h4>
          <ul className="text-xs text-blue-800 font-arabic space-y-1">
            <li>• انقر لتحديد عنصر واحد</li>
            <li>• اسحب لتحديد عدة عناصر</li>
            <li>• سحب الطبقات لإعادة الترتيب</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default SelectionPanel;