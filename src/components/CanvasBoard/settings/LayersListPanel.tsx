import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ToolPanelContainer } from '@/components/custom/ToolPanelContainer';
import { ChevronUp, ChevronDown, Eye, EyeOff, Lock, Unlock } from 'lucide-react';

interface Layer {
  id: string;
  name?: string;
  hidden?: boolean;
  locked?: boolean;
}

interface LayersListPanelProps {
  selectedTool: string;
  layers: Layer[];
  onToggleVisibility: (id: string) => void;
  onToggleLock: (id: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

export const LayersListPanel: React.FC<LayersListPanelProps> = ({
  selectedTool,
  layers,
  onToggleVisibility,
  onToggleLock,
  onReorder
}) => {
  if (selectedTool !== 'layers') return null;

  return (
    <ToolPanelContainer title="طبقات اللوحة">
      <div className="space-y-2 text-sm">
        {layers.length === 0 ? (
          <div className="text-center text-gray-500 py-4 font-arabic">
            لا توجد طبقات حالياً
          </div>
        ) : (
          layers.map((layer, idx) => (
            <div 
              key={layer.id} 
              className="flex items-center justify-between gap-2 bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg"
            >
              <span className="truncate text-xs font-arabic flex-1">
                {layer.name || layer.id}
              </span>
              
              <div className="flex gap-1 items-center">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={() => onToggleVisibility(layer.id)}
                  title={layer.hidden ? 'إظهار' : 'إخفاء'}
                >
                  {layer.hidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </Button>
                
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={() => onToggleLock(layer.id)}
                  title={layer.locked ? 'إلغاء القفل' : 'قفل'}
                >
                  {layer.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                </Button>
                
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={() => onReorder(idx, idx - 1)}
                  disabled={idx === 0}
                  title="تحريك للأعلى"
                >
                  <ChevronUp className="w-3 h-3" />
                </Button>
                
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={() => onReorder(idx, idx + 1)}
                  disabled={idx === layers.length - 1}
                  title="تحريك للأسفل"
                >
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </ToolPanelContainer>
  );
};