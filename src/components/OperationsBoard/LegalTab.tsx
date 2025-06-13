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
const LegalTab: React.FC<LegalTabProps> = ({
  data,
  loading
}) => {
  if (loading || !data) {
    return <div className="h-full flex items-center justify-center text-gray-600 font-arabic">جارٍ التحميل...</div>;
  }
  return <div className=" h-full">
      <div className="text-right">
        <h2 className="text-2xl font-arabic font-semibold text-gray-800 mb-1">الشؤون القانونية</h2>
        <p className="text-gray-600 text-sm">إدارة العقود والوثائق القانونية</p>
      </div>
      
      <ContractsStatus contracts={data.contracts} />
      <UpcomingContracts upcoming={data.upcoming} />
      <UploadButton />
    </div>;
};
export default LegalTab;