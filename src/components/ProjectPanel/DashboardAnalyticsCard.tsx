
import React from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';

export const DashboardAnalyticsCard: React.FC = () => {
  return (
    <div className="h-full bg-white/40 backdrop-blur-[20px] border border-white/30 rounded-[20px] p-6 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 font-arabic" style={{ fontFamily: 'IBM Plex Sans Arabic' }}>
          التحليلات
        </h3>
        <BarChart3 size={20} className="text-gray-600" />
      </div>

      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="w-full h-20 flex items-end justify-center gap-1 mb-4">
          {[40, 60, 30, 80, 45, 70, 55].map((height, i) => (
            <div
              key={i}
              className="bg-gradient-to-t from-purple-500 to-purple-400 rounded-sm"
              style={{ width: '8px', height: `${height}%` }}
            />
          ))}
        </div>
        
        <div className="flex items-center gap-2 text-green-600">
          <TrendingUp size={16} />
          <span className="text-sm font-arabic">+15% هذا الأسبوع</span>
        </div>
      </div>
    </div>
  );
};
