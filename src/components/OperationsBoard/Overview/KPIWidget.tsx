
import React from 'react';
import { GenericCard } from '@/components/ui/GenericCard';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

interface KPIData {
  id: number;
  title: string;
  value: string;
  change: number;
  isPositive: boolean;
  unit?: string;
}

interface KPIWidgetProps {
  className?: string;
}

export const KPIWidget: React.FC<KPIWidgetProps> = ({
  className = ''
}) => {
  const kpiData: KPIData[] = [
    {
      id: 1,
      title: 'الإيرادات الشهرية',
      value: '1.2M',
      change: 12.5,
      isPositive: true,
      unit: 'ر.س'
    },
    {
      id: 2,
      title: 'معدل إنجاز المشاريع',
      value: '87',
      change: 5.2,
      isPositive: true,
      unit: '%'
    },
    {
      id: 3,
      title: 'رضا العملاء',
      value: '4.8',
      change: -2.1,
      isPositive: false,
      unit: '/5'
    },
    {
      id: 4,
      title: 'متوسط وقت التسليم',
      value: '12',
      change: -8.3,
      isPositive: true,
      unit: 'يوم'
    }
  ];

  return (
    <GenericCard
      adminBoardStyle
      hover={false}
      padding="md"
      className={`${className} flex flex-col`}
    >
      <header className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
          <BarChart3 size={16} className="text-green-600" />
        </div>
        <h3 className="text-lg font-arabic font-bold text-[#23272f]">
          المؤشرات الرئيسية
        </h3>
      </header>
      
      <div className="grid grid-cols-2 gap-4 flex-1">
        {kpiData.map((kpi) => (
          <div 
            key={kpi.id} 
            className="p-4 bg-white/50 rounded-2xl border border-white/60"
          >
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-1">{kpi.title}</p>
              <div className="flex items-center justify-center gap-1 mb-2">
                <span className="text-2xl font-bold text-[#23272f]">
                  {kpi.value}
                </span>
                {kpi.unit && (
                  <span className="text-sm text-gray-500">{kpi.unit}</span>
                )}
              </div>
              <div className={`flex items-center justify-center gap-1 px-2 py-1 rounded-full text-xs ${
                kpi.isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {kpi.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                <span>{Math.abs(kpi.change)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </GenericCard>
  );
};
