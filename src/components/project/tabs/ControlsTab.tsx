
import React from 'react';
import { Project } from '@/types/project';
import { Settings, Users, Lock, Bell } from 'lucide-react';

interface ControlsTabProps {
  project: Project;
}

export const ControlsTab: React.FC<ControlsTabProps> = ({ project }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
        <h3 className="text-lg font-bold text-gray-800 mb-4">إعدادات المشروع</h3>
        <div className="space-y-4">
          {[
            { icon: Settings, title: 'الإعدادات العامة', desc: 'تحرير معلومات المشروع الأساسية' },
            { icon: Users, title: 'إدارة الفريق', desc: 'إضافة أو إزالة أعضاء الفريق' },
            { icon: Lock, title: 'الصلاحيات', desc: 'تحديد مستويات الوصول' },
            { icon: Bell, title: 'الإشعارات', desc: 'إعدادات التنبيهات والتذكيرات' }
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <item.icon className="w-6 h-6 text-blue-600" />
              <div>
                <div className="font-medium text-gray-800">{item.title}</div>
                <div className="text-sm text-gray-600">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
