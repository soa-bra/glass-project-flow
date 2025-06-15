
import React from "react";

interface DataStatCardProps {
  title: string;
  value: number | string;
  label: string;
  note?: string;
  renderBar?: boolean;
  renderLine?: boolean;
  className?: string;
}

export const DataStatCard: React.FC<DataStatCardProps> = ({
  title,
  value,
  label,
  note,
  renderBar = false,
  renderLine = false,
  className = "",
}) => {
  // Datacard بتوزيع مشابه لبطاقة بيانات القيمة (النصوص يمين وقيمة كبيرة يسار)
  return (
    <div
      className={`rounded-[26px] bg-white/70 border border-white/40 shadow glass-enhanced flex flex-col justify-between px-6 py-3 min-h-[143px] h-full ${className}`}
      style={{
        fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
      }}
    >
      <div className="flex flex-row justify-between items-center gap-3">
        <div className="flex flex-col items-start justify-start flex-1 min-w-0">
          <span className="text-base font-bold text-[#181B29] mb-0.5">{title}</span>
          <span className="text-sm text-gray-500 font-arabic">{note ?? "هذا النص مثال للشكل النهائي"}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="block text-3xl font-extrabold text-[#23272f]">{value}</span>
          <span className="block text-xs text-gray-600 mt-0.5 text-end">{label}</span>
        </div>
      </div>
      {/* عناصر بصرية بناء على نوع البطاقة */}
      {renderBar && (
        <div className="w-full flex items-center mt-3">
          {/* بار وهمي */}
          <div className="flex-1 h-4 rounded-full bg-[#eee] overflow-hidden flex flex-row">
            <div className="bg-[#23272f] h-full" style={{ width: "70%" }}></div>
            <div className="bg-[#CFF6F1] h-full" style={{ width: "25%" }}></div>
          </div>
        </div>
      )}
      {renderLine && (
        <div className="w-full mt-2">
          {/* Placeholder LineChart Style فقط بصري وليس ديناميكي */}
          <svg height="38" width="100%" viewBox="0 0 110 38">
            <polyline
              fill="none"
              stroke="#A0C3F6"
              strokeWidth="3"
              points="0,28 20,23 40,19 55,34 75,15 92,23 110,19"
            />
          </svg>
        </div>
      )}
    </div>
  );
};
