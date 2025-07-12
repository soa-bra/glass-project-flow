
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CashFlowData {
  date: string;
  inflow: number;
  outflow: number;
  netFlow: number;
  cumulativeBalance: number;
}

interface CashFlowForecastProps {
  cashFlowData: CashFlowData[];
}

export const CashFlowForecast: React.FC<CashFlowForecastProps> = ({ cashFlowData }) => {
  return (
    <div className="p-6 rounded-3xl border border-gray-200/50" style={{ backgroundColor: '#f3ffff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
      <div className="mb-6">
        <h3 className="text-large font-semibold text-black font-arabic">توقعات التدفق النقدي</h3>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={cashFlowData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#000000" opacity={0.1} />
            <XAxis 
              dataKey="date" 
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
            <Line type="monotone" dataKey="inflow" stroke="#bdeed3" strokeWidth={3} name="التدفق الداخل" />
            <Line type="monotone" dataKey="outflow" stroke="#f1b5b9" strokeWidth={3} name="التدفق الخارج" />
            <Line type="monotone" dataKey="netFlow" stroke="#d9d2fd" strokeWidth={3} name="صافي التدفق" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
