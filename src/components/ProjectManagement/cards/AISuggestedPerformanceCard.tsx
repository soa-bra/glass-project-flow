
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
      className="h-full p-4 rounded-[41px] bg-[#FFFFFF] border border-[#DADCE0] flex flex-col overflow-hidden"
      style={{
        fontFamily: 'IBM Plex Sans Arabic'
      }}
    >
      {/* الرأس */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-arabic font-semibold text-gray-800">
          {title}
        </h4>
        <Icon size={16} className="text-gray-600" />
      </div>

      {/* المقياس الرئيسي */}
      <div className="mb-2">
        <div className="text-2xl font-bold text-gray-900 font-arabic">
          {metric}
        </div>
        <div className="text-xs text-gray-600 font-arabic">
          {description}
        </div>
      </div>

      {/* الرسم البياني */}
      <div className="flex-1 mb-2 overflow-hidden">
        <div 
          className="w-full h-full max-w-[120px] mx-auto"
          style={{ aspectRatio: '16/9' }}
        >
          {renderChart()}
        </div>
      </div>

      {/* المؤشر */}
      <div className="text-xs text-gray-500 font-arabic">
        {trend}
      </div>
    </div>
  );
};
