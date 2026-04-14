import React from 'react';
import { AppCardSurface } from '@/components/shared/surfaces/AppCardSurface';

interface FunnelStage {
  stage: string;
  count: number;
  value: number;
  conversionRate?: number;
}
interface OpportunityFunnelProps {
  funnelData: FunnelStage[];
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(220, 14%, 80%)', 'hsl(220, 14%, 60%)'];

export const OpportunityFunnel: React.FC<OpportunityFunnelProps> = ({ funnelData }) => {
  return (
    <AppCardSurface density="standard">
      <h3 className="text-lg font-semibold text-right font-arabic mb-4">قمع الفرص التجارية</h3>
      <div className="space-y-4">
        {funnelData.map((stage, index) => {
          const width = stage.count / funnelData[0].count * 100;
          return (
            <div key={index} className="relative">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">{stage.stage}</span>
                <span className="text-sm text-gray-600">{stage.conversionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-8 relative overflow-hidden">
                <div
                  className="h-8 rounded-full transition-all duration-300 flex items-center justify-center text-white text-sm font-medium"
                  style={{ width: `${width}%`, backgroundColor: COLORS[index % COLORS.length] }}
                >
                  {stage.count} ({(stage.value / 1000).toFixed(0)}k ر.س)
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AppCardSurface>
  );
};
