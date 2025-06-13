
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';

interface SatisfactionWidgetProps {
  satisfaction: number;
}

export const SatisfactionWidget: React.FC<SatisfactionWidgetProps> = ({ satisfaction }) => {
  const getRingColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getScoreText = (score: number) => {
    if (score >= 80) return 'ممتاز';
    if (score >= 60) return 'جيد';
    return 'يحتاج تحسين';
  };

  return (
    <BaseCard 
      size="lg"
      variant="glass"
      neonRing={getRingColor(satisfaction)}
      header={
        <h3 className="text-xl font-arabic font-bold text-gray-800 text-center">
          مؤشر رضا العملاء
        </h3>
      }
      className="h-[220px]"
    >
      <div className="flex-1 flex items-center justify-center gap-8">
        {/* الدائرة الأساسية */}
        <div className="flex flex-col items-center">
          <div className="relative w-24 h-24 mb-2">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={satisfaction >= 80 ? "#10b981" : satisfaction >= 60 ? "#f59e0b" : "#ef4444"}
                strokeWidth="3"
                strokeDasharray={`${satisfaction}, 100`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-900">{satisfaction}%</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 font-medium">{getScoreText(satisfaction)}</p>
        </div>

        {/* إحصائيات إضافية */}
        <div className="flex flex-col gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">245</div>
            <div className="text-xs text-gray-600">تقييمات إيجابية</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">89%</div>
            <div className="text-xs text-gray-600">معدل التوصية</div>
          </div>
        </div>

        {/* المزيد من التفاصيل */}
        <div className="flex flex-col gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">4.7</div>
            <div className="text-xs text-gray-600">متوسط التقييم</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">12</div>
            <div className="text-xs text-gray-600">شكاوى قيد المعالجة</div>
          </div>
        </div>
      </div>
    </BaseCard>
  );
};
