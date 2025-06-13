
import React from 'react';
import { ProjectCardProps } from '@/components/ProjectCard/types';

interface ClientTabProps {
  project: ProjectCardProps;
}

const ClientTab: React.FC<ClientTabProps> = ({ project }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      <div className="rounded-3xl backdrop-blur-3xl bg-white/40 p-6">
        <h3 className="text-xl font-bold font-arabic text-gray-800 mb-4">معلومات العميل</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-arabic text-gray-600">اسم العميل</label>
            <p className="text-gray-800 font-arabic">شركة سوبرا</p>
          </div>
          <div>
            <label className="text-sm font-arabic text-gray-600">جهة الاتصال</label>
            <p className="text-gray-800 font-arabic">د. أسامة</p>
          </div>
          <div>
            <label className="text-sm font-arabic text-gray-600">البريد الإلكتروني</label>
            <p className="text-gray-800">contact@soabra.com</p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl backdrop-blur-3xl bg-white/40 p-6">
        <h3 className="text-xl font-bold font-arabic text-gray-800 mb-4">سجل التواصل</h3>
        <div className="space-y-3">
          <div className="p-3 bg-white/40 rounded-xl">
            <div className="text-sm font-arabic text-gray-800">اجتماع مراجعة المشروع</div>
            <div className="text-xs text-gray-600 font-arabic">15 يناير 2025</div>
          </div>
          <div className="p-3 bg-white/40 rounded-xl">
            <div className="text-sm font-arabic text-gray-800">تقديم التصاميم الأولية</div>
            <div className="text-xs text-gray-600 font-arabic">10 يناير 2025</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientTab;
