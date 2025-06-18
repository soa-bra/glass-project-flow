
import React from 'react';

interface ProgressStagesCardProps {
  progress: number;
}

export const ProgressStagesCard: React.FC<ProgressStagesCardProps> = ({ progress }) => {
  const stages = [
    { name: 'الميزانية', value: '15', unit: 'ألف', status: 'completed' },
    { name: 'الفريق', value: '08', unit: 'أشخاص', status: 'in-progress' },
    { name: 'التسليم', value: '03', unit: 'أيام', status: 'pending' }
  ];

  const getStageColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="bg-white/60 backdrop-blur-[20px] rounded-3xl p-6 border border-white/30">
      {/* العنوان والحالة */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-arabic font-bold text-gray-900">
          تطوير موقع سوريا
        </h2>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-green-100 text-green-800 rounded-full font-arabic text-sm">
            وفق الخطة
          </div>
          <div className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-arabic text-sm">
            محمد أحمد
          </div>
        </div>
      </div>

      {/* مؤشرات المشروع */}
      <div className="flex items-center justify-between">
        {stages.map((stage, index) => (
          <div key={index} className="text-center">
            <div className={`px-6 py-4 rounded-2xl ${getStageColor(stage.status)} mb-2`}>
              <div className="text-2xl font-bold">{stage.value}</div>
              <div className="text-sm">{stage.unit}</div>
            </div>
            <div className="text-sm font-arabic text-gray-600">{stage.name}</div>
          </div>
        ))}

        {/* شريط التقدم الملون */}
        <div className="flex-1 mx-8">
          <div className="relative">
            <div className="h-2 bg-gradient-to-r from-red-300 via-blue-300 via-purple-300 to-green-300 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="bg-green-500 w-4 h-4 rounded-full border-2 border-white shadow-lg"></div>
            </div>
          </div>
          <div className="text-center mt-2">
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-arabic inline-block">
              مقياس مراحل تقدم المشروع
            </div>
          </div>
        </div>
      </div>

      {/* الوصف */}
      <div className="mt-4 text-sm text-gray-600 font-arabic">
        تطوير المشروع الأساسي لموقع سوريا الحديث باستخدام أحدث التقنيات الموصى بها عالمياً
      </div>
    </div>
  );
};
