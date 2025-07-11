
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  MousePointer, Copy, Scissors, Trash2, Group, Ungroup, 
  Lock, Unlock, FlipHorizontal, FlipVertical, 
  RotateCw, AlignLeft, AlignCenter, AlignRight,
  AlignStartVertical, AlignEndVertical, AlignCenterVertical, Layers
} from 'lucide-react';
import { CanvasElement, CanvasLayer } from '../../types';

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
  onAlign: (type: string) => void;
  onDistribute: (type: string) => void;
  layers: CanvasLayer[];
  onLayerReorder: (layers: CanvasLayer[]) => void;
}

const EnhancedSelectionPanel: React.FC<EnhancedSelectionPanelProps> = ({
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
  const hasSelection = selectedElements.length > 0;
  const multipleSelection = selectedElements.length > 1;

  return (
    <Card className="w-80 bg-white/95 backdrop-blur-xl shadow-lg border border-white/20 rounded-[24px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-arabic flex items-center gap-2">
          <MousePointer className="w-5 h-5 text-blue-500" />
          أداة التحديد
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* الإجراءات الأساسية */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">الإجراءات الأساسية</h4>
          <div className="grid grid-cols-4 gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onCut}
              disabled={!hasSelection}
              className="flex flex-col items-center p-2 h-12 text-xs font-arabic"
            >
              <Scissors className="w-4 h-4 mb-1" />
              قص
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onCopy}
              disabled={!hasSelection}
              className="flex flex-col items-center p-2 h-12 text-xs font-arabic"
            >
              <Copy className="w-4 h-4 mb-1" />
              نسخ
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onPaste}
              className="flex flex-col items-center p-2 h-12 text-xs font-arabic"
            >
              <Copy className="w-4 h-4 mb-1" />
              لصق
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onDelete}
              disabled={!hasSelection}
              className="flex flex-col items-center p-2 h-12 text-xs font-arabic text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4 mb-1" />
              حذف
            </Button>
          </div>
        </div>

        <Separator />

        {/* التجميع */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">التجميع</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onGroup}
              disabled={!multipleSelection}
              className="flex items-center gap-2 text-xs font-arabic"
            >
              <Group className="w-4 h-4" />
              تجميع
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onUngroup}
              disabled={!hasSelection}
              className="flex items-center gap-2 text-xs font-arabic"
            >
              <Ungroup className="w-4 h-4" />
              إلغاء التجميع
            </Button>
          </div>
        </div>

        <Separator />

        {/* القفل والحماية */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">القفل والحماية</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onLock}
              disabled={!hasSelection}
              className="flex items-center gap-2 text-xs font-arabic"
            >
              <Lock className="w-4 h-4" />
              قفل
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onUnlock}
              disabled={!hasSelection}
              className="flex items-center gap-2 text-xs font-arabic"
            >
              <Unlock className="w-4 h-4" />
              إلغاء القفل
            </Button>
          </div>
        </div>

        <Separator />

        {/* التحويل */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">التحويل</h4>
          <div className="grid grid-cols-3 gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onFlipHorizontal}
              disabled={!hasSelection}
              className="flex flex-col items-center p-2 h-12 text-xs font-arabic"
            >
              <FlipHorizontal className="w-4 h-4 mb-1" />
              قلب أفقي
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onFlipVertical}
              disabled={!hasSelection}
              className="flex flex-col items-center p-2 h-12 text-xs font-arabic"
            >
              <FlipVertical className="w-4 h-4 mb-1" />
              قلب عمودي
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onRotate(90)}
              disabled={!hasSelection}
              className="flex flex-col items-center p-2 h-12 text-xs font-arabic"
            >
              <RotateCw className="w-4 h-4 mb-1" />
              دوران
            </Button>
          </div>
        </div>

        <Separator />

        {/* المحاذاة */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">المحاذاة</h4>
          <div className="grid grid-cols-3 gap-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAlign('left')}
              disabled={!multipleSelection}
              className="flex flex-col items-center p-1 h-10 text-xs font-arabic"
            >
              <AlignLeft className="w-3 h-3 mb-1" />
              يسار
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAlign('center')}
              disabled={!multipleSelection}
              className="flex flex-col items-center p-1 h-10 text-xs font-arabic"
            >
              <AlignCenter className="w-3 h-3 mb-1" />
              وسط
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAlign('right')}
              disabled={!multipleSelection}
              className="flex flex-col items-center p-1 h-10 text-xs font-arabic"
            >
              <AlignRight className="w-3 h-3 mb-1" />
              يمين
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAlign('top')}
              disabled={!multipleSelection}
              className="flex flex-col items-center p-1 h-10 text-xs font-arabic"
            >
              <AlignStartVertical className="w-3 h-3 mb-1" />
              أعلى
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAlign('middle')}
              disabled={!multipleSelection}
              className="flex flex-col items-center p-1 h-10 text-xs font-arabic"
            >
              <AlignCenterVertical className="w-3 h-3 mb-1" />
              منتصف
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAlign('bottom')}
              disabled={!multipleSelection}
              className="flex flex-col items-center p-1 h-10 text-xs font-arabic"
            >
              <AlignEndVertical className="w-3 h-3 mb-1" />
              أسفل
            </Button>
          </div>
        </div>

        {/* معلومات التحديد */}
        <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
          <div className="text-xs text-blue-800 font-arabic">
            {hasSelection ? (
              <>
                <div>🎯 محدد: {selectedElements.length} عنصر</div>
                <div className="mt-1">⌨️ Ctrl+C نسخ | Ctrl+G تجميع | Delete حذف</div>
              </>
            ) : (
              <div>📌 انقر لتحديد عنصر أو اسحب لتحديد مجموعة</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedSelectionPanel;
