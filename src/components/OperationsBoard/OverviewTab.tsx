
import React from 'react';
import { OverviewLayout } from './Overview/OverviewLayout';
import { mockOverviewData, OverviewData } from './Overview/OverviewData';

interface OverviewTabProps {
  data?: OverviewData;
  loading: boolean;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  data,
  loading
}) => {
  if (loading || !data) {
    return <div className="h-full flex items-center justify-center text-gray-600 font-arabic">جارٍ التحميل...</div>;
  }

  return <OverviewLayout data={mockOverviewData} />;
};
