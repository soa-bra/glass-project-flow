
import React from 'react';

export const ExportButton: React.FC = () => {
  return (
    <div className="flex justify-center mt-6">
      <button 
        className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-6 rounded-full transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
        تصدير تقرير مالي
      </button>
    </div>
  );
};
