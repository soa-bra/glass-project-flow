
import React from "react";

const stats = [
  {
    label: "عدد المستخدمين",
    value: 150,
    desc: "المستخدمين في المنصة",
    color: "flat-info",
    icon: "users",
  },
  {
    label: "الطلبات",
    value: 5,
    desc: "طلبات جديدة اليوم",
    color: "flat-success",
    icon: "chart-bar",
  },
  {
    label: "عقود منتهية",
    value: 3,
    desc: "بحاجة لتجديد",
    color: "flat-warning",
    icon: "chart-line",
  },
  {
    label: "متأخر",
    value: 3,
    desc: "مهام متأخرة",
    color: "flat-crimson",
    icon: "user",
  },
];

// أيقونات lucide-react معتمدة بالأسماء المذكورة في المسموح فقط
import {
  Users,
  ChartBar,
  ChartLine,
  User,
} from "lucide-react";

const iconMap = {
  users: Users,
  "chart-bar": ChartBar,
  "chart-line": ChartLine,
  user: User,
};

export const InstantStatsRow = () => (
  <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mb-5">
    {stats.map((stat, idx) => {
      const Icon = iconMap[stat.icon];
      return (
        <div
          key={stat.label}
          className={`
            ${stat.color} 
            flex flex-row items-center justify-between rounded-2xl px-6 py-5 min-h-[92px] 
            shadow-lg transition-transform duration-200 hover:scale-105 hover:shadow-2xl
            font-arabic relative
          `}
          style={{
            fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
            direction: "rtl",
          }}
        >
          <div className="flex flex-col items-start">
            <div className="text-base font-bold drop-shadow-sm">{stat.label}</div>
            <div className="text-xs opacity-85">{stat.desc}</div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-2xl font-extrabold drop-shadow-md">{stat.value}</span>
            <span className="mt-0.5 text-xs text-white/90"> </span>
          </div>
          <span className="absolute left-4 top-4 opacity-45">
            <Icon size={32} strokeWidth={2} />
          </span>
        </div>
      );
    })}
  </div>
);
