
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
  return (
    <div
      className={`rounded-[28px] bg-white/90 border-none shadow glass-enhanced flex flex-col justify-between px-8 py-7 min-h-[95px] h-full ${className}`}
      style={{
        fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
        background: "rgba(255,255,255,0.84)",
        boxShadow: "0 2px 16px 0 rgba(54,52,53,0.06)",
      }}
    >
      <div className="flex flex-row justify-between items-center gap-2 h-[38px] mb-1">
        <div className="flex flex-col items-start justify-start flex-1 min-w-0">
          <span className="text-base font-bold text-[#23272f] mb-0.5">{title}</span>
          <span className="text-xs text-gray-500 font-arabic">{note ?? "هذا النص مثال للشكل النهائي"}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="block text-2xl font-extrabold text-[#23272f]">{value}</span>
          <span className="block text-xs text-gray-600 mt-0.5 text-end">{label}</span>
        </div>
      </div>
      {/* شريط بياني وهمي */}
      {renderBar && (
        <div className="w-full flex items-center mt-1 mb-1">
          {/* بار وهمي مطابق للمرجع */}
          <div className="flex-1 h-3.5 rounded-full bg-[#e2e9e6] overflow-hidden flex flex-row">
            <div className="bg-[#13181b] h-full" style={{ width: "68%" }}></div>
            <div className="bg-[#c8faee] h-full" style={{ width: "25%" }}></div>
          </div>
        </div>
      )}
      {/* رسم خط مبدئي */}
      {renderLine && (
        <div className="w-full flex items-center mt-2">
          {/* خط SVG مبسط */}
          <svg height="36" width="99%" viewBox="0 0 110 35">
            <polyline
              fill="none"
              stroke="#6bc5bc"
              strokeWidth="2.5"
              points="1,22 25,19 43,10 70,30 88,17 109,13"
            />
            <circle cx="25" cy="19" r="2.7" fill="#19b2a2" opacity="0.8" />
            <circle cx="70" cy="30" r="2.7" fill="#b8e6e3" opacity="0.8" />
          </svg>
        </div>
      )}
    </div>
  );
};
