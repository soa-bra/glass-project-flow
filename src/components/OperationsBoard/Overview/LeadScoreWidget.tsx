
import React from 'react';
import { GenericCard } from '@/components/ui/GenericCard';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface LeadScoreWidgetProps {
  className?: string;
}

export const LeadScoreWidget: React.FC<LeadScoreWidgetProps> = ({
  className = ''
}) => {
  const leadData = [
    { label: 'عملاء محتملون جدد', value: 24, change: 12, isPositive: true },
    { label: 'معدل التحويل', value: '68%', change: 5, isPositive: true },
    { label: 'النقاط المحققة', value: 1250, change: -8, isPositive: false },
  ];

  return (
    <GenericCard
      adminBoardStyle
      hover={false}
      padding="md"
      className={`${className} flex flex-col`}
    >
      <header className="mb-6">
        <h3 className="text-xl font-arabic font-bold text-[#23272f]">
          نقاط العملاء المحتملين
        </h3>
      </header>
      
      <div className="space-y-4 flex-1">
        {leadData.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-white/30 rounded-2xl">
            <div>
              <p className="text-sm text-gray-600 mb-1">{item.label}</p>
              <p className="text-2xl font-bold text-[#23272f]">{item.value}</p>
            </div>
            <div className={`flex items-center gap-2 px-3 py-2 rounded-full ${
              item.isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {item.isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span className="text-sm font-medium">{Math.abs(item.change)}%</span>
            </div>
          </div>
        ))}
      </div>
    </GenericCard>
  );
};
