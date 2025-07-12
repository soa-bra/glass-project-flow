import React from 'react';
import { Button } from '@/components/ui/button';
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
          onClick={onUngroup}
          disabled={!hasSelection}
          size="sm"
          className="rounded-[12px] bg-[#fbe2aa] hover:bg-[#fbe2aa]/80 disabled:bg-[#d1e1ea] text-black border-none"
        >
          <Ungroup className="w-4 h-4 mr-2" />
          إلغاء التجميع
        </Button>
      </div>
    </div>
  );
};