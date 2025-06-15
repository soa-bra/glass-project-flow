
import React from "react";
import { TrendingUp, TrendingDown, Clock, FileText, ListCheck } from "lucide-react";

// بيانات العناصر العلوية كما هو مطلوب
const stats = [
  {
    label: "عدد المستخدمين",
    value: 150,
    desc: "المستخدمين في المنصة",
    icon: <TrendingUp size={22} strokeWidth={1.5} />,
    color: "#3B82F6",
  },
  {
    label: "الطلبات",
    value: 5,
    desc: "طلبات جديدة اليوم",
    icon: <ListCheck size={22} strokeWidth={1.5} />,
    color: "#10B981",
  },
  {
    label: "عقود منتهية",
    value: 3,
    desc: "بحاجة لتجديد",
    icon: <FileText size={22} strokeWidth={1.5} />,
    color: "#F59E42",
  },
  {
    label: "متأخر",
    value: 3,
    desc: "مهام متاخرة",
    icon: <Clock size={22} strokeWidth={1.5} />,
    color: "#EF4444",
  },
];

export const InstantStatsRow = () => (
  <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 mt-1">
    {stats.map((stat, idx) => (
      <div
        key={stat.label}
        className={`
          glass-enhanced
          flex flex-col justify-center items-end
          rounded-2xl min-h-[84px] px-3 py-2
          shadow
          animate-fade-in delay-${idx * 50}
          border border-white/50
          transition-all duration-300
        `}
        style={{
          fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
          background: "rgba(255,255,255,0.40)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="flex items-center gap-3">
          <span
            className="bg-white/50 rounded-full p-2 flex items-center justify-center"
            style={{ color: stat.color, boxShadow: "0 1px 8px rgba(0,0,0,0.04)" }}
          >
            {stat.icon}
          </span>
          <span className="text-2xl font-bold text-[#181b29] pt-0.5">{stat.value}</span>
        </div>
        <div className="text-base font-semibold text-[#23272f] mt-2">{stat.label}</div>
        <div className="text-xs text-[#6B7280] font-medium">{stat.desc}</div>
      </div>
    ))}
  </div>
);
