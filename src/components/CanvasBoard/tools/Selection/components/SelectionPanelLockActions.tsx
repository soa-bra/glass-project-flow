import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Lock, Unlock } from 'lucide-react';

interface SelectionPanelLockActionsProps {
  hasSelection: boolean;
  onLock: () => void;
  onUnlock: () => void;
}

export const SelectionPanelLockActions: React.FC<SelectionPanelLockActionsProps> = ({
  hasSelection,
  onLock,
  onUnlock
}) => {
  return (
    <TooltipProvider>
      <div>
        <h4 className="text-sm font-medium font-arabic mb-3 text-black">القفل والحماية</h4>
        <div className="grid grid-cols-2 gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onLock}
                disabled={!hasSelection}
                size="sm"
                className="rounded-[12px] bg-[#f1b5b9] hover:bg-[#f1b5b9]/80 disabled:bg-[#d1e1ea] text-black border-none p-2"
              >
                <Lock className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="center" sideOffset={8} className="bg-black text-white text-xs">
              <p>قفل</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onUnlock}
                disabled={!hasSelection}
                size="sm"
                className="rounded-[12px] bg-[#bdeed3] hover:bg-[#bdeed3]/80 disabled:bg-[#d1e1ea] text-black border-none p-2"
              >
                <Unlock className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="center" sideOffset={8} className="bg-black text-white text-xs">
              <p>إلغاء القفل</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
};