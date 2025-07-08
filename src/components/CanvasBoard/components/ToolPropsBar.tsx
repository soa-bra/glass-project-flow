import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { 
  Copy, 
  Scissors, 
  ClipboardCopy, 
  Trash2, 
  Group, 
  Ungroup,
  Layers,
  RotateCw,
  Move,
  Maximize,
  Palette,
  Type,
  Upload,
  MessageSquare,
  Plus
} from 'lucide-react';

interface ToolPropsBarProps {
  selectedTool: string;
  isCollabBarOpen: boolean;
  selectedElement?: any;
  onElementUpdate?: (updates: any) => void;
  onAction?: (action: string) => void;
}

export const ToolPropsBar: React.FC<ToolPropsBarProps> = ({
  selectedTool,
  isCollabBarOpen,
  selectedElement,
  onElementUpdate,
  onAction
}) => {
  const isCompact = isCollabBarOpen;

  const renderSelectionTools = () => (
    <div className="space-y-4">
      <div className="text-sm font-medium text-gray-700">أداة التحديد</div>
      
      {selectedElement && (
        <>
          {/* Position and Size */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">الموقع X</Label>
              <Input 
                type="number" 
                value={selectedElement.position?.x || 0}
                onChange={(e) => onElementUpdate?.({
                  position: { ...selectedElement.position, x: parseInt(e.target.value) }
                })}
                className="h-8 text-xs"
              />
            </div>
            <div>
              <Label className="text-xs">الموقع Y</Label>
              <Input 
                type="number" 
                value={selectedElement.position?.y || 0}
                onChange={(e) => onElementUpdate?.({
                  position: { ...selectedElement.position, y: parseInt(e.target.value) }
                })}
                className="h-8 text-xs"
              />
            </div>
            <div>
              <Label className="text-xs">العرض</Label>
              <Input 
                type="number" 
                value={selectedElement.size?.width || 0}
                onChange={(e) => onElementUpdate?.({
                  size: { ...selectedElement.size, width: parseInt(e.target.value) }
                })}
                className="h-8 text-xs"
              />
            </div>
            <div>
              <Label className="text-xs">الارتفاع</Label>
              <Input 
                type="number" 
                value={selectedElement.size?.height || 0}
                onChange={(e) => onElementUpdate?.({
                  size: { ...selectedElement.size, height: parseInt(e.target.value) }
                })}
                className="h-8 text-xs"
              />
            </div>
          </div>

          {/* Edit Actions */}
          <div className="flex gap-1 flex-wrap">
            <Button size="sm" variant="outline" onClick={() => onAction?.('cut')}>
              <Scissors className="w-3 h-3" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => onAction?.('copy')}>
              <Copy className="w-3 h-3" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => onAction?.('paste')}>
              <ClipboardCopy className="w-3 h-3" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => onAction?.('delete')}>
              <Trash2 className="w-3 h-3" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => onAction?.('group')}>
              <Group className="w-3 h-3" />
            </Button>
          </div>

          {/* Layers Panel */}
          <div>
            <Label className="text-xs">الطبقات</Label>
            <div className="border rounded p-2 max-h-32 overflow-y-auto">
              <div className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded text-xs">
                <Layers className="w-3 h-3" />
                <span>العنصر المحدد</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderSmartPenTools = () => (
    <div className="space-y-4">
      <div className="text-sm font-medium text-gray-700">القلم الذكي</div>
      
      {/* Line Style */}
      <div>
        <Label className="text-xs">عرض الخط</Label>
        <Slider defaultValue={[2]} max={10} min={1} step={1} className="mt-2" />
      </div>
      
      <div>
        <Label className="text-xs">نوع الخط</Label>
        <Select defaultValue="solid">
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="solid">مستمر</SelectItem>
            <SelectItem value="dashed">متقطع</SelectItem>
            <SelectItem value="dotted">منقط</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Smart Functions */}
      <Separator />
      <div className="text-xs font-medium">الوظائف الذكية</div>
      <div className="grid gap-2">
        <Button size="sm" variant="outline" className="justify-start text-xs">
          <RotateCw className="w-3 h-3 ml-2" />
          الرسم الذكي
        </Button>
        <Button size="sm" variant="outline" className="justify-start text-xs">
          <Move className="w-3 h-3 ml-2" />
          الجذر
        </Button>
        <Button size="sm" variant="outline" className="justify-start text-xs">
          <Group className="w-3 h-3 ml-2" />
          التجميع التلقائي
        </Button>
        <Button size="sm" variant="outline" className="justify-start text-xs">
          <Trash2 className="w-3 h-3 ml-2" />
          أداة المسح
        </Button>
      </div>
    </div>
  );

  const renderZoomTools = () => (
    <div className="space-y-4">
      <div className="text-sm font-medium text-gray-700">أداة الزوم</div>
      
      <div className="grid grid-cols-3 gap-2">
        <div>
          <Label className="text-xs">درجة القرب</Label>
          <Input type="number" defaultValue={100} className="h-8 text-xs" />
        </div>
        <div>
          <Label className="text-xs">الأفقي</Label>
          <Input type="number" defaultValue={0} className="h-8 text-xs" />
        </div>
        <div>
          <Label className="text-xs">العمودي</Label>
          <Input type="number" defaultValue={0} className="h-8 text-xs" />
        </div>
      </div>

      <div>
        <Label className="text-xs">نسبة التكبير</Label>
        <Select defaultValue="100">
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="50">50%</SelectItem>
            <SelectItem value="75">75%</SelectItem>
            <SelectItem value="100">100%</SelectItem>
            <SelectItem value="125">125%</SelectItem>
            <SelectItem value="150">150%</SelectItem>
            <SelectItem value="fit">ملاءمة</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderFileTools = () => (
    <div className="space-y-4">
      <div className="text-sm font-medium text-gray-700">رفع المرفقات</div>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <div className="text-xs text-gray-500">اسحب الملفات هنا أو انقر للاستعراض</div>
      </div>

      <div className="max-h-32 overflow-y-auto">
        <div className="text-xs font-medium mb-2">الملفات المرفوعة</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 p-2 border rounded text-xs">
            <div className="w-2 h-2 bg-blue-500 rounded"></div>
            <span>تقرير_المشروع.pdf</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTextTools = () => (
    <div className="space-y-4">
      <div className="text-sm font-medium text-gray-700">أداة النص</div>
      
      <div className="flex gap-2">
        <Button size="sm" variant="outline" className="text-xs">نص</Button>
        <Button size="sm" variant="outline" className="text-xs">مربع نص</Button>
        <Button size="sm" variant="outline" className="text-xs">نص إلى شكل</Button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">حجم الخط</Label>
          <Select defaultValue="16">
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12">12</SelectItem>
              <SelectItem value="14">14</SelectItem>
              <SelectItem value="16">16</SelectItem>
              <SelectItem value="18">18</SelectItem>
              <SelectItem value="20">20</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">المحاذاة</Label>
          <Select defaultValue="right">
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="right">يمين</SelectItem>
              <SelectItem value="center">وسط</SelectItem>
              <SelectItem value="left">يسار</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderShapeTools = () => (
    <div className="space-y-4">
      <div className="text-sm font-medium text-gray-700">أداة الأشكال</div>
      
      <div className="grid grid-cols-4 gap-2">
        <Button size="sm" variant="outline" className="aspect-square p-1">
          <div className="w-4 h-4 border-2 border-gray-600"></div>
        </Button>
        <Button size="sm" variant="outline" className="aspect-square p-1">
          <div className="w-4 h-4 rounded-full border-2 border-gray-600"></div>
        </Button>
        <Button size="sm" variant="outline" className="aspect-square p-1">
          <div className="w-0 h-0 border-l-2 border-r-2 border-b-4 border-transparent border-b-gray-600"></div>
        </Button>
        <Button size="sm" variant="outline" className="aspect-square p-1">
          <MessageSquare className="w-4 h-4" />
        </Button>
      </div>

      <div>
        <Label className="text-xs">اللون</Label>
        <div className="flex gap-2 mt-1">
          {['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'].map(color => (
            <div 
              key={color}
              className="w-6 h-6 rounded border-2 border-gray-300 cursor-pointer"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (selectedTool) {
      case 'select':
        return renderSelectionTools();
      case 'smart-pen':
        return renderSmartPenTools();
      case 'zoom':
      case 'hand':
        return renderZoomTools();
      case 'upload':
        return renderFileTools();
      case 'text':
        return renderTextTools();
      case 'shape':
        return renderShapeTools();
      default:
        return (
          <div className="text-center text-gray-500 py-8 text-sm">
            اختر أداة لعرض خصائصها
          </div>
        );
    }
  };

  return (
    <div className={`fixed left-4 z-40 transition-all duration-300 ${
      isCompact ? 'top-72 w-64' : 'top-24 w-80'
    }`}>
      <Card className="bg-white/95 backdrop-blur-md shadow-lg border border-gray-300 rounded-[20px] max-h-[calc(100vh-300px)] overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-arabic flex items-center gap-2">
            <Palette className="w-4 h-4" />
            خصائص الأداة
          </CardTitle>
        </CardHeader>
        
        <CardContent className="overflow-y-auto max-h-96">
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
};