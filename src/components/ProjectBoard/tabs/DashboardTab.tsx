
import React, { useEffect, useState } from 'react';
import { ProjectCardProps } from '@/components/ProjectCard/types';

interface DashboardTabProps {
  project: ProjectCardProps;
}

const DashboardTab: React.FC<DashboardTabProps> = ({ project }) => {
  const [metrics, setMetrics] = useState({
    completion: 75,
    budget: 85,
    tasks: 12,
    issues: 3
  });

  // Simulate real-time updates every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        completion: Math.min(100, prev.completion + Math.random() * 2),
        budget: Math.max(0, prev.budget + (Math.random() - 0.5) * 5),
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Performance Overview */}
      <div className="lg:col-span-2 space-y-6">
        <div className="rounded-3xl backdrop-blur-3xl bg-white/40 p-6">
          <h3 className="text-xl font-bold font-arabic text-gray-800 mb-4">مؤشرات الأداء</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 rounded-2xl bg-white/40">
              <div className="text-3xl font-bold text-green-600">{metrics.completion.toFixed(1)}%</div>
              <div className="text-sm font-arabic text-gray-600">معدل الإنجاز</div>
            </div>
            <div className="text-center p-4 rounded-2xl bg-white/40">
              <div className="text-3xl font-bold text-blue-600">{metrics.budget.toFixed(1)}%</div>
              <div className="text-sm font-arabic text-gray-600">استخدام الميزانية</div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl backdrop-blur-3xl bg-white/40 p-6">
          <h3 className="text-xl font-bold font-arabic text-gray-800 mb-4">نظرة سريعة</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 rounded-xl bg-white/40">
              <span className="font-arabic text-gray-700">المهام المكتملة</span>
              <span className="font-bold text-green-600">{metrics.tasks}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-white/40">
              <span className="font-arabic text-gray-700">المشاكل المفتوحة</span>
              <span className="font-bold text-red-600">{metrics.issues}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <div className="rounded-3xl backdrop-blur-3xl bg-white/40 p-4">
          <h4 className="font-bold font-arabic text-gray-800 mb-3">إجراءات سريعة</h4>
          <button className="w-full p-3 rounded-xl bg-white/40 text-center font-arabic text-gray-700 hover:bg-white/60 transition-colors">
            إضافة مهمة جديدة
          </button>
        </div>
        <div className="rounded-3xl backdrop-blur-3xl bg-white/40 p-4">
          <h4 className="font-bold font-arabic text-gray-800 mb-3">التحديثات الأخيرة</h4>
          <div className="text-sm font-arabic text-gray-600 space-y-2">
            <div>تم إنجاز مهمة التصميم</div>
            <div>مراجعة الكود جارية</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;
