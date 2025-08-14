import React from 'react';
import { cn } from '@/lib/utils';

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: any;
    name: string;
    color: string;
    dataKey: string;
  }>;
  label?: string;
  labelFormatter?: (label: any) => string;
  valueFormatter?: (value: any, name: string) => string;
}

export const SoaChartTooltip: React.FC<ChartTooltipProps> = ({
  active,
  payload,
  label,
  labelFormatter,
  valueFormatter
}) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className={cn(
      'bg-soabra-ink text-soabra-white rounded-tooltip px-3 py-2',
      'shadow-[0_8px_24px_rgba(0,0,0,0.24)] border-none'
    )}>
      {label && (
        <p className="text-body font-medium mb-1">
          {labelFormatter ? labelFormatter(label) : label}
        </p>
      )}
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-body text-soabra-white/70">
            {entry.name}:
          </span>
          <span className="text-subtitle font-medium">
            {valueFormatter ? valueFormatter(entry.value, entry.name) : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

interface ChartContainerProps {
  children: React.ReactNode;
  className?: string;
  config?: Record<string, any>;
}

export const SoaChartContainer: React.FC<ChartContainerProps> = ({
  children,
  className = '',
  config = {}
}) => {
  return (
    <div className={cn('w-full h-full', className)}>
      {children}
    </div>
  );
};

// Chart Configuration based on SoaBra Design Tokens
export const soaChartConfig = {
  colors: {
    primary: '#0B0F12',      // soabra-ink
    accent: {
      green: '#3DBE8B',      // soabra-accent-green
      yellow: '#F6C445',     // soabra-accent-yellow  
      red: '#E5564D',        // soabra-accent-red
      blue: '#3DA8F5'        // soabra-accent-blue
    },
    neutral: {
      60: 'rgba(11,15,18,0.60)',  // soabra-ink-60
      30: 'rgba(11,15,18,0.30)',  // soabra-ink-30
      10: 'rgba(11,15,18,0.10)'   // Light grid
    }
  },
  grid: {
    stroke: 'rgba(11,15,18,0.08)',
    strokeWidth: 1
  },
  axis: {
    stroke: 'rgba(11,15,18,0.30)',
    fontSize: 12,
    fontFamily: 'IBM Plex Sans Arabic, system-ui, sans-serif'
  },
  line: {
    strokeWidth: 2,
    dot: {
      r: 3,
      strokeWidth: 2
    }
  },
  bar: {
    radius: 8
  },
  tooltip: {
    backgroundColor: '#0B0F12',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: 10,
    boxShadow: '0 8px 24px rgba(0,0,0,0.24)'
  }
};