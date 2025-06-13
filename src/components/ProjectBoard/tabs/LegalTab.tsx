
import React from 'react';
import { ProjectCardProps } from '@/components/ProjectCard/types';

interface LegalTabProps {
  project: ProjectCardProps;
}

const LegalTab: React.FC<LegalTabProps> = ({ project }) => {
  const contracts = [
    { id: 1, name: 'عقد التطوير الأساسي', status: 'active', renewal: '2025-06-15', urgent: false },
    { id: 2, name: 'اتفاقية السرية', status: 'signed', renewal: '2025-12-01', urgent: false },
    { id: 3, name: 'عقد الاستضافة', status: 'pending', renewal: '2025-01-20', urgent: true },
  ];

  return (
    <div className="h-full">
      <div className="rounded-3xl backdrop-blur-3xl bg-white/40 p-6 h-full">
        <h3 className="text-xl font-bold font-arabic text-gray-800 mb-6">جدول زمني للعقود</h3>
        <div className="space-y-4">
          {contracts.map((contract, index) => (
            <div key={contract.id} className="relative">
              {/* Timeline line */}
              {index < contracts.length - 1 && (
                <div className="absolute right-4 top-8 w-0.5 h-12 bg-gray-300"></div>
              )}
              
              <div className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  contract.urgent ? 'bg-red-500' : 'bg-blue-500'
                }`}>
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                
                <div className="flex-1 p-4 rounded-2xl bg-white/40">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-arabic font-semibold text-gray-800">{contract.name}</h4>
                    {contract.urgent && (
                      <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full font-arabic">
                        عاجل
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 font-arabic">
                    تجديد: {contract.renewal}
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full inline-block mt-2 font-arabic ${
                    contract.status === 'active' ? 'bg-green-100 text-green-800' :
                    contract.status === 'signed' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {contract.status === 'active' ? 'نشط' : 
                     contract.status === 'signed' ? 'موقع' : 'معلق'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LegalTab;
