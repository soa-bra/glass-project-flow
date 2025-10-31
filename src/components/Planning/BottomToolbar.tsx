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

interface Tool {
  id: ToolId;
  name: string;
  icon: React.ReactNode;
  shortcut: string;
}

const tools: Tool[] = [
  { 
    id: 'selection_tool', 
    name: 'تحديد', 
    icon: <MousePointer2 size={20} />, 
    shortcut: 'V' 
  },
  { 
    id: 'smart_pen', 
    name: 'قلم ذكي', 
    icon: <Pen size={20} />, 
    shortcut: 'P' 
  },
  { 
    id: 'frame_tool', 
    name: 'إطار', 
    icon: <Square size={20} />, 
    shortcut: 'F' 
  },
  { 
    id: 'file_uploader', 
    name: 'رفع', 
    icon: <Upload size={20} />, 
    shortcut: 'U' 
  },
  { 
    id: 'text_tool', 
    name: 'نص', 
    icon: <Type size={20} />, 
    shortcut: 'T' 
  },
  { 
    id: 'shapes_tool', 
    name: 'أشكال', 
    icon: <Star size={20} />, 
    shortcut: 'R' 
  },
  { 
    id: 'smart_element_tool', 
    name: 'عنصر ذكي', 
    icon: <Lightbulb size={20} />, 
    shortcut: 'S' 
  },
];

const BottomToolbar: React.FC = () => {
  const { activeTool, setActiveTool } = useCanvasStore();

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            title={`${tool.name} (${tool.shortcut})`}
            className={`
              group relative inline-flex items-center justify-center gap-2 
              whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium 
              transition-all
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
              disabled:pointer-events-none disabled:opacity-50
              ${
                activeTool === tool.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'hover:bg-background/50'
              }
            `}
          >
            <span className="flex-shrink-0">{tool.icon}</span>
            <span className="whitespace-nowrap">
              {tool.name}
            </span>
            
            {/* Keyboard Shortcut Hint */}
            <span 
              className={`
                absolute -top-8 left-1/2 -translate-x-1/2
                opacity-0 group-hover:opacity-100 pointer-events-none
                transition-opacity duration-200
                bg-popover text-popover-foreground text-[11px] font-medium
                px-2 py-1 rounded-md whitespace-nowrap
                shadow-md border
              `}
            >
              {tool.shortcut}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomToolbar;
