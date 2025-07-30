import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Minus } from 'lucide-react';
import { PanelType } from '@/types/canvas';
import { LayersPanel } from './LayersPanel';
import { EnhancedAppearancePanel } from '../AppearancePanel/EnhancedAppearancePanel';
import { CollaborationPanel } from './CollaborationPanel';
import { SmartAssistantPanel } from './SmartAssistantPanel';
import { ToolCustomizationPanel } from './ToolCustomizationPanel';

interface SidePanelProps {
  activePanel: PanelType;
  onClose: () => void;
  onCollapse: () => void;
}

const panelTitles: Record<PanelType, string> = {
  layers: 'الطبقات',
  appearance: 'المظهر',
  collaboration: 'التعاون',
  'smart-assistant': 'المساعد الذكي',
  'tool-customization': 'تخصيص الأدوات'
};

export const SidePanel: React.FC<SidePanelProps> = ({
  activePanel,
  onClose,
  onCollapse
}) => {
  const renderPanelContent = () => {
    switch (activePanel) {
      case 'layers':
        return <LayersPanel />;
      case 'appearance':
        return <EnhancedAppearancePanel />;
      case 'collaboration':
        return <CollaborationPanel />;
      case 'smart-assistant':
        return <SmartAssistantPanel />;
      case 'tool-customization':
        return <ToolCustomizationPanel />;
      default:
        return <div className="p-4">لوحة غير متاحة</div>;
    }
  };

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Panel Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-semibold text-foreground">
          {panelTitles[activePanel]}
        </h3>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCollapse}
            className="w-8 h-8 p-0"
          >
            <Minus className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="w-8 h-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-auto">
        {renderPanelContent()}
      </div>
    </div>
  );
};