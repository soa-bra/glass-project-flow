
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
  // نفس تصميم البطاقة الدائرية للنسبة المئوية في المرجع
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / 100) * circumference;

  return (
    <div
      className={`rounded-[26px] bg-[#F9FEFE] border border-white/40 shadow glass-enhanced flex flex-col items-end px-6 py-5 min-h-[143px] h-full ${className}`}
      style={{
        fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
      }}
    >
      <div className="w-full text-base font-bold text-[#292D34] mb-2 mt-0.5">نسبة</div>
      <div className="flex items-center gap-4 w-full justify-between">
        <div className="relative w-[85px] h-[85px]">
          <svg width="85" height="85">
            <circle
              cx="42.5"
              cy="42.5"
              r={radius}
              fill="none"
              stroke="#E7F6FF"
              strokeWidth="7"
            />
            <circle
              cx="42.5"
              cy="42.5"
              r={radius}
              fill="none"
              stroke="#A0C4EA"
              strokeWidth="7"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - progress}
              strokeLinecap="round"
              style={{
                transition: "stroke-dashoffset 1s cubic-bezier(.21,1.02,.73,1)",
                filter: "drop-shadow(0px 2px 8px #A0C4EA)",
              }}
            />
          </svg>
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[1.57rem] font-extrabold text-[#23272f] text-center">
            %{value}
          </span>
        </div>
        <div className="mr-1">
          <div className="text-xs font-bold text-gray-500 mb-1">سنوية</div>
          <div className="text-xs text-gray-500">{note}</div>
        </div>
      </div>
    </div>
  );
};
