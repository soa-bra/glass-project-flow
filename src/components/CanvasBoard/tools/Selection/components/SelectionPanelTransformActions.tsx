import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { RotateCcw, FlipHorizontal, FlipVertical } from 'lucide-react';

interface SelectionPanelTransformActionsProps {
  hasSelection: boolean;
  onRotate: () => void;
  onFlipHorizontal: () => void;
  onFlipVertical: () => void;
}

export const SelectionPanelTransformActions: React.FC<SelectionPanelTransformActionsProps> = ({
  hasSelection,
  onRotate,
  onFlipHorizontal,
  onFlipVertical
}) => {
  return (
    <TooltipProvider>
      <div>
        <h4 className="text-sm font-medium font-arabic mb-3 text-black">التحويل</h4>
        <div className="grid grid-cols-3 gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onRotate}
                disabled={!hasSelection}
                size="sm"
                className="rounded-[12px] bg-[#96d8d0] hover:bg-[#96d8d0]/80 disabled:bg-[#d1e1ea] text-black border-none p-2"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
              <TooltipContent side="top" align="center" sideOffset={4} className="bg-black text-white text-xs">
                <p>تدوير</p>
              </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onFlipHorizontal}
                disabled={!hasSelection}
                size="sm"
                className="rounded-[12px] bg-[#a4e2f6] hover:bg-[#a4e2f6]/80 disabled:bg-[#d1e1ea] text-black border-none p-2"
              >
                <FlipHorizontal className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
              <TooltipContent side="top" align="center" sideOffset={4} className="bg-black text-white text-xs">
                <p>عكس أفقي</p>
              </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onFlipVertical}
                disabled={!hasSelection}
                size="sm"
                className="rounded-[12px] bg-[#bdeed3] hover:bg-[#bdeed3]/80 disabled:bg-[#d1e1ea] text-black border-none p-2"
              >
                <FlipVertical className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
              <TooltipContent side="top" align="center" sideOffset={4} className="bg-black text-white text-xs">
                <p>عكس عمودي</p>
              </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
};