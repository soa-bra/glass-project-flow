import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Copy, Scissors, Clipboard, Trash2, Group, Ungroup, Lock, Unlock, RotateCcw, FlipHorizontal, FlipVertical, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { CanvasElement } from '../../../types';

interface SelectionToolPanelProps {
  selectedElements: CanvasElement[];
  onCopy: () => void;
  onCut: () => void;
  onPaste: () => void;
  onDelete: () => void;
  onGroup: () => void;
  onUpdateElement: (elementId: string, updates: any) => void;
}

export const SelectionToolPanel: React.FC<SelectionToolPanelProps> = ({
  selectedElements,
  onCopy,
  onCut,
  onPaste,
  onDelete,
  onGroup,
  onUpdateElement
}) => {
  const hasSelection = selectedElements.length > 0;
  const multipleSelection = selectedElements.length > 1;

  const handleUngroup = () => {
    // Ungroup logic
  };

  const handleLock = () => {
    selectedElements.forEach(element => {
      onUpdateElement(element.id, { locked: true });
    });
  };

  const handleUnlock = () => {
    selectedElements.forEach(element => {
      onUpdateElement(element.id, { locked: false });
    });
  };

  const handleRotate = () => {
    selectedElements.forEach(element => {
      // Rotate element logic
      // TODO: Implement rotation when CanvasElement type supports it
    });
  };

  const handleFlipHorizontal = () => {
    selectedElements.forEach(element => {
      // Flip horizontal logic
      // TODO: Implement horizontal flip when CanvasElement type supports it
    });
  };

  const handleFlipVertical = () => {
    selectedElements.forEach(element => {
      // Flip vertical logic
      // TODO: Implement vertical flip when CanvasElement type supports it
    });
  };

  const handleAlign = (type: string) => {
    // Alignment logic
  };

  return (
    <div className="space-y-4">
      {/* Selection Info */}
      <div className="bg-[#e9eff4] p-3 rounded-[16px]">
        <div className="text-sm font-arabic text-black">
          {hasSelection 
            ? `تم تحديد ${selectedElements.length} عنصر` 
            : 'لم يتم تحديد أي عنصر'
          }
        </div>
        {hasSelection && (
          <div className="text-xs text-black/70 mt-1">
            اختر من الأدوات أدناه للتحكم في العناصر المحددة
          </div>
        )}
      </div>

      {/* Basic Actions */}
      <div>
        <h4 className="text-sm font-medium font-arabic mb-3 text-black">الإجراءات الأساسية</h4>
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={onCopy}
            disabled={!hasSelection}
            size="sm"
            className="rounded-[12px] bg-[#96d8d0] hover:bg-[#96d8d0]/80 disabled:bg-[#d1e1ea] text-black border-none"
          >
            <Copy className="w-4 h-4 mr-2" />
            نسخ
          </Button>
          <Button
            onClick={onCut}
            disabled={!hasSelection}
            size="sm"
            className="rounded-[12px] bg-[#a4e2f6] hover:bg-[#a4e2f6]/80 disabled:bg-[#d1e1ea] text-black border-none"
          >
            <Scissors className="w-4 h-4 mr-2" />
            قص
          </Button>
          <Button
            onClick={onPaste}
            size="sm"
            className="rounded-[12px] bg-[#bdeed3] hover:bg-[#bdeed3]/80 text-black border-none"
          >
            <Clipboard className="w-4 h-4 mr-2" />
            لصق
          </Button>
          <Button
            onClick={onDelete}
            disabled={!hasSelection}
            size="sm"
            className="rounded-[12px] bg-[#f1b5b9] hover:bg-[#f1b5b9]/80 disabled:bg-[#d1e1ea] text-black border-none"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            حذف
          </Button>
        </div>
      </div>

      <Separator className="bg-[#d1e1ea]" />

      {/* Group Actions */}
      <div>
        <h4 className="text-sm font-medium font-arabic mb-3 text-black">التجميع</h4>
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={onGroup}
            disabled={!multipleSelection}
            size="sm"
            className="rounded-[12px] bg-[#d9d2fd] hover:bg-[#d9d2fd]/80 disabled:bg-[#d1e1ea] text-black border-none"
          >
            <Group className="w-4 h-4 mr-2" />
            تجميع
          </Button>
          <Button
            onClick={handleUngroup}
            disabled={!hasSelection}
            size="sm"
            className="rounded-[12px] bg-[#fbe2aa] hover:bg-[#fbe2aa]/80 disabled:bg-[#d1e1ea] text-black border-none"
          >
            <Ungroup className="w-4 h-4 mr-2" />
            إلغاء التجميع
          </Button>
        </div>
      </div>

      <Separator className="bg-[#d1e1ea]" />

      {/* Lock/Unlock */}
      <div>
        <h4 className="text-sm font-medium font-arabic mb-3 text-black">القفل والحماية</h4>
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={handleLock}
            disabled={!hasSelection}
            size="sm"
            className="rounded-[12px] bg-[#f1b5b9] hover:bg-[#f1b5b9]/80 disabled:bg-[#d1e1ea] text-black border-none"
          >
            <Lock className="w-4 h-4 mr-2" />
            قفل
          </Button>
          <Button
            onClick={handleUnlock}
            disabled={!hasSelection}
            size="sm"
            className="rounded-[12px] bg-[#bdeed3] hover:bg-[#bdeed3]/80 disabled:bg-[#d1e1ea] text-black border-none"
          >
            <Unlock className="w-4 h-4 mr-2" />
            إلغاء القفل
          </Button>
        </div>
      </div>

      <Separator className="bg-[#d1e1ea]" />

      {/* Transform */}
      <div>
        <h4 className="text-sm font-medium font-arabic mb-3 text-black">التحويل</h4>
        <div className="grid grid-cols-3 gap-2">
          <Button
            onClick={handleRotate}
            disabled={!hasSelection}
            size="sm"
            className="rounded-[12px] bg-[#96d8d0] hover:bg-[#96d8d0]/80 disabled:bg-[#d1e1ea] text-black border-none"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            onClick={handleFlipHorizontal}
            disabled={!hasSelection}
            size="sm"
            className="rounded-[12px] bg-[#a4e2f6] hover:bg-[#a4e2f6]/80 disabled:bg-[#d1e1ea] text-black border-none"
          >
            <FlipHorizontal className="w-4 h-4" />
          </Button>
          <Button
            onClick={handleFlipVertical}
            disabled={!hasSelection}
            size="sm"
            className="rounded-[12px] bg-[#bdeed3] hover:bg-[#bdeed3]/80 disabled:bg-[#d1e1ea] text-black border-none"
          >
            <FlipVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Separator className="bg-[#d1e1ea]" />

      {/* Alignment */}
      <div>
        <h4 className="text-sm font-medium font-arabic mb-3 text-black">المحاذاة</h4>
        <div className="grid grid-cols-3 gap-2">
          <Button
            onClick={() => handleAlign('left')}
            disabled={!multipleSelection}
            size="sm"
            className="rounded-[12px] bg-[#d9d2fd] hover:bg-[#d9d2fd]/80 disabled:bg-[#d1e1ea] text-black border-none"
          >
            <AlignLeft className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => handleAlign('center')}
            disabled={!multipleSelection}
            size="sm"
            className="rounded-[12px] bg-[#fbe2aa] hover:bg-[#fbe2aa]/80 disabled:bg-[#d1e1ea] text-black border-none"
          >
            <AlignCenter className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => handleAlign('right')}
            disabled={!multipleSelection}
            size="sm"
            className="rounded-[12px] bg-[#96d8d0] hover:bg-[#96d8d0]/80 disabled:bg-[#d1e1ea] text-black border-none"
          >
            <AlignRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};