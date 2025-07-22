
import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Scissors, Clipboard, Trash2, Group, Ungroup } from 'lucide-react';
import { CanvasElement } from '../types';

interface CleanSelectionPanelProps {
  selectedElements: CanvasElement[];
  onCopy: () => void;
  onCut: () => void;
  onPaste: () => void;
  onDelete: () => void;
  onGroup: () => void;
  onUngroup: () => void;
}

export const CleanSelectionPanel: React.FC<CleanSelectionPanelProps> = ({
  selectedElements,
  onCopy,
  onCut,
  onPaste,
  onDelete,
  onGroup,
  onUngroup
}) => {
  const hasSelection = selectedElements.length > 0;
  const multipleSelection = selectedElements.length > 1;

  return (
    <div className="space-y-4 p-4 bg-white border border-gray-200 rounded-lg">
      <div>
        <h4 className="text-sm font-medium mb-3">تحديد العناصر</h4>
        <p className="text-xs text-gray-500 mb-3">
          {hasSelection ? `${selectedElements.length} عنصر محدد` : 'لا توجد عناصر محددة'}
        </p>
      </div>

      {hasSelection && (
        <>
          <div className="space-y-2">
            <h5 className="text-xs font-medium text-gray-700">العمليات الأساسية</h5>
            <div className="grid grid-cols-4 gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={onCopy}
                className="p-2"
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={onCut}
                className="p-2"
              >
                <Scissors className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={onPaste}
                className="p-2"
              >
                <Clipboard className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={onDelete}
                className="p-2 text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {multipleSelection && (
            <div className="space-y-2">
              <h5 className="text-xs font-medium text-gray-700">التجميع</h5>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onGroup}
                  className="p-2"
                >
                  <Group className="w-4 h-4 mr-1" />
                  تجميع
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onUngroup}
                  className="p-2"
                >
                  <Ungroup className="w-4 h-4 mr-1" />
                  إلغاء
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
