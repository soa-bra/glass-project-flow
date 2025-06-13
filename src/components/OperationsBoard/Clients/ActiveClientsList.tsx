
import React from 'react';
import { GenericCard } from '@/components/ui/GenericCard';
import { SoaBraBadge } from '@/components/ui/SoaBraBadge';

interface ActiveClient {
  id: number;
  name: string;
  projects: number;
}

interface ActiveClientsListProps {
  active: ActiveClient[];
}

export const ActiveClientsList: React.FC<ActiveClientsListProps> = ({ active }) => {
  return (
    <div>
      <h3 className="text-xl font-arabic font-medium text-right mb-4">العملاء النشطين</h3>
      
      <GenericCard>
        <ul className="space-y-2">
          {active.map(client => (
            <li key={client.id} className="border-b border-gray-200/60 last:border-0 pb-2 last:pb-0">
              <div className="flex justify-between items-center">
                <SoaBraBadge variant="primary" size="sm">
                  {client.projects} مشروع
                </SoaBraBadge>
                <h4 className="font-medium text-lg text-right">{client.name}</h4>
              </div>
            </li>
          ))}
        </ul>
      </GenericCard>
    </div>
  );
};
