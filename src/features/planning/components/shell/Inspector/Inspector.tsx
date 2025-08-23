import React from 'react';
import { useToolsStore } from '../../../store/tools.store';
import { ToolPanelContainer } from '@/components/custom/ToolPanelContainer';
import { SelectionPanel } from '../../panels/SelectionPanel/SelectionPanel';
import { SmartPenPanel } from '../../panels/SmartPenPanel/SmartPenPanel';
import { ZoomPanel } from '../../panels/ZoomPanel/ZoomPanel';

export const Inspector: React.FC = () => {
  const { activeTool } = useToolsStore();

  const renderPanel = () => {
    switch (activeTool) {
      case 'selection':
        return <SelectionPanel />;
      case 'smart_pen':
        return <SmartPenPanel />;
      case 'zoom':
        return <ZoomPanel />;
      case 'pan':
        return (
          <ToolPanelContainer title="تحريك العرض">
            <p className="text-sm text-muted-foreground text-center py-4">
              استخدم الماوس أو Space + السحب للتحريك
            </p>
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="font-medium">اختصارات:</div>
              <div>Space: تحريك مؤقت</div>
              <div>H: تحريك دائم</div>
              <div>مضغوط + السحب: تحريك أسرع</div>
            </div>
          </ToolPanelContainer>
        );
      default:
        return (
          <ToolPanelContainer title="الخصائص">
            <p className="text-sm text-muted-foreground text-center py-4">
              اختر أداة لعرض خصائصها
            </p>
          </ToolPanelContainer>
        );
    }
  };

  return (
    <div className="w-80 bg-background border-l border-border p-4 overflow-y-auto">
      {renderPanel()}
    </div>
  );
};