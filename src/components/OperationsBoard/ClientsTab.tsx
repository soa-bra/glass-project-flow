
import React from 'react';
import { OpportunityFunnel } from './Clients/OpportunityFunnel';
import { NPSScores } from './Clients/NPSScores';
import { ClientPortfolioHealth } from './Clients/ClientPortfolioHealth';
import { ClientSentiment } from './Clients/ClientSentiment';
import { BaseOperationsTabLayout } from './BaseOperationsTabLayout';
import { AppDashboardGrid } from '@/components/shared/layout/AppDashboardGrid';
import { AppGridItem } from '@/components/shared/layout/AppGridItem';

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
  const kpiStats = data ? [{
    title: "إجمالي العملاء",
    value: String(data.portfolioHealth.totalClients),
    unit: "عميل",
    description: "العملاء النشطين والسابقين"
  }, {
    title: "العقود النشطة",
    value: String(data.portfolioHealth.activeContracts),
    unit: "عقد",
    description: "عقود قيد التنفيذ"
  }, {
    title: "معدل التجديد",
    value: String(data.portfolioHealth.renewalRate),
    unit: "%",
    description: "نسبة تجديد العقود"
  }, {
    title: "رضا العملاء",
    value: data.portfolioHealth.clientSatisfaction.toFixed(1),
    unit: "/5",
    description: "متوسط تقييم رضا العملاء"
  }] : [];

  return (
    <BaseOperationsTabLayout
      value="clients"
      kpiStats={kpiStats}
      loading={loading}
      error={!data && !loading ? "لا توجد بيانات عملاء متاحة" : undefined}
    >
      {data && (
        <div className="space-y-6">
          <AppDashboardGrid columns={12} density="spacious">
            <AppGridItem colSpan={6} tabletSpan={6}>
              <OpportunityFunnel funnelData={data.opportunityFunnel} />
            </AppGridItem>
            <AppGridItem colSpan={6} tabletSpan={6}>
              <NPSScores nps={data.npsScores} />
            </AppGridItem>
          </AppDashboardGrid>

          {/* تحليل المشاعر */}
          <ClientSentiment sentimentData={data.sentimentData} />
        </div>
      )}
    </BaseOperationsTabLayout>
  );
};
