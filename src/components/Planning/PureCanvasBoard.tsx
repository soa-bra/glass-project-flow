import React from "react";
import { useCamera } from "./canvasStore";
import { getGridStyle } from "./canvasUtils";

type Props = {
  /** محتوى العالم (World) — يُطبق عليه Transform الكاميرا */
  children?: React.ReactNode;
  /** طبقة Overlay على مستوى الشاشة (Screen) — بدون Transform */
  overlay?: React.ReactNode;
};

export default function PureCanvasBoard({ children, overlay }: Props) {
  const camera = useCamera();

  return (
    <div className="relative w-full h-full overflow-hidden bg-neutral-100">
      {/* Grid (Screen layer but aligned to World via camera) */}
      <div className="absolute inset-0 pointer-events-none" style={getGridStyle(camera)} />

      {/* World (transformed) */}
      <div
        className="absolute inset-0 origin-top-left will-change-transform"
        style={{
          transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.zoom})`,
        }}
      >
        {children}
      </div>

      {/* Overlay (screen space) */}
      {overlay ? <div className="absolute inset-0 pointer-events-none">{overlay}</div> : null}
    </div>
  );
}
