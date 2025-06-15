
import React from "react";

interface ScoreCircleStatCardProps {
  value: number; // نسبة
  note: string;
  className?: string;
}

export const ScoreCircleStatCard: React.FC<ScoreCircleStatCardProps> = ({
  value,
  note,
  className = "",
}) => {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / 100) * circumference;

  return (
    <div
      className={`rounded-[28px] bg-[#eaf7fb]/80 border-none glass-enhanced shadow flex flex-col items-end px-7 py-7 min-h-[112px] h-full ${className}`}
      style={{
        fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
        background: "rgba(226, 247, 252, 0.82)",
      }}
    >
      <div className="w-full text-base font-bold text-[#23272f] mb-2 mt-0.5">نسبة</div>
      <div className="flex items-center gap-3 w-full justify-between">
        {/* دائرة النسبة الدائرية */}
        <div className="relative w-[95px] h-[95px]">
          <svg width="95" height="95">
            <circle
              cx="47.5"
              cy="47.5"
              r={radius}
              fill="none"
              stroke="#e1f1f7"
              strokeWidth="7"
            />
            <circle
              cx="47.5"
              cy="47.5"
              r={radius}
              fill="none"
              stroke="#13181b"
              strokeWidth="7"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - progress}
              strokeLinecap="round"
              style={{
                transition: "stroke-dashoffset 1.1s cubic-bezier(.21,1.02,.73,1)",
                filter: "drop-shadow(0px 2px 8px #a0c4ea33)",
              }}
            />
          </svg>
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[1.65rem] font-extrabold text-[#23272f] text-center">
            %{value}
          </span>
        </div>
        <div className="mr-1 flex flex-col items-end">
          <div className="text-xs font-bold text-gray-600 mb-1">سنوية</div>
          <div className="text-xs text-gray-600">{note}</div>
        </div>
      </div>
    </div>
  );
};
