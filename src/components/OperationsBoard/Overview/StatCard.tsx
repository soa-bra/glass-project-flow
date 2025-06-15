
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
      className={`${className} flex items-center justify-between`}
    >
      <div>
        <p className="text-sm text-gray-600 mb-2">{title}</p>
        <p className="text-3xl font-bold text-[#23272f]">{value}</p>
      </div>
      {Icon && (
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${color}20`, color }}
        >
          <Icon size={24} />
        </div>
      )}
    </GenericCard>
  );
};
