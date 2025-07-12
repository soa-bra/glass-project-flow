
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface MonthlyBudget {
  month: string;
  budget: number;
  actual: number;
  variance: number;
}

interface BudgetVsActualChartProps {
  monthlyData: MonthlyBudget[];
}

export const BudgetVsActualChart: React.FC<BudgetVsActualChartProps> = ({ monthlyData }) => {
  return (
    <div className="p-6 rounded-3xl border border-gray-200/50" style={{ backgroundColor: '#f3ffff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
      <div className="mb-6">
        <h3 className="text-large font-semibold text-black font-arabic">الميزانية مقابل الفعلي</h3>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#000000" opacity={0.1} />
            <XAxis 
              dataKey="month" 
              stroke="#000000" 
              tick={{ fill: '#000000', fontSize: 12, fontFamily: 'IBM Plex Sans Arabic' }} 
            />
            <YAxis 
              stroke="#000000" 
              tick={{ fill: '#000000', fontSize: 12, fontFamily: 'IBM Plex Sans Arabic' }} 
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                borderRadius: '12px',
                color: '#000000',
                fontFamily: 'IBM Plex Sans Arabic'
              }}
              labelStyle={{ color: '#000000', fontFamily: 'IBM Plex Sans Arabic' }}
            />
            <Legend wrapperStyle={{ color: '#000000', fontFamily: 'IBM Plex Sans Arabic' }} />
            <Bar dataKey="budget" fill="#bdeed3" name="الميزانية" />
            <Bar dataKey="actual" fill="#a4e2f6" name="الفعلي" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
