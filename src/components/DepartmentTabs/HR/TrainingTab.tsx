import React, { useState } from 'react';
import { BookOpen, Users, Clock, Play } from 'lucide-react';
import { BaseActionButton } from '@/components/shared/BaseActionButton';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { MetricHeroCard } from '@/components/shared/visual-data/MetricHeroCard';
import { mockTrainingPrograms, mockEmployees } from './data';
import { getHRStatusColor, getHRStatusText } from './utils';

export const TrainingTab: React.FC = () => {
  const [selectedView, setSelectedView] = useState<'programs' | 'enrollments'>('programs');

  const trainingStats = {
    activePrograms: 8,
    totalEnrollments: 156,
    completedCourses: 89,
    certificatesIssued: 67,
    averageRating: 4.3,
    upcomingPrograms: 4,
  };

  const getFormatLabel = (format: string) => {
    const formats: Record<string, string> = { online: 'عبر الإنترنت', inPerson: 'حضوري', hybrid: 'مختلط' };
    return formats[format] || format;
  };

  const mockEnrollments = [
    { id: 'enr-001', employeeId: 'emp-001', programId: 'train-001', enrollmentDate: '2024-12-20', status: 'enrolled', progress: 0 },
    { id: 'enr-002', employeeId: 'emp-002', programId: 'train-002', enrollmentDate: '2024-12-22', status: 'enrolled', progress: 0 },
  ];

  const getEmployeeName = (employeeId: string) => mockEmployees.find(e => e.id === employeeId)?.name || 'غير معروف';
  const getProgramTitle = (programId: string) => mockTrainingPrograms.find(p => p.id === programId)?.title || 'غير معروف';

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricHeroCard title="البرامج النشطة" value={trainingStats.activePrograms} className="min-h-[120px]" />
        <MetricHeroCard title="إجمالي التسجيلات" value={trainingStats.totalEnrollments} className="min-h-[120px]" />
        <MetricHeroCard title="الدورات المكتملة" value={trainingStats.completedCourses} className="min-h-[120px]" />
        <MetricHeroCard title="الشهادات الصادرة" value={trainingStats.certificatesIssued} className="min-h-[120px]" />
        <MetricHeroCard title="متوسط التقييم" value={trainingStats.averageRating} unit="/5" className="min-h-[120px]" />
        <MetricHeroCard title="البرامج القادمة" value={trainingStats.upcomingPrograms} className="min-h-[120px]" />
      </div>

      {/* Toggle */}
      <div className="rounded-[24px] bg-white border border-[#DADCE0] p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-[#0B0F12]" />
            <span className="text-xs font-medium text-[rgba(11,15,18,0.50)] font-arabic tracking-wide uppercase">
              إدارة التدريب والتطوير
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedView('programs')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium font-arabic transition-colors ${selectedView === 'programs' ? 'bg-[#0B0F12] text-white' : 'border border-[#DADCE0] text-[#0B0F12] hover:bg-[#d9e7ed]/50'}`}
            >
              البرامج التدريبية
            </button>
            <button
              onClick={() => setSelectedView('enrollments')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium font-arabic transition-colors ${selectedView === 'enrollments' ? 'bg-[#0B0F12] text-white' : 'border border-[#DADCE0] text-[#0B0F12] hover:bg-[#d9e7ed]/50'}`}
            >
              التسجيلات
            </button>
          </div>
        </div>

        {selectedView === 'programs' ? (
          <div className="space-y-4">
            {mockTrainingPrograms.map((program, index) => (
              <div key={index} className="rounded-[18px] border border-[#DADCE0] p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-bold text-[#0B0F12] font-arabic">{program.title}</h4>
                      <BaseBadge className={getHRStatusColor(program.status)}>{getHRStatusText(program.status)}</BaseBadge>
                    </div>
                    <p className="text-[11px] text-[rgba(11,15,18,0.50)] font-arabic">{program.description}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[11px] text-[rgba(11,15,18,0.50)] font-arabic mb-3">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{program.duration} ساعة</span>
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" />{program.enrolledCount}/{program.maxParticipants}</span>
                  <span className="flex items-center gap-1"><Play className="h-3 w-3" />{getFormatLabel(program.format)}</span>
                  <span>{program.cost.toLocaleString()} ر.س</span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2 bg-[rgba(11,15,18,0.08)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#3DA8F5] rounded-full transition-all"
                    style={{ width: `${(program.enrolledCount / program.maxParticipants) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-[10px] text-[rgba(11,15,18,0.35)] font-arabic">نسبة الامتلاء</span>
                  <span className="text-[10px] font-bold text-[#0B0F12]">
                    {Math.round((program.enrolledCount / program.maxParticipants) * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {mockEnrollments.map((enrollment, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-[18px] border border-[#DADCE0]">
                <div>
                  <p className="text-sm font-bold text-[#0B0F12] font-arabic">{getEmployeeName(enrollment.employeeId)}</p>
                  <p className="text-[11px] text-[rgba(11,15,18,0.50)] font-arabic">{getProgramTitle(enrollment.programId)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-[rgba(11,15,18,0.08)] rounded-full overflow-hidden">
                      <div className="h-full bg-[#3DA8F5] rounded-full" style={{ width: `${enrollment.progress}%` }} />
                    </div>
                    <span className="text-[11px] font-bold">{enrollment.progress}%</span>
                  </div>
                  <BaseBadge className={getHRStatusColor(enrollment.status)}>{getHRStatusText(enrollment.status)}</BaseBadge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
