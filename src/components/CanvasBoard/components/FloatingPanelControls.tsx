import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Bot,
  Layers,
  Palette,
  Users,
  Wrench
} from 'lucide-react';

interface FloatingPanelControlsProps {
  showSmartAssistant: boolean;
  showLayers: boolean;
  showAppearance: boolean;
  showCollaboration: boolean;
  showTools: boolean;
  onTogglePanel: (panel: string) => void;
}

export const FloatingPanelControls: React.FC<FloatingPanelControlsProps> = ({
  showSmartAssistant,
  showLayers,
  showAppearance,
  showCollaboration,
  showTools,
  onTogglePanel
}) => {
  const panels = [
    { 
      id: 'smartAssistant', 
      icon: Bot, 
      label: 'المساعد الذكي', 
      active: showSmartAssistant,
      color: 'text-blue-600'
    },
    { 
      id: 'layers', 
      icon: Layers, 
      label: 'الطبقات', 
      active: showLayers,
      color: 'text-purple-600'
    },
    { 
      id: 'appearance', 
      icon: Palette, 
      label: 'المظهر', 
      active: showAppearance,
      color: 'text-pink-600'
    },
    { 
      id: 'collaboration', 
      icon: Users, 
      label: 'التعاون', 
      active: showCollaboration,
      color: 'text-green-600'
    },
    { 
      id: 'tools', 
      icon: Wrench, 
      label: 'الأدوات', 
      active: showTools,
      color: 'text-orange-600'
    }
  ];

  return (
    <Card className="fixed top-1/2 right-4 transform -translate-y-1/2 bg-white/95 backdrop-blur-lg shadow-lg border border-gray-200/50 z-50 animate-fade-in">
      <div className="flex flex-col gap-1 p-2">
        {panels.map((panel) => {
          const Icon = panel.icon;
          return (
            <Button
              key={panel.id}
              variant={panel.active ? "default" : "ghost"}
              size="sm"
              onClick={() => onTogglePanel(panel.id)}
              className={`w-12 h-12 p-0 transition-all duration-200 hover:scale-105 ${panel.active ? 'shadow-md' : 'hover:bg-gray-100'}`}
              title={panel.label}
            >
              <Icon className={`w-5 h-5 ${panel.active ? 'text-white' : panel.color}`} />
            </Button>
          );
        })}
      </div>
    </Card>
  );
};