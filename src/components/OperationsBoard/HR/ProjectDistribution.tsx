
import React, { useMemo } from 'react';
import { BaseCard } from '@/components/ui/BaseCard';

interface ProjectDistribution {
  project: string;
  members: number;
}

interface ProjectDistributionProps {
  distribution: ProjectDistribution[];
}

export const ProjectDistribution: React.FC<ProjectDistributionProps> = React.memo(({ distribution }) => {
  const { sortedDistribution, maxMembers } = useMemo(() => {
    const sorted = [...distribution].sort((a, b) => b.members - a.members);
    const max = Math.max(...sorted.map(item => item.members));
    return {
      sortedDistribution: sorted,
      maxMembers: max
    };
  }, [distribution]);

  const gradientClassName = useMemo(() => 
    "h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-700 ease-out",
    []
  );

  return (
    <BaseCard 
      size="lg"
      header={
        <h3 className="text-lg font-arabic font-bold text-gray-800">
          توزيع الأعضاء على المشاريع
        </h3>
      }
    >
      <div className="space-y-4">
        {sortedDistribution.map((item, index) => (
          <div key={`${item.project}-${index}`}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-blue-600">{item.members}</span>
              <span className="text-right font-medium">{item.project}</span>
            </div>
            <div className="h-6 bg-gray-200/50 rounded-full overflow-hidden">
              <div 
                className={gradientClassName}
                style={{width: `${(item.members / maxMembers) * 100}%`}}
              />
            </div>
          </div>
        ))}
      </div>
    </BaseCard>
  );
});

ProjectDistribution.displayName = 'ProjectDistribution';
