
import React from 'react';
import { GenericCard } from '@/components/ui/GenericCard';
import { AlertCircle, CalendarDays } from "lucide-react";

const deadlines = [
  {
    name: "مركز التطوير",
    due: "2024-07-18",
    manager: "سارة العنزي",
    status: "متأخر",
    tasksCount: 9
  },
  {
    name: "الحملة التسويقية",
    due: "2024-08-01",
    manager: "فهد القحطاني",
    status: "نشط",
    tasksCount: 7
  },
  {
    name: "منصة العملاء",
    due: "2024-08-25",
    manager: "ميساء",
    status: "نشط",
    tasksCount: 4
  }
];

export const ProjectsDeadlines: React.FC = () => (
  <GenericCard
    adminBoardStyle
    className="flex flex-col items-end w-full min-h-[253px] overflow-visible py-5"
    padding="sm"
  >
    <h4 className="text-lg font-bold mb-1 text-[#23272f] w-full text-right flex items-center gap-2" style={{ fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif' }}>
      <CalendarDays size={20} className="ml-2 text-cyan-800" />
      إحصائيات المشاريع
    </h4>
    <div className="text-soabra-text-secondary text-sm mb-4 w-full text-right" style={{ fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif' }}>
      أقرب المواعيد النهائية لتسليم المشاريع
    </div>
    <div className="flex flex-col gap-3 w-full">
      {deadlines.map((item, idx) => (
        <div
          key={idx}
          className={`
            flex flex-row-reverse items-center justify-between bg-white/60 rounded-2xl px-3 py-2
            border border-white/30 shadow transition
            ${idx === 0 ? "ring-2 ring-soabra-warning/50 font-bold" : ""}
          `}
          style={{ fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif', backdropFilter: "blur(20px)" }}
        >
          <div className="flex flex-row-reverse items-center gap-2">
            <span className="font-medium text-[#019883] text-sm">
              {item.tasksCount} مهام
            </span>
            <span className={`text-xs px-3 py-1 rounded-full font-semibold border
                ${item.status === "متأخر"
                  ? "bg-[#fff1d7] text-[#c76101] border-[#ffd38a]"
                  : "bg-[#eafae1] text-[#29936c] border-[#59cc87]"}
            `}>
              {item.status}
            </span>
          </div>
          <div className="flex-1 text-right ml-2">
            <div className="text-base font-bold text-[#23272f]">{item.name}</div>
            <div className="text-xs text-gray-600 mt-1">{item.manager}</div>
          </div>
          <div className="flex flex-col items-end mr-2 min-w-[88px]">
            <div className="flex items-center gap-1 text-[#B4556D] font-bold text-xs">
              <AlertCircle size={14} className="ml-1 text-soabra-warning" />
              {
                new Date(item.due).toLocaleDateString('ar-SA', { year: 'numeric', month: '2-digit', day: '2-digit' })
              }
            </div>
            <span className="text-[10px] text-gray-500">
              موعد التسليم
            </span>
          </div>
        </div>
      ))}
    </div>
  </GenericCard>
);
