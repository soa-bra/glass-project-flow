
import React from 'react';

interface DelayedMilestone {
  id: string;
  projectName: string;
  milestone: string;
  originalDate: string;
  currentDate: string;
  delayDays: number;
  impact: 'high' | 'medium' | 'low';
}

interface DelayedMilestonesProps {
  delayedMilestones: DelayedMilestone[];
}

export const DelayedMilestones: React.FC<DelayedMilestonesProps> = ({ delayedMilestones }) => {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return '#f1b5b9';
      case 'medium':
        return '#fbe2aa';
      case 'low':
        return '#bdeed3';
      default:
        return '#d0e0e2';
    }
  };

  return (
    <div className="p-6 rounded-3xl border border-black/10" style={{ backgroundColor: '#d0e0e2' }}>
      <div className="mb-6">
        <h3 className="text-large font-semibold text-black font-arabic">المعالم المتأخرة</h3>
      </div>
      <div className="space-y-4">
        {delayedMilestones.map((milestone) => (
          <div key={milestone.id} className="p-4 rounded-2xl bg-white/50 border border-black/10">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="text-sm font-bold text-black font-arabic">{milestone.projectName}</h4>
                <p className="text-sm font-medium text-black font-arabic">{milestone.milestone}</p>
              </div>
              <span 
                className="px-3 py-1 rounded-full text-xs font-normal text-black"
                style={{ backgroundColor: getImpactColor(milestone.impact) }}
              >
                {milestone.impact === 'high' ? 'تأثير عالي' : 
                 milestone.impact === 'medium' ? 'تأثير متوسط' : 'تأثير منخفض'}
              </span>
            </div>
            <div className="flex justify-between text-xs font-normal text-gray-400 font-arabic">
              <span>التاريخ الأصلي: {milestone.originalDate}</span>
              <span>متأخر {milestone.delayDays} يوم</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
