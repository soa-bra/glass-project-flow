import React from 'react';
import { ToolPanelContainer } from '@/components/custom/ToolPanelContainer';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCanvasStore } from '../../../store/canvas.store';
import { Copy, Trash2, Lock, Unlock, Eye, EyeOff, Group, Ungroup } from 'lucide-react';

export const SelectionPanel: React.FC = () => {
  const {
    selectedElementIds,
    elements,
    removeElement,
    clearSelection,
    updateElement,
    duplicateElement
  } = useCanvasStore();

  const selectedElements = elements.filter(el => selectedElementIds.includes(el.id));
  const hasSelection = selectedElements.length > 0;
  const allLocked = selectedElements.every(el => el.locked);
  const allVisible = selectedElements.every(el => el.visible !== false);

  const handleDelete = () => {
    selectedElementIds.forEach(id => removeElement(id));
    clearSelection();
  };

  const handleDuplicate = () => {
    selectedElementIds.forEach(id => duplicateElement(id));
  };

  const handleToggleLock = () => {
    selectedElementIds.forEach(id => {
      updateElement(id, { locked: !allLocked });
    });
  };

  const handleToggleVisibility = () => {
    selectedElementIds.forEach(id => {
      updateElement(id, { visible: allVisible ? false : true });
    });
  };

  const handleGroup = () => {
    // TODO: Implement grouping logic
    console.log('Group elements:', selectedElementIds);
  };

  const handleUngroup = () => {
    // TODO: Implement ungrouping logic
    console.log('Ungroup elements:', selectedElementIds);
  };

  return (
    <ToolPanelContainer title="التحديد">
      {!hasSelection ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          لم يتم تحديد أي عنصر
        </p>
      ) : (
        <div className="space-y-3">
          <div className="text-sm text-muted-foreground">
            {selectedElements.length === 1 
              ? 'عنصر واحد محدد' 
              : `${selectedElements.length} عناصر محددة`
            }
          </div>

          <Separator />

          {/* Basic Actions */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDuplicate}
              className="flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              نسخ
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="flex items-center gap-2 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              حذف
            </Button>
          </div>

          <Separator />

          {/* Lock and Visibility */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleLock}
              className="flex items-center gap-2"
            >
              {allLocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
              {allLocked ? 'إلغاء القفل' : 'قفل'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleVisibility}
              className="flex items-center gap-2"
            >
              {allVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {allVisible ? 'إخفاء' : 'إظهار'}
            </Button>
          </div>

          {selectedElements.length > 1 && (
            <>
              <Separator />
              
              {/* Grouping */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGroup}
                  className="flex items-center gap-2"
                >
                  <Group className="h-4 w-4" />
                  تجميع
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleUngroup}
                  className="flex items-center gap-2"
                >
                  <Ungroup className="h-4 w-4" />
                  فك التجميع
                </Button>
              </div>
            </>
          )}

          {/* Element Details */}
          {selectedElements.length === 1 && (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="text-sm font-medium">تفاصيل العنصر</div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div>النوع: {selectedElements[0].type}</div>
                  <div>الموضع: ({Math.round(selectedElements[0].position.x)}, {Math.round(selectedElements[0].position.y)})</div>
                  <div>الحجم: {Math.round(selectedElements[0].size.width)} × {Math.round(selectedElements[0].size.height)}</div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </ToolPanelContainer>
  );
};