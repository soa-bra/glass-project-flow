
import React from 'react';
import { Archive } from 'lucide-react';

export const EmptyArchiveState: React.FC = () => {
  return (
    <div 
      style={{
        background: 'var(--backgrounds-admin-ops-board-bg)'
      }} 
      className="h-full rounded-3xl overflow-hidden flex items-center justify-center"
    >
      <div className="text-center">
        <Archive className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2 font-arabic">
          اختر فئة من الأرشيف
        </h3>
        <p className="text-gray-500 font-arabic">
          قم بتحديد فئة من الشريط الجانبي لعرض محتوى الأرشيف
        </p>
      </div>
    </div>
  );
};
