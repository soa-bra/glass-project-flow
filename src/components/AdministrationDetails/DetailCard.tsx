
import React from "react";

interface DetailCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  icon?: React.ReactNode;
  bgColorClass?: string;
  statItems?: {
    label: string;
    value: string | number;
    icon?: React.ReactNode;
  }[];
  children?: React.ReactNode;
}

export const DetailCard: React.FC<DetailCardProps> = ({
  title,
  subtitle,
  description,
  icon,
  statItems,
  bgColorClass = 'bg-white/40',
  children
}) => {
  return (
    <div
      dir="rtl"
      className={`
        rounded-3xl shadow-2xl border border-white/60
        ${bgColorClass} 
        backdrop-blur-[20px]
        px-10 py-8 md:px-14 md:py-10
        font-arabic text-[#23272f] 
        transition hover:scale-105 hover:shadow-2xl
        relative
      `}
      style={{
        fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif'
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        {icon && (
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow p-2 mr-2">
            {icon}
          </div>
        )}
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          {subtitle && <div className="text-base text-soabra-text-secondary/80">{subtitle}</div>}
        </div>
      </div>
      {description && (
        <div className="mb-3 text-soabra-text-secondary/90 text-sm">{description}</div>
      )}
      {statItems && (
        <div className="flex flex-wrap gap-4 items-end my-2 mb-6">
          {statItems.map((s, i) => (
            <div key={i} className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-2xl shadow min-w-[90px] text-right">
              {s.icon && <span className="ml-1">{s.icon}</span>} 
              <span className="font-bold text-lg">{s.value}</span>
              <span className="text-xs text-soabra-text-secondary/90">{s.label}</span>
            </div>
          ))}
        </div>
      )}
      {children}
    </div>
  );
};
