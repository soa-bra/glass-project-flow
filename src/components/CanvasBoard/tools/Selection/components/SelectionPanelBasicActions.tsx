import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Scissors, Clipboard, Trash2 } from 'lucide-react';

interface SelectionPanelBasicActionsProps {
  hasSelection: boolean;
  onCopy: () => void;
  onCut: () => void;
  onPaste: () => void;
  onDelete: () => void;
}

export const SelectionPanelBasicActions: React.FC<SelectionPanelBasicActionsProps> = ({
  hasSelection,
  onCopy,
  onCut,
  onPaste,
  onDelete
}) => {
  return (
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
  );
};