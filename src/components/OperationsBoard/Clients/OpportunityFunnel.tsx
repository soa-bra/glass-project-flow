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
  npsData: NPSScore[];
}

export const NPSScores: React.FC<NPSScoresProps> = ({ npsData }) => {
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

export const OpportunityFunnel = () => <div>قيد التطوير</div>;
export const ClientPortfolioHealth = () => <div>قيد التطوير</div>;
export const ClientSentiment = () => <div>قيد التطوير</div>;