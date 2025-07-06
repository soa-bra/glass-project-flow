import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Scissors, Clipboard, Trash2 } from 'lucide-react';
import { SMART_ELEMENTS, ZOOM_OPTIONS } from '../constants';
import { toast } from 'sonner';

interface ToolPropsBarProps {
  selectedTool: string;
  selectedElementId: string | null;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onSmartElementSelect: (elementId: string) => void;
  onCopy: () => void;
  onCut: () => void;
  onPaste: () => void;
  onDelete: () => void;
}

const ToolPropsBar: React.FC<ToolPropsBarProps> = ({ 
  selectedTool, 
  selectedElementId,
  zoom, 
  onZoomChange,
  onSmartElementSelect,
  onCopy,
  onCut,
  onPaste,
  onDelete
}) => {
  const handleZoomSelect = (value: string) => {
    if (value === 'fit') {
      onZoomChange(100);
      toast.success('تم ضبط الزوم على الملاءمة');
    } else {
      onZoomChange(parseInt(value));
    }
  };
  return (
    <div className="fixed bottom-24 left-4 z-40 w-80">
      <Card className="bg-white/95 backdrop-blur-md shadow-sm rounded-[40px]">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-arabic">خصائص الأداة</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedTool === 'select' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="الموقع X" type="number" />
                <Input placeholder="الموقع Y" type="number" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="العرض" type="number" />
                <Input placeholder="الارتفاع" type="number" />
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onCut}
                  disabled={!selectedElementId}
                  title="قص"
                >
                  <Scissors className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onCopy}
                  disabled={!selectedElementId}
                  title="نسخ"
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onPaste}
                  title="لصق"
                >
                  <Clipboard className="w-4 h-4" />
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={onDelete}
                  disabled={!selectedElementId}
                  title="حذف"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
          
          {selectedTool === 'zoom' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Input 
                  type="number"
                  value={zoom} 
                  onChange={(e) => onZoomChange(Number(e.target.value))}
                  placeholder="نسبة الزوم"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onZoomChange(100)}
                >
                  إعادة تعيين
                </Button>
              </div>
              <select 
                className="w-full p-2 border rounded"
                onChange={(e) => handleZoomSelect(e.target.value)}
                value={zoom.toString()}
              >
                {ZOOM_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onZoomChange(Math.min(zoom + 25, 200))}
                >
                  تكبير +
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onZoomChange(Math.max(zoom - 25, 25))}
                >
                  تصغير -
                </Button>
              </div>
            </div>
          )}

          {selectedTool === 'smart-element' && (
            <div className="space-y-3">
              <h4 className="font-medium font-arabic">العناصر الذكية</h4>
              <div className="grid grid-cols-1 gap-2">
                {SMART_ELEMENTS.map((element) => {
                  const Icon = element.icon;
                  return (
                    <Button
                      key={element.id}
                      variant="outline"
                      size="sm"
                      className="justify-start hover:bg-blue-50"
                      onClick={() => {
                        onSmartElementSelect(element.id);
                        toast.success(`تم اختيار ${element.label}`);
                      }}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {element.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {(selectedTool === 'text' || selectedTool === 'sticky') && (
            <div className="space-y-3">
              <h4 className="font-medium font-arabic">خصائص النص</h4>
              <Input placeholder="محتوى النص..." />
              <div className="grid grid-cols-2 gap-2">
                <select className="p-2 border rounded">
                  <option>العادي</option>
                  <option>عريض</option>
                  <option>مائل</option>
                </select>
                <select className="p-2 border rounded">
                  <option>صغير</option>
                  <option>متوسط</option>
                  <option>كبير</option>
                </select>
              </div>
            </div>
          )}

          {selectedTool === 'shape' && (
            <div className="space-y-3">
              <h4 className="font-medium font-arabic">خصائص الشكل</h4>
              <div className="grid grid-cols-2 gap-2">
                <select className="p-2 border rounded">
                  <option>مستطيل</option>
                  <option>دائرة</option>
                  <option>مثلث</option>
                  <option>خط</option>
                </select>
                <Input type="number" placeholder="سمك الحد" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ToolPropsBar;