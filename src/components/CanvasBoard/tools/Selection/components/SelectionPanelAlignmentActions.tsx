import React from 'react';
import { Button } from '@/components/ui/button';
import { AlignLeft, AlignCenter, AlignRight, AlignHorizontalJustifyCenter, AlignVerticalJustifyCenter, AlignHorizontalJustifyEnd } from 'lucide-react';

interface SelectionPanelAlignmentActionsProps {
  hasSelection: boolean;
  multipleSelection: boolean;
  onAlign: (direction: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
}

export const SelectionPanelAlignmentActions: React.FC<SelectionPanelAlignmentActionsProps> = ({
  hasSelection,
  multipleSelection,
  onAlign
}) => {
  return (
    <div>
      <h4 className="text-sm font-medium font-arabic mb-3 text-black">المحاذاة</h4>
      <div className="space-y-2">
        {/* المحاذاة الأفقية */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            onClick={() => onAlign('left')}
            disabled={!multipleSelection}
            size="sm"
            className="rounded-[12px] bg-[#d9d2fd] hover:bg-[#d9d2fd]/80 disabled:bg-[#d1e1ea] text-black border-none"
            title="محاذاة يسار"
          >
            <AlignLeft className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => onAlign('center')}
            disabled={!multipleSelection}
            size="sm"
            className="rounded-[12px] bg-[#fbe2aa] hover:bg-[#fbe2aa]/80 disabled:bg-[#d1e1ea] text-black border-none"
            title="محاذاة وسط"
          >
            <AlignCenter className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => onAlign('right')}
            disabled={!multipleSelection}
            size="sm"
            className="rounded-[12px] bg-[#96d8d0] hover:bg-[#96d8d0]/80 disabled:bg-[#d1e1ea] text-black border-none"
            title="محاذاة يمين"
          >
            <AlignRight className="w-4 h-4" />
          </Button>
        </div>
        
        {/* المحاذاة العمودية */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            onClick={() => onAlign('top')}
            disabled={!multipleSelection}
            size="sm"
            className="rounded-[12px] bg-[#a4e2f6] hover:bg-[#a4e2f6]/80 disabled:bg-[#d1e1ea] text-black border-none"
            title="محاذاة أعلى"
          >
            <AlignHorizontalJustifyCenter className="w-4 h-4 rotate-90" />
          </Button>
          <Button
            onClick={() => onAlign('middle')}
            disabled={!multipleSelection}
            size="sm"
            className="rounded-[12px] bg-[#bdeed3] hover:bg-[#bdeed3]/80 disabled:bg-[#d1e1ea] text-black border-none"
            title="محاذاة منتصف"
          >
            <AlignVerticalJustifyCenter className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => onAlign('bottom')}
            disabled={!multipleSelection}
            size="sm"
            className="rounded-[12px] bg-[#f1b5b9] hover:bg-[#f1b5b9]/80 disabled:bg-[#d1e1ea] text-black border-none"
            title="محاذاة أسفل"
          >
            <AlignHorizontalJustifyEnd className="w-4 h-4 rotate-90" />
          </Button>
        </div>
      </div>
    </div>
  );
};