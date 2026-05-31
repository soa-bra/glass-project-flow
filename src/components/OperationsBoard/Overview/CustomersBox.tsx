import React from 'react';
import { BaseBox } from '@/components/ui/BaseBox';

export interface CustomersData {
  totalClients: number;
  newClients: number;
  satisfaction: number;
}

export interface CustomersBoxProps {
  customers: CustomersData;
  className?: string;
}

export const CustomersBox: React.FC<CustomersBoxProps> = ({ 
  customers, 
  className = '' 
}) => {
  return (
    <BaseBox 
      title="العملاء"
      variant="unified"
      size="sm"
      rounded="xl"
      className={`h-full min-h-0 flex flex-col justify-between ${className}`}
    >
      <div className="space-y-4 flex-1">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[hsl(var(--ink))]">إجمالي العملاء</span>
          <span className="text-xl font-bold text-[hsl(var(--ink))]">{customers.totalClients}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-[hsl(var(--ink))]">عملاء جدد</span>
          <span className="text-xl font-bold text-[hsl(var(--ink))]">{customers.newClients}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-[hsl(var(--ink))]">مستوى الرضا</span>
          <span className="text-xl font-bold text-[hsl(var(--ink))]">{customers.satisfaction}%</span>
        </div>
      </div>
    </BaseBox>
  );
};
