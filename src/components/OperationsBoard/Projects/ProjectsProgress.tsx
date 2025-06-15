
import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell } from "recharts";
import { GenericCard } from "@/components/ui/GenericCard";

// استخدم ألوان من قائمة soabra في tailwind
const progressData = [
  { name: "مشروع أ", progress: 90, color: "#34D399" },      // soabra-success
  { name: "مشروع ب", progress: 68, color: "#FBBF24" },      // soabra-warning
  { name: "مشروع ج", progress: 41, color: "#0099FF" },      // soabra-primary-blue
  { name: "مشروع د", progress: 22, color: "#EF4444" }       // soabra-error
];

const ProgressTooltip = ({ active, payload }: any) =>
  active && payload?.length ? (
    <div className="text-xs font-arabic bg-white/90 px-3 py-2 rounded-xl shadow border text-[#23272f] text-right">
      <div>
        <span className="font-bold text-[#23272f]">{payload[0].payload.name}</span>
      </div>
      <div>
        الإنجاز:{" "}
        <span className="font-bold text-[#23272f]">
          {payload[0].payload.progress}%
        </span>
      </div>
    </div>
  ) : null;

export const ProjectsProgress: React.FC = () => (
  <GenericCard adminBoardStyle hover padding="md" className="relative group overflow-visible min-h-[210px]">
    <div className="flex flex-col items-end text-right w-full h-full justify-between">
      <h4 className="text-lg font-bold mb-0 text-[#23272f] w-full leading-tight mt-1">تقدم المشاريع</h4>
      <div className="text-soabra-text-secondary text-sm mb-4 mt-1 text-[#23272f] w-full">مخططات تقدم المشاريع</div>
      <div className="h-28 w-full relative mb-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart layout="vertical" data={progressData}>
            <XAxis type="number" domain={[0, 100]} hide />
            <Tooltip content={ProgressTooltip} />
            <Bar dataKey="progress" radius={[12, 12, 12, 12]}>
              {progressData.map((entry, idx) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Hover details */}
      <div className="absolute left-4 top-2 opacity-0 group-hover:opacity-100 
        transition-all pointer-events-none z-30 min-w-[140px] p-2 text-xs rounded-xl
        bg-white/80 shadow border text-right text-[#23272f]"
        style={{
          fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
          backdropFilter: "blur(20px)"
        }}>
        يوضح الرسم نسب الإكمال للمشاريع الرئيسية المسجّلة حالياً.
      </div>
    </div>
  </GenericCard>
);
