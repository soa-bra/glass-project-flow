import React from 'react';

interface ReportStatistics {
  totalReports: number;
  monthlyDownloads: number;
  customReports: number;
  scheduledReports: number;
  popularCategories: { category: string; count: number }[];
}

interface ReportStatsProps {
  statistics: ReportStatistics;
}

export const ReportStats: React.FC<ReportStatsProps> = ({ statistics }) => {
  return <div className="text-center text-gray-500 font-arabic">قيد التطوير</div>;
};

export const CustomReportWizard: React.FC = () => {
  return <div className="text-center text-gray-500 font-arabic">قيد التطوير</div>;
};