
import React from "react";
import { CircleArrowUp, ArrowDown, Search } from "lucide-react";

const KPI_DATA = [
  {
    label: "المشاريع الفعّالة",
    value: 23,
    icon: <CircleArrowUp color="#23272f" size={20} />, // أيقونة سوداء
    color: "bg-soabra-success/20 text-[#23272f]",
    hint: "عدد المشاريع الحالية ضمن الخطة."
  },
  {
    label: "متأخر أو متعثر",
    value: 5,
    icon: <ArrowDown color="#23272f" size={20} />, // أيقونة سوداء
    color: "bg-soabra-warning/30 text-[#23272f]",
    hint: "عدد المشاريع بحاجة تدخل دعم أو متابعة."
  },
  {
    label: "نسبة الإنجاز",
    value: "78%",
    icon: <Search color="#23272f" size={20} />, // أيقونة سوداء
    color: "bg-soabra-primary-blue/10 text-[#23272f]",
    hint: "معدل متوسط نسبة التقدم العام."
  }
];

export const ProjectKPICards = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
    {KPI_DATA.map((item, idx) => (
      <div
        key={item.label}
        className={`
          rounded-2xl ${item.color} shadow hover:scale-105 hover:shadow-lg 
          transition-all duration-150 px-5 py-4 flex flex-col items-center 
          cursor-pointer group font-arabic relative
        `}
        style={{
          fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
          backdropFilter: 'blur(20px) saturate(135%)'
        }}
      >
        <div className="flex items-center gap-2 text-xl mb-3 font-bold text-[#23272f]">
          {item.icon}
          <span className="text-[#23272f]">{item.value}</span>
        </div>
        <div className="text-xs font-medium mb-1 group-hover:opacity-70 transition-opacity text-[#23272f]">
          {item.label}
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity text-xs mt-2 bg-white/80 
                        p-2 rounded-lg shadow border border-gray-100 absolute translate-y-1 w-44 right-1 z-50 text-[#23272f] text-right pointer-events-none">
          {item.hint}
        </div>
      </div>
    ))}
  </div>
)
