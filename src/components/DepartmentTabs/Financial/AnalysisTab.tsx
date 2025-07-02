
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, PieChart, Target } from 'lucide-react';
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Tooltip } from 'recharts';
import { mockExpenseCategories } from './data';
import { formatCurrency } from './utils';
import { CircularIconButton } from '@/components/ui/CircularIconButton';

export const AnalysisTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-black font-arabic">التحليل والتقارير</h3>
        <Button className="bg-transparent border border-black/20 text-black hover:bg-black/5 rounded-full">
          <Download className="w-4 h-4 mr-2" />
          تصدير التقرير
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Categories */}
        <div className="bg-[#f2ffff] rounded-3xl p-6 border border-transparent">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-black font-arabic">
              توزيع المصروفات
            </h3>
            <CircularIconButton 
              icon={PieChart}
              size="sm"
              className="w-8 h-8 bg-transparent border border-black/20 text-black"
            />
          </div>
          <div className="bg-transparent">
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
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#f2ffff',
                    border: '1px solid rgba(0,0,0,0.1)',
                    borderRadius: '12px',
                    color: '#000000'
                  }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Predictions */}
        <div className="bg-[#f2ffff] rounded-3xl p-6 border border-transparent">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-black font-arabic">
              التنبؤات المالية
            </h3>
            <CircularIconButton 
              icon={Target}
              size="sm"
              className="w-8 h-8 bg-transparent border border-black/20 text-black"
            />
          </div>
          <div className="space-y-4 bg-transparent">
            <div className="p-4 bg-[#bdeed3] rounded-2xl border border-transparent">
              <h4 className="text-sm font-bold text-black font-arabic">السيناريو المتفائل</h4>
              <p className="text-sm font-medium text-black font-arabic">نمو متوقع: +25%</p>
              <p className="text-sm font-normal text-black font-arabic">الإيرادات المتوقعة: {formatCurrency(3062500)}</p>
            </div>
            <div className="p-4 bg-[#a4e2f6] rounded-2xl border border-transparent">
              <h4 className="text-sm font-bold text-black font-arabic">السيناريو الأساسي</h4>
              <p className="text-sm font-medium text-black font-arabic">نمو متوقع: +12%</p>
              <p className="text-sm font-normal text-black font-arabic">الإيرادات المتوقعة: {formatCurrency(2744000)}</p>
            </div>
            <div className="p-4 bg-[#fbe2aa] rounded-2xl border border-transparent">
              <h4 className="text-sm font-bold text-black font-arabic">السيناريو المتحفظ</h4>
              <p className="text-sm font-medium text-black font-arabic">نمو متوقع: +5%</p>
              <p className="text-sm font-normal text-black font-arabic">الإيرادات المتوقعة: {formatCurrency(2572500)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
