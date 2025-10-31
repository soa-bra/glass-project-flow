import React, { useLayoutEffect, useRef } from 'react';
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
  const animationLayerRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<Map<string, HTMLButtonElement>>(new Map());

  useLayoutEffect(() => {
    const animationLayer = animationLayerRef.current;
    const activeButton = buttonsRef.current.get(activeTool);
    
    if (animationLayer && activeButton) {
      const parent = animationLayer.parentElement;
      if (parent) {
        const parentRect = parent.getBoundingClientRect();
        const buttonRect = activeButton.getBoundingClientRect();
        
        const leftPercent = ((buttonRect.left - parentRect.left) / parentRect.width) * 100;
        const rightPercent = ((parentRect.right - buttonRect.right) / parentRect.width) * 100;
        
        animationLayer.style.clipPath = `inset(0 ${rightPercent}% 0 ${leftPercent}% round 20px)`;
      }
    }
  }, [activeTool]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="relative bg-white border border-[hsl(var(--ink))] flex w-fit items-center gap-0 rounded-full p-1">
        {/* Animation Layer */}
        <div
          ref={animationLayerRef}
          className="absolute inset-0 z-10 pointer-events-none overflow-hidden"
          style={{
            clipPath: 'inset(0 100% 0 0% round 20px)',
            transition: 'clip-path 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <div className="flex items-center gap-0">
            {tools.map((tool) => (
              <button
                key={`anim-${tool.id}`}
                className="flex h-9 items-center gap-2 rounded-full bg-[hsl(var(--ink))] px-4 py-2 text-[13px] font-medium text-white whitespace-nowrap"
                tabIndex={-1}
                aria-hidden="true"
              >
                <span className="flex-shrink-0">{tool.icon}</span>
                {tool.name}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Layer */}
        <div className="relative z-20 flex items-center gap-0">
          {tools.map((tool) => (
            <button
              key={tool.id}
              ref={(el) => {
                if (el) {
                  buttonsRef.current.set(tool.id, el);
                } else {
                  buttonsRef.current.delete(tool.id);
                }
              }}
              onClick={() => setActiveTool(tool.id)}
              title={`${tool.name} (${tool.shortcut})`}
              className="group relative flex h-9 items-center gap-2 cursor-pointer rounded-full px-4 py-2 text-[13px] font-medium text-[hsl(var(--ink-60))] hover:text-[hsl(var(--ink))] whitespace-nowrap transition-colors duration-200"
            >
              <span className="flex-shrink-0">{tool.icon}</span>
              {tool.name}
              
              {/* Keyboard Shortcut Hint */}
              <span 
                className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 bg-[hsl(var(--ink))] text-white text-[11px] font-medium px-2 py-1 rounded-[6px] whitespace-nowrap shadow-[0_8px_24px_rgba(0,0,0,0.24)]"
              >
                {tool.shortcut}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BottomToolbar;
