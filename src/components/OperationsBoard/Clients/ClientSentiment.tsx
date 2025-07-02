import React from 'react';

interface SentimentData {
  clientId: string;
  clientName: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  score: number;
  lastInteraction: string;
  riskLevel: 'low' | 'medium' | 'high';
}

interface ClientSentimentProps {
  sentimentData: SentimentData[];
}

export const ClientSentiment: React.FC<ClientSentimentProps> = ({ sentimentData }) => {
  return <div className="text-center text-gray-500 font-arabic">قيد التطوير</div>;
};