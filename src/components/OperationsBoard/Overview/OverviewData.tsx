
import React from 'react';

// واجهة البيانات المبسطة للنظرة العامة
export interface OverviewData {
  stats: {
    expectedRevenue: number;
    complaints: number;
    delayedProjects: number;
  };
}

// البيانات التجريبية المبسطة
export const mockOverviewData: OverviewData = {
  stats: {
    expectedRevenue: 150,
    complaints: 5,
    delayedProjects: 3
  }
};
