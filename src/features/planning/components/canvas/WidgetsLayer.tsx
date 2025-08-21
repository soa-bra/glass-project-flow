"use client";
import React from "react";
import { useCanvas } from "@/src/features/planning/hooks/useCanvas";
import { useSelection } from "@/src/features/planning/hooks/useSelection";

const WidgetsLayer: React.FC = () => {
  const { getWidgets, getStyleFor, getTextFor } = useCanvas();
  const { toggleSelect } = useSelection();
  const widgets = getWidgets();

  return (
    <div aria-label="Widgets Layer">
      {widgets.map((w:any) => {
        const common = {
          key: w.id,
          className: `absolute ${w.lockedBy ? "opacity-70" : ""}`,
          style: { left: w.x, top: w.y, width: w.w, height: w.h, transform: `rotate(${w.rotation ?? 0}deg)` },
          onPointerDown: (e: React.PointerEvent) => { e.stopPropagation(); toggleSelect(w.id, e.shiftKey); }
        };

        if (w.type === "text") {
          const st = getStyleFor(w);
          const text = getTextFor(w);
          return (
            <div {...common} role="textbox" aria-label="Text">
              <div
                className="w-full h-full outline outline-1 outline-transparent hover:outline-gray-300 rounded"
                style={{ color: st.color, fontWeight: st.bold?700:400, fontStyle: st.italic?"italic":"normal", textDecoration: st.underline?"underline":"none", fontSize: st.fontSize, fontFamily: st.fontFamily, textAlign: st.align }}
                contentEditable suppressContentEditableWarning
                onBlur={(e) => text.set(e.currentTarget.innerText)}
              >
                {text.value ?? "Text"}
              </div>
            </div>
          );
        }

        if (w.type === "image") {
          const st = getStyleFor(w);
          return (
            <div {...common} role="img" aria-label="Image">
              <img src={w.src} alt={w.alt ?? ""} className="w-full h-full object-contain rounded" style={{ opacity: st.opacity }} />
            </div>
          );
        }

        if (w.type === "sticky") {
          const st = getStyleFor(w);
          return (
            <div {...common} role="note" aria-label="Sticky" className={`${common.className} rounded-lg shadow`}>
              <div className="w-full h-full p-2" style={{ background: st.fill ?? "#FFD86B", color: "#333", border: `1px solid ${st.stroke ?? "#333"}`, opacity: st.opacity ?? 1 }}>
                <div contentEditable suppressContentEditableWarning className="text-sm font-medium">{w.data?.text ?? "Sticky"}</div>
              </div>
            </div>
          );
        }

        // أشكال أساسية
        if (w.type === "shape") {
          const st = getStyleFor(w);
          const radius = st.radius ?? 8;
          if (w.kind === "ellipse") {
            return (
              <svg {...common as any} viewBox={`0 0 ${w.w} ${w.h}`} role="figure" aria-label="Ellipse">
                <ellipse cx={w.w/2} cy={w.h/2} rx={w.w/2} ry={w.h/2} fill={st.fill ?? "#fff"} stroke={st.stroke ?? "#111"} opacity={st.opacity ?? 1} />
              </svg>
            );
          }
          if (w.kind === "triangle") {
            return (
              <svg {...common as any} viewBox={`0 0 ${w.w} ${w.h}`} role="figure" aria-label="Triangle">
                <polygon points={`${w.w/2},0 ${w.w},${w.h} 0,${w.h}`} fill={st.fill ?? "#fff"} stroke={st.stroke ?? "#111"} opacity={st.opacity ?? 1} />
              </svg>
            );
          }
          if (w.kind === "diamond") {
            return (
              <svg {...common as any} viewBox={`0 0 ${w.w} ${w.h}`} role="figure" aria-label="Diamond">
                <polygon points={`${w.w/2},0 ${w.w},${w.h/2} ${w.w/2},${w.h} 0,${w.h/2}`} fill={st.fill ?? "#fff"} stroke={st.stroke ?? "#111"} opacity={st.opacity ?? 1} />
              </svg>
            );
          }
          // rect
          return (
            <div {...common} role="figure" aria-label="Rectangle" style={{ ...common.style, background: st.fill ?? "#fff", border: `1px solid ${st.stroke ?? "#111"}`, borderRadius: radius, opacity: st.opacity ?? 1 }} />
          );
        }

        // عناصر ذكية (Placeholder بسيط؛ سيتم استبداله بمكوّناتها)
        if (w.type === "smart") {
          return (
            <div {...common} aria-label={`Smart:${w.kind}`} className="rounded border bg-white grid place-items-center text-xs text-gray-600">
              {w.kind}
            </div>
          );
        }

        // افتراضي
        return <div {...common} className="rounded border bg-white/40" />;
      })}
    </div>
  );
};
export default WidgetsLayer;
