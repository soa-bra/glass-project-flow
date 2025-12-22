
import React from 'react';
import { BaseBox } from '@/components/ui/BaseBox';

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
    <BaseBox 
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
            <BaseBox
              key={contract.id}
              size="sm"
              variant="glass"
              className="p-4"
            >
              <div className="flex justify-between items-center">
                <div className="text-center">
                  <BaseBox 
                    size="sm"
                    variant="flat"
                    color={daysLeft < 10 ? 'crimson' : 'info'}
                    className="py-2 px-4 min-h-fit"
                  >
                    <span className="font-bold text-white text-sm">
                      {daysLeft} أيام
                    </span>
                  </BaseBox>
                </div>
                
                <div className="text-right">
                  <h4 className="font-medium text-gray-800">{contract.title}</h4>
                  <p className="text-sm text-gray-600">{contract.client}</p>
                  <p className="text-xs text-gray-500 mt-1">{new Date(contract.date).toLocaleDateString('ar-SA')}</p>
                </div>
              </div>
            </BaseBox>
          );
        })}
      </div>
    </BaseBox>
  );
};
