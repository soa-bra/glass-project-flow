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
  Plus,
  Pen
} from 'lucide-react';

interface ToolPropsBarProps {
  selectedTool: string;
  isCollabBarOpen: boolean;
  selectedElement?: any;
  onElementUpdate?: (updates: any) => void;
  onAction?: (action: string) => void;
  // Tool-specific props
  zoom?: number;
  canvasPosition?: { x: number; y: number };
  onZoomChange?: (zoom: number) => void;
  onPositionChange?: (position: { x: number; y: number }) => void;
  onFitToScreen?: () => void;
  onResetView?: () => void;
  selectedPenMode?: string;
  lineWidth?: number;
  lineStyle?: string;
  onPenModeSelect?: (mode: string) => void;
  onLineWidthChange?: (width: number) => void;
  onLineStyleChange?: (style: string) => void;
  onFileUpload?: (files: File[]) => void;
  selectedSmartElement?: string;
  onSmartElementSelect?: (element: string) => void;
}

export const ToolPropsBar: React.FC<ToolPropsBarProps> = ({
  selectedTool,
  isCollabBarOpen,
  selectedElement,
  onElementUpdate,
  onAction,
  // Tool-specific props
  zoom = 100,
  canvasPosition = { x: 0, y: 0 },
  onZoomChange,
  onPositionChange,
  onFitToScreen,
  onResetView,
  selectedPenMode = 'smart-draw',
  lineWidth = 2,
  lineStyle = 'solid',
  onPenModeSelect,
  onLineWidthChange,
  onLineStyleChange,
  onFileUpload,
  selectedSmartElement,
  onSmartElementSelect
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
        <Slider 
          value={[lineWidth]} 
          onValueChange={(value) => onLineWidthChange?.(value[0])}
          max={10} 
          min={1} 
          step={1} 
          className="mt-2" 
        />
        <div className="text-xs text-gray-500 text-center mt-1">{lineWidth}px</div>
      </div>
      
      <div>
        <Label className="text-xs">نوع الخط</Label>
        <Select value={lineStyle} onValueChange={onLineStyleChange}>
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
        <Button 
          size="sm" 
          variant={selectedPenMode === 'smart-draw' ? 'default' : 'outline'} 
          className="justify-start text-xs"
          onClick={() => onPenModeSelect?.('smart-draw')}
        >
          <RotateCw className="w-3 h-3 ml-2" />
          الرسم الذكي
        </Button>
        <Button 
          size="sm" 
          variant={selectedPenMode === 'root-connector' ? 'default' : 'outline'} 
          className="justify-start text-xs"
          onClick={() => onPenModeSelect?.('root-connector')}
        >
          <Move className="w-3 h-3 ml-2" />
          الجذر
        </Button>
        <Button 
          size="sm" 
          variant={selectedPenMode === 'auto-group' ? 'default' : 'outline'} 
          className="justify-start text-xs"
          onClick={() => onPenModeSelect?.('auto-group')}
        >
          <Group className="w-3 h-3 ml-2" />
          التجميع التلقائي
        </Button>
        <Button 
          size="sm" 
          variant={selectedPenMode === 'eraser' ? 'default' : 'outline'} 
          className="justify-start text-xs"
          onClick={() => onPenModeSelect?.('eraser')}
        >
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
          <Input 
            type="number" 
            value={zoom} 
            onChange={(e) => onZoomChange?.(parseInt(e.target.value) || 100)}
            className="h-8 text-xs" 
          />
        </div>
        <div>
          <Label className="text-xs">الأفقي</Label>
          <Input 
            type="number" 
            value={canvasPosition.x} 
            onChange={(e) => onPositionChange?.({ 
              ...canvasPosition, 
              x: parseInt(e.target.value) || 0 
            })}
            className="h-8 text-xs" 
          />
        </div>
        <div>
          <Label className="text-xs">العمودي</Label>
          <Input 
            type="number" 
            value={canvasPosition.y} 
            onChange={(e) => onPositionChange?.({ 
              ...canvasPosition, 
              y: parseInt(e.target.value) || 0 
            })}
            className="h-8 text-xs" 
          />
        </div>
      </div>

      <div>
        <Label className="text-xs">نسبة التكبير</Label>
        <Select value={zoom.toString()} onValueChange={(value) => {
          if (value === 'fit') {
            onFitToScreen?.();
          } else {
            onZoomChange?.(parseInt(value));
          }
        }}>
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

      <div className="flex gap-2">
        <Button size="sm" onClick={onFitToScreen} className="flex-1 text-xs">
          <Maximize className="w-3 h-3 ml-1" />
          ملاءمة الشاشة
        </Button>
        <Button size="sm" variant="outline" onClick={onResetView} className="flex-1 text-xs">
          إعادة تعيين
        </Button>
      </div>
    </div>
  );

  const renderFileTools = () => {
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files && files.length > 0) {
        onFileUpload?.(Array.from(files));
      }
    };

    return (
      <div className="space-y-4">
        <div className="text-sm font-medium text-gray-700">رفع المرفقات</div>
        
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 transition-colors"
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <div className="text-xs text-gray-500">اسحب الملفات هنا أو انقر للاستعراض</div>
          <input 
            id="file-upload"
            type="file" 
            multiple 
            className="hidden" 
            onChange={handleFileUpload}
            accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
          />
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
  };

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

  const renderShapeTools = () => {
    const shapes = [
      { id: 'rectangle', label: 'مستطيل', icon: <div className="w-4 h-4 border-2 border-gray-600"></div> },
      { id: 'circle', label: 'دائرة', icon: <div className="w-4 h-4 rounded-full border-2 border-gray-600"></div> },
      { id: 'triangle', label: 'مثلث', icon: <div className="w-0 h-0 border-l-2 border-r-2 border-b-4 border-transparent border-b-gray-600"></div> },
      { id: 'sticky', label: 'ملاحظة لاصقة', icon: <MessageSquare className="w-4 h-4" /> }
    ];

    return (
      <div className="space-y-4">
        <div className="text-sm font-medium text-gray-700">أداة الأشكال</div>
        
        <div className="grid grid-cols-4 gap-2">
          {shapes.map(shape => (
            <Button 
              key={shape.id}
              size="sm" 
              variant={selectedSmartElement === shape.id ? "default" : "outline"} 
              className="aspect-square p-1"
              onClick={() => onSmartElementSelect?.(shape.id)}
              title={shape.label}
            >
              {shape.icon}
            </Button>
          ))}
        </div>

        <div>
          <Label className="text-xs">اللون</Label>
          <div className="flex gap-2 mt-1">
            {['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'].map(color => (
              <div 
                key={color}
                className="w-6 h-6 rounded border-2 border-gray-300 cursor-pointer hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                onClick={() => {
                  console.log('Color selected:', color);
                  // Handle color selection
                }}
              />
            ))}
          </div>
        </div>

        <div>
          <Label className="text-xs">الشكل المحدد</Label>
          <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded">
            {shapes.find(s => s.id === selectedSmartElement)?.label || 'لم يتم تحديد شكل'}
          </div>
        </div>
      </div>
    );
  };

  const renderCommentTools = () => (
    <div className="space-y-4">
      <div className="text-sm font-medium text-gray-700">أداة التعليق</div>
      
      <div className="flex gap-2">
        <Button size="sm" variant="outline" className="text-xs flex-1">
          <MessageSquare className="w-3 h-3 ml-1" />
          تعليق نصي
        </Button>
        <Button size="sm" variant="outline" className="text-xs flex-1">
          🎤
          تعليق صوتي
        </Button>
      </div>

      <div>
        <Label className="text-xs">قلم التعليق</Label>
        <div className="flex gap-2 mt-1">
          <Button size="sm" variant="outline" className="text-xs flex-1">
            <Pen className="w-3 h-3 ml-1" />
            تفعيل
          </Button>
          <div className="w-6 h-6 rounded-full bg-blue-500 border cursor-pointer" title="لون القلم"></div>
        </div>
      </div>

      <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-800">
        <div>💬 انقر لإضافة تعليق</div>
        <div>🎨 استخدم قلم التعليق للرسم التوضيحي</div>
        <div>💾 اضغط تطبيق لحفظ التعليق</div>
      </div>
    </div>
  );

  const renderSmartElementTools = () => (
    <div className="space-y-4">
      <div className="text-sm font-medium text-gray-700">العناصر الذكية</div>
      
      <div className="grid gap-2">
        <Button size="sm" variant="outline" className="justify-start text-xs">
          <Move className="w-3 h-3 ml-2" />
          الجذر
        </Button>
        <Button size="sm" variant="outline" className="justify-start text-xs">
          🧠
          محرك العصف الذهني
        </Button>
        <Button size="sm" variant="outline" className="justify-start text-xs">
          📅
          الخط الزمني
        </Button>
        <Button size="sm" variant="outline" className="justify-start text-xs">
          🗺️
          الخرائط الذهنية
        </Button>
        <Button size="sm" variant="outline" className="justify-start text-xs">
          🎯
          أداة ثنك بورد الذكية
        </Button>
      </div>

      <div className="bg-purple-50 p-3 rounded-lg text-xs text-purple-800">
        <div>🔗 الجذر: ربط العناصر ببعضها</div>
        <div>🧠 العصف الذهني: أدوات إبداعية</div>
        <div>📅 الخط الزمني: جدولة المشاريع</div>
        <div>🗺️ الخرائط: تنظيم الأفكار</div>
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
      case 'comment':
        return renderCommentTools();
      case 'text':
        return renderTextTools();
      case 'shape':
        return renderShapeTools();
      case 'smart-element':
        return renderSmartElementTools();
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