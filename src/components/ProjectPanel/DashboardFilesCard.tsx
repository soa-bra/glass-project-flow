
import React from 'react';
import { FileText, Upload, Download } from 'lucide-react';

export const DashboardFilesCard: React.FC = () => {
  return (
    <div className="h-full bg-white/40 backdrop-blur-[20px] border border-white/30 rounded-[20px] p-6 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 font-arabic" style={{ fontFamily: 'IBM Plex Sans Arabic' }}>
          الملفات
        </h3>
        <FileText size={20} className="text-gray-600" />
      </div>

      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="text-3xl font-bold text-gray-800 mb-2">24</div>
        <div className="text-sm text-gray-600 font-arabic mb-4">ملف</div>
        
        <div className="flex gap-2">
          <button className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            <Upload size={16} />
          </button>
          <button className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            <Download size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
