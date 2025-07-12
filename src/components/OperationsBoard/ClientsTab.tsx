
import React from 'react';
import { OpportunityFunnel } from './Clients/OpportunityFunnel';
import { NPSScores } from './Clients/NPSScores';
import { ClientPortfolioHealth } from './Clients/ClientPortfolioHealth';
import { ClientSentiment } from './Clients/ClientSentiment';
import { KPIStatsSection } from '@/components/shared/KPIStatsSection';

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

  // إعداد بيانات KPI
  const kpiStats = [
    {
      title: "إجمالي العملاء",
      value: data.portfolioHealth.totalClients,
      unit: "عميل"
    },
    {
      title: "العقود النشطة", 
      value: data.portfolioHealth.activeContracts,
      unit: "عقد"
    },
    {
      title: "معدل التجديد",
      value: data.portfolioHealth.renewalRate,
      unit: "%"
    },
    {
      title: "رضا العملاء",
      value: data.portfolioHealth.clientSatisfaction,
      unit: "/5"
    }
  ];

  return (
    <div className="space-y-4 h-full overflow-auto">
      {/* العنوان و KPI في نفس السطر */}
      <div className="flex justify-between items-start px-6 pt-6">
        <div className="text-right">
          <h2 className="text-lg font-semibold text-black font-arabic mb-1">علاقات العملاء</h2>
          <p className="text-xs font-normal text-gray-400 font-arabic">مواءمة صحة المحفظة مع تجربة العملاء</p>
        </div>
        <KPIStatsSection stats={kpiStats} className="flex-1 max-w-2xl" />
      </div>
      
      {/* الرسوم البيانية الأساسية */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 px-6">
        <OpportunityFunnel funnelData={data.opportunityFunnel} />
        <NPSScores nps={data.npsScores} />
      </div>
      
      {/* تحليل المشاعر */}
      <div className="px-6">
        <ClientSentiment sentimentData={data.sentimentData} />
      </div>
    </div>
  );
};
