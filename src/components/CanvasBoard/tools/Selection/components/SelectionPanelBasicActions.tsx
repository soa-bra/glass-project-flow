import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
    <TooltipProvider>
      <div>
        <h4 className="text-sm font-medium font-arabic mb-3 text-black">الإجراءات الأساسية</h4>
        <div className="grid grid-cols-4 gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onCopy}
                disabled={!hasSelection}
                size="sm"
                className="rounded-[12px] bg-[#96d8d0] hover:bg-[#96d8d0]/80 disabled:bg-[#d1e1ea] text-black border-none p-2"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>نسخ</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onCut}
                disabled={!hasSelection}
                size="sm"
                className="rounded-[12px] bg-[#a4e2f6] hover:bg-[#a4e2f6]/80 disabled:bg-[#d1e1ea] text-black border-none p-2"
              >
                <Scissors className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>قص</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onPaste}
                size="sm"
                className="rounded-[12px] bg-[#bdeed3] hover:bg-[#bdeed3]/80 text-black border-none p-2"
              >
                <Clipboard className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>لصق</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onDelete}
                disabled={!hasSelection}
                size="sm"
                className="rounded-[12px] bg-[#f1b5b9] hover:bg-[#f1b5b9]/80 disabled:bg-[#d1e1ea] text-black border-none p-2"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>حذف</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
};