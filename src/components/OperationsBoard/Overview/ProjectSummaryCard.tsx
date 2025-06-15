
import React from "react";

export const ProjectSummaryCard: React.FC = () => {
  // تلخيص المشاريع ـ تصميم شبيه (مخطط قضبان بسيط + قائمة أرقام)
  return (
    <div
      className="rounded-[30px] bg-gradient-to-br from-[#CDEBF7] to-[#ECF8FD] border border-white/40 glass-enhanced shadow flex flex-col px-6 py-5 h-full min-h-[205px]"
      style={{
        fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="block font-bold text-[#181B29] text-lg">ملخص المشاريع</span>
        <div className="flex items-center gap-1">
          <span className="text-[#9da3ad] font-bold text-[1.11rem] cursor-pointer">... </span>
        </div>
      </div>
      {/* مخطط الأعمدة - تبسيط */}
      <div className="w-full flex flex-row gap-1 h-[54px] items-end mb-2">
        {[140, 95, 50, 20, 2].map((val, idx) => (
          <div
            key={idx}
            className={`flex-1 bg-[#23272f] rounded-xl`}
            style={{
              height: `${val / 1.7}px`,
              marginLeft: idx !== 4 ? "8px" : 0,
              background: idx === 0
                ? "linear-gradient(180deg, #35B6F0 0%, #C3EDFF 100%)"
                : "#C5E4F7",
              transition: "height .6s",
            }}
          ></div>
        ))}
      </div>
      {/* قائمة الأرقام */}
      <ul className="text-sm text-gray-700 flex flex-col gap-y-1 mt-1">
        <li>
          <span className="font-bold text-[#181b29]">140</span>
          <span className="mx-1">مشروع فعال</span>
        </li>
        <li>
          <span className="font-bold text-[#181b29]">95</span>
          <span className="mx-1">تحت الإنشاء</span>
        </li>
        <li>
          <span className="font-bold text-[#181b29]">50</span>
          <span className="mx-1">مكتمل</span>
        </li>
        <li>
          <span className="font-bold text-[#181b29]">20</span>
          <span className="mx-1">واقف مؤقتاً</span>
        </li>
        <li>
          <span className="font-bold text-[#181b29]">02</span>
          <span className="mx-1">ملغي</span>
        </li>
      </ul>
    </div>
  );
};
