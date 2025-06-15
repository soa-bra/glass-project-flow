
import React from "react";
import { GenericCard } from "@/components/ui/GenericCard";
import { Briefcase, Users } from "lucide-react";

const stats = [
  {
    label: "إجمالي المشاريع",
    value: 38,
    icon: <Briefcase size={18} color="#23272f" />,
  },
  {
    label: "عدد المدراء",
    value: 7,
    icon: <Users size={18} color="#23272f" />,
  }
];

export const ProjectsOverview: React.FC = () => (
  <GenericCard adminBoardStyle hover padding="md" className="relative group min-h-[180px] flex flex-col justify-between">
    <div className="flex flex-col items-end text-right w-full h-full justify-between">
      <h4 className="text-lg font-bold mb-0 text-[#23272f] w-full leading-tight mt-1">نظرة عامة</h4>
      <div className="text-soabra-text-secondary text-sm mb-4 mt-1 w-full text-[#23272f]">
        إحصائيات المشاريع
      </div>
      <div className="flex flex-col gap-4 w-full mb-2">
        {stats.map(stat => (
          <div
            key={stat.label}
            className="flex items-center justify-end gap-2 w-full"
            style={{ fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif' }}
          >
            <div className="font-bold text-xl text-[#23272f]">{stat.value}</div>
            <div>{stat.icon}</div>
            <div className="text-xs text-[#23272f] font-medium">{stat.label}</div>
          </div>
        ))}
      </div>
      {/* Hover details */}
      <div
        className="absolute left-4 top-2 opacity-0 group-hover:opacity-100 
          transition-all pointer-events-none z-30 min-w-[120px] p-2 text-xs rounded-xl
          bg-white/80 shadow border text-right text-[#23272f]"
        style={{
          fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
          backdropFilter: "blur(20px)"
        }}
      >
        نظرة عامة مختصرة حول عدد المشاريع وعدد المدراء.
      </div>
    </div>
  </GenericCard>
);
