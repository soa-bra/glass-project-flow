import React from "react";
import { Upload, Image, FileText, File } from "lucide-react";

export default function FileUploadPanel() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-[hsl(var(--ink))]">رفع الملفات</h3>
      
      <div className="border-2 border-dashed border-[hsl(var(--border))] rounded-lg p-8 text-center">
        <Upload className="w-12 h-12 mx-auto mb-4 text-[hsl(var(--ink-60))]" />
        <p className="text-sm text-[hsl(var(--ink-60))] mb-2">اسحب الملفات هنا أو انقر للتحميل</p>
        <button className="px-4 py-2 bg-[hsl(var(--accent-green))] text-white rounded-lg text-sm hover:opacity-90">
          اختر ملف
        </button>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-[hsl(var(--ink-60))]">أنواع الملفات المدعومة:</p>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1 px-3 py-1 bg-[hsl(var(--panel))] rounded-full text-xs">
            <Image className="w-3 h-3" />
            صور
          </div>
          <div className="flex items-center gap-1 px-3 py-1 bg-[hsl(var(--panel))] rounded-full text-xs">
            <FileText className="w-3 h-3" />
            PDF
          </div>
          <div className="flex items-center gap-1 px-3 py-1 bg-[hsl(var(--panel))] rounded-full text-xs">
            <File className="w-3 h-3" />
            مستندات
          </div>
        </div>
      </div>
    </div>
  );
}
