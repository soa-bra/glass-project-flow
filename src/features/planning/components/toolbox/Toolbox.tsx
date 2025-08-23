import React from 'react';
import { cn } from '@/lib/utils';
import { COLORS } from '@/components/shared/design-system/constants';
import { SelectionTool } from './tools/SelectionTool';
import { PanTool } from './tools/PanTool';
import { ZoomTool } from './tools/ZoomTool';
import { TextTool } from './tools/TextTool';
import { ShapesTool } from './tools/ShapesTool';
import { SmartPenTool } from './tools/SmartPenTool';

export const Toolbox: React.FC = () => {
  return (
    <div className={cn("w-16 h-full flex flex-col", COLORS.BOX_BACKGROUND, "border-l border-sb-border")}>
      <div className="p-2 border-b border-sb-border">
        <h3 className="text-xs font-medium text-sb-color-text-light">الأدوات</h3>
      </div>
      
      <div className="flex flex-col gap-1 p-2">
        <SelectionTool />
        <PanTool />
        <ZoomTool />
        
        <div className="h-px bg-sb-border my-2" />
        
        <TextTool />
        <ShapesTool />
        <SmartPenTool />
      </div>
      
      <div className="mt-auto p-2 text-xs text-sb-color-text-light">
        اضغط ESC للعودة للتحديد
      </div>
    </div>
  );
};