import React from 'react';
import { Users, UserPlus, Heart } from 'lucide-react';

interface CustomersData {
  totalClients: number;
  newClients: number;
  satisfaction: number;
}

interface CustomersWidgetProps {
  customers: CustomersData;
  className?: string;
}

export const CustomersWidget: React.FC<CustomersWidgetProps> = ({ 
  customers, 
  className = '' 
}) => {
  const hasHighSatisfaction = customers.satisfaction >= 85;

  return (
    <div className={`
      ${className}
      rounded-3xl p-5
      bg-white/80 backdrop-blur-xl border border-white/30
      shadow-lg hover:shadow-xl transition-all duration-300
      ${hasHighSatisfaction ? 'border-green-200/50' : 'border-orange-200/50'}
      flex flex-col justify-between
    `}>
      
      <h3 className="text-lg font-arabic font-bold text-gray-800 mb-4">
        العملاء
      </h3>

      <div className="space-y-4 flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Users size={16} className="text-blue-500" />
            <span className="text-sm text-gray-600">إجمالي العملاء</span>
          </div>
          <span className="text-xl font-bold text-blue-500">{customers.totalClients}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <UserPlus size={16} className="text-green-500" />
            <span className="text-sm text-gray-600">عملاء جدد</span>
          </div>
          <span className="text-xl font-bold text-green-500">{customers.newClients}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Heart size={16} className="text-red-500" />
            <span className="text-sm text-gray-600">مستوى الرضا</span>
          </div>
          <span className="text-xl font-bold text-red-500">{customers.satisfaction}%</span>
        </div>
      </div>
    </div>
  );
};