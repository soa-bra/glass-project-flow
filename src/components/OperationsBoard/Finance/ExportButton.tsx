
import React from 'react';

export const ExportButton: React.FC = () => {
  return (
    <div className="flex justify-center mt-6">
      <button 
        className="bg-black hover:bg-gray-800 text-white py-2 px-6 rounded-full transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 font-arabic"
      >
        <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
          <span className="text-sm">⬇</span>
        </div>
        تصدير تقرير مالي
      </button>
    </div>
  );
};
