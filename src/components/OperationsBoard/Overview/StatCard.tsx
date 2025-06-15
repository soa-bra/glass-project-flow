
import React from 'react';
import { GenericCard } from '@/components/ui/GenericCard';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  color?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  color = '#6366f1',
  className = ''
}) => {
  return (
    <GenericCard
      adminBoardStyle
      hover={false}
      padding="md"
      className={`${className} flex flex-col justify-center text-center`}
    >
      {Icon && (
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
          style={{ backgroundColor: `${color}20`, color }}
        >
          <Icon size={24} />
        </div>
      )}
      <div>
        <p className="text-2xl font-bold text-[#23272f] mb-1">{value}</p>
        <p className="text-sm text-gray-600 font-medium">{title}</p>
      </div>
    </GenericCard>
  );
};
