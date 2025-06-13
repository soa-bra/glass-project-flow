
import React from 'react';
import { FileText, Download, Upload } from 'lucide-react';

const files = [
  { id: 1, name: 'متطلبات المشروع.pdf', size: '2.4 MB', type: 'pdf' },
  { id: 2, name: 'التصاميم النهائية.zip', size: '15.2 MB', type: 'zip' },
  { id: 3, name: 'دليل المستخدم.docx', size: '1.8 MB', type: 'doc' }
];

export const FilesCard: React.FC = () => {
  return (
    <div className="h-full p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-gray-800 font-arabic">الملفات</h3>
        <button className="p-1 hover:bg-white/20 rounded transition-colors duration-200">
          <Upload size={16} className="text-gray-600" />
        </button>
      </div>

      <div className="space-y-2">
        {files.slice(0, 2).map((file) => (
          <div key={file.id} className="flex items-center gap-2 p-2 hover:bg-white/10 rounded transition-colors duration-200">
            <FileText size={16} className="text-blue-500" />
            <div className="flex-1 text-right">
              <div className="text-xs font-arabic text-gray-800 truncate">
                {file.name}
              </div>
              <div className="text-xs text-gray-600 font-arabic">
                {file.size}
              </div>
            </div>
            <button className="p-1 hover:bg-white/20 rounded transition-colors duration-200">
              <Download size={12} className="text-gray-600" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-3 text-center">
        <button className="text-xs text-blue-600 hover:text-blue-700 font-arabic">
          عرض جميع الملفات ({files.length})
        </button>
      </div>
    </div>
  );
};
