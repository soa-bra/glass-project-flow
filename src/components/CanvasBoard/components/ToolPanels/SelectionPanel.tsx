import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Copy, Scissors, Clipboard, Trash2, 
  Group, Ungroup, Lock, Unlock,
  FlipHorizontal, FlipVertical, RotateCw,
  AlignLeft, AlignCenter, AlignRight,
  AlignStartVertical, AlignCenterVertical, AlignEndVertical
} from 'lucide-react';
import { toast } from 'sonner';

interface SelectionPanelProps {
  selectedElementIds: string[];
  onAction: (action: string, params?: any) => void;
}

export const SelectionPanel: React.FC<SelectionPanelProps> = ({
  selectedElementIds,
  onAction
}) => {
  const hasSelection = selectedElementIds.length > 0;
  const hasMultipleSelection = selectedElementIds.length > 1;

  const handleAction = (action: string, params?: any) => {
    if (!hasSelection && action !== 'selectAll') {
      toast.error('يرجى تحديد عنصر أولاً');
      return;
    }
    onAction(action, params);
    toast.success(`تم تنفيذ: ${getActionLabel(action)}`);
  };

  const getActionLabel = (action: string): string => {
    const labels: { [key: string]: string } = {
      copy: 'نسخ',
      cut: 'قص',
      paste: 'لصق',
      delete: 'حذف',
      group: 'تجميع',
      ungroup: 'فك التجميع',
      lock: 'قفل',
      unlock: 'إلغاء القفل',
      flipH: 'قلب أفقي',
      flipV: 'قلب عمودي',
      rotate: 'تدوير',
      alignLeft: 'محاذاة يسار',
      alignCenter: 'محاذاة وسط',
      alignRight: 'محاذاة يمين',
      selectAll: 'تحديد الكل'
    };
    return labels[action] || action;
  };

  return (
    <Card className="w-64 bg-white/95 backdrop-blur-lg shadow-lg border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-arabic">أداة التحديد</CardTitle>
        <div className="text-xs text-gray-500">
          العناصر المحددة: {selectedElementIds.length}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* الإجراءات الأساسية */}
        <div>
          <div className="text-xs font-medium text-gray-700 mb-2">الإجراءات الأساسية</div>
          <div className="grid grid-cols-4 gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={() => handleAction('copy')}
              disabled={!hasSelection}
              title="نسخ (Ctrl+C)"
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={() => handleAction('cut')}
              disabled={!hasSelection}
              title="قص (Ctrl+X)"
            >
              <Scissors className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={() => handleAction('paste')}
              title="لصق (Ctrl+V)"
            >
              <Clipboard className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={() => handleAction('delete')}
              disabled={!hasSelection}
              title="حذف (Delete)"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Separator />

        {/* التجميع والحماية */}
        <div>
          <div className="text-xs font-medium text-gray-700 mb-2">التجميع والحماية</div>
          <div className="grid grid-cols-4 gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={() => handleAction('group')}
              disabled={!hasMultipleSelection}
              title="تجميع (Ctrl+G)"
            >
              <Group className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={() => handleAction('ungroup')}
              disabled={!hasSelection}
              title="فك التجميع (Shift+G)"
            >
              <Ungroup className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={() => handleAction('lock')}
              disabled={!hasSelection}
              title="قفل"
            >
              <Lock className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={() => handleAction('unlock')}
              disabled={!hasSelection}
              title="إلغاء القفل"
            >
              <Unlock className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Separator />

        {/* التحويل */}
        <div>
          <div className="text-xs font-medium text-gray-700 mb-2">التحويل</div>
          <div className="grid grid-cols-3 gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={() => handleAction('flipH')}
              disabled={!hasSelection}
              title="قلب أفقي"
            >
              <FlipHorizontal className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={() => handleAction('flipV')}
              disabled={!hasSelection}
              title="قلب عمودي"
            >
              <FlipVertical className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={() => handleAction('rotate')}
              disabled={!hasSelection}
              title="تدوير"
            >
              <RotateCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Separator />

        {/* المحاذاة */}
        <div>
          <div className="text-xs font-medium text-gray-700 mb-2">المحاذاة</div>
          <div className="space-y-2">
            {/* محاذاة أفقية */}
            <div className="grid grid-cols-3 gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="p-2"
                onClick={() => handleAction('alignLeft')}
                disabled={!hasMultipleSelection}
                title="محاذاة يسار"
              >
                <AlignLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-2"
                onClick={() => handleAction('alignCenter')}
                disabled={!hasMultipleSelection}
                title="محاذاة وسط"
              >
                <AlignCenter className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-2"
                onClick={() => handleAction('alignRight')}
                disabled={!hasMultipleSelection}
                title="محاذاة يمين"
              >
                <AlignRight className="w-4 h-4" />
              </Button>
            </div>
            
            {/* محاذاة عمودية */}
            <div className="grid grid-cols-3 gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="p-2"
                onClick={() => handleAction('alignTop')}
                disabled={!hasMultipleSelection}
                title="محاذاة أعلى"
              >
                <AlignStartVertical className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-2"
                onClick={() => handleAction('alignMiddle')}
                disabled={!hasMultipleSelection}
                title="محاذاة منتصف"
              >
                <AlignCenterVertical className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-2"
                onClick={() => handleAction('alignBottom')}
                disabled={!hasMultipleSelection}
                title="محاذاة أسفل"
              >
                <AlignEndVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        {/* تحديد سريع */}
        <div>
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs"
            onClick={() => handleAction('selectAll')}
            title="تحديد الكل (Ctrl+A)"
          >
            تحديد الكل
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};