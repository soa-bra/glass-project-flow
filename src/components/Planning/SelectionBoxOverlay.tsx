import React from "react";

type Props = {
  rect: { x: number; y: number; w: number; h: number } | null;
};

export default function SelectionBoxOverlay({ rect }: Props) {
  if (!rect) return null;

  const x = Math.round(rect.x);
  const y = Math.round(rect.y);
  const w = Math.max(0, Math.round(rect.w));
  const h = Math.max(0, Math.round(rect.h));

  if (w === 0 || h === 0) return null;

  return (
    <div
      className="absolute"
      style={{
        left: x,
        top: y,
        width: w,
        height: h,
        border: "1px solid rgba(37, 99, 235, 0.9)",
        background: "rgba(37, 99, 235, 0.10)",
        borderRadius: 8,
      }}
    />
  );
}
