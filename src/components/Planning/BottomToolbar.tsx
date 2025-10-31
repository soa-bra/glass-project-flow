import React, { useEffect, useRef } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const activeToolRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (container && activeTool) {
      const activeElement = activeToolRef.current;

      if (activeElement) {
        const { offsetLeft, offsetWidth } = activeElement;

        const clipLeft = offsetLeft + 16;
        const clipRight = offsetLeft + offsetWidth + 16;

        container.style.clipPath = `inset(0 ${Number(
          100 - (clipRight / container.offsetWidth) * 100,
        ).toFixed()}% 0 ${Number(
          (clipLeft / container.offsetWidth) * 100,
        ).toFixed()}% round 17px)`;
      }
    }
  }, [activeTool]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="relative bg-white border border-black flex w-fit items-center rounded-full py-2 px-4">
        {/* Animation Layer */}
        <div
          ref={containerRef}
          className="absolute z-10 w-full overflow-hidden [clip-path:inset(0px_75%_0px_0%_round_17px)] [transition:clip-path_0.25s_ease]"
        >
          <div className="relative flex w-full justify-center bg-black">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className="flex h-8 items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-white whitespace-nowrap"
                tabIndex={-1}
              >
                <span className="flex-shrink-0">{tool.icon}</span>
                <span>{tool.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Layer */}
        <div className="relative flex w-full justify-center">
          {tools.map((tool) => {
            const isActive = activeTool === tool.id;

            return (
              <button
                key={tool.id}
                ref={isActive ? activeToolRef : null}
                onClick={() => setActiveTool(tool.id)}
                title={`${tool.name} (${tool.shortcut})`}
                className="group relative flex h-8 items-center gap-2 cursor-pointer rounded-full px-3 py-2 text-sm font-medium text-gray-700 whitespace-nowrap"
              >
                <span className="flex-shrink-0">{tool.icon}</span>
                <span>{tool.name}</span>
                
                {/* Keyboard Shortcut Hint */}
                <span 
                  className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 bg-black text-white text-[11px] font-medium px-2 py-1 rounded-md whitespace-nowrap shadow-md"
                >
                  {tool.shortcut}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomToolbar;
