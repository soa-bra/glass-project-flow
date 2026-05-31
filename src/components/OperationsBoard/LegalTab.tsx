
import React from 'react';
import { ContractsStatus } from './Legal/ContractsStatus';
import { UpcomingContracts } from './Legal/UpcomingContracts';
import { UploadButton } from './Legal/UploadButton';
import { AppDashboardGrid } from '@/components/shared/layout/AppDashboardGrid';
import { AppGridItem } from '@/components/shared/layout/AppGridItem';

interface ContractCount {
  signed: number;
  pending: number;
  expired: number;
}

interface UpcomingContract {
  id: number;
  title: string;
  date: string;
  client: string;
}

interface LegalData {
  contracts: ContractCount;
  upcoming: UpcomingContract[];
}

interface LegalTabProps {
  data?: LegalData;
  loading: boolean;
}

const LegalTab: React.FC<LegalTabProps> = ({ data, loading }) => {
  if (loading || !data) {
    return <div className="h-full flex items-center justify-center text-[rgba(11,15,18,0.6)] font-arabic">جارٍ التحميل...</div>;
  }

  return (
    <div className="space-y-6 h-full">
      <div className="text-right">
        <h2 className="text-2xl font-arabic font-semibold text-[#0B0F12] mb-1">الشؤون القانونية</h2>
        <p className="text-[rgba(11,15,18,0.6)] text-sm">إدارة العقود والوثائق القانونية</p>
      </div>

      <AppDashboardGrid columns={12} density="spacious">
        <AppGridItem colSpan={6} tabletSpan={6}>
          <ContractsStatus contracts={data.contracts} />
        </AppGridItem>
        <AppGridItem colSpan={6} tabletSpan={6}>
          <UpcomingContracts upcoming={data.upcoming} />
        </AppGridItem>
        <AppGridItem colSpan={12} tabletSpan={6}>
          <UploadButton />
        </AppGridItem>
      </AppDashboardGrid>
    </div>
  );
};

export default LegalTab;
