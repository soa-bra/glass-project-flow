import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface NPSScore {
  id: number;
  score: number;
  client: string;
  category: 'promoter' | 'passive' | 'detractor';
  feedback?: string;
  date: string;
}

interface NPSScoresProps {
  nps: NPSScore[];
}

export const NPSScores: React.FC<NPSScoresProps> = ({ nps }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right font-arabic">درجات رضا العملاء (NPS)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center text-gray-500 font-arabic">قيد التطوير</div>
      </CardContent>
    </Card>
  );
};

interface FunnelStage {
  stage: string;
  count: number;
  value: number;
  conversionRate?: number;
}

interface OpportunityFunnelProps {
  funnelData: FunnelStage[];
}

export const OpportunityFunnel: React.FC<OpportunityFunnelProps> = ({ funnelData }) => {
  return <div className="text-center text-gray-500 font-arabic">قيد التطوير</div>;
};