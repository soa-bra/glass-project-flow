
import React from 'react';
import { GenericCard } from '@/components/ui/GenericCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload } from 'lucide-react';

interface TemplateUploadFormProps {
  onCancel: () => void;
  onSubmit: () => void;
}

export const TemplateUploadForm: React.FC<TemplateUploadFormProps> = ({
  onCancel,
  onSubmit
}) => {
  return (
    <GenericCard>
      <h3 className="text-lg font-bold font-arabic mb-4">رفع قالب جديد</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-semibold font-arabic mb-2">اسم القالب</label>
          <Input placeholder="اسم وصفي للقالب" />
        </div>
        <div>
          <label className="block text-sm font-semibold font-arabic mb-2">الفئة</label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg font-arabic bg-white">
            <option value="proposal">عرض تجاري</option>
            <option value="contract">عقد</option>
            <option value="email">رسالة إلكترونية</option>
            <option value="report">تقرير</option>
            <option value="survey">استطلاع</option>
          </select>
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-semibold font-arabic mb-2">الوصف</label>
        <Input placeholder="وصف مختصر للقالب واستخداماته" />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-semibold font-arabic mb-2">الملف</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600 font-arabic">اسحب الملف هنا أو انقر للتحديد</p>
          <p className="text-sm text-gray-500 font-arabic">يدعم: PDF, DOCX, XLSX</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button 
          onClick={onSubmit}
          className="bg-green-600 hover:bg-green-700 text-white font-arabic"
        >
          رفع القالب
        </Button>
        <Button 
          variant="outline" 
          onClick={onCancel}
          className="font-arabic"
        >
          إلغاء
        </Button>
      </div>
    </GenericCard>
  );
};
