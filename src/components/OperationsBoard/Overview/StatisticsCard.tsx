
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';

interface StatisticsCardProps {
  title: string;
  value: string;
  unit: string;
  description: string;
  chartType: 'bar' | 'line' | 'donut' | 'area' | 'radial' | 'gauge' | 'simple';
}

const generateRandomData = (points: number) => {
  return Array.from({ length: points }, () => Math.random() * 100);
};

const BarChart: React.FC<{ data: number[] }> = ({ data }) => (
  <svg className="w-full h-full" viewBox="0 0 100 60" preserveAspectRatio="xMidYMid meet">
    {data.map((value, index) => (
      <rect
        key={index}
        x={index * (100 / data.length) + 2}
        y={60 - (value * 0.5)}
        width={(100 / data.length) - 4}
        height={value * 0.5}
        fill="#4F46E5"
        rx="1"
      />
    ))}
  </svg>
);

const LineChart: React.FC<{ data: number[] }> = ({ data }) => {
  const points = data.map((value, index) => 
    `${index * (100 / (data.length - 1))},${60 - (value * 0.5)}`
  ).join(' ');
  
  return (
    <svg className="w-full h-full" viewBox="0 0 100 60" preserveAspectRatio="xMidYMid meet">
      <polyline
        points={points}
        fill="none"
        stroke="#10B981"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {data.map((value, index) => (
        <circle
          key={index}
          cx={index * (100 / (data.length - 1))}
          cy={60 - (value * 0.5)}
          r="2"
          fill="#10B981"
        />
      ))}
    </svg>
  );
};

const DonutChart: React.FC<{ percentage: number }> = ({ percentage }) => {
  const radius = 25;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <svg className="w-full h-full" viewBox="0 0 60 60" preserveAspectRatio="xMidYMid meet">
      <circle
        cx="30"
        cy="30"
        r={radius}
        fill="none"
        stroke="#E5E7EB"
        strokeWidth="6"
      />
      <circle
        cx="30"
        cy="30"
        r={radius}
        fill="none"
        stroke="#F59E0B"
        strokeWidth="6"
        strokeDasharray={strokeDasharray}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        transform="rotate(-90 30 30)"
      />
    </svg>
  );
};

const AreaChart: React.FC<{ data: number[] }> = ({ data }) => {
  const points = data.map((value, index) => 
    `${index * (100 / (data.length - 1))},${60 - (value * 0.5)}`
  ).join(' ');
  
  return (
    <svg className="w-full h-full" viewBox="0 0 100 60" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.1"/>
        </linearGradient>
      </defs>
      <polygon
        points={`0,60 ${points} 100,60`}
        fill="url(#areaGradient)"
      />
      <polyline
        points={points}
        fill="none"
        stroke="#8B5CF6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const RadialChart: React.FC<{ percentage: number }> = ({ percentage }) => {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <svg className="w-full h-full" viewBox="0 0 60 60" preserveAspectRatio="xMidYMid meet">
      <circle
        cx="30"
        cy="30"
        r={radius}
        fill="none"
        stroke="#E5E7EB"
        strokeWidth="4"
      />
      <circle
        cx="30"
        cy="30"
        r={radius}
        fill="none"
        stroke="#EF4444"
        strokeWidth="4"
        strokeDasharray={strokeDasharray}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        transform="rotate(-90 30 30)"
      />
      <text
        x="30"
        y="35"
        textAnchor="middle"
        fontSize="10"
        fill="#374151"
        fontWeight="bold"
      >
        {percentage}%
      </text>
    </svg>
  );
};

const GaugeChart: React.FC<{ percentage: number }> = ({ percentage }) => {
  const angle = (percentage / 100) * 180 - 90;
  
  return (
    <svg className="w-full h-full" viewBox="0 0 100 60" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#EF4444"/>
          <stop offset="50%" stopColor="#F59E0B"/>
          <stop offset="100%" stopColor="#10B981"/>
        </linearGradient>
      </defs>
      <path
        d="M 15 45 A 35 35 0 0 1 85 45"
        fill="none"
        stroke="#E5E7EB"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M 15 45 A 35 35 0 0 1 85 45"
        fill="none"
        stroke="url(#gaugeGradient)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray="110"
        strokeDashoffset={110 - (percentage / 100) * 110}
      />
      <line
        x1="50"
        y1="45"
        x2={50 + 25 * Math.cos(angle * Math.PI / 180)}
        y2={45 + 25 * Math.sin(angle * Math.PI / 180)}
        stroke="#374151"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
};

export const StatisticsCard: React.FC<StatisticsCardProps> = ({
  title,
  value,
  unit,
  description,
  chartType
}) => {
  const data = generateRandomData(8);
  const percentage = parseInt(value) || 75;

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return <BarChart data={data} />;
      case 'line':
        return <LineChart data={data} />;
      case 'donut':
        return <DonutChart percentage={percentage} />;
      case 'area':
        return <AreaChart data={data} />;
      case 'radial':
        return <RadialChart percentage={percentage} />;
      case 'gauge':
        return <GaugeChart percentage={percentage} />;
      default:
        return null;
    }
  };

  return (
    <BaseCard variant="operations" size="sm" className="h-[180px]">
      <div className="flex-1 flex gap-4 h-full overflow-hidden">
        {/* النصوص والأرقام - النصف الأول */}
        <div className="flex-1 flex flex-col justify-center overflow-hidden">
          <div className="text-center mb-4">
            <div className="text-2xl font-bold text-black font-arabic mb-2">
              {value}
            </div>
            <div className="text-sm font-bold text-black font-arabic mb-1">
              {title}
            </div>
            <div className="text-sm font-normal text-black font-arabic mb-3">
              {unit}
            </div>
          </div>
          <div className="text-xs font-normal text-gray-400 font-arabic text-center">
            {description}
          </div>
        </div>

        {/* الرسم البياني - النصف الثاني (3/5 من المساحة) */}
        <div className="flex-[3] flex justify-center items-center overflow-hidden p-2">
          <div className="w-full h-full flex items-center justify-center">
            {renderChart()}
          </div>
        </div>
      </div>
    </BaseCard>
  );
};
