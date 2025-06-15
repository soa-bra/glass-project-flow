
import React from "react";

interface LeadingStatsCardProps {
  value: number;
  label: string;
  circleData: { value: number; label: string }[];
  className?: string;
}

export const LeadingStatsCard: React.FC<LeadingStatsCardProps> = ({
  value,
  label,
  circleData,
  className = "",
}) => {
  return (
    <div
      className={`rounded-[38px] bg-[#cff2dd]/60 border-none shadow-lg glass-enhanced flex flex-col px-8 py-7 h-full min-h-[390px] max-w-full ${className}`}
      style={{
        fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
        background: "rgba(209, 240, 220, 0.55)",
        boxShadow: "0 2px 36px 0 rgba(148,189,160,0.07)",
      }}
    >
      {/* صف العنوان العلوي */}
      <div className="flex items-center justify-between mb-2 w-full">
        <div className="flex gap-2 items-center">
          <span className="block font-bold text-[#23272f] text-xl">{label}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[#9da3ad] font-bold text-[1.25rem] cursor-pointer">... </span>
        </div>
      </div>
      {/* دائرة مركزية للقيمة */}
      <div className="flex flex-1 flex-col items-center justify-center gap-1 relative">
        <svg width="200" height="200" className="mb-2 block">
          <defs>
            <linearGradient id="rainbow" gradientTransform="rotate(80)">
              <stop offset="0%" stopColor="#85D8CE" />
              <stop offset="40%" stopColor="#41B7C4" />
              <stop offset="60%" stopColor="#9CEEBC" />
              <stop offset="100%" stopColor="#F9F871" />
            </linearGradient>
          </defs>
          {/* دائرة باهتة خارجية */}
          <circle cx={100} cy={100} r={92} fill="#fafdfb" opacity={0.96} />
          {/* مخطط القوس الدائري */}
          <circle
            cx={100}
            cy={100}
            r={85}
            fill="none"
            stroke="url(#rainbow)"
            strokeWidth="8"
            strokeDasharray={2 * Math.PI * 85}
            strokeDashoffset={(2 * Math.PI * 85 * (100 - value)) / 100}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 1.4s cubic-bezier(.21,1.02,.73,1)",
              filter: "drop-shadow(0 8px 34px rgba(74,175,162,0.24))"
            }}
          />
        </svg>
        <div className="absolute top-[92px] left-1/2 -translate-x-1/2 text-center w-full">
          <span className="block text-[3rem] font-extrabold text-[#23272f] mb-1">{value}</span>
          <span className="block text-base font-medium text-gray-900 opacity-60">Lead Score</span>
        </div>
        {/* القيم الجانبية عمودية يسار الدائرة */}
        <div className="absolute flex flex-col gap-y-6 right-8 top-10 items-end z-10">
          {circleData.map((item, idx) => (
            <div key={idx} className="flex flex-col items-end">
              <span className="font-extrabold text-[#23272f] text-xl leading-tight">{item.value.toString().padStart(2, "0")}</span>
              <span className="text-xs text-gray-600 font-semibold">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
      {/* أسفل: نصوص مساعدة */}
      <div className="flex flex-wrap gap-x-10 gap-y-1 mt-5">
        <span className="text-xs text-gray-600">هذا النص مثال للشكل النهائي</span>
        <span className="text-xs text-gray-600">هذا النص مثال للشكل النهائي</span>
      </div>
    </div>
  );
};
