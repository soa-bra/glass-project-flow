
import React from 'react';
import { Project } from '@/types/project';
import { FileBarChart, Download, Printer } from 'lucide-react';

interface ReportsTabProps {
  project: Project;
}

export const ReportsTab: React.FC<ReportsTabProps> = ({ project }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
        <h3 className="text-lg font-bold text-gray-800 mb-4">تقارير المشروع</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'تقرير التقدم الشامل', desc: 'ملخص كامل لحالة المشروع والإنجازات' },
            { name: 'التقرير المالي', desc: 'تفاصيل الميزانية والمصروفات' },
            { name: 'تقرير الفريق', desc: 'أداء أعضاء الفريق والساعات' },
            { name: 'تقرير المخاطر', desc: 'تحليل المخاطر والتحديات' }
          ].map((report) => (
            <div
              key={report.name}
              className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <FileBarChart className="w-6 h-6 text-blue-600" />
                <div className="flex gap-2">
                  <button className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                    <Download className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                    <Printer className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
              <h4 className="font-medium text-gray-800 mb-2">{report.name}</h4>
              <p className="text-sm text-gray-600">{report.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
