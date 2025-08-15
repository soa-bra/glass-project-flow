
import React from 'react';

interface Phase {
  name: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

interface ProjectPhaseProgressProps {
  phases: Phase[];
}

export const ProjectPhaseProgress: React.FC<ProjectPhaseProgressProps> = ({ phases }) => {
  return (
    <div className="timeline-card mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 font-arabic">الأحداث القادمة</h3>
        <div className="flex gap-2">
          <button 
            className="text-white px-3 py-1 rounded-full text-xs font-arabic bg-soabra-new-on-plan"
          >
            وفق الخطة
          </button>
          <button 
            className="text-black px-3 py-1 rounded-full text-xs font-arabic bg-soabra-new-in-preparation"
          >
            1 أسابيع
          </button>
        </div>
      </div>
      
      <div className="relative">
        {/* الشريط الزمني */}
        <div className="h-1 bg-gray-200 rounded-full mb-6 overflow-hidden">
          <div 
            className="h-full rounded-full w-3/4 bg-soabra-new-primary"
          ></div>
        </div>
        
        {/* الأحداث */}
        <div className="flex justify-between items-center">
          {/* الأحداث بالترتيب من اليمين إلى اليسار */}
          <div className="flex flex-col items-center text-center">
            <div className="text-lg font-bold font-arabic mb-1">07</div>
            <div className="text-xs text-gray-600 font-arabic mb-2">يون</div>
            <div className="text-xs text-gray-600 font-arabic mb-2">جلسة ملاحظة النموذج المدخل</div>
            <div className="text-xs font-bold font-arabic">داخلي</div>
            <div className="w-8 h-8 rounded-full bg-gray-200 mt-2"></div>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="text-lg font-bold font-arabic mb-1">02</div>
            <div className="text-xs text-gray-600 font-arabic mb-2">يون</div>
            <div className="text-xs text-gray-600 font-arabic mb-2">للبحث الجديدة</div>
            <div className="text-xs font-bold font-arabic">داخلي</div>
            <div className="w-8 h-8 rounded-full bg-gray-200 mt-2"></div>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="text-lg font-bold font-arabic mb-1">25</div>
            <div className="text-xs text-gray-600 font-arabic mb-2">May</div>
            <div className="text-xs text-gray-600 font-arabic mb-2">تجربة قاعدة البيانات المترية</div>
            <div className="text-xs font-bold font-arabic">جامعة الملك سعود</div>
            <div className="w-8 h-8 rounded-full bg-gray-200 mt-2"></div>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="text-lg font-bold font-arabic mb-1">20</div>
            <div className="text-xs text-gray-600 font-arabic mb-2">May</div>
            <div className="text-xs text-gray-600 font-arabic mb-2">نسليم الطدراج الترية</div>
            <div className="text-xs font-bold font-arabic">المحيط للتدريب</div>
            <div className="w-8 h-8 rounded-full bg-gray-200 mt-2"></div>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="text-lg font-bold font-arabic mb-1">16</div>
            <div className="text-xs text-gray-600 font-arabic mb-2">May</div>
            <div className="text-xs text-gray-600 font-arabic mb-2">متابعة الملصقة مع سندي النعجمة</div>
            <div className="text-xs font-bold font-arabic">مسك الخيرية</div>
            <div className="w-8 h-8 rounded-full bg-gray-200 mt-2"></div>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="text-lg font-bold font-arabic mb-1">12</div>
            <div className="text-xs text-gray-600 font-arabic mb-2">May</div>
            <div className="text-xs text-gray-600 font-arabic mb-2">الإجتماع التصرح مع التدوية الدقة</div>
            <div className="text-xs font-bold font-arabic">داخلي</div>
            <div className="w-8 h-8 rounded-full bg-gray-200 mt-2"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
