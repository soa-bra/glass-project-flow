import React from "react";
import { useTooling } from "./ToolState";
import type { ToolId } from "./panels";

const tools: { id: ToolId; label: string; icon: string; shortcut: string }[] = [
  { id:"selection_tool", label:"تحديد", icon:"↔", shortcut:"V" },
  { id:"smart_pen", label:"قلم ذكي", icon:"✎", shortcut:"P" },
  { id:"zoom_tool", label:"زووم", icon:"🔍", shortcut:"Z" },
  { id:"pan_tool", label:"تحريك", icon:"✋", shortcut:"H" },
  { id:"file_uploader", label:"رفع", icon:"⤴", shortcut:"U" },
  { id:"comment_tool", label:"تعليق", icon:"💬", shortcut:"C" },
  { id:"text_tool", label:"نص", icon:"T", shortcut:"T" },
  { id:"shapes_tool", label:"أشكال", icon:"▢", shortcut:"R" },
  { id:"smart_element_tool", label:"عنصر ذكي", icon:"✨", shortcut:"S" },
  { id:"root_link_tool", label:"ربط جذري", icon:"🔗", shortcut:"L" },
];

export default function BottomToolbar() {
  const { activeTool, setActiveTool } = useTooling();
  return (
    <div style={{ position:"absolute", bottom:8, left:"50%", transform:"translateX(-50%)", background:"#ffffffd9", backdropFilter:"blur(8px)", border:"1px solid #e5e7eb", borderRadius:12, padding:6, display:"flex", gap:6, zIndex:10 }}>
      {tools.map(t => (
        <button
          key={t.id}
          onClick={() => setActiveTool(t.id)}
          title={`${t.label} • ${t.shortcut}`}
          aria-pressed={activeTool === t.id}
          style={{
            padding: "6px 10px",
            fontWeight: activeTool === t.id ? 700 : 400,
            background: activeTool === t.id ? "#e5e7eb" : "transparent",
            borderRadius: 6,
          }}
        >
          <span style={{ marginInlineEnd: 6 }}>{t.icon}</span>
          {t.label}
        </button>
      ))}
    </div>
  );
}
