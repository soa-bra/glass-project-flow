import React from 'react';
import { Project } from '@/types/project';
import { AppCardSurface } from '@/components/shared/surfaces/AppCardSurface';

interface AICardProps {
  project: Project;
}

export const AIBox: React.FC<AICardProps> = ({ project }) => {
  const suggestions = [
    { id: 1, type: 'team', title: 'إضافة مطور واجهات', description: 'يُنصح بإضافة مطور واجهات متخصص لتسريع العمل في المرحلة القادمة', priority: 'high' },
    { id: 2, type: 'budget', title: 'مراجعة الميزانية', description: 'تم صرف 75% من الميزانية، يُنصح بمراجعة المصروفات المتبقية', priority: 'medium' },
    { id: 3, type: 'legal', title: 'تجديد التراخيص', description: 'ينتهي ترخيص البرمجيات المستخدمة في 15 يوماً', priority: 'high' },
  ];

  const getPriorityStyle = (p: string) => {
    switch (p) {
      case 'high': return { bg: '#f1b5b9', text: 'عالي' };
      case 'medium': return { bg: '#fbe2aa', text: 'متوسط' };
      default: return { bg: '#bdeed3', text: 'منخفض' };
    }
  };

  return (
    <div className="h-full rounded-[24px] bg-[#FFFFFF] ring-1 ring-[#DADCE0] p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-full ring-1 ring-[rgba(11,15,18,0.15)] flex items-center justify-center text-sm">🤖</div>
        <h3 className="text-[11px] font-medium text-[rgba(11,15,18,0.6)] uppercase tracking-wide">اقتراحات الذكاء الاصطناعي</h3>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {suggestions.map((s) => {
          const ps = getPriorityStyle(s.priority);
          return (
            <div key={s.id} className="rounded-[18px] ring-1 ring-[rgba(11,15,18,0.08)] p-4 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-bold text-[#0B0F12] text-sm flex-1">{s.title}</h4>
                <div className="px-2.5 py-0.5 rounded-full" style={{ backgroundColor: ps.bg }}>
                  <span className="text-[10px] font-medium text-[#0B0F12]">{ps.text}</span>
                </div>
              </div>
              <p className="text-[12px] text-[rgba(11,15,18,0.6)] leading-relaxed">{s.description}</p>
              <div className="flex gap-2 mt-3">
                <button className="px-3 py-1.5 bg-[#0B0F12] text-white rounded-full text-[11px] font-medium hover:bg-[rgba(11,15,18,0.85)] transition-colors">تطبيق</button>
                <button className="px-3 py-1.5 rounded-full text-[11px] font-medium ring-1 ring-[rgba(11,15,18,0.15)] text-[#0B0F12] hover:bg-[rgba(11,15,18,0.05)] transition-colors">تجاهل</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
