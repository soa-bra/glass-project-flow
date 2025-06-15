
import React from "react";
import { GenericCard } from "@/components/ui/GenericCard";
import { Briefcase, Users, ListTodo, Activity } from "lucide-react";

const stats = [
  {
    label: "إجمالي المشاريع",
    value: 38,
    icon: <Briefcase size={18} color="#23272f" />,
    color: "text-cyan-800"
  },
  {
    label: "عدد المدراء",
    value: 7,
    icon: <Users size={18} color="#23272f" />,
    color: "text-fuchsia-800"
  },
  {
    label: "المهام المفتوحة",
    value: 21,
    icon: <ListTodo size={18} color="#23272f" />,
    color: "text-amber-700"
  },
  {
    label: "مشاريع نشطة",
    value: 5,
    icon: <Activity size={18} color="#23272f" />,
    color: "text-green-700"
  }
];

export const ProjectsOverview: React.FC = () => (
  <GenericCard adminBoardStyle hover className="relative group min-h-[250px]">
    <div
      className="flex flex-col items-end text-right w-full h-full gap-1"
      style={{ fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif' }}
    >
      <h4 className="text-lg font-bold mb-1 text-[#23272f] w-full">إحصائيات المشاريع</h4>
      <div className="text-soabra-text-secondary text-sm mb-4 w-full text-[#23272f]">
        لمحة سريعة عن مؤشرات مشاريع الإدارة
      </div>
      {/* الجدول الإحصائي في صفين */}
      <div className="grid grid-cols-2 gap-y-4 gap-x-5 w-full min-h-[140px]">
        {stats.map(stat => (
          <div
            key={stat.label}
            className="flex items-center justify-end gap-2 bg-soabra-solid-bg/80 rounded-xl py-4 px-4 shadow group-hover:scale-105 transition"
            style={{
              minWidth: 0,
              fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif'
            }}
          >
            <div className={`font-bold text-xl text-[#23272f]`}>{stat.value}</div>
            <div className="mr-1">{stat.icon}</div>
            <div className="text-xs font-semibold text-[#23272f] whitespace-nowrap text-ellipsis overflow-hidden">{stat.label}</div>
          </div>
        ))}
      </div>
      {/* تفاصيل عند التحويم */}
      <div
        className="absolute left-4 top-2 opacity-0 group-hover:opacity-100 
          transition-all pointer-events-none z-30 min-w-[120px] p-2 text-xs rounded-xl
          bg-white/80 shadow border text-right text-[#23272f]"
        style={{
          fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
          backdropFilter: "blur(20px)"
        }}
      >
        لمحة سريعة عن المشاريع والإدارة.
      </div>
    </div>
  </GenericCard>
);
