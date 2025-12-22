import React from 'react';

export interface ReportsData {
  totalReports: number;
  pendingReports: number;
  completedReports: number;
}

export interface ReportsBoxProps {
  reports: ReportsData;
  className?: string;
}

export const ReportsBox: React.FC<ReportsBoxProps> = ({ 
  reports, 
  className = '' 
}) => {
  return (
    <div className={`
      ${className}
      rounded-[40px] p-5 h-full min-h-0
      bg-[#FFFFFF] border border-[#DADCE0] shadow-sm
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