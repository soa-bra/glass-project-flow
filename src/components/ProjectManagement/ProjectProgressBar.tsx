
import React from 'react';

interface ProjectProgressBarProps {
  progress: number;
}

export const ProjectProgressBar: React.FC<ProjectProgressBarProps> = ({ progress }) => {
  const stages = [
    { name: 'التحضير', icon: '🔒' },
    { name: 'التنفيذ المبدئي', icon: '⟳' },
    { name: 'المراجعة الأولية', icon: '⟳' },
    { name: 'المعالجة الأولية', icon: '⟳' },
    { name: 'المراجعة النهائية', icon: '⟳' },
    { name: 'المعالجة النهائية', icon: '✓' }
  ];

  const getStageStatus = (index: number) => {
    const stageProgress = (progress / 100) * stages.length;
    if (stageProgress > index + 1) return 'completed';
    if (stageProgress > index) return 'in-progress';
    return 'pending';
  };

  const getStageColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-gradient-to-r from-blue-400 to-purple-500';
      case 'pending': return 'bg-gray-200';
      default: return 'bg-gray-200';
    }
  };

  const getIconColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-white bg-green-500';
      case 'in-progress': return 'text-white bg-purple-500';
      case 'pending': return 'text-gray-400 bg-gray-100';
      default: return 'text-gray-400 bg-gray-100';
    }
  };

  return (
    <div className="bg-white/40 backdrop-blur-[20px] rounded-3xl p-6 border border-white/20">
      {/* العنوان والوصف */}
      <div className="flex justify-between items-center mb-6">
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-arabic text-sm">
          مقياس مراحل تقدم المشروع
        </div>
        <div className="text-sm text-gray-600 font-arabic">
          المهمة الحالية: المراجعة النهائية
        </div>
      </div>

      {/* شريط التقدم */}
      <div className="relative">
        {/* الخلفية */}
        <div className="flex h-3 rounded-full overflow-hidden bg-gray-200">
          {stages.map((stage, index) => {
            const status = getStageStatus(index);
            return (
              <div
                key={index}
                className={`flex-1 ${getStageColor(status)} transition-all duration-500`}
                style={{ animationDelay: `${index * 100}ms` }}
              />
            );
          })}
        </div>

        {/* الأيقونات والتسميات */}
        <div className="flex justify-between mt-4">
          {stages.map((stage, index) => {
            const status = getStageStatus(index);
            return (
              <div key={index} className="flex flex-col items-center flex-1">
                {/* الأيقونة */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-2 transition-all duration-500 ${getIconColor(status)}`}>
                  {status === 'completed' ? '✓' : status === 'in-progress' ? '⟳' : '🔒'}
                </div>
                {/* التسمية */}
                <div className="text-xs font-arabic text-gray-600 text-center">
                  {stage.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* نسبة التقدم */}
      <div className="mt-4 text-center">
        <div className="text-lg font-bold text-gray-800 font-arabic">
          {Math.round(progress)}% مكتمل
        </div>
      </div>
    </div>
  );
};
