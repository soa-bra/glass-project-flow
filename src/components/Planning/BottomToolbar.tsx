import React from 'react';
import { 
  MousePointer2, 
  Pen, 
  Square, 
  Upload, 
  Type, 
  Star, 
  Lightbulb 
} from 'lucide-react';
import { useCanvasStore, type ToolId } from '@/stores/canvasStore';
import Dock from '@/components/ui/dock';

interface Tool {
  id: ToolId;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  shortcut: string;
}

const tools: Tool[] = [
  { 
    id: 'selection_tool', 
    name: 'تحديد', 
    icon: MousePointer2, 
    shortcut: 'V' 
  },
  { 
    id: 'smart_pen', 
    name: 'قلم ذكي', 
    icon: Pen, 
    shortcut: 'P' 
  },
  { 
    id: 'frame_tool', 
    name: 'إطار', 
    icon: Square, 
    shortcut: 'F' 
  },
  { 
    id: 'file_uploader', 
    name: 'رفع', 
    icon: Upload, 
    shortcut: 'U' 
  },
  { 
    id: 'text_tool', 
    name: 'نص', 
    icon: Type, 
    shortcut: 'T' 
  },
  { 
    id: 'shapes_tool', 
    name: 'أشكال', 
    icon: Star, 
    shortcut: 'R' 
  },
  { 
    id: 'smart_element_tool', 
    name: 'عنصر ذكي', 
    icon: Lightbulb, 
    shortcut: 'S' 
  },
];

const BottomToolbar: React.FC = () => {
  const { activeTool, setActiveTool } = useCanvasStore();

  const dockItems = tools.map((tool) => ({
    icon: tool.icon,
    label: `${tool.name} • ${tool.shortcut}`,
    onClick: () => setActiveTool(tool.id),
    isActive: activeTool === tool.id,
  }));

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <Dock items={dockItems} />
    </div>
  );
};

export default BottomToolbar;
