import React from 'react';
import { Switch } from '@/components/ui/switch';
import { ToolPanelContainer } from '@/components/custom/ToolPanelContainer';

interface CanvasGuidesToggleProps {
  showGrid: boolean;
  snapEnabled: boolean;
  onGridToggle: (value: boolean) => void;
  onSnapToggle: (value: boolean) => void;
}

export const CanvasGuidesToggle: React.FC<CanvasGuidesToggleProps> = ({
  showGrid,
  snapEnabled,
  onGridToggle,
  onSnapToggle
}) => {
  return (
    <ToolPanelContainer title="الشبكة الذكية والسناب">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-black font-arabic">إظهار الشبكة</label>
          <Switch checked={showGrid} onCheckedChange={onGridToggle} />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-black font-arabic">تفعيل السناب</label>
          <Switch checked={snapEnabled} onCheckedChange={onSnapToggle} />
        </div>
      </div>
    </ToolPanelContainer>
  );
};