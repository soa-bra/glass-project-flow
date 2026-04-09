
import React from 'react';
import { DataCardFrame } from '@/components/shared/visual-data/DataCardFrame';
import { FileText } from 'lucide-react';

export const TemplateVariablesReference: React.FC = () => {
  return (
    <DataCardFrame title="دليل المتغيرات المتاحة" icon={<FileText className="h-5 w-5" />}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <h4 className="font-semibold font-arabic text-gray-900 mb-2">معلومات العميل</h4>
          <div className="space-y-1 text-sm font-arabic">
            <div className="flex justify-between">
              <span className="text-gray-600">اسم العميل:</span>
              <code className="bg-gray-100 px-2 py-1 rounded text-xs">{"{{customer_name}}"}</code>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">الشركة:</span>
              <code className="bg-gray-100 px-2 py-1 rounded text-xs">{"{{company_name}}"}</code>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">البريد الإلكتروني:</span>
              <code className="bg-gray-100 px-2 py-1 rounded text-xs">{"{{email}}"}</code>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold font-arabic text-gray-900 mb-2">معلومات المشروع</h4>
          <div className="space-y-1 text-sm font-arabic">
            <div className="flex justify-between">
              <span className="text-gray-600">اسم المشروع:</span>
              <code className="bg-gray-100 px-2 py-1 rounded text-xs">{"{{project_name}}"}</code>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">القيمة:</span>
              <code className="bg-gray-100 px-2 py-1 rounded text-xs">{"{{project_value}}"}</code>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">المدة:</span>
              <code className="bg-gray-100 px-2 py-1 rounded text-xs">{"{{duration}}"}</code>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold font-arabic text-gray-900 mb-2">معلومات عامة</h4>
          <div className="space-y-1 text-sm font-arabic">
            <div className="flex justify-between">
              <span className="text-gray-600">التاريخ:</span>
              <code className="bg-gray-100 px-2 py-1 rounded text-xs">{"{{current_date}}"}</code>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">اسم المسؤول:</span>
              <code className="bg-gray-100 px-2 py-1 rounded text-xs">{"{{manager_name}}"}</code>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">اسم الشركة:</span>
              <code className="bg-gray-100 px-2 py-1 rounded text-xs">{"{{company_logo}}"}</code>
            </div>
          </div>
        </div>
      </div>
    </DataCardFrame>
  );
};
