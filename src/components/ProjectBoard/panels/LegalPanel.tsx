
import React from 'react';
import { ProjectCardProps } from '@/components/ProjectCard/types';

interface LegalPanelProps {
  project: ProjectCardProps;
}

export const LegalPanel: React.FC<LegalPanelProps> = ({ project }) => {
  const contracts = [
    { id: 1, name: 'عقد التطوير الأساسي', status: 'نشط', date: '2024-12-01' },
    { id: 2, name: 'اتفاقية السرية', status: 'مكتمل', date: '2024-11-15' },
    { id: 3, name: 'عقد الاستضافة', status: 'معلق', date: '2025-01-20' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      <div className="rounded-3xl bg-white/30 backdrop-blur-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold font-arabic text-gray-800 mb-4">العقود النشطة</h3>
        <div className="space-y-3">
          {contracts.map(contract => (
            <div key={contract.id} className="p-4 bg-white/40 rounded-2xl backdrop-blur-sm">
              <h4 className="font-arabic font-semibold text-gray-800">{contract.name}</h4>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-600 font-arabic">{contract.date}</span>
                <span className={`text-xs px-2 py-1 rounded-full font-arabic ${
                  contract.status === 'نشط' ? 'bg-green-100 text-green-800' :
                  contract.status === 'مكتمل' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {contract.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl bg-white/30 backdrop-blur-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold font-arabic text-gray-800 mb-4">المستندات القانونية</h3>
        <div className="text-center text-gray-500 font-arabic">
          لا توجد مستندات حاليًا
        </div>
      </div>
    </div>
  );
};
