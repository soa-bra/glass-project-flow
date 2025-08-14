import React, { useState } from 'react';
import { Search, Filter, Download, Eye, Users, Calendar, User, Award, BookOpen, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SoaCard, SoaTypography, SoaBadge, SoaIcon } from '@/components/ui';
import { SoaMotion } from '@/components/ui/SoaMotion';

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
      documents: ['عقد العمل', 'تقييمات الأداء', 'شهادات التدريب'],
      documentsCount: 3
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
      documents: ['محتوى الدورة', 'قائمة المشاركين', 'التقييم النهائي'],
      documentsCount: 3
    },
    {
      id: '3',
      type: 'تقييم أداء',
      period: 'الربع الثالث 2023',
      department: 'جميع الإدارات',
      evaluatedEmployees: 45,
      completionRate: '98%',
      status: 'مكتمل',
      documents: ['نماذج التقييم', 'التقارير الفردية', 'التحليل العام'],
      documentsCount: 3
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'سجل موظف': return User;
      case 'برنامج تدريبي': return BookOpen;
      case 'تقييم أداء': return Award;
      default: return FileText;
    }
  };

  return (
    <div className="h-full flex flex-col bg-transparent">
      <div className="flex items-center justify-between px-6 py-6">
        <SoaTypography variant="display-m" className="text-soabra-ink">
          أرشيف الموارد البشرية
        </SoaTypography>
        <div className="flex items-center gap-3">
          <Button className="bg-soabra-ink text-soabra-white rounded-full">
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
        <SoaCard variant="main">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-soabra-ink-30 w-5 h-5" />
              <input
                type="text"
                placeholder="البحث في أرشيف الموارد البشرية..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-12 pl-4 py-3 rounded-full ring-1 ring-soabra-border focus:outline-none focus:ring-2 focus:ring-soabra-ink/20 font-arabic"
              />
            </div>
          </div>
        </SoaCard>
      </div>

      {/* HR Records List */}
      <div className="flex-1 overflow-auto px-6 pb-6">
        <div className="space-y-4">
          {mockHRRecords.map((record) => {
            const IconComponent = getTypeIcon(record.type);
            return (
              <SoaMotion key={record.id} variant="reveal" delay={0.1}>
                <SoaCard variant="main" className="hover:shadow-lg transition-shadow duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <SoaIcon icon={IconComponent} size="md" className="text-soabra-ink-60" />
                        <SoaTypography variant="title" className="text-soabra-ink flex-1">
                          {record.type === 'سجل موظف' ? record.employeeName : 
                           record.type === 'برنامج تدريبي' ? record.title : 
                           `${record.type} - ${record.period}`}
                        </SoaTypography>
                        <SoaBadge variant={record.status === 'مكتمل' ? 'success' : record.status === 'نشط' ? 'info' : 'default'}>
                          {record.status}
                        </SoaBadge>
                        <SoaBadge variant="outline">
                          {record.type}
                        </SoaBadge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-body text-soabra-ink-60 mb-4">
                        {record.type === 'سجل موظف' && (
                          <>
                            <span className="flex items-center gap-1">
                              <SoaIcon icon={Users} size="sm" />
                              {record.department}
                            </span>
                            <span className="flex items-center gap-1">
                              {record.position}
                            </span>
                            <span className="flex items-center gap-1">
                              <SoaIcon icon={Calendar} size="sm" />
                              {record.startDate} - {record.endDate}
                            </span>
                          </>
                        )}
                        
                        {record.type === 'برنامج تدريبي' && (
                          <>
                            <span className="flex items-center gap-1">
                              <SoaIcon icon={Calendar} size="sm" />
                              {record.startDate} - {record.endDate}
                            </span>
                            <span className="flex items-center gap-1">
                              <SoaIcon icon={Users} size="sm" />
                              {record.participants} مشارك
                            </span>
                            <span className="flex items-center gap-1">
                              <SoaIcon icon={Award} size="sm" />
                              {record.certificates} شهادة
                            </span>
                          </>
                        )}
                        
                        {record.type === 'تقييم أداء' && (
                          <>
                            <span className="flex items-center gap-1">
                              <SoaIcon icon={Users} size="sm" />
                              {record.evaluatedEmployees} موظف
                            </span>
                            <span className="flex items-center gap-1">
                              معدل الإكمال: {record.completionRate}
                            </span>
                            <span className="flex items-center gap-1">
                              {record.department}
                            </span>
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <SoaIcon icon={FileText} size="sm" className="text-soabra-ink-30" />
                        <SoaTypography variant="body" className="text-soabra-ink-60">
                          الوثائق: {record.documents.join('، ')}
                        </SoaTypography>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-soabra-border mt-4">
                        <div className="flex items-center gap-2 text-soabra-ink-60">
                          <SoaIcon icon={FileText} size="sm" />
                          <SoaTypography variant="body" className="text-soabra-ink-60">
                            {record.documentsCount} وثيقة
                          </SoaTypography>
                        </div>
                        <button className="text-soabra-accent-blue hover:opacity-80 transition-opacity">
                          <SoaTypography variant="body">عرض التفاصيل</SoaTypography>
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button size="sm" className="bg-soabra-ink text-soabra-white rounded-full">
                        <Eye className="w-4 h-4 mr-1" />
                        عرض
                      </Button>
                      <Button size="sm" variant="outline" className="rounded-full">
                        <Download className="w-4 h-4 mr-1" />
                        تحميل
                      </Button>
                    </div>
                  </div>
                </SoaCard>
              </SoaMotion>
            );
          })}
        </div>
      </div>
    </div>
  );
};