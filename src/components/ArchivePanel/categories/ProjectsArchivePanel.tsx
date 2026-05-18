import { AppCardSurface } from '@/components/shared/surfaces/AppCardSurface';
import React, { useMemo, useState } from 'react';
import { Search, Filter, Download, Eye, Briefcase, Calendar, User, CheckCircle, DollarSign, Loader2 } from 'lucide-react';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { Button } from '@/components/ui/button';
import { useProjects } from '@/hooks/central';

/**
 * P3 — يقرأ المشاريع المؤرشفة (state in {archived, completed}) من DB المركزي.
 * لا mock بعد هذه النقطة.
 */
export const ProjectsArchivePanel: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: allProjects, isLoading } = useProjects();

  const archived = useMemo(() => {
    const list = (allProjects ?? []).filter(
      (p) => p.state === 'archived' || p.state === 'completed',
    );
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (p) => p.name.toLowerCase().includes(q) || (p.description ?? '').toLowerCase().includes(q),
    );
  }, [allProjects, searchQuery]);

  const formatDate = (iso: string | null) =>
    iso ? new Date(iso).toLocaleDateString('ar-SA') : '—';

  return (
    <div className="h-full flex flex-col bg-transparent">
      <div className="flex items-center justify-between px-6 py-6">
        <h2 className="text-[11px] font-medium text-[rgba(11,15,18,0.6)] uppercase tracking-wide">
          المشاريع المؤرشفة ({archived.length})
        </h2>
        <div className="flex items-center gap-3">
          <Button className="bg-[#0B0F12] text-white rounded-full text-sm">
            <Download className="w-4 h-4 mr-2" />تقرير المشاريع
          </Button>
          <Button variant="outline" className="rounded-full text-sm ring-1 ring-[rgba(11,15,18,0.15)]">
            <Filter className="w-4 h-4 mr-2" />تصفية
          </Button>
        </div>
      </div>

      <div className="px-6 mb-6">
        <AppCardSurface density="compact">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(11,15,18,0.3)] w-5 h-5" />
            <input
              type="text"
              placeholder="البحث في المشاريع المؤرشفة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-12 pl-4 py-3 rounded-full ring-1 ring-[rgba(11,15,18,0.1)] focus:outline-none focus:ring-2 focus:ring-[rgba(11,15,18,0.2)] text-sm"
            />
          </div>
        </AppCardSurface>
      </div>

      <div className="flex-1 px-6 pb-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-[rgba(11,15,18,0.4)]" />
          </div>
        ) : archived.length === 0 ? (
          <AppCardSurface density="standard">
            <div className="text-center py-12 text-[rgba(11,15,18,0.5)] text-sm">
              لا توجد مشاريع مؤرشفة بعد.
            </div>
          </AppCardSurface>
        ) : (
          <div className="space-y-4">
            {archived.map((project) => (
              <AppCardSurface key={project.id} interactive="hoverable" density="standard">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-bold text-[#0B0F12] text-base">{project.name}</h3>
                      <div className="bg-[#bdeed3] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-[#0B0F12]" />
                        <span className="text-[10px] font-medium text-[#0B0F12]">
                          {project.state === 'completed' ? 'مكتمل' : 'مؤرشف'}
                        </span>
                      </div>
                      <BaseBadge variant="secondary" size="sm">{project.priority}</BaseBadge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-[11px] text-[rgba(11,15,18,0.5)] mb-3">
                      <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" />{project.description ?? '—'}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{formatDate(project.start_date)} - {formatDate(project.due_date)}</span>
                      <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" />{project.budget ? `${project.budget} ر.س` : '—'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-[rgba(11,15,18,0.3)]" />
                      <span className="text-[11px] text-[rgba(11,15,18,0.5)]">المالك: {project.owner_id.slice(0, 8)}…</span>
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
              </AppCardSurface>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
