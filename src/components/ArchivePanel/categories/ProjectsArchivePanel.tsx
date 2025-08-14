import React, { useState } from 'react';
import { Search, Filter, Download, Eye, Briefcase, Calendar, User, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SoaCard, SoaTypography, SoaBadge, SoaIcon, SoaProgressTape } from '@/components/ui';
import { SoaMotion } from '@/components/ui/SoaMotion';

export const ProjectsArchivePanel: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const mockProjects = [
    {
      id: '1',
      title: 'حملة إعلانية للمنتج الجديد X',
      client: 'شركة التقنية المتقدمة',
      startDate: '2023-06-01',
      endDate: '2023-09-30',
      budget: '150,000',
      team: ['أحمد محمد', 'سارة أحمد', 'محمد عبدالله'],
      status: 'مكتمل',
      completion: 100,
      category: 'تسويق وإعلان',
      deliverables: 12
    },
    {
      id: '2', 
      title: 'تطوير نظام إدارة المحتوى الداخلي',
      client: 'سوبرا الداخلي',
      startDate: '2023-08-15',
      endDate: '2023-12-20',
      budget: '80,000',
      team: ['فاطمة علي', 'خالد سعد'],
      status: 'مكتمل',
      completion: 100,
      category: 'تطوير تقني',
      deliverables: 8
    },
    {
      id: '3',
      title: 'استراتيجية العلامة التجارية الجديدة',
      client: 'مجموعة الأعمال الكبرى',
      startDate: '2023-03-01',
      endDate: '2023-07-15',
      budget: '200,000',
      team: ['منى حسن', 'علي أحمد', 'نور محمد'],
      status: 'مكتمل',
      completion: 100,
      category: 'استراتيجية العلامة',
      deliverables: 15
    }
  ];

  return (
    <div className="h-full flex flex-col bg-transparent">
      <div className="flex items-center justify-between px-6 py-6">
        <SoaTypography variant="display-m" className="text-soabra-ink">
          المشاريع المكتملة
        </SoaTypography>
        <div className="flex items-center gap-3">
          <Button className="bg-soabra-ink text-soabra-white rounded-full">
            <Download className="w-4 h-4 mr-2" />
            تقرير المشاريع
          </Button>
          <Button variant="outline" className="rounded-full">
            <Filter className="w-4 h-4 mr-2" />
            تصفية حسب الفترة
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
                placeholder="البحث في المشاريع المكتملة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-12 pl-4 py-3 rounded-full ring-1 ring-soabra-border focus:outline-none focus:ring-2 focus:ring-soabra-ink/20 font-arabic"
              />
            </div>
          </div>
        </SoaCard>
      </div>

      {/* Projects List */}
      <div className="flex-1 overflow-auto px-6 pb-6">
        <div className="space-y-4">
          {mockProjects.map((project) => (
            <SoaMotion key={project.id} variant="reveal" delay={0.1}>
              <SoaCard variant="main" className="hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <SoaTypography variant="title" className="text-soabra-ink flex-1">{project.title}</SoaTypography>
                      <SoaBadge variant="success">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {project.status}
                      </SoaBadge>
                      <SoaBadge variant="outline">
                        {project.category}
                      </SoaBadge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-body text-soabra-ink-60 mb-4">
                      <span className="flex items-center gap-1">
                        <SoaIcon icon={Briefcase} size="sm" />
                        {project.client}
                      </span>
                      <span className="flex items-center gap-1">
                        <SoaIcon icon={Calendar} size="sm" />
                        {project.startDate} - {project.endDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <SoaIcon icon={DollarSign} size="sm" />
                        {project.budget} ر.س
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mb-3">
                      <SoaTypography variant="body" className="text-soabra-ink-60">
                        المسلمات: {project.deliverables}
                      </SoaTypography>
                      <SoaTypography variant="body" className="text-soabra-ink-60">
                        الفريق: {project.team.length} أعضاء
                      </SoaTypography>
                    </div>

                    <div className="flex items-center gap-2">
                      <SoaIcon icon={User} size="sm" className="text-soabra-ink-30" />
                      <SoaTypography variant="body" className="text-soabra-ink-60">
                        {project.team.join('، ')}
                      </SoaTypography>
                    </div>

                    {/* Progress Section */}
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <SoaTypography variant="label" className="text-soabra-ink-60">التقدم</SoaTypography>
                        <SoaTypography variant="body" className="text-soabra-ink-60">{project.completion}%</SoaTypography>
                      </div>
                      <SoaProgressTape 
                        totalTicks={20} 
                        completedTicks={Math.floor(20 * (project.completion / 100))} 
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Button size="sm" className="bg-soabra-ink text-soabra-white rounded-full">
                      <Eye className="w-4 h-4 mr-1" />
                      عرض التفاصيل
                    </Button>
                    <Button size="sm" variant="outline" className="rounded-full">
                      <Download className="w-4 h-4 mr-1" />
                      تحميل الملفات
                    </Button>
                  </div>
                </div>
              </SoaCard>
            </SoaMotion>
          ))}
        </div>
      </div>
    </div>
  );
};