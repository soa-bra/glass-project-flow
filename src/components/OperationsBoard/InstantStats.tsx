
import React from 'react';

const statsData = [
  { title: "الإيرادات اليومية", value: "١٢,٤٥٠ ر.س" },
  { title: "المشاريع الجارية", value: "٨" },
  { title: "الشكـاوى", value: "١" },
];

const StatItem = ({ title, value }: { title: string, value: string }) => (
  <div className="flex items-center gap-2" dir="rtl">
    <span className="text-2xl font-semibold text-[#2A3437]">{value}</span>
    <div className="flex flex-col items-start">
      <span className="text-sm font-medium text-gray-500">{title}</span>
    </div>
  </div>
);

export const InstantStats = () => {
  return (
    <div className="flex justify-end gap-12">
      {statsData.map((stat, index) => (
        <StatItem key={index} title={stat.title} value={stat.value} />
      ))}
    </div>
  );
};
