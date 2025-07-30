import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  MousePointer2, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  AlignVerticalDistributeCenter,
  AlignHorizontalDistributeCenter,
  Group,
  Ungroup,
  MoveUp,
  MoveDown,
  FlipHorizontal,
  FlipVertical,
  RotateCw,
  Copy,
  Trash2,
  Lock,
  Unlock,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'sonner';

interface SelectedElement {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  isLocked?: boolean;
  isVisible?: boolean;
  groupId?: string;
}

interface SelectionPanelProps {
  selectedElements: SelectedElement[];
  onAlign: (type: string) => void;
  onDistribute: (type: string) => void;
  onGroup: () => void;
  onUngroup: () => void;
  onLayerChange: (elementId: string, direction: 'up' | 'down' | 'top' | 'bottom') => void;
  onTransform: (elementId: string, transform: string) => void;
  onDuplicate: (elementIds: string[]) => void;
  onDelete: (elementIds: string[]) => void;
  onLockToggle: (elementIds: string[]) => void;
  onVisibilityToggle: (elementIds: string[]) => void;
}

export const SelectionPanel: React.FC<SelectionPanelProps> = ({
  selectedElements,
  onAlign,
  onDistribute,
  onGroup,
  onUngroup,
  onLayerChange,
  onTransform,
  onDuplicate,
  onDelete,
  onLockToggle,
  onVisibilityToggle
}) => {
  const [selectedTool, setSelectedTool] = useState('select');
  
  const hasSelection = selectedElements.length > 0;
  const hasMultipleSelection = selectedElements.length > 1;
  const canGroup = hasMultipleSelection && !selectedElements.some(el => el.groupId);
  const canUngroup = selectedElements.some(el => el.groupId);

  const alignmentTools = [
    { type: 'left', icon: AlignLeft, label: 'محاذاة يسار' },
    { type: 'center-h', icon: AlignCenter, label: 'توسيط أفقي' },
    { type: 'right', icon: AlignRight, label: 'محاذاة يمين' },
    { type: 'top', icon: AlignLeft, label: 'محاذاة أعلى' },
    { type: 'center-v', icon: AlignVerticalDistributeCenter, label: 'توسيط عمودي' },
    { type: 'bottom', icon: AlignLeft, label: 'محاذاة أسفل' }
  ];

  const distributionTools = [
    { type: 'horizontal', icon: AlignHorizontalDistributeCenter, label: 'توزيع أفقي' },
    { type: 'vertical', icon: AlignVerticalDistributeCenter, label: 'توزيع عمودي' }
  ];

  return (
    <Card className="w-80 bg-white/95 backdrop-blur-md shadow-lg border border-gray-200 rounded-2xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <MousePointer2 className="w-5 h-5" />
          أدوات التحديد
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!hasSelection ? (
          <div className="text-center py-6 text-gray-500">
            <MousePointer2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">لا توجد عناصر محددة</p>
            <p className="text-xs">اختر عنصر أو أكثر للمتابعة</p>
          </div>
        ) : (
          <>
            {/* Selection Info */}
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm font-medium">
                {selectedElements.length === 1 
                  ? 'عنصر واحد محدد' 
                  : `${selectedElements.length} عناصر محددة`
                }
              </p>
              {selectedElements.length === 1 && (
                <p className="text-xs text-gray-500 mt-1">
                  الموضع: ({selectedElements[0].x}, {selectedElements[0].y})
                  الحجم: {selectedElements[0].width} × {selectedElements[0].height}
                </p>
              )}
            </div>

            {/* Alignment Tools */}
            {hasMultipleSelection && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium">المحاذاة</h4>
                <div className="grid grid-cols-3 gap-2">
                  {alignmentTools.map((tool) => (
                    <Button
                      key={tool.type}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        onAlign(tool.type);
                        toast.success(`تم تطبيق ${tool.label}`);
                      }}
                      className="h-10"
                      title={tool.label}
                    >
                      <tool.icon className="w-4 h-4" />
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Distribution Tools */}
            {selectedElements.length > 2 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium">التوزيع</h4>
                <div className="grid grid-cols-2 gap-2">
                  {distributionTools.map((tool) => (
                    <Button
                      key={tool.type}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        onDistribute(tool.type);
                        toast.success(`تم تطبيق ${tool.label}`);
                      }}
                      title={tool.label}
                    >
                      <tool.icon className="w-4 h-4 mr-2" />
                      {tool.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Grouping */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">التجميع</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!canGroup}
                  onClick={() => {
                    onGroup();
                    toast.success('تم إنشاء مجموعة');
                  }}
                >
                  <Group className="w-4 h-4 mr-2" />
                  تجميع
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!canUngroup}
                  onClick={() => {
                    onUngroup();
                    toast.success('تم فك التجميع');
                  }}
                >
                  <Ungroup className="w-4 h-4 mr-2" />
                  فك التجميع
                </Button>
              </div>
            </div>

            <Separator />

            {/* Layer Controls */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">ترتيب الطبقات</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    selectedElements.forEach(el => onLayerChange(el.id, 'up'));
                    toast.success('تم رفع الطبقة');
                  }}
                >
                  <MoveUp className="w-4 h-4 mr-2" />
                  للأمام
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    selectedElements.forEach(el => onLayerChange(el.id, 'down'));
                    toast.success('تم خفض الطبقة');
                  }}
                >
                  <MoveDown className="w-4 h-4 mr-2" />
                  للخلف
                </Button>
              </div>
            </div>

            <Separator />

            {/* Transform Tools */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">التحويلات</h4>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    selectedElements.forEach(el => onTransform(el.id, 'flip-h'));
                    toast.success('تم القلب أفقياً');
                  }}
                  title="قلب أفقي"
                >
                  <FlipHorizontal className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    selectedElements.forEach(el => onTransform(el.id, 'flip-v'));
                    toast.success('تم القلب عمودياً');
                  }}
                  title="قلب عمودي"
                >
                  <FlipVertical className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    selectedElements.forEach(el => onTransform(el.id, 'rotate'));
                    toast.success('تم التدوير');
                  }}
                  title="تدوير 90°"
                >
                  <RotateCw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Separator />

            {/* Action Tools */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">الإجراءات</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onDuplicate(selectedElements.map(el => el.id));
                    toast.success('تم النسخ');
                  }}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  نسخ
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onDelete(selectedElements.map(el => el.id));
                    toast.success('تم الحذف');
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  حذف
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onLockToggle(selectedElements.map(el => el.id));
                    const isLocked = selectedElements.some(el => el.isLocked);
                    toast.success(isLocked ? 'تم إلغاء القفل' : 'تم القفل');
                  }}
                >
                  {selectedElements.some(el => el.isLocked) ? (
                    <Unlock className="w-4 h-4 mr-2" />
                  ) : (
                    <Lock className="w-4 h-4 mr-2" />
                  )}
                  {selectedElements.some(el => el.isLocked) ? 'إلغاء القفل' : 'قفل'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onVisibilityToggle(selectedElements.map(el => el.id));
                    const isVisible = selectedElements.some(el => el.isVisible !== false);
                    toast.success(isVisible ? 'تم الإخفاء' : 'تم الإظهار');
                  }}
                >
                  {selectedElements.some(el => el.isVisible === false) ? (
                    <Eye className="w-4 h-4 mr-2" />
                  ) : (
                    <EyeOff className="w-4 h-4 mr-2" />
                  )}
                  {selectedElements.some(el => el.isVisible === false) ? 'إظهار' : 'إخفاء'}
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};