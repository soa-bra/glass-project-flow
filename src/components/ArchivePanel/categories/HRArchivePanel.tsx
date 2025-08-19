
import React, { useState } from 'react';
import { Search, Filter, Download, Eye, Users, Calendar, User, Award, BookOpen, FileText } from 'lucide-react';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { Button } from '@/components/ui/button';

export const HRArchivePanel: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const mockHRRecords = [
    {
      id: '1',
      type: 'سجل موظف',
      employeeName: 'أحمد محمد السعد',
      department: 'التسويق الرقمي',
      position: 'مدير التسويق',
      startDate: '2020-03-15',
      endDate: '2023-12-31',
      status: 'منتهي الخدمة',
      reason: 'استقالة',
      documents: ['عقد العمل', 'تقييمات الأداء', 'شهادات التدريب']
    },
    {
      id: '2',
      type: 'برنامج تدريبي',
      title: 'دورة القيادة الإستراتيجية',
      startDate: '2023-09-01',
      endDate: '2023-09-30',
      participants: 25,
      trainer: 'د. سارة أحمد',
      status: 'مكتمل',
      certificates: 23,
      documents: ['محتوى الدورة', 'قائمة المشاركين', 'التقييم النهائي']
    },
    {
      id: '3',
      type: 'تقييم أداء',
      period: 'الربع الثالث 2023',
      department: 'جميع الإدارات',
      evaluatedEmployees: 45,
      completionRate: '98%',
      status: 'مكتمل',
      documents: ['نماذج التقييم', 'التقارير الفردية', 'التحليل العام']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'مكتمل': return 'bg-green-100 text-green-800';
      case 'منتهي الخدمة': return 'bg-gray-100 text-gray-800';
      case 'نشط': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'سجل موظف': return User;
      case 'برنامج تدريبي': return BookOpen;
      case 'تقييم أداء': return Award;
      default: return FileText;
    }
  };

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--sb-column-3-bg)' }}>
      <div className="flex items-center justify-between px-6 py-6">
        <h2 className="font-medium text-black font-arabic text-3xl">
          أرشيف الموارد البشرية
        </h2>
        <div className="flex items-center gap-3">
          <Button className="bg-black text-white rounded-full">
            <Download className="w-4 h-4 mr-2" />
            تقرير شامل
          </Button>
          <Button variant="outline" className="rounded-full">
            <Filter className="w-4 h-4 mr-2" />
            تصفية حسب النوع
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="px-6 mb-6">
        <div className="p-4 rounded-[41px] ring-1" style={{ background: 'var(--sb-box-standard)', borderColor: 'var(--sb-box-border)' }}>
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="البحث في أرشيف الموارد البشرية..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-12 pl-4 py-3 rounded-full ring-1 focus:outline-none focus:ring-2 focus:ring-black/20 font-arabic"
                style={{ borderColor: 'var(--sb-box-border)' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* HR Records List */}
      <div className="flex-1 overflow-auto px-6 pb-6">
        <div className="space-y-4">
          {mockHRRecords.map((record) => {
            const IconComponent = getTypeIcon(record.type);
            return (
              <div key={record.id} className="p-6 rounded-[41px] ring-1" style={{ background: 'var(--sb-box-standard)', borderColor: 'var(--sb-box-border)' }}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <IconComponent className="w-5 h-5 text-gray-600" />
                      <h3 className="font-bold text-black font-arabic text-lg">
                        {record.type === 'سجل موظف' ? record.employeeName : 
                         record.type === 'برنامج تدريبي' ? record.title : 
                         `${record.type} - ${record.period}`}
                      </h3>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                        {record.status}
                      </div>
                      <BaseBadge variant="secondary" size="sm">
                        {record.type}
                      </BaseBadge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                      {record.type === 'سجل موظف' && (
                        <>
                          <span className="flex items-center gap-1 font-arabic">
                            <Users className="w-4 h-4" />
                            {record.department}
                          </span>
                          <span className="flex items-center gap-1 font-arabic">
                            {record.position}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {record.startDate} - {record.endDate}
                          </span>
                        </>
                      )}
                      
                      {record.type === 'برنامج تدريبي' && (
                        <>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {record.startDate} - {record.endDate}
                          </span>
                          <span className="flex items-center gap-1 font-arabic">
                            <Users className="w-4 h-4" />
                            {record.participants} مشارك
                          </span>
                          <span className="flex items-center gap-1 font-arabic">
                            <Award className="w-4 h-4" />
                            {record.certificates} شهادة
                          </span>
                        </>
                      )}
                      
                      {record.type === 'تقييم أداء' && (
                        <>
                          <span className="flex items-center gap-1 font-arabic">
                            <Users className="w-4 h-4" />
                            {record.evaluatedEmployees} موظف
                          </span>
                          <span className="flex items-center gap-1 font-arabic">
                            معدل الإكمال: {record.completionRate}
                          </span>
                          <span className="flex items-center gap-1 font-arabic">
                            {record.department}
                          </span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600 font-arabic">
                        الوثائق: {record.documents.join('، ')}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Button size="sm" className="bg-black text-white rounded-full">
                      <Eye className="w-4 h-4 mr-1" />
                      عرض
                    </Button>
                    <Button size="sm" variant="outline" className="rounded-full">
                      <Download className="w-4 h-4 mr-1" />
                      تحميل
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
