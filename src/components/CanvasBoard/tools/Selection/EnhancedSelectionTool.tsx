
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TooltipProvider } from '@/components/ui/tooltip';
import { MousePointer } from 'lucide-react';
import { CanvasElement } from '../../types';
import { SelectionPanel } from './SelectionPanel';

interface EnhancedSelectionToolProps {
  selectedTool: string;
  selectedElements: CanvasElement[];
  onCopy: () => void;
  onCut: () => void;
  onPaste: () => void;
  onDelete: () => void;
  onGroup: () => void;
  onUngroup: () => void;
  onLock: () => void;
  onUnlock: () => void;
  onRotate: () => void;
  onFlipHorizontal: () => void;
  onFlipVertical: () => void;
  onAlign: (direction: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
  onUpdateElement: (elementId: string, updates: any) => void;
  onMoveElement?: (elementId: string, direction: 'up' | 'down' | 'left' | 'right', distance: number) => void;
  onRotateElement?: (elementId: string, angle: number) => void;
  onFlipElement?: (elementId: string, direction: 'horizontal' | 'vertical') => void;
  onAlignElements?: (elementIds: string[], direction: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
  onSelectAll?: () => void;
  onDeselect?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
}

export const EnhancedSelectionTool: React.FC<EnhancedSelectionToolProps> = (props) => {
  if (props.selectedTool !== 'select') return null;

  return (
    <TooltipProvider>
      <Card className="w-80 bg-white/95 backdrop-blur-xl shadow-lg border border-white/20 rounded-[24px]">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-arabic flex items-center gap-2">
            <MousePointer className="w-5 h-5 text-blue-500" />
            أداة التحديد
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SelectionPanel
            selectedElements={props.selectedElements}
            onCopy={props.onCopy}
            onCut={props.onCut}
            onPaste={props.onPaste}
            onDelete={props.onDelete}
            onGroup={props.onGroup}
            onUngroup={props.onUngroup}
            onLock={props.onLock}
            onUnlock={props.onUnlock}
            onRotate={props.onRotate}
            onFlipHorizontal={props.onFlipHorizontal}
            onFlipVertical={props.onFlipVertical}
            onAlign={props.onAlign}
            onUpdateElement={props.onUpdateElement}
          />
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};
