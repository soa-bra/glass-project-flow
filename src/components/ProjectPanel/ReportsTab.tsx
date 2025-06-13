
import React from 'react';
import { ProjectData } from './types';
import { BarChart3, Download, Calendar, TrendingUp } from 'lucide-react';

interface ReportsTabProps {
  projectData: ProjectData;
  loading: boolean;
}

export const ReportsTab: React.FC<ReportsTabProps> = ({ projectData, loading }) => {
  if (loading) {
    return (
      <div className="p-6 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white/20 backdrop-blur-[10px] rounded-[20px] p-4 animate-pulse">
            <div className="h-4 bg-white/30 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-white/30 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  const reports = [
    {
      name: 'تقرير التقدم الأسبوعي',
      type: 'progress',
      lastGenerated: '2025-06-13',
      size: '2.1 MB',
      icon: TrendingUp
    },
    {
      name: 'تقرير الميزانية الشهرية',
      type: 'finance',
      lastGenerated: '2025-06-01',
      size: '1.8 MB',
      icon: BarChart3
    },
    {
      name: 'تقرير المهام المكتملة',
      type: 'tasks',
      lastGenerated: '2025-06-10',
      size: '1.2 MB',
      icon: Calendar
    }
  ];

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case 'progress': return 'bg-blue-100 text-blue-600';
      case 'finance': return 'bg-green-100 text-green-600';
      case 'tasks': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* ملخص التقارير */}
      <div className="bg-white/30 backdrop-blur-[15px] rounded-[20px] p-6 border border-white/40">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800 font-arabic">تقارير المشروع</h3>
          <BarChart3 className="w-6 h-6 text-blue-600" />
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-100 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">12</p>
            <p className="text-sm text-gray-600">إج��الي التقارير</p>
          </div>
          
          <div className="text-center p-4 bg-green-100 rounded-lg">
            <p className="text-2xl font-bold text-green-600">85%</p>
            <p className="text-sm text-gray-600">معدل الإنجاز</p>
          </div>
          
          <div className="text-center p-4 bg-purple-100 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">3</p>
            <p className="text-sm text-gray-600">تقارير هذا الشهر</p>
          </div>
        </div>
      </div>

      {/* قائمة التقارير */}
      <div className="bg-white/30 backdrop-blur-[15px] rounded-[20px] p-6 border border-white/40">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 font-arabic">التقارير المتاحة</h3>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
            <Download size={16} />
            <span>تحميل الكل</span>
          </button>
        </div>
        
        <div className="space-y-3">
          {reports.map((report, index) => (
            <div key={index} className="bg-white/20 backdrop-blur-[10px] rounded-[15px] p-4 border border-white/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${getReportTypeColor(report.type)}`}>
                    <report.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{report.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <span>آخر تحديث: {new Date(report.lastGenerated).toLocaleDateString('ar-SA')}</span>
                      <span>الحجم: {report.size}</span>
                    </div>
                  </div>
                </div>
                
                <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                  <Download size={16} className="text-gray-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="bg-white/30 backdrop-blur-[15px] rounded-[20px] p-6 border border-white/40">
        <h3 className="text-lg font-bold text-gray-800 font-arabic mb-4">إحصائيات سريعة</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/20 backdrop-blur-[10px] rounded-[15px] p-4 border border-white/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">المهام المكتملة</span>
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-600">18/25</p>
            <p className="text-xs text-gray-500">72% معدل الإنجاز</p>
          </div>
          
          <div className="bg-white/20 backdrop-blur-[10px] rounded-[15px] p-4 border border-white/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">الوقت المتبقي</span>
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-600">11</p>
            <p className="text-xs text-gray-500">يوم</p>
          </div>
        </div>
      </div>
    </div>
  );
};
