import { AppCardSurface } from '@/components/shared/surfaces/AppCardSurface';
import React, { useState } from 'react';
import { Search, Filter, Download, Eye, Briefcase, Calendar, User, CheckCircle, DollarSign } from 'lucide-react';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { Button } from '@/components/ui/button';

export const ProjectsArchivePanel: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const mockProjects = [
    { id: '1', title: 'حملة إعلانية للمنتج الجديد X', client: 'شركة التقنية المتقدمة', startDate: '2023-06-01', endDate: '2023-09-30', budget: '150,000', team: ['أحمد محمد', 'سارة أحمد', 'محمد عبدالله'], status: 'مكتمل', completion: 100, category: 'تسويق وإعلان', deliverables: 12 },
    { id: '2', title: 'تطوير نظام إدارة المحتوى الداخلي', client: 'سوبرا الداخلي', startDate: '2023-08-15', endDate: '2023-12-20', budget: '80,000', team: ['فاطمة علي', 'خالد سعد'], status: 'مكتمل', completion: 100, category: 'تطوير تقني', deliverables: 8 },
    { id: '3', title: 'استراتيجية العلامة التجارية الجديدة', client: 'مجموعة الأعمال الكبرى', startDate: '2023-03-01', endDate: '2023-07-15', budget: '200,000', team: ['منى حسن', 'علي أحمد', 'نور محمد'], status: 'مكتمل', completion: 100, category: 'استراتيجية العلامة', deliverables: 15 },
  ];

  return (
    <div className="h-full flex flex-col bg-transparent">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-6">
        <h2 className="text-[11px] font-medium text-[rgba(11,15,18,0.6)] uppercase tracking-wide">المشاريع المكتملة</h2>
        <div className="flex items-center gap-3">
          <Button className="bg-[#0B0F12] text-white rounded-full text-sm">
            <Download className="w-4 h-4 mr-2" />تقرير المشاريع
          </Button>
          <Button variant="outline" className="rounded-full text-sm ring-1 ring-[rgba(11,15,18,0.15)]">
            <Filter className="w-4 h-4 mr-2" />تصفية
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="px-6 mb-6">
        <AppCardSurface density="compact">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(11,15,18,0.3)] w-5 h-5" />
            <input
              type="text"
              placeholder="البحث في المشاريع المكتملة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-12 pl-4 py-3 rounded-full ring-1 ring-[rgba(11,15,18,0.1)] focus:outline-none focus:ring-2 focus:ring-[rgba(11,15,18,0.2)] text-sm"
            />
          </div>
        </AppCardSurface>
      </div>

      {/* Projects List */}
      <div className="flex-1 px-6 pb-6">
        <div className="space-y-4">
          {mockProjects.map((project) => (
            <AppCardSurface key={project.id} interactive="hoverable" density="standard">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-bold text-[#0B0F12] text-base">{project.title}</h3>
                    <div className="bg-[#bdeed3] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-[#0B0F12]" />
                      <span className="text-[10px] font-medium text-[#0B0F12]">{project.status}</span>
                    </div>
                    <BaseBadge variant="secondary" size="sm">{project.category}</BaseBadge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-[11px] text-[rgba(11,15,18,0.5)] mb-3">
                    <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" />{project.client}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{project.startDate} - {project.endDate}</span>
                    <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" />{project.budget} ر.س</span>
                  </div>

                  <div className="flex items-center gap-4 mb-2 text-[11px] text-[rgba(11,15,18,0.5)]">
                    <span>المسلمات: <strong className="text-[#0B0F12]">{project.deliverables}</strong></span>
                    <span>الفريق: <strong className="text-[#0B0F12]">{project.team.length}</strong> أعضاء</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-[rgba(11,15,18,0.3)]" />
                    <span className="text-[11px] text-[rgba(11,15,18,0.5)]">{project.team.join('، ')}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <Button size="sm" className="bg-[#0B0F12] text-white rounded-full text-[11px]">
                    <Eye className="w-3.5 h-3.5 mr-1" />عرض
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-full text-[11px] ring-1 ring-[rgba(11,15,18,0.15)]">
                    <Download className="w-3.5 h-3.5 mr-1" />تحميل
                  </Button>
                </div>
              </div>

              {/* Progress - Capsule style */}
              <div className="mt-3 pt-3 border-t border-[rgba(11,15,18,0.06)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] text-[rgba(11,15,18,0.5)]">التقدم</span>
                  <span className="text-sm font-bold text-[#0B0F12]">{project.completion}%</span>
                </div>
                <div className="w-full bg-[rgba(11,15,18,0.06)] rounded-full h-2.5">
                  <div className="bg-[#3DBE8B] h-2.5 rounded-full transition-all duration-500" style={{ width: `${project.completion}%` }} />
                </div>
              </div>
            </AppCardSurface>
          ))}
        </div>
      </div>
    </div>
  );
};
