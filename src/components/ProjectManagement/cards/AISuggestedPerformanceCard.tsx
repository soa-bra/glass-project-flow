
import React from 'react';
import { BarChart3, Users, Target, FileText, TrendingUp, PieChart } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart as RechartsPieChart, Cell, XAxis, YAxis } from 'recharts';
import { ChartWrapper } from '@/components/shared/charts/ChartWrapper';

interface AISuggestedPerformanceCardProps {
  type: 'analytics' | 'team' | 'goals' | 'reports';
  title: string;
  metric: string;
  description: string;
  trend: string;
  chartType: 'line' | 'bar' | 'pie' | 'donut';
}

export const AISuggestedPerformanceCard: React.FC<AISuggestedPerformanceCardProps> = ({
  type,
  title,
  metric,
  description,
  trend,
  chartType
}) => {
  const getIcon = () => {
    switch (type) {
      case 'analytics': return TrendingUp;
      case 'team': return Users;
      case 'goals': return Target;
      case 'reports': return FileText;
      default: return BarChart3;
    }
  };

  const Icon = getIcon();

  // بيانات وهمية للرسوم البيانية
  const lineData = [
    { name: 'يناير', value: 65 },
    { name: 'فبراير', value: 78 },
    { name: 'مارس', value: 90 },
    { name: 'أبريل', value: 94 }
  ];

  const barData = [
    { name: 'أ', value: 20 },
    { name: 'ب', value: 35 },
    { name: 'ج', value: 25 },
    { name: 'د', value: 30 }
  ];

  const pieData = [
    { name: 'مكتمل', value: 70, color: '#000000' },
    { name: 'قيد التنفيذ', value: 20, color: '#aec2cf' },
    { name: 'متبقي', value: 10, color: '#f0f0f0' }
  ];

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <ChartWrapper minHeight={60} minWidth={100} aspectRatio="16/9">
            <LineChart data={lineData}>
              <Line type="monotone" dataKey="value" stroke="#000000" strokeWidth={2} dot={false} />
            </LineChart>
          </ChartWrapper>
        );
      case 'bar':
        return (
          <ChartWrapper minHeight={60} minWidth={100} aspectRatio="16/9">
            <BarChart data={barData}>
              <Bar dataKey="value" fill="#aec2cf" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ChartWrapper>
        );
      case 'pie':
      case 'donut':
        return (
          <ChartWrapper minHeight={60} minWidth={100} aspectRatio="1/1">
            <RechartsPieChart>
              <RechartsPieChart
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={chartType === 'donut' ? 10 : 0}
                outerRadius={20}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </RechartsPieChart>
            </RechartsPieChart>
          </ChartWrapper>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className="h-full rounded-[41px] bg-[#FFFFFF] border border-[#DADCE0] flex flex-col overflow-hidden"
      style={{
        fontFamily: 'IBM Plex Sans Arabic',
        padding: 'clamp(8px, 2vw, 16px)'
      }}
    >
      {/* الرأس */}
      <div className="flex items-center justify-between mb-2 flex-shrink-0">
        <h4 
          className="font-arabic font-semibold text-gray-800 leading-tight"
          style={{ fontSize: 'clamp(0.7rem, 1.2vw, 0.9rem)' }}
        >
          {title}
        </h4>
        <Icon 
          className="text-gray-600 flex-shrink-0" 
          style={{ width: 'clamp(12px, 1.5vw, 16px)', height: 'clamp(12px, 1.5vw, 16px)' }}
        />
      </div>

      {/* المقياس الرئيسي */}
      <div className="mb-2 flex-shrink-0">
        <div 
          className="font-bold text-gray-900 font-arabic leading-none"
          style={{ fontSize: 'clamp(1rem, 2.5vw, 1.5rem)' }}
        >
          {metric}
        </div>
        <div 
          className="text-gray-600 font-arabic leading-tight"
          style={{ fontSize: 'clamp(0.6rem, 1vw, 0.75rem)' }}
        >
          {description}
        </div>
      </div>

      {/* الرسم البياني */}
      <div className="flex-1 mb-2 overflow-hidden min-h-0">
        <div 
          className="w-full h-full mx-auto flex items-center justify-center"
          style={{ 
            maxWidth: 'min(100%, 120px)',
            aspectRatio: chartType === 'pie' || chartType === 'donut' ? '1/1' : '16/9'
          }}
        >
          {renderChart()}
        </div>
      </div>

      {/* المؤشر */}
      <div 
        className="text-gray-500 font-arabic flex-shrink-0 leading-tight"
        style={{ fontSize: 'clamp(0.6rem, 1vw, 0.75rem)' }}
      >
        {trend}
      </div>
    </div>
  );
};
