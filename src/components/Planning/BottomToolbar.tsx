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
import type { ToolId } from '../../../panels';

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

interface BottomToolbarProps {
  activeTool: ToolId;
  onToolChange: (toolId: ToolId) => void;
}

const BottomToolbar: React.FC<BottomToolbarProps> = ({ activeTool, onToolChange }) => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-white/90 backdrop-blur-[18px] rounded-[18px] border border-[#DADCE0] shadow-[0_1px_1px_rgba(0,0,0,0.04),0_12px_28px_rgba(0,0,0,0.10)] px-2 py-2 flex items-center gap-1">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onToolChange(tool.id)}
            title={`${tool.name} (${tool.shortcut})`}
            className={`
              group relative flex items-center gap-2 px-4 py-2.5 rounded-[10px] 
              transition-all duration-200
              ${
                activeTool === tool.id
                  ? 'bg-[hsl(var(--accent-green))] text-white shadow-sm'
                  : 'hover:bg-[hsl(var(--panel))] text-[hsl(var(--ink))]'
              }
            `}
          >
            <span className="flex-shrink-0">{tool.icon}</span>
            <span className="text-[13px] font-medium whitespace-nowrap">
              {tool.name}
            </span>
            
            {/* Keyboard Shortcut Hint */}
            <span 
              className={`
                absolute -top-8 left-1/2 -translate-x-1/2
                opacity-0 group-hover:opacity-100 pointer-events-none
                transition-opacity duration-200
                bg-[hsl(var(--ink))] text-white text-[11px] font-medium
                px-2 py-1 rounded-[6px] whitespace-nowrap
                shadow-[0_8px_24px_rgba(0,0,0,0.24)]
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
