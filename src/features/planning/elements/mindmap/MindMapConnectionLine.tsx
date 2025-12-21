import React from "react";
import { createBezierPath } from "@/types/mindmap-canvas";

interface MindMapConnectionLineProps {
  startPosition: { x: number; y: number };
  endPosition: { x: number; y: number };
  startAnchor: "top" | "bottom" | "left" | "right";
  color?: string;
  isSnapped?: boolean; // ✅ هل الموصل في حالة snap مع anchor
}

/**
 * خط التوصيل المؤقت أثناء السحب
 * - شفاف أثناء السحب العادي
 * - متوهج عند الاقتراب من anchor (snap)
 */
const MindMapConnectionLine: React.FC<MindMapConnectionLineProps> = ({
  startPosition,
  endPosition,
  startAnchor,
  color = "#3DA8F5",
  isSnapped = false,
}) => {
  // حساب حدود SVG
  const padding = 50;
  const minX = Math.min(startPosition.x, endPosition.x) - padding;
  const minY = Math.min(startPosition.y, endPosition.y) - padding;
  const maxX = Math.max(startPosition.x, endPosition.x) + padding;
  const maxY = Math.max(startPosition.y, endPosition.y) + padding;

  // تحديد نقطة الربط المفترضة للنهاية بناءً على الاتجاه
  const dx = endPosition.x - startPosition.x;
  const dy = endPosition.y - startPosition.y;
  let endAnchor: "top" | "bottom" | "left" | "right" = "left";

  if (Math.abs(dx) > Math.abs(dy)) {
    endAnchor = dx > 0 ? "left" : "right";
  } else {
    endAnchor = dy > 0 ? "top" : "bottom";
  }

  const path = createBezierPath(startPosition, endPosition, startAnchor, endAnchor);

  return (
    <svg
      className="absolute pointer-events-none"
      style={{
        left: minX,
        top: minY,
        width: maxX - minX,
        height: maxY - minY,
        overflow: "visible",
        zIndex: 1000,
      }}
    >
      {/* ✅ توهج الخلفية عند snap */}
      {isSnapped && (
        <path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth={6}
          strokeLinecap="round"
          opacity={0.2}
          style={{
            transform: `translate(${-minX}px, ${-minY}px)`,
            filter: `blur(2px)`,
          }}
        />
      )}

      {/* ✅ الخط الرئيسي - شفاف أثناء السحب، متوهج عند snap */}
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={isSnapped ? 3 : 2}
        strokeDasharray={isSnapped ? "none" : "8 4"}
        strokeLinecap="round"
        className={isSnapped ? "" : "animate-pulse"}
        style={{
          transform: `translate(${-minX}px, ${-minY}px)`,
          opacity: isSnapped ? 1 : 0.5,
          filter: isSnapped ? `drop-shadow(0 0 6px ${color})` : "none",
          transition: "all 0.15s ease-out",
        }}
      />

      {/* ✅ نقطة النهاية - تتوهج عند snap */}
      <circle
        cx={endPosition.x - minX}
        cy={endPosition.y - minY}
        r={isSnapped ? 8 : 6}
        fill={color}
        className={isSnapped ? "" : "animate-pulse"}
        style={{
          opacity: isSnapped ? 1 : 0.6,
          filter: isSnapped ? `drop-shadow(0 0 8px ${color})` : "none",
          transition: "all 0.15s ease-out",
        }}
      />

      {/* ✅ حلقة التوهج الخارجية عند snap */}
      {isSnapped && (
        <circle
          cx={endPosition.x - minX}
          cy={endPosition.y - minY}
          r={8}
          fill="none"
          stroke={color}
          strokeWidth={2}
          opacity={0.2}
          style={{
            animation: "pulse 1s ease-in-out infinite",
          }}
        />
      )}
    </svg>
  );
};

export default MindMapConnectionLine;
