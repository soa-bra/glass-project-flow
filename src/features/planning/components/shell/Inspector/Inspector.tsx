import React from 'react';
import { useToolsStore } from '../../../store/tools.store';
import { ToolPanelContainer } from '@/components/custom/ToolPanelContainer';
import { SelectionPanel } from '../../panels/SelectionPanel/SelectionPanel';
import { SmartPenPanel } from '../../panels/SmartPenPanel/SmartPenPanel';
import { ZoomPanel } from '../../panels/ZoomPanel/ZoomPanel';
import { SmartElementsPanel } from '../../smartElements/SmartElementsPanel/SmartElementsPanel';
import { BusinessWidgetsPanel } from '../../widgets/BusinessWidgetsPanel/BusinessWidgetsPanel';
import { useCanvasStore } from '../../../store/canvas.store';

export const Inspector: React.FC = () => {
  const { activeTool } = useToolsStore();
  const { addElement } = useCanvasStore();

  const handleAddBusinessWidget = (widgetType: any) => {
    const newWidget = {
      id: `widget_${Date.now()}`,
      type: 'business_widget' as const,
      position: { x: 100, y: 100 },
      size: { width: widgetType.size.width, height: widgetType.size.height },
      rotation: 0,
      data: {
        widgetType: widgetType.id,
        title: widgetType.name,
        config: {}
      },
      style: {
        backgroundColor: '#ffffff',
        borderColor: '#e5e7eb',
        borderWidth: 2,
        borderRadius: 16
      },
      metadata: {
        createdBy: 'user',
        createdAt: Date.now(),
        version: 1
      }
    };

    addElement(newWidget);
  };

  const renderPanel = () => {
    switch (activeTool) {
      case 'selection':
        return <SelectionPanel />;
      case 'smart_pen':
        return <SmartPenPanel />;
      case 'zoom':
        return <ZoomPanel />;
      case 'smart_element':
        return <SmartElementsPanel />;
      case 'business_widgets':
        return <BusinessWidgetsPanel onAddWidget={handleAddBusinessWidget} />;
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