
import React from "react";
import { GenericCard } from "@/components/ui/GenericCard";
import { Briefcase, Users } from "lucide-react";

const stats = [
  {
    label: "إجمالي المشاريع",
    value: 38,
    icon: <Briefcase size={20} color="#23272f" />,
  },
  {
    label: "عدد المدراء",
    value: 7,
    icon: <Users size={20} color="#23272f" />,
  }
];

export const ProjectsOverview: React.FC = () => (
  <GenericCard
    adminBoardStyle
    hover
    padding="md"
    className="relative group min-h-[192px] flex flex-col justify-start items-end shadow-none"
  >
    <div className="flex flex-col w-full h-full text-right">
      <h4 className="text-xl font-bold leading-[1.4] text-[#23272f] mt-1 mb-0 w-full">
        نظرة عامة
      </h4>
      <div className="text-soabra-text-secondary text-base mb-3 mt-1 w-full text-[#23272f]">
        إحصائيات المشاريع
      </div>
      <div className="flex flex-row-reverse gap-6 w-full mb-2 items-end mt-2">
        {stats.map(stat => (
          <div
            key={stat.label}
            className="flex flex-col items-end gap-1 w-max"
            style={{ fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif' }}
          >
            <div className="font-bold text-2xl text-[#23272f] flex items-center gap-1">
              {stat.value} <span className="ml-1">{stat.icon}</span>
            </div>
            <div className="text-xs text-[#23272f] font-medium">{stat.label}</div>
          </div>
        ))}
      </div>
      {/* Hover details */}
      <div
        className="absolute left-4 top-2 opacity-0 group-hover:opacity-100 
          transition-all pointer-events-none z-30 min-w-[110px] p-2 text-xs rounded-xl
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
