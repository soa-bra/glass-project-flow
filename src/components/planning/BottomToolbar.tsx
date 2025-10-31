import React from "react";
import { ArrowUpRight, Pen, Square, Upload, Type, Star, Lamp } from "lucide-react";
import { useTooling } from "./ToolState";
import type { ToolId } from "./types";

const tools: { id: ToolId; label: string; icon: React.ReactNode; shortcut: string }[] = [
  { id: "selection_tool", label: "تحديد", icon: <ArrowUpRight className="w-4 h-4" />, shortcut: "V" },
  { id: "smart_pen", label: "قلم ذكي", icon: <Pen className="w-4 h-4" />, shortcut: "P" },
  { id: "frame_tool", label: "إطار", icon: <Square className="w-4 h-4" />, shortcut: "F" },
  { id: "file_uploader", label: "رفع", icon: <Upload className="w-4 h-4" />, shortcut: "U" },
  { id: "text_tool", label: "نص", icon: <Type className="w-4 h-4" />, shortcut: "T" },
  { id: "shapes_tool", label: "أشكال", icon: <Star className="w-4 h-4" />, shortcut: "R" },
  { id: "smart_element_tool", label: "عنصر ذكي", icon: <Lamp className="w-4 h-4" />, shortcut: "S" },
];

export default function BottomToolbar() {
  const { activeTool, setActiveTool } = useTooling();
  
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
      <div className="bg-white/90 backdrop-blur-md border border-[hsl(var(--border))] rounded-2xl p-2 shadow-lg flex gap-1">
        {tools.map(tool => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            title={`${tool.label} • ${tool.shortcut}`}
            aria-pressed={activeTool === tool.id}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-lg transition-all
              ${activeTool === tool.id 
                ? 'bg-[hsl(var(--accent-green))] text-white font-semibold' 
                : 'hover:bg-[hsl(var(--panel))] text-[hsl(var(--ink))]'
              }
            `}
          >
            {tool.icon}
            <span className="text-sm">{tool.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
