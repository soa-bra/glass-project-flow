
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
  // دائري الزوايا والألوان من المرجع، دائرة كبيرة + مقاييس جانبية
  return (
    <div
      className={`rounded-[36px] bg-gradient-to-br from-[#E1F7F2] to-[#E0F1FB] border border-white/45 glass-enhanced shadow flex flex-col px-7 py-6 h-full min-h-[330px] max-w-full ${className}`}
      style={{
        fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
      }}
    >
      {/* صف العنوان العلوي */}
      <div className="flex items-center justify-between mb-3 w-full">
        <div className="flex gap-2 items-center">
          <span className="block font-bold text-[#23272f] text-xl">{label}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[#9da3ad] font-bold text-[1.35rem] cursor-pointer">... </span>
        </div>
      </div>
      {/* دائرة مركزية للقيمة */}
      <div className="flex flex-1 flex-col items-center justify-center gap-1 relative">
        <svg width="142" height="142" className="mb-2 block">
          <defs>
            <linearGradient id="leadScoreCircle" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#CBEDDD" />
              <stop offset="90%" stopColor="#87D6DD" />
            </linearGradient>
          </defs>
          <circle
            cx="71"
            cy="71"
            r="64"
            fill="#fff"
            opacity={0.95}
            stroke="url(#leadScoreCircle)"
            strokeWidth="4"
          />
          {/* خلفية مخطط دائري ملون */}
          <circle
            cx="71"
            cy="71"
            r="60"
            fill="none"
            stroke="#BAEADD"
            strokeWidth="7"
            opacity={0.42}
          />
          <circle
            cx="71"
            cy="71"
            r="60"
            fill="none"
            stroke="#A7E9E1"
            strokeWidth="7"
            strokeDasharray={377}
            strokeDashoffset={377 - (value / 100) * 377}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 1s cubic-bezier(.21,1.02,.73,1)",
              filter: "drop-shadow(0px 2px 8px #B1D9B8)",
            }}
          />
        </svg>
        <div className="absolute top-[65px] left-1/2 -translate-x-1/2 text-center">
          <span className="block text-[2.6rem] font-extrabold text-[#23272f]">{value}</span>
          <span className="block text-xs text-gray-600">Lead Score</span>
        </div>

        {/* قيم جانبية عامودية */}
        <div className="absolute flex flex-col gap-y-3 right-9 top-2 items-end">
          {circleData.map((item, idx) => (
            <div key={idx} className="flex flex-col items-end">
              <span className="font-extrabold text-[#23272f] text-lg leading-tight">{item.value.toString().padStart(2, "0")}</span>
              <span className="text-xs text-gray-500 font-semibold">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
      {/* أسفل: نصوص مساعدة */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
        <span className="text-xs text-gray-500">هذا النص مثال للشكل النهائي</span>
        <span className="text-xs text-gray-500">هذا النص مثال للشكل النهائي</span>
      </div>
    </div>
  );
};
