
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

interface ClientsData {
  active: ActiveClient[];
  nps: NPSScore[];
}

interface ClientsTabProps {
  data?: ClientsData;
  loading: boolean;
}

export const ClientsTab: React.FC<ClientsTabProps> = ({ data, loading }) => {
  if (loading || !data) {
    return <div className="h-full flex items-center justify-center">جارٍ التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-arabic font-medium text-right">العملاء</h2>
      
      <ActiveClientsList active={data.active} />
      <NPSScores nps={data.nps} />
      <AddClientButton />
    </div>
  );
};
