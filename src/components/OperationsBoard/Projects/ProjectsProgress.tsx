
import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell } from "recharts";
import { GenericCard } from "@/components/ui/GenericCard";

const progressData = [
  { name: "مشروع أ", progress: 90, color: "#34D399" },
  { name: "مشروع ب", progress: 68, color: "#FBBF24" },
  { name: "مشروع ج", progress: 41, color: "#0099FF" },
  { name: "مشروع د", progress: 22, color: "#EF4444" }
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
  <GenericCard
    adminBoardStyle
    hover
    padding="md"
    className="relative group overflow-visible min-h-[192px] flex flex-col"
  >
    <div className="flex flex-col w-full h-full text-right">
      <h4 className="text-xl font-bold leading-[1.4] text-[#23272f] mt-1 mb-0 w-full">
        تقدم المشاريع
      </h4>
      <div className="text-soabra-text-secondary text-base mb-3 mt-1 text-[#23272f] w-full">
        مخططات تقدم المشاريع
      </div>
      <div className="h-32 w-full relative mb-2 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart layout="vertical" data={progressData}>
            <XAxis type="number" domain={[0, 100]} hide />
            <Tooltip content={ProgressTooltip} />
            <Bar dataKey="progress" radius={[12, 12, 12, 12]}>
              {progressData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Hover details */}
      <div
        className="absolute left-4 top-2 opacity-0 group-hover:opacity-100 
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
