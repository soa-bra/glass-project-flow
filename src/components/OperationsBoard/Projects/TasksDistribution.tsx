
import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { GenericCard } from "@/components/ui/GenericCard";

const data = [
  { name: "فريق التقنية", value: 43, color: "#34D399" },
  { name: "فريق التسويق", value: 31, color: "#FBBF24" },
  { name: "فريق الموارد", value: 23, color: "#0099FF" },
  { name: "فريق الجودة", value: 14, color: "#6B7280" }
];

const renderCustomTooltip = ({ active, payload }: any) =>
  active && payload?.length ? (
    <div className="text-xs font-arabic bg-white/90 px-3 py-2 rounded-xl shadow border text-[#23272f] text-right">
      <div>
        <span className="font-bold text-[#23272f]">{payload[0].payload.name}</span>
      </div>
      <div>
        نسبة المهام:{" "}
        <span className="font-bold text-[#23272f]">
          {payload[0].payload.value}%
        </span>
      </div>
    </div>
  ) : null;

export const TasksDistribution: React.FC = () => (
  <GenericCard
    adminBoardStyle
    hover
    padding="md"
    className="relative group overflow-visible min-h-[192px] flex flex-col"
  >
    <div className="flex flex-col w-full text-right">
      <h4 className="text-xl font-bold leading-[1.4] text-[#23272f] mt-1 mb-0 w-full">
        توزيع المهام
      </h4>
      <div className="text-soabra-text-secondary text-base mb-3 mt-1 text-[#23272f] w-full">
        توزيع المهام بين الفرق
      </div>
      <div className="w-full h-24 relative mb-4 mt-2 flex justify-center">
        <ResponsiveContainer width="85%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={38}
              innerRadius={21}
              strokeWidth={2}
              startAngle={230}
              endAngle={-130}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={renderCustomTooltip} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Hover details */}
      <div
        className="absolute left-4 top-2 opacity-0 group-hover:opacity-100 
        transition-all pointer-events-none z-30 min-w-[135px] p-2 text-xs rounded-xl
        bg-white/80 shadow border text-right text-[#23272f]"
        style={{
          fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
          backdropFilter: "blur(20px)"
        }}>
        يظهر أعلاه توزيع النسبي للمهام المنجزة والمفتوحة لكل فريق.
      </div>
    </div>
  </GenericCard>
);
