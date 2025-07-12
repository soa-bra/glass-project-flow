import React from 'react';
import { Button } from '@/components/ui/button';
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
    <div>
      <h4 className="text-sm font-medium font-arabic mb-3 text-black">التحويل</h4>
      <div className="grid grid-cols-3 gap-2">
        <Button
          onClick={onRotate}
          disabled={!hasSelection}
          size="sm"
          className="rounded-[12px] bg-[#96d8d0] hover:bg-[#96d8d0]/80 disabled:bg-[#d1e1ea] text-black border-none"
          title="تدوير"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
        <Button
          onClick={onFlipHorizontal}
          disabled={!hasSelection}
          size="sm"
          className="rounded-[12px] bg-[#a4e2f6] hover:bg-[#a4e2f6]/80 disabled:bg-[#d1e1ea] text-black border-none"
          title="عكس أفقي"
        >
          <FlipHorizontal className="w-4 h-4" />
        </Button>
        <Button
          onClick={onFlipVertical}
          disabled={!hasSelection}
          size="sm"
          className="rounded-[12px] bg-[#bdeed3] hover:bg-[#bdeed3]/80 disabled:bg-[#d1e1ea] text-black border-none"
          title="عكس عمودي"
        >
          <FlipVertical className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};