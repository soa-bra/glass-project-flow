import React from 'react';
import { NumericStatCard } from '@/components/shared/visual-data';
import { AppDashboardGrid } from '@/components/shared/layout/AppDashboardGrid';
import { AppGridItem } from '@/components/shared/layout/AppGridItem';

interface PortfolioHealth {
  totalClients: number;
  activeContracts: number;
  renewalRate: number;
  churnRate: number;
  avgContractValue: number;
  clientSatisfaction: number;
}

interface ClientPortfolioHealthProps {
  portfolioHealth: PortfolioHealth;
}

export const ClientPortfolioHealth: React.FC<ClientPortfolioHealthProps> = ({
  portfolioHealth
}) => {
  return (
    <AppDashboardGrid columns={12} density="compact">
      <AppGridItem colSpan={4}>
        <NumericStatCard title="إجمالي العملاء" value={portfolioHealth.totalClients} unit="عميل" size="sm" />
      </AppGridItem>
      <AppGridItem colSpan={4}>
        <NumericStatCard title="العقود النشطة" value={portfolioHealth.activeContracts} unit="عقد" accentColor="#3DBE8B" size="sm" />
      </AppGridItem>
      <AppGridItem colSpan={4}>
        <NumericStatCard title="متوسط قيمة العقد" value={portfolioHealth.avgContractValue.toLocaleString()} unit="ر.س" accentColor="#3DA8F5" size="sm" />
      </AppGridItem>
      <AppGridItem colSpan={4}>
        <NumericStatCard title="معدل التجديد" value={`${portfolioHealth.renewalRate}%`} accentColor="#3DBE8B" size="sm" />
      </AppGridItem>
      <AppGridItem colSpan={4}>
        <NumericStatCard title="معدل التسرب" value={`${portfolioHealth.churnRate}%`} accentColor="#E5564D" size="sm" />
      </AppGridItem>
      <AppGridItem colSpan={4}>
        <NumericStatCard title="رضا العملاء" value={`${portfolioHealth.clientSatisfaction}/5`} size="sm" />
      </AppGridItem>
    </AppDashboardGrid>
  );
};
