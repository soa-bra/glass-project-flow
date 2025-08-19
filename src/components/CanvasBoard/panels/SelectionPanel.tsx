import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MousePointer, Copy, Scissors, Clipboard, Trash2, Group } from 'lucide-react';
import { CanvasElement } from '../types';

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  elements: string[];
}

interface SelectionPanelProps {
  selectedElements: CanvasElement[];
  onUpdateElement: (elementId: string, updates: any) => void;
  onCopy: () => void;
  onCut: () => void;
  onPaste: () => void;
  onDelete: () => void;
  onGroup: () => void;
  layers: Layer[];
  onLayerReorder: (layers: Layer[]) => void;
}

const SelectionPanel: React.FC<SelectionPanelProps> = ({
  selectedElements,
  onCopy,
  onCut,
  onPaste,
  onDelete,
  onGroup
}) => {
  const hasSelection = selectedElements.length > 0;
  const multipleSelection = selectedElements.length > 1;

  return (
    <Card className="w-64">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MousePointer size={16} />
          أداة التحديد
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasSelection ? (
          <>
            <div className="text-sm text-muted-foreground">
              {selectedElements.length} عنصر محدد
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={onCopy}
                size="sm"
              >
                <Copy size={14} className="mr-1" />
                نسخ
              </Button>
              
              <Button
                variant="outline"
                onClick={onCut}
                size="sm"
              >
                <Scissors size={14} className="mr-1" />
                قص
              </Button>
              
              <Button
                variant="outline"
                onClick={onPaste}
                size="sm"
              >
                <Clipboard size={14} className="mr-1" />
                لصق
              </Button>
              
              <Button
                variant="outline"
                onClick={onDelete}
                size="sm"
              >
                <Trash2 size={14} className="mr-1" />
                حذف
              </Button>
            </div>
            
            {multipleSelection && (
              <Button
                variant="outline"
                className="w-full"
                onClick={onGroup}
              >
                <Group size={14} className="mr-2" />
                تجميع العناصر
              </Button>
            )}
          </>
        ) : (
          <div className="text-sm text-muted-foreground text-center py-4">
            لم يتم تحديد أي عنصر
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SelectionPanel;