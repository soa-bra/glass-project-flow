"use client";
import React from "react";
import { useCanvas } from "@/src/features/planning/hooks/useCanvas";
import { routeSimple } from "@/src/features/planning/utils/routing";

const ConnectorsLayer: React.FC = () => {
  const { getConnectors, getWidgetById, getStyleFor } = useCanvas();
  const connectors = getConnectors();

  return (
    <svg aria-label="Connectors Layer" className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible">
      {connectors.map((c:any) => {
        const a = getWidgetById(c.sourceId);
        const b = getWidgetById(c.targetId);
        if (!a || !b) return null;
        const path = routeSimple(a, b, c.style?.orthogonal);
        const st = c.style ?? {};
        return (
          <g key={c.id} opacity={st.opacity ?? 1}>
            <path d={path} fill="none" stroke={st.color ?? "#475569"} strokeWidth={st.width ?? 2} markerEnd={st.arrow ? "url(#arrow)" : undefined}/>
            {c.label && (
              <text>
                <textPath href={`#${c.id}`} startOffset="50%" textAnchor="middle" fill="#0f172a" fontSize="12">{c.label}</textPath>
              </text>
            )}
          </g>
        );
      })}
      <defs>
        <marker id="arrow" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#475569" />
        </marker>
      </defs>
    </svg>
  );
};
export default ConnectorsLayer;
