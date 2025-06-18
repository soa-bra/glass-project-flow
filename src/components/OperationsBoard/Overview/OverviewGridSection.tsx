
import React from 'react';
import { OverviewData } from './OverviewData';

interface OverviewGridSectionProps {
  data: OverviewData;
}

export const OverviewGridSection: React.FC<OverviewGridSectionProps> = ({
  data
}) => {
  // إرجاع null لعدم عرض أي محتوى إضافي
  return null;
};
