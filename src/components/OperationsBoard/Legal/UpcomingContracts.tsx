
import React from 'react';
import GenericCard from '@/components/ui/GenericCard';

interface UpcomingContract {
  id: number;
  title: string;
  date: string;
  client: string;
}

interface UpcomingContractsProps {
  upcoming: UpcomingContract[];
}

export const UpcomingContracts: React.FC<UpcomingContractsProps> = ({ upcoming }) => {
  return (
    <div>
      <h3 className="text-xl font-arabic font-medium text-right mb-4">أقرب العقود للتجديد</h3>
      
      <div className="grid gap-3">
        {upcoming.map(contract => {
          const daysLeft = Math.ceil((new Date(contract.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          
          return (
            <GenericCard key={contract.id}>
              <div className="flex justify-between items-center">
                <div className="text-center bg-gray-100 rounded-full py-1 px-3 text-sm">
                  <span className={`font-bold ${daysLeft < 10 ? 'text-red-500' : 'text-blue-600'}`}>
                    {daysLeft} أيام
                  </span>
                </div>
                
                <div className="text-right">
                  <h4 className="font-medium">{contract.title}</h4>
                  <p className="text-sm text-gray-600">{contract.client}</p>
                  <p className="text-xs text-gray-500 mt-1">{new Date(contract.date).toLocaleDateString('ar-SA')}</p>
                </div>
              </div>
            </GenericCard>
          );
        })}
      </div>
    </div>
  );
};
