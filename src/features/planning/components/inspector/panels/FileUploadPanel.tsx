import React from 'react';

export default function FileUploadPanel() {
  return (
    <div className="file-upload-panel p-4 space-y-3">
      <h4 className="text-sm font-medium">رفع الملفات</h4>
      <div className="space-y-2">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          <p className="text-xs text-gray-500">اسحب الملفات هنا أو انقر للاختيار</p>
        </div>
        <div className="text-xs text-gray-500">
          الأنواع المدعومة: صور، PDF، مستندات
        </div>
      </div>
    </div>
  );
}