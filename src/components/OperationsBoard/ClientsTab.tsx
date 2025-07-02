
import React from 'react';
import { OpportunityFunnel } from './Clients/OpportunityFunnel';
import { NPSScores } from './Clients/NPSScores';
import { ClientPortfolioHealth } from './Clients/ClientPortfolioHealth';
import { ClientSentiment } from './Clients/ClientSentiment';

interface FunnelStage {
  stage: string;
  count: number;
  value: number;
  conversionRate?: number;
}

interface NPSScore {
  id: number;
  score: number;
  client: string;
  category: 'promoter' | 'passive' | 'detractor';
  feedback?: string;
  date: string;
}

interface PortfolioHealth {
  totalClients: number;
  activeContracts: number;
  renewalRate: number;
  churnRate: number;
  avgContractValue: number;
  clientSatisfaction: number;
}

interface SentimentData {
  clientId: string;
  clientName: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  score: number;
  lastInteraction: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface ClientsData {
  opportunityFunnel: FunnelStage[];
  npsScores: NPSScore[];
  portfolioHealth: PortfolioHealth;
  sentimentData: SentimentData[];
}

interface ClientsTabProps {
  data?: ClientsData;
  loading: boolean;
}

export const ClientsTab: React.FC<ClientsTabProps> = ({ data, loading }) => {
  if (loading || !data) {
    return <div className="h-full flex items-center justify-center text-gray-600 font-arabic">جارٍ التحميل...</div>;
  }

  return (
    <div className="space-y-6 h-full overflow-auto">
      <div className="text-right">
        <h2 className="text-2xl font-arabic font-semibold text-gray-800 mb-1">علاقات العملاء</h2>
        <p className="text-gray-600 text-sm">مواءمة صحة المحفظة مع تجربة العملاء</p>
      </div>
      
      {/* صحة محفظة العملاء */}
      <ClientPortfolioHealth portfolioHealth={data.portfolioHealth} />
      
      {/* الرسوم البيانية الأساسية */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <OpportunityFunnel funnelData={data.opportunityFunnel} />
        <NPSScores nps={data.npsScores} />
      </div>
      
      {/* تحليل المشاعر */}
      <ClientSentiment sentimentData={data.sentimentData} />
    </div>
  );
};
