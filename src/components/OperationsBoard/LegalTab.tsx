
import React from 'react';
import { ContractsStatus } from './Legal/ContractsStatus';
import { UpcomingContracts } from './Legal/UpcomingContracts';
import { UploadButton } from './Legal/UploadButton';

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
    return <div className="h-full flex items-center justify-center">جارٍ التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-arabic font-medium text-right">الشؤون القانونية</h2>
      
      <ContractsStatus contracts={data.contracts} />
      <UpcomingContracts upcoming={data.upcoming} />
      <UploadButton />
    </div>
  );
};

export default LegalTab;
