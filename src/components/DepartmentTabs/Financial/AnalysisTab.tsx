
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, PieChart, Target } from 'lucide-react';
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Tooltip } from 'recharts';
import { BaseCard } from '@/components/ui/BaseCard';
import { mockExpenseCategories } from './data';
import { formatCurrency } from './utils';

export const AnalysisTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">التحليل والتقارير</h3>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          تصدير التقرير
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Categories */}
        <BaseCard variant="operations" className="p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              توزيع المصروفات
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie 
                  data={mockExpenseCategories} 
                  cx="50%" 
                  cy="50%" 
                  labelLine={false} 
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} 
                  outerRadius={80} 
                  fill="#8884d8" 
                  dataKey="value"
                >
                  {mockExpenseCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </BaseCard>

        {/* AI Predictions */}
        <BaseCard variant="operations" className="p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              التنبؤات المالية
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800">السيناريو المتفائل</h4>
              <p className="text-green-700">نمو متوقع: +25%</p>
              <p className="text-green-600">الإيرادات المتوقعة: {formatCurrency(3062500)}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800">السيناريو الأساسي</h4>
              <p className="text-blue-700">نمو متوقع: +12%</p>
              <p className="text-blue-600">الإيرادات المتوقعة: {formatCurrency(2744000)}</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-semibold text-orange-800">السيناريو المتحفظ</h4>
              <p className="text-orange-700">نمو متوقع: +5%</p>
              <p className="text-orange-600">الإيرادات المتوقعة: {formatCurrency(2572500)}</p>
            </div>
          </CardContent>
        </BaseCard>
      </div>
    </div>
  );
};
