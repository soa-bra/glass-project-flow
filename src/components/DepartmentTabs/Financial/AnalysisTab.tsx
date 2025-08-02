
import React from 'react';
import { Download, PieChart, Target } from 'lucide-react';
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Tooltip } from 'recharts';
import { UnifiedSystemCard } from '@/components/ui/UnifiedSystemCard';
import { UnifiedSystemButton } from '@/components/ui/UnifiedSystemButton';
import { mockExpenseCategories } from './data';
import { formatCurrency } from './utils';

export const AnalysisTab: React.FC = () => {
  const colors = ['#bdeed3', '#a4e2f6', '#d9d2fd', '#f1b5b9', '#fbe2aa'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-black font-arabic">التحليل والتقارير</h3>
        <UnifiedSystemButton variant="primary" icon={<Download />}>
          تصدير التقرير
        </UnifiedSystemButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Categories */}
        <UnifiedSystemCard
          title="توزيع المصروفات"
          icon={<PieChart />}
        >
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
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  borderRadius: '12px',
                  color: '#000000'
                }}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
        </UnifiedSystemCard>

        {/* AI Predictions */}
        <UnifiedSystemCard
          title="التنبؤات المالية"
          icon={<Target />}
        >
          <div className="space-y-4">
            <div className="p-4 bg-[#bdeed3] rounded-3xl">
              <h4 className="text-sm font-bold text-black font-arabic">السيناريو المتفائل</h4>
              <p className="text-sm font-medium text-black">نمو متوقع: +25%</p>
              <p className="text-sm font-normal text-black">الإيرادات المتوقعة: {formatCurrency(3062500)}</p>
            </div>
            <div className="p-4 bg-[#a4e2f6] rounded-3xl">
              <h4 className="text-sm font-bold text-black font-arabic">السيناريو الأساسي</h4>
              <p className="text-sm font-medium text-black">نمو متوقع: +12%</p>
              <p className="text-sm font-normal text-black">الإيرادات المتوقعة: {formatCurrency(2744000)}</p>
            </div>
            <div className="p-4 bg-[#fbe2aa] rounded-3xl">
              <h4 className="text-sm font-bold text-black font-arabic">السيناريو المتحفظ</h4>
              <p className="text-sm font-medium text-black">نمو متوقع: +5%</p>
              <p className="text-sm font-normal text-black">الإيرادات المتوقعة: {formatCurrency(2572500)}</p>
            </div>
          </div>
        </UnifiedSystemCard>
      </div>
    </div>
  );
};
