
import React from 'react';
import { ChevronLeft } from 'lucide-react';

const topStats = [
  {
    label: 'الإيرادات اليومية',
    value: '12,500 ﷼',
    icon: <ChevronLeft size={22} strokeWidth={1.5} />,
  },
  {
    label: 'المشاريع الجارية',
    value: 8,
    icon: <ChevronLeft size={22} strokeWidth={1.5} />,
  },
  {
    label: 'الشكـاوى',
    value: 2,
    icon: <ChevronLeft size={22} strokeWidth={1.5} />,
  },
];

export const TopStats: React.FC = () => {
  return (
    <div className="w-full flex justify-between items-center gap-4 px-8 pb-2">
      {topStats.map((stat) => (
        <div
          key={stat.label}
          className="flex items-center justify-end gap-3 flex-1 min-w-0"
          style={{
            background: 'none',
            boxShadow: 'none'
          }}
        >
          <div className="flex flex-col items-end text-right">
            <span className="text-[1.3rem] font-extrabold font-arabic leading-tight block text-black mb-0">
              {stat.value}
            </span>
            <span className="text-[14px] text-black/75 font-medium font-arabic">{stat.label}</span>
          </div>
          <span className="bg-white/45 rounded-full p-2.5 flex items-center justify-center ml-2 border border-gray-300 shadow-sm"
                  style={{
                    boxShadow: 'inset 0 1px 5px 0 rgba(40,90,150,0.10)'
                  }}>
            {stat.icon}
          </span>
        </div>
      ))}
    </div>
  );
};
