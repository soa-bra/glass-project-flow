import React from 'react';
import { AlertTriangle, Clock } from 'lucide-react';

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
  const getImpactStyle = (impact: string) => {
    switch (impact) {
      case 'high': return { bg: '#f1b5b9', text: 'تأثير عالي' };
      case 'medium': return { bg: '#fbe2aa', text: 'تأثير متوسط' };
      case 'low': return { bg: '#a4e2f6', text: 'تأثير منخفض' };
      default: return { bg: '#e5e7eb', text: 'غير محدد' };
    }
  };

  return (
    <div className="rounded-[24px] bg-[#FFFFFF] ring-1 ring-[#DADCE0] p-6 h-full">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[11px] font-medium text-[rgba(11,15,18,0.6)] uppercase tracking-wide">المعالم المتأخرة</h3>
        <div className="w-8 h-8 rounded-full ring-1 ring-[rgba(11,15,18,0.15)] flex items-center justify-center">
          <AlertTriangle className="h-4 w-4 text-[#E5564D]" />
        </div>
      </div>

      <div className="space-y-3 max-h-[380px] overflow-y-auto">
        {delayedMilestones.length === 0 ? (
          <div className="text-center py-10 text-[rgba(11,15,18,0.4)] text-sm">
            لا توجد معالم متأخرة حالياً
          </div>
        ) : (
          delayedMilestones.map(milestone => {
            const impact = getImpactStyle(milestone.impact);
            return (
              <div key={milestone.id} className="rounded-[18px] ring-1 ring-[rgba(11,15,18,0.08)] p-4 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h4 className="font-bold text-[#0B0F12] text-sm mb-1">{milestone.milestone}</h4>
                    <p className="text-[11px] text-[rgba(11,15,18,0.5)]">المشروع: {milestone.projectName}</p>
                  </div>
                  <div className="px-2.5 py-1 rounded-full" style={{ backgroundColor: impact.bg }}>
                    <span className="text-[10px] font-medium text-[#0B0F12]">{impact.text}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[rgba(11,15,18,0.5)] mt-3 pt-3 border-t border-[rgba(11,15,18,0.06)]">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    <span className="font-semibold text-[#0B0F12] text-sm">{milestone.delayDays}</span>
                    <span>يوم تأخير</span>
                  </div>
                  <div className="text-left text-[10px]">
                    <div>الأصلي: {milestone.originalDate}</div>
                    <div>الحالي: {milestone.currentDate}</div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
