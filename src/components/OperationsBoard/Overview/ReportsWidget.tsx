import React from 'react';
import { FileText, Clock, CheckCircle } from 'lucide-react';

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
  const hasPendingReports = reports.pendingReports > 0;

  return (
    <div className={`
      ${className}
      rounded-3xl p-5
      bg-[#f3ffff] border border-gray-200/50 shadow-sm
      hover:shadow-md transition-all duration-300
      ${hasPendingReports ? 'border-orange-200' : 'border-green-200'}
      flex flex-col justify-between
    `}>
      
      <h3 className="text-lg font-arabic font-bold text-gray-800 mb-4">
        التقارير
      </h3>

      <div className="space-y-4 flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FileText size={16} className="text-blue-500" />
            <span className="text-sm text-gray-600">إجمالي التقارير</span>
          </div>
          <span className="text-xl font-bold text-blue-500">{reports.totalReports}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Clock size={16} className="text-orange-500" />
            <span className="text-sm text-gray-600">قيد المراجعة</span>
          </div>
          <span className="text-xl font-bold text-orange-500">{reports.pendingReports}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <CheckCircle size={16} className="text-green-500" />
            <span className="text-sm text-gray-600">مكتملة</span>
          </div>
          <span className="text-xl font-bold text-green-500">{reports.completedReports}</span>
        </div>
      </div>
    </div>
  );
};