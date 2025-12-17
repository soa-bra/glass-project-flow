import React, { useMemo } from "react";
import { Move, Type, Shapes, Frame, Upload, PenTool, Sparkles, Link2 } from "lucide-react";
import { useCanvasStore, ToolId } from "@/stores/canvasStore";

const tools: Array<{ id: ToolId; label: string; icon: React.ReactNode; shortcut?: string }> = [
  { id: "selection_tool", label: "تحديد", icon: <Move size={18} />, shortcut: "V" },
  { id: "text_tool", label: "نص", icon: <Type size={18} />, shortcut: "T" },
  { id: "shapes_tool", label: "أشكال", icon: <Shapes size={18} />, shortcut: "R" },
  { id: "frame_tool", label: "إطار", icon: <Frame size={18} />, shortcut: "F" },
  { id: "file_uploader", label: "ملفات", icon: <Upload size={18} />, shortcut: "U" },
  { id: "smart_pen", label: "قلم", icon: <PenTool size={18} />, shortcut: "P" },
  { id: "smart_element_tool", label: "عنصر ذكي", icon: <Sparkles size={18} />, shortcut: "S" },
  { id: "root_connector_tool", label: "الجذر", icon: <Link2 size={18} />, shortcut: "C" },
];

const CanvasToolbar: React.FC = () => {
  const { activeTool, setActiveTool, typingMode } = useCanvasStore();

  const disabled = useMemo(() => typingMode, [typingMode]);

  return (
    <div className="absolute bottom-6 left-6 z-50">
      <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md border border-[hsl(var(--border))] rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] px-3 py-2">
        {tools.map((t) => {
          const isActive = activeTool === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTool(t.id)}
              disabled={disabled}
              className={`group flex items-center gap-2 px-3 py-2 rounded-xl transition-colors ${
                disabled
                  ? "opacity-60 cursor-not-allowed"
                  : isActive
                    ? "bg-[hsl(var(--accent-green))/0.12] text-[hsl(var(--accent-green))]"
                    : "hover:bg-[hsl(var(--panel))] text-[hsl(var(--ink))]"
              }`}
              title={t.shortcut ? `${t.label} (${t.shortcut})` : t.label}
            >
              <span className={`${isActive ? "text-[hsl(var(--accent-green))]" : "text-[hsl(var(--ink))]"}`}>
                {t.icon}
              </span>
              <span className="text-[12px] font-medium">{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CanvasToolbar;
