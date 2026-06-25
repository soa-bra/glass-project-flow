import { AppCardSurface } from '@/components/shared/surfaces/AppCardSurface';
import React, { useEffect, useMemo, useState } from 'react';
import { Search, Filter, Download, Eye, CheckCircle, Calendar, User, Loader2, Archive, AlertCircle } from 'lucide-react';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface ArchivedTaskRow {
  id: string;
  name: string | null;
  state: string | null;
  priority: string | null;
  due_date: string | null;
  assignee_id: string | null;
  linked_project_id: string | null;
  created_at: string;
}

const ARCHIVED_TASK_STATES = ['archived', 'completed', 'done', 'stopped', 'cancelled'];

const getTaskStateLabel = (state: string | null) => {
  switch (state) {
    case 'completed':
    case 'done':
      return 'مكتملة';
    case 'stopped':
      return 'متوقفة';
    case 'cancelled':
      return 'ملغاة';
    case 'archived':
      return 'مؤرشفة';
    default:
      return 'مؤرشفة';
  }
};

const formatDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString('ar-SA') : '—';

export const TasksArchivePanel: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tasks, setTasks] = useState<ArchivedTaskRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    (async () => {
      try {
        const { data, error: taskError } = await supabase
          .from('tasks')
          .select('id,name,state,priority,due_date,assignee_id,linked_project_id,created_at')
          .in('state', ARCHIVED_TASK_STATES)
          .order('created_at', { ascending: false });

        if (cancelled) return;
        if (taskError) throw taskError;
        setTasks((data ?? []) as ArchivedTaskRow[]);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'فشل تحميل أرشيف المهام');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const archivedTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks;
    const q = searchQuery.toLowerCase();
    return tasks.filter((task) =>
      (task.name ?? '').toLowerCase().includes(q) ||
      (task.priority ?? '').toLowerCase().includes(q) ||
      (task.state ?? '').toLowerCase().includes(q),
    );
  }, [tasks, searchQuery]);

  return (
    <div className="h-full flex flex-col bg-transparent" dir="rtl">
      <div className="flex items-center justify-between px-6 py-6">
        <h2 className="text-[11px] font-medium text-[rgba(11,15,18,0.6)] uppercase tracking-wide">
          أرشيف المهام ({archivedTasks.length})
        </h2>
        <div className="flex items-center gap-3">
          <Button className="bg-[#0B0F12] text-white rounded-full text-sm">
            <Download className="w-4 h-4 ml-2" />تقرير المهام
          </Button>
          <Button variant="outline" className="rounded-full text-sm ring-1 ring-[rgba(11,15,18,0.15)]">
            <Filter className="w-4 h-4 ml-2" />تصفية
          </Button>
        </div>
      </div>

      <div className="px-6 mb-6">
        <AppCardSurface density="compact">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(11,15,18,0.3)] w-5 h-5" />
            <input
              type="text"
              placeholder="البحث في أرشيف المهام..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-12 pl-4 py-3 rounded-full ring-1 ring-[rgba(11,15,18,0.1)] focus:outline-none focus:ring-2 focus:ring-[rgba(11,15,18,0.2)] text-sm"
            />
          </div>
        </AppCardSurface>
      </div>

      <div className="flex-1 px-6 pb-6 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-[rgba(11,15,18,0.4)]" />
          </div>
        ) : error ? (
          <AppCardSurface density="standard">
            <div className="flex items-center justify-center gap-2 py-12 text-[#E5564D] text-sm">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          </AppCardSurface>
        ) : archivedTasks.length === 0 ? (
          <AppCardSurface density="standard">
            <div className="text-center py-12 text-[rgba(11,15,18,0.5)] text-sm">
              لا توجد مهام مؤرشفة بعد.
            </div>
          </AppCardSurface>
        ) : (
          <div className="space-y-4">
            {archivedTasks.map((task) => (
              <AppCardSurface key={task.id} interactive="hoverable" density="standard">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-bold text-[#0B0F12] text-base truncate">{task.name || 'مهمة بدون عنوان'}</h3>
                      <div className="bg-[#d1e1ea] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-[#0B0F12]" />
                        <span className="text-[10px] font-medium text-[#0B0F12]">
                          {getTaskStateLabel(task.state)}
                        </span>
                      </div>
                      {task.priority && <BaseBadge variant="secondary" size="sm">{task.priority}</BaseBadge>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] text-[rgba(11,15,18,0.5)] mb-3">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />تاريخ الاستحقاق: {formatDate(task.due_date)}</span>
                      <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />المسؤول: {task.assignee_id ? `${task.assignee_id.slice(0, 8)}…` : '—'}</span>
                      <span className="flex items-center gap-1"><Archive className="w-3.5 h-3.5" />المشروع: {task.linked_project_id ? `${task.linked_project_id.slice(0, 8)}…` : '—'}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    <Button size="sm" className="bg-[#0B0F12] text-white rounded-full text-[11px]">
                      <Eye className="w-3.5 h-3.5 ml-1" />عرض
                    </Button>
                    <Button size="sm" variant="outline" className="rounded-full text-[11px] ring-1 ring-[rgba(11,15,18,0.15)]">
                      <Download className="w-3.5 h-3.5 ml-1" />تحميل
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
