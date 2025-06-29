
import React from 'react';
import { ActiveClientsList } from './Clients/ActiveClientsList';
import { NPSScores } from './Clients/NPSScores';
import { AddClientButton } from './Clients/AddClientButton';

interface ActiveClient {
  id: number;
  name: string;
  projects: number;
}

interface NPSScore {
  id: number;
  score: number;
  client: string;
}

export interface ClientsData {
  active: ActiveClient[];
  nps: NPSScore[];
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
    <div className="space-y-6 h-full">
      <div className="text-right">
        <h2 className="text-2xl font-arabic font-semibold text-gray-800 mb-1">العملاء</h2>
        <p className="text-gray-600 text-sm">إدارة العلاقات مع العملاء</p>
      </div>
      
      <ActiveClientsList active={data.active} />
      <NPSScores nps={data.nps} />
      <AddClientButton />
    </div>
  );
};
