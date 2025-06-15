
import React from "react";

export const ProjectSummaryCard: React.FC = () => {
  // تلخيص المشاريع ـ مخطط أعمدة كما المرجع
  return (
    <div
      className="rounded-[28px] bg-[#bee5f5]/90 border-none glass-enhanced shadow flex flex-col px-7 py-6 h-full min-h-[128px]"
      style={{
        fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
        background: "rgba(187,229,245,0.90)",
        boxShadow: "0 2px 16px 0 rgba(84,172,224,0.09)",
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="block font-bold text-[#181B29] text-lg">ملخص المشاريع</span>
        <div className="flex items-center gap-1">
          <span className="text-[#9da3ad] font-bold text-[1.13rem] cursor-pointer">... </span>
        </div>
      </div>
      {/* مخطط الأعمدة المبسط - مطابق للمرجع */}
      <div className="w-full flex flex-row gap-2 h-[56px] items-end mb-2 px-1">
        {[40, 100, 109, 37, 80].map((val, idx) => (
          <div
            key={idx}
            className="flex-1 rounded-full"
            style={{
              height: `${val}px`,
              background:
                idx === 2
                  ? "linear-gradient(170deg, #13181b 0%, #b8e8f7 100%)"
                  : "#e7f6fc",
              marginLeft: idx !== 4 ? "8px" : 0,
              boxShadow: idx === 2 ? "0px 2px 16px rgba(13,32,43,.19)" : "none",
              minWidth: "24px"
            }}
          ></div>
        ))}
      </div>
      {/* قائمة الأرقام */}
      <ul className="text-base text-gray-700 flex flex-col gap-y-1 mt-1 pr-2">
        <li>
          <span className="font-bold text-[#23272f] ml-2">140</span>
          <span className="mx-1 text-xs">مشروع فعال</span>
        </li>
        <li>
          <span className="font-bold text-[#23272f] ml-2">95</span>
          <span className="mx-1 text-xs">تحت الإنشاء</span>
        </li>
        <li>
          <span className="font-bold text-[#23272f] ml-2">50</span>
          <span className="mx-1 text-xs">مكتمل</span>
        </li>
        <li>
          <span className="font-bold text-[#23272f] ml-2">20</span>
          <span className="mx-1 text-xs">واقف مؤقتاً</span>
        </li>
        <li>
          <span className="font-bold text-[#23272f] ml-2">02</span>
          <span className="mx-1 text-xs">ملغي</span>
        </li>
      </ul>
    </div>
  );
};
