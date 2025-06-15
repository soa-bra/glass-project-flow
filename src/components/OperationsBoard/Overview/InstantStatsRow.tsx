
import React from "react";
import { TrendingUp, ListCheck, FileText, Clock } from "lucide-react";
import { CircularStatCard } from "./CircularStatCard";

// البيانات كما هو بالمطلوب (ألوان متباينة من نظام الألوان)
const stats = [
  {
    label: "عدد المستخدمين",
    value: 150,
    desc: "المستخدمين في المنصة",
    icon: <TrendingUp size={20} strokeWidth={2} />,
    color: "#0099FF",
    percentage: 90,
  },
  {
    label: "الطلبات",
    value: 5,
    desc: "طلبات جديدة اليوم",
    icon: <ListCheck size={20} strokeWidth={2} />,
    color: "#16b86e",
    percentage: 40,
  },
  {
    label: "عقود منتهية",
    value: 3,
    desc: "بحاجة لتجديد",
    icon: <FileText size={20} strokeWidth={2} />,
    color: "#F59E42",
    percentage: 20,
  },
  {
    label: "متأخر",
    value: 3,
    desc: "مهام متأخرة",
    icon: <Clock size={20} strokeWidth={2} />,
    color: "#EF4444",
    percentage: 10,
  }
];

export const InstantStatsRow = () => (
  <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 mt-1">
    {stats.map((stat, idx) => (
      <CircularStatCard
        key={stat.label}
        {...stat}
        className={`delay-[${idx * 70}ms]`}
      />
    ))}
  </div>
);
