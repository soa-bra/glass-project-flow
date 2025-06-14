
import React from "react";
import { CircleArrowUp, ArrowDown, Search } from "lucide-react";

const KPI_DATA = [
  {
    label: "المشاريع الفعّالة",
    value: 23,
    icon: <CircleArrowUp className="text-green-500" size={20} />,
    color: "bg-[#ccffe0]/70 text-[#22a95b]",
    hint: "عدد المشاريع الحالية ضمن الخطة."
  },
  {
    label: "متأخر أو متعثر",
    value: 5,
    icon: <ArrowDown className="text-yellow-500" size={20} />,
    color: "bg-[#fff7d2]/80 text-[#b29418]",
    hint: "عدد المشاريع بحاجة تدخل دعم أو متابعة."
  },
  {
    label: "نسبة الإنجاز",
    value: "78%",
    icon: <Search className="text-blue-400" size={20} />,
    color: "bg-[#d5f0fd]/70 text-[#2996a7]",
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
          cursor-pointer group font-arabic
        `}
        style={{
          fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
          backdropFilter: 'blur(20px) saturate(135%)'
        }}
      >
        <div className="flex items-center gap-2 text-xl mb-3 font-bold">
          {item.icon}
          <span>{item.value}</span>
        </div>
        <div className="text-xs font-medium mb-1 group-hover:opacity-70 transition-opacity">
          {item.label}
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity text-xs mt-2 bg-white/80 
                        p-2 rounded-lg shadow border border-gray-100 absolute translate-y-1 w-44 right-1 z-50 text-gray-700 text-right pointer-events-none">
          {item.hint}
        </div>
      </div>
    ))}
  </div>
)
