
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';

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
    <BaseCard 
      size="lg"
      header={
        <h3 className="text-lg font-arabic font-bold text-gray-800">
          أقرب العقود للتجديد
        </h3>
      }
    >
      <div className="space-y-3">
        {upcoming.map(contract => {
          const daysLeft = Math.ceil((new Date(contract.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          
          return (
            <div 
              key={contract.id} 
              className="bg-white/30 backdrop-blur-sm rounded-2xl p-4 transition-all duration-200 ease-in-out hover:bg-white/50 border border-white/20"
            >
              <div className="flex justify-between items-center">
                <div className="text-center bg-gray-100/80 backdrop-blur-sm rounded-full py-2 px-4 text-sm">
                  <span className={`font-bold ${daysLeft < 10 ? 'text-red-500' : 'text-blue-600'}`}>
                    {daysLeft} أيام
                  </span>
                </div>
                
                <div className="text-right">
                  <h4 className="font-medium text-gray-800">{contract.title}</h4>
                  <p className="text-sm text-gray-600">{contract.client}</p>
                  <p className="text-xs text-gray-500 mt-1">{new Date(contract.date).toLocaleDateString('ar-SA')}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </BaseCard>
  );
};
