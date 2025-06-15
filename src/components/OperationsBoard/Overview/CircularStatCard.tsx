
import React from "react";

interface CircularStatCardProps {
  label: string;
  value: number | string;
  suffix?: string;
  desc: string;
  color: string;
  icon: React.ReactNode;
  percentage?: number;
  className?: string;
}
const SIZE = 56;
const STROKE_WIDTH = 7;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCLE = 2 * Math.PI * RADIUS;

export const CircularStatCard: React.FC<CircularStatCardProps> = ({
  label,
  value,
  desc,
  color,
  icon,
  className,
  percentage = 100, // دائري ممتلئ افتراضياً
  suffix
}) => {
  const progress = Math.max(0, Math.min(percentage, 100));
  const dash = (progress / 100) * CIRCLE;
  return (
    <div
      className={`glass-enhanced flex flex-col justify-center items-end rounded-2xl min-h-[96px] px-4 py-2 shadow animate-fade-in border border-white/50 bg-white/40 transition-all duration-300 max-w-[95vw] ${className ?? ""
        }`}
      style={{
        fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
        backdropFilter: "blur(20px)",
      }}
    >
      <div className="flex items-center gap-3 pr-1">
        <span
          className="flex items-center justify-center relative"
          style={{ width: SIZE, height: SIZE }}
        >
          <svg width={SIZE} height={SIZE}>
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              stroke="#eee"
              strokeWidth={STROKE_WIDTH}
              fill="none"
              opacity={0.53}
            />
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              stroke={color}
              strokeWidth={STROKE_WIDTH}
              fill="none"
              strokeDasharray={CIRCLE}
              strokeDashoffset={CIRCLE - dash}
              strokeLinecap="round"
              style={{
                transition: "stroke-dashoffset 1s cubic-bezier(.21,1.02,.73,1)",
                filter: `drop-shadow(0px 2px 8px ${color}22)`,
              }}
            />
          </svg>
          <span
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-0.5 bg-white/80 rounded-full shadow"
            style={{
              fontSize: "1.26rem",
              fontWeight: 800,
              color: "#181b29",
              minWidth: 27,
              textAlign: "center",
            }}
          >
            {value}
            {suffix ? <span style={{ fontWeight: 500, fontSize: 13, marginInlineStart: 2 }}>{suffix}</span> : ""}
          </span>
          <span className="absolute left-[-16px] top-0 text-xl">{icon}</span>
        </span>
        <span>
          <div className="text-base font-bold text-[#181b29]">{label}</div>
          <div className="text-xs text-[#6B7280] font-medium">{desc}</div>
        </span>
      </div>
    </div>
  );
};
