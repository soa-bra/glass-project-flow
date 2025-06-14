import React from 'react';
import { GenericCard } from '@/components/ui/GenericCard';

// نموذج جديد محسّن لبطاقة نظرة عامة المشاريع
export const ProjectsOverview: React.FC = () => (
  <GenericCard adminBoardStyle hover className="relative group overflow-visible">
    <div className="flex flex-col items-end">
      <h4 className="text-lg font-bold text-[#23272F] mb-2">نظرة عامة المشاريع</h4>
      <div className="text-soabra-text-secondary text-sm mb-4">إحصائيات مجمعة حول المشاريع النشطة</div>
      <div className="flex gap-7">
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-[#29936c]">23</span>
          <span className="text-xs text-gray-500">مشروع نشط</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-[#eab308]">5</span>
          <span className="text-xs text-gray-500">متأخر</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-[#ef4444]">2</span>
          <span className="text-xs text-gray-500">توقف</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-[#2563eb]">6</span>
          <span className="text-xs text-gray-500">جديد/تخطيط</span>
        </div>
      </div>
      {/* Hint Hover card */}
      <div className="absolute left-3 top-2 opacity-0 group-hover:opacity-100 
        transition-all pointer-events-none z-30 min-w-[150px] p-2 text-xs rounded-xl
        bg-white/80 shadow border text-right text-gray-700"
        style={{
          fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
          backdropFilter: "blur(20px)"
        }}>
        تفاصيل: مشاريع نشطة = قيد التنفيذ. متأخر = تجاوز موعد التسليم. توقف = متعثرات/مجمّدة. جديد/تخطيط = قيد الدراسة.
      </div>
    </div>
  </GenericCard>
);
