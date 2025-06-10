
import React from 'react';

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
      
      <div className="glass-enhanced rounded-[40px] p-4 transition-all duration-200 ease-in-out">
        <ul className="space-y-2">
          {active.map(client => (
            <li key={client.id} className="border-b border-gray-200/60 last:border-0 pb-2 last:pb-0">
              <div className="flex justify-between items-center">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
                  {client.projects} مشروع
                </span>
                <h4 className="font-medium text-lg text-right">{client.name}</h4>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
