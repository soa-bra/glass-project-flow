
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Group, Ungroup } from 'lucide-react';

interface SelectionPanelGroupActionsProps {
  hasSelection: boolean;
  multipleSelection: boolean;
  onGroup: () => void;
  onUngroup: () => void;
}

export const SelectionPanelGroupActions: React.FC<SelectionPanelGroupActionsProps> = ({
  hasSelection,
  multipleSelection,
  onGroup,
  onUngroup
}) => {
  return (
    <TooltipProvider delayDuration={300}>
      <div>
        <h4 className="text-sm font-medium font-arabic mb-3 text-black">التجميع</h4>
        <div className="grid grid-cols-2 gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onGroup}
                disabled={!multipleSelection}
                size="sm"
                className="rounded-[12px] bg-[#d9d2fd] hover:bg-[#d9d2fd]/80 disabled:bg-[#d1e1ea] text-black border-none p-2"
              >
                <Group className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" align="center" sideOffset={8}>
              <p>تجميع</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onUngroup}
                disabled={!hasSelection}
                size="sm"
                className="rounded-[12px] bg-[#fbe2aa] hover:bg-[#fbe2aa]/80 disabled:bg-[#d1e1ea] text-black border-none p-2"
              >
                <Ungroup className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" align="center" sideOffset={8}>
              <p>إلغاء التجميع</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
};
