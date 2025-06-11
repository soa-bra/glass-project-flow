
import React from 'react';
import GenericCard from '@/components/ui/GenericCard';

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
    <div>
      <h3 className="text-xl font-arabic font-medium text-right mb-4">توزيع الأعضاء على المشاريع</h3>
      
      <GenericCard className="space-y-4">
        {sortedDistribution.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">{item.members}</span>
              <span className="text-right">{item.project}</span>
            </div>
            <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-500"
                style={{width: `${(item.members / maxMembers) * 100}%`}}
              ></div>
            </div>
          </div>
        ))}
      </GenericCard>
    </div>
  );
};
