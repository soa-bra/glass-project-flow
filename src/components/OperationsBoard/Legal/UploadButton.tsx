
import React from 'react';

export const UploadButton: React.FC = () => {
  return (
    <div className="flex justify-center mt-6">
      <button 
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
        رفع عقد جديد
      </button>
    </div>
  );
};
