import React from 'react';

interface ReportsData {
  totalReports: number;
  pendingReports: number;
  completedReports: number;
}

interface ReportsWidgetProps {
  reports: ReportsData;
  className?: string;
}

export const ReportsWidget: React.FC<ReportsWidgetProps> = ({ 
  reports, 
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
        التقارير
      </h3>

      <div className="space-y-4 flex-1">
        <div className="flex items-center justify-between">
          <span className="text-sm text-black">إجمالي التقارير</span>
          <span className="text-xl font-bold text-black">{reports.totalReports}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-black">قيد المراجعة</span>
          <span className="text-xl font-bold text-black">{reports.pendingReports}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-black">مكتملة</span>
          <span className="text-xl font-bold text-black">{reports.completedReports}</span>
        </div>
      </div>
    </div>
  );
};