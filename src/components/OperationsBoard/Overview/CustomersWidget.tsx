import React from 'react';

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
  return (
    <div className={`
      ${className}
      rounded-[40px] p-5
      bg-[#FFFFFF] ring-1 ring-[#DADCE0] shadow-sm
      hover:shadow-md transition-all duration-300
      flex flex-col justify-between
    `}>
      
      <h3 className="text-lg font-arabic font-bold text-black mb-4">
        العملاء
      </h3>

      <div className="space-y-4 flex-1">
        <div className="flex items-center justify-between">
          <span className="text-sm text-black">إجمالي العملاء</span>
          <span className="text-xl font-bold text-black">{customers.totalClients}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-black">عملاء جدد</span>
          <span className="text-xl font-bold text-black">{customers.newClients}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-black">مستوى الرضا</span>
          <span className="text-xl font-bold text-black">{customers.satisfaction}%</span>
        </div>
      </div>
    </div>
  );
};