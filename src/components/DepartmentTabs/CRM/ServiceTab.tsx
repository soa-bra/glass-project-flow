
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, Tooltip, XAxis, YAxis } from 'recharts';
import { Plus, Search, Eye, Edit, Clock, User, Tag, Calendar, AlertTriangle, MessageSquare, CheckCircle2 } from 'lucide-react';
import { MetricHeroCard } from '@/components/shared/visual-data/MetricHeroCard';
import { DataCardFrame } from '@/components/shared/visual-data/DataCardFrame';
import { ChartTooltipShell, CHART_CURSOR_STYLE } from '@/components/shared/visual-data';
import { AppDashboardGrid } from '@/components/shared/layout/AppDashboardGrid';
import { AppGridItem } from '@/components/shared/layout/AppGridItem';
import { BaseActionButton } from '@/components/shared/BaseActionButton';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { mockCustomerService } from './data';
import { GenericFormModal, FormField } from '../shared/GenericFormModal';
import { toast } from 'sonner';

// ─── Maps ───────────────────────────────────────────────────────
const PRIORITY_MAP: Record<string, { label: string; color: string }> = {
  urgent: { label: 'عاجل', color: '#E5564D' },
  high:   { label: 'مرتفع', color: '#F6C445' },
  medium: { label: 'متوسط', color: '#3DA8F5' },
  low:    { label: 'منخفض', color: '#3DBE8B' },
};

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  open:          { label: 'مفتوح', color: '#3DA8F5' },
  'in-progress': { label: 'قيد المعالجة', color: '#F6C445' },
  resolved:      { label: 'محلول', color: '#3DBE8B' },
  closed:        { label: 'مغلق', color: 'rgba(11,15,18,0.40)' },
};

const InlineBadge = ({ map, value }: { map: Record<string, { label: string; color: string }>; value: string }) => {
  const entry = map[value];
  if (!entry) return <BaseBadge variant="secondary">{value}</BaseBadge>;
  return (
    <span
      className="px-2 py-0.5 text-[10px] rounded-full font-medium font-arabic"
      style={{ backgroundColor: `${entry.color}18`, color: entry.color, border: `1px solid ${entry.color}30` }}
    >
      {entry.label}
    </span>
  );
};

// ─── Form fields ────────────────────────────────────────────────
const ticketFields: FormField[] = [
  { name: 'customerName', label: 'اسم العميل', type: 'text', required: true, placeholder: 'اسم العميل أو الشركة' },
  { name: 'subject', label: 'موضوع التذكرة', type: 'text', required: true, placeholder: 'وصف مختصر للمشكلة أو الطلب' },
  { name: 'priority', label: 'الأولوية', type: 'select', required: true, options: [
    { value: 'low', label: 'منخفض' }, { value: 'medium', label: 'متوسط' },
    { value: 'high', label: 'مرتفع' }, { value: 'urgent', label: 'عاجل' },
  ]},
  { name: 'category', label: 'التصنيف', type: 'select', required: true, options: [
    { value: 'تقني', label: 'دعم تقني' }, { value: 'فوترة', label: 'فوترة ومدفوعات' },
    { value: 'عام', label: 'استفسار عام' }, { value: 'تغيير', label: 'طلب تغيير' },
    { value: 'تدريب', label: 'تدريب' },
  ]},
  { name: 'assignedTo', label: 'المسؤول', type: 'text', placeholder: 'اسم الوكيل المسؤول' },
  { name: 'description', label: 'التفاصيل', type: 'textarea', placeholder: 'وصف تفصيلي للمشكلة أو الطلب...' },
];

export const ServiceTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [tickets, setTickets] = useState(mockCustomerService);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<any>(null);
  const [viewingTicket, setViewingTicket] = useState<any>(null);

  const filteredTickets = tickets.filter(t => {
    const ms = t.subject.toLowerCase().includes(searchTerm.toLowerCase()) || t.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    return ms && (selectedPriority === 'all' || t.priority === selectedPriority) && (selectedStatus === 'all' || t.status === selectedStatus);
  });

  // ── Handlers ──
  const handleCreate = (data: Record<string, string>) => {
    const newTicket = {
      id: `ticket-${Date.now()}`, customerId: `c-${Date.now()}`, customerName: data.customerName,
      type: 'request' as const, priority: data.priority as any, status: 'open' as const,
      subject: data.subject, description: data.description || '', category: data.category || 'عام',
      subcategory: '', assignedTo: data.assignedTo || 'غير محدد',
      createdDate: new Date().toISOString().split('T')[0], dueDate: '', escalated: false,
      tags: [], attachments: [], responseTime: 0,
    };
    setTickets(prev => [newTicket, ...prev]);
  };

  const handleEdit = (data: Record<string, string>) => {
    if (!editingTicket) return;
    setTickets(prev => prev.map(t => t.id === editingTicket.id ? {
      ...t, customerName: data.customerName, subject: data.subject,
      priority: data.priority as any, category: data.category || t.category,
      assignedTo: data.assignedTo || t.assignedTo, description: data.description || t.description,
    } : t));
    setEditingTicket(null);
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus as any } : t));
    const label = STATUS_MAP[newStatus]?.label || newStatus;
    toast.success(`تم تغيير الحالة إلى: ${label}`);
  };

  // ── Chart data ──
  const responseTimeData = [
    { month: 'يناير', avgTime: 2.1 }, { month: 'فبراير', avgTime: 1.9 }, { month: 'مارس', avgTime: 2.3 },
    { month: 'أبريل', avgTime: 1.8 }, { month: 'مايو', avgTime: 1.7 }, { month: 'يونيو', avgTime: 1.6 },
  ];
  const ticketCategoryData = [
    { category: 'تقني', count: 45 }, { category: 'فوترة', count: 23 }, { category: 'عام', count: 18 },
    { category: 'تغيير', count: 15 }, { category: 'تدريب', count: 8 },
  ];
  const satisfactionData = [
    { month: 'يناير', rating: 4.2 }, { month: 'فبراير', rating: 4.3 }, { month: 'مارس', rating: 4.1 },
    { month: 'أبريل', rating: 4.5 }, { month: 'مايو', rating: 4.4 }, { month: 'يونيو', rating: 4.6 },
  ];

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-80">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[rgba(11,15,18,0.4)]" />
            <Input placeholder="البحث في التذاكر..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pr-10" />
          </div>
          <Select value={selectedPriority} onValueChange={setSelectedPriority}>
            <SelectTrigger className="w-[130px]"><SelectValue placeholder="الأولوية" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الأولويات</SelectItem>
              {Object.entries(PRIORITY_MAP).map(([v, { label }]) => <SelectItem key={v} value={v}>{label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[130px]"><SelectValue placeholder="الحالة" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الحالات</SelectItem>
              {Object.entries(STATUS_MAP).map(([v, { label }]) => <SelectItem key={v} value={v}>{label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <BaseActionButton onClick={() => setIsCreateOpen(true)} className="flex items-center gap-1.5">
          <Plus className="h-4 w-4" /> تذكرة جديدة
        </BaseActionButton>
      </div>

      {/* ── KPIs ── */}
      <AppDashboardGrid columns={12} density="default">
        <AppGridItem colSpan={3} tabletSpan={6}><MetricHeroCard title="تذاكر مفتوحة" value={tickets.filter(t => t.status === 'open').length} description={`من أصل ${tickets.length}`} className="min-h-[130px]" /></AppGridItem>
        <AppGridItem colSpan={3} tabletSpan={6}><MetricHeroCard title="وقت الاستجابة" value="1.6" unit="ساعة" className="min-h-[130px]" /></AppGridItem>
        <AppGridItem colSpan={3} tabletSpan={6}><MetricHeroCard title="تقييم الرضا" value="4.6" unit="/5" className="min-h-[130px]" /></AppGridItem>
        <AppGridItem colSpan={3} tabletSpan={6}><MetricHeroCard title="معدل الحل" value="92%" className="min-h-[130px]" /></AppGridItem>
      </AppDashboardGrid>

      {/* ── Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <DataCardFrame title="وقت الاستجابة">
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={responseTimeData}>
              <XAxis dataKey="month" tick={{ fontSize: 9, fill: 'rgba(11,15,18,0.35)' }} axisLine={false} tickLine={false} /><YAxis hide />
              <Tooltip content={<ChartTooltipShell />} cursor={CHART_CURSOR_STYLE} />
              <Line type="monotone" dataKey="avgTime" stroke="#3DA8F5" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </DataCardFrame>
        <DataCardFrame title="التذاكر حسب الفئة">
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={ticketCategoryData} barSize={20}>
              <XAxis dataKey="category" tick={{ fontSize: 9, fill: 'rgba(11,15,18,0.35)' }} axisLine={false} tickLine={false} /><YAxis hide />
              <Tooltip content={<ChartTooltipShell />} cursor={CHART_CURSOR_STYLE} />
              <Bar dataKey="count" fill="#3DBE8B" radius={[999, 999, 999, 999]} />
            </BarChart>
          </ResponsiveContainer>
        </DataCardFrame>
        <DataCardFrame title="اتجاه الرضا">
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={satisfactionData}>
              <XAxis dataKey="month" tick={{ fontSize: 9, fill: 'rgba(11,15,18,0.35)' }} axisLine={false} tickLine={false} /><YAxis hide />
              <Tooltip content={<ChartTooltipShell />} cursor={CHART_CURSOR_STYLE} />
              <Line type="monotone" dataKey="rating" stroke="#F6C445" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </DataCardFrame>
      </div>

      {/* ── Tickets Table ── */}
      <DataCardFrame title={`قائمة التذاكر (${filteredTickets.length})`}>
        {filteredTickets.length === 0 ? (
          <div className="text-center py-10 text-[rgba(11,15,18,0.4)]">
            <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm font-arabic">لا توجد تذاكر مطابقة</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredTickets.map(ticket => (
              <div key={ticket.id} className="p-4 rounded-2xl border border-[#DADCE0] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-shadow group">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className="text-sm font-bold text-[#0B0F12] font-arabic truncate">{ticket.subject}</h4>
                      <InlineBadge map={PRIORITY_MAP} value={ticket.priority} />
                      <InlineBadge map={STATUS_MAP} value={ticket.status} />
                      {ticket.escalated && (
                        <span className="px-2 py-0.5 text-[10px] rounded-full font-medium bg-[#E5564D]/10 text-[#E5564D] border border-[#E5564D]/30">
                          <AlertTriangle className="inline h-2.5 w-2.5 ml-0.5" />مصعّد
                        </span>
                      )}
                    </div>
                    <div className="flex gap-3 text-[10px] text-[rgba(11,15,18,0.35)] font-arabic">
                      <span>العميل: {ticket.customerName}</span>
                      <span>المسؤول: {ticket.assignedTo}</span>
                      <span>{ticket.createdDate}</span>
                      {ticket.category && <span>التصنيف: {ticket.category}</span>}
                    </div>
                  </div>
                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <BaseActionButton size="sm" variant="outline" onClick={() => setViewingTicket(ticket)}><Eye className="h-3 w-3" /></BaseActionButton>
                    <BaseActionButton size="sm" variant="outline" onClick={() => setEditingTicket(ticket)}><Edit className="h-3 w-3" /></BaseActionButton>
                    {ticket.status === 'open' && (
                      <BaseActionButton size="sm" variant="outline" onClick={() => handleStatusChange(ticket.id, 'in-progress')}>
                        <Clock className="h-3 w-3 ml-1" />معالجة
                      </BaseActionButton>
                    )}
                    {ticket.status === 'in-progress' && (
                      <BaseActionButton size="sm" variant="outline" onClick={() => handleStatusChange(ticket.id, 'resolved')}>
                        <CheckCircle2 className="h-3 w-3 ml-1" />حل
                      </BaseActionButton>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </DataCardFrame>

      {/* ═══════ MODAL: Create Ticket ═══════ */}
      <GenericFormModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="إنشاء تذكرة دعم جديدة"
        fields={ticketFields}
        onSubmit={handleCreate}
        submitLabel="إنشاء التذكرة"
        successMessage="تم إنشاء التذكرة بنجاح"
      />

      {/* ═══════ MODAL: Edit Ticket ═══════ */}
      {editingTicket && (
        <GenericFormModal
          isOpen={!!editingTicket}
          onClose={() => setEditingTicket(null)}
          title={`تعديل: ${editingTicket.subject}`}
          fields={ticketFields.map(f => ({
            ...f,
            defaultValue: String((editingTicket as any)[f.name] || ''),
          }))}
          onSubmit={handleEdit}
          submitLabel="حفظ التعديلات"
          successMessage="تم تحديث التذكرة بنجاح"
        />
      )}

      {/* ═══════ MODAL: View Ticket Details ═══════ */}
      {viewingTicket && (
        <Dialog open={!!viewingTicket} onOpenChange={() => setViewingTicket(null)}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold font-arabic text-center">تفاصيل التذكرة</DialogTitle>
            </DialogHeader>

            <div className="space-y-5 mt-4">
              {/* Hero */}
              <div className="p-4 bg-white/30 rounded-2xl border border-black/5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold font-arabic">{viewingTicket.subject}</h3>
                    <p className="text-sm text-[rgba(11,15,18,0.6)] font-arabic mt-1">{viewingTicket.customerName}</p>
                  </div>
                  <div className="flex flex-col gap-1.5 items-end">
                    <InlineBadge map={STATUS_MAP} value={viewingTicket.status} />
                    <InlineBadge map={PRIORITY_MAP} value={viewingTicket.priority} />
                  </div>
                </div>
                {viewingTicket.description && (
                  <p className="text-sm text-[rgba(11,15,18,0.7)] font-arabic mt-3 leading-relaxed">{viewingTicket.description}</p>
                )}
              </div>

              {/* Metadata grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Tag, label: 'رقم التذكرة', value: viewingTicket.id },
                  { icon: User, label: 'المسؤول', value: viewingTicket.assignedTo },
                  { icon: Calendar, label: 'تاريخ الإنشاء', value: viewingTicket.createdDate },
                  { icon: Clock, label: 'وقت الاستجابة', value: viewingTicket.responseTime ? `${viewingTicket.responseTime} ساعة` : 'غير محدد' },
                  { icon: Tag, label: 'التصنيف', value: viewingTicket.category || 'عام' },
                  { icon: AlertTriangle, label: 'مصعّد', value: viewingTicket.escalated ? 'نعم' : 'لا' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-3 bg-white/30 rounded-xl border border-black/5">
                    <item.icon className="h-4 w-4 text-[rgba(11,15,18,0.4)] shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs text-[rgba(11,15,18,0.5)] font-arabic">{item.label}</div>
                      <div className="text-sm font-semibold font-arabic truncate">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tags */}
              {viewingTicket.tags?.length > 0 && (
                <div className="p-4 bg-white/30 rounded-2xl border border-black/5">
                  <span className="text-sm font-semibold font-arabic">الوسوم</span>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {viewingTicket.tags.map((tag: string, i: number) => (
                      <BaseBadge key={i} variant="outline">{tag}</BaseBadge>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick status actions */}
              {viewingTicket.status !== 'closed' && viewingTicket.status !== 'resolved' && (
                <div className="p-4 bg-white/30 rounded-2xl border border-black/5">
                  <span className="text-sm font-semibold font-arabic block mb-2">إجراءات سريعة</span>
                  <div className="flex gap-2">
                    {viewingTicket.status === 'open' && (
                      <BaseActionButton size="sm" onClick={() => { handleStatusChange(viewingTicket.id, 'in-progress'); setViewingTicket({ ...viewingTicket, status: 'in-progress' }); }}>
                        <Clock className="h-3.5 w-3.5 ml-1" /> بدء المعالجة
                      </BaseActionButton>
                    )}
                    {viewingTicket.status === 'in-progress' && (
                      <BaseActionButton size="sm" onClick={() => { handleStatusChange(viewingTicket.id, 'resolved'); setViewingTicket({ ...viewingTicket, status: 'resolved' }); }}>
                        <CheckCircle2 className="h-3.5 w-3.5 ml-1" /> تم الحل
                      </BaseActionButton>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <BaseActionButton variant="outline" size="sm" onClick={() => { setViewingTicket(null); setEditingTicket(viewingTicket); }}>
                <Edit className="h-3.5 w-3.5 ml-1" /> تعديل
              </BaseActionButton>
              <BaseActionButton variant="outline" onClick={() => setViewingTicket(null)}>إغلاق</BaseActionButton>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
