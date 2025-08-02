
import React from 'react';
import { UnifiedCard } from '@/components/shared/UnifiedCard';
import { TYPOGRAPHY, COLORS } from '@/components/shared/design-system/constants';

interface ProjectDistribution {
  project: string;
  members: number;
}

interface ProjectDistributionProps {
  distribution: ProjectDistribution[];
}

export const ProjectDistribution: React.FC<ProjectDistributionProps> = ({ distribution }) => {
  const sortedDistribution = [...distribution].sort((a, b) => b.members - a.members);
  const maxMembers = Math.max(...sortedDistribution.map(item => item.members));

  return (
    <UnifiedCard 
      title="توزيع الأعضاء على المشاريع"
    >
      <div className="space-y-4">
        {sortedDistribution.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-blue-600">{item.members}</span>
              <span className="text-right font-medium">{item.project}</span>
            </div>
            <div className="h-6 bg-gray-200/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-700 ease-out"
                style={{width: `${(item.members / maxMembers) * 100}%`}}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </UnifiedCard>
  );
};
