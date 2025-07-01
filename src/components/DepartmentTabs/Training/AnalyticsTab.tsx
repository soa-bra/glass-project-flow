
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const AnalyticsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center py-12">
        <h3 className="text-2xl font-semibold mb-4">التحليلات والأداء</h3>
        <p className="text-gray-600 mb-6">
          لوحات قياس مؤشرات الأداء مع تحليلات كيركباتريك وحساب العائد على الاستثمار
        </p>
        <div className="bg-gray-50 p-8 rounded-lg">
          <p className="text-gray-500">محتوى التحليلات والأداء سيتم تطويره هنا</p>
        </div>
      </div>
    </div>
  );
};
