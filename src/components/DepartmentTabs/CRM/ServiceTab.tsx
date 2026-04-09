import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, Tooltip, XAxis, YAxis } from 'recharts';
import { MessageSquare, Plus, Search, Clock, CheckCircle, XCircle, Timer } from 'lucide-react';
import { MetricHeroCard } from '@/components/shared/visual-data/MetricHeroCard';
import { mockCustomerService } from './data';
import { GenericDetailModal, DetailField } from '../shared/GenericDetailModal';
import { toast } from 'sonner';

const tooltipStyle = { backgroundColor: '#0B0F12', border: 'none', borderRadius: '10px', fontSize: '12px', color: '#FFF', padding: '8px 12px' };

export const ServiceTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [tickets, setTickets] = useState(mockCustomerService);
  const [viewingTicket, setViewingTicket] = useState<any>(null);
  const [newTicket, setNewTicket] = useState({ customer: '', priority: 'medium', subject: '', description: '' });

  const getPriorityColor = (p: string) => ({ urgent: 'bg-[#E5564D]/10 text-[#E5564D]', high: 'bg-[#F6C445]/10 text-[#F6C445]', medium: 'bg-[#3DA8F5]/10 text-[#3DA8F5]', low: 'bg-[#3DBE8B]/10 text-[#3DBE8B]' }[p] || 'bg-gray-100 text-gray-600');
  const getPriorityText = (p: string) => ({ urgent: 'عاجل', high: 'مرتفع', medium: 'متوسط', low: 'منخفض' }[p] || p);
  const getStatusColor = (s: string) => ({ open: 'bg-[#3DA8F5]/10 text-[#3DA8F5]', 'in-progress': 'bg-[#F6C445]/10 text-[#F6C445]', resolved: 'bg-[#3DBE8B]/10 text-[#3DBE8B]', closed: 'bg-[rgba(11,15,18,0.08)] text-[rgba(11,15,18,0.50)]' }[s] || 'bg-gray-100');
  const getStatusText = (s: string) => ({ open: 'مفتوح', 'in-progress': 'قيد المعالجة', resolved: 'محلول', closed: 'مغلق' }[s] || s);

  const filteredTickets = tickets.filter(t => {
    const ms = t.subject.toLowerCase().includes(searchTerm.toLowerCase()) || t.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    return ms && (selectedPriority === 'all' || t.priority === selectedPriority) && (selectedStatus === 'all' || t.status === selectedStatus);
  });

  const handleCreateTicket = () => {
    if (!newTicket.customer || !newTicket.subject) { toast.error('يرجى ملء الحقول المطلوبة'); return; }
    setTickets(prev => [{ id: `ticket-${Date.now()}`, customerId: `c-${Date.now()}`, customerName: newTicket.customer, type: 'request' as const, priority: newTicket.priority as any, status: 'open' as const, subject: newTicket.subject, description: newTicket.description, category: 'عام', subcategory: '', assignedTo: 'غير محدد', createdDate: new Date().toISOString().split('T')[0], dueDate: '', escalated: false, tags: [], attachments: [], responseTime: 0 }, ...prev]);
    setNewTicket({ customer: '', priority: 'medium', subject: '', description: '' });
    setShowNewTicketForm(false);
    toast.success('تم إنشاء التذكرة');
  };

  const handleProcessTicket = (id: string) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'in-progress' as const } : t));
    toast.success('تم بدء المعالجة');
  };

  const getViewFields = (t: any): DetailField[] => [
    { label: 'رقم التذكرة', value: t.id }, { label: 'الموضوع', value: t.subject },
    { label: 'العميل', value: t.customerName }, { label: 'الأولوية', value: getPriorityText(t.priority) },
    { label: 'الحالة', value: getStatusText(t.status) }, { label: 'المسؤول', value: t.assignedTo },
    { label: 'تاريخ الإنشاء', value: t.createdDate }, { label: 'الوصف', value: t.description || 'لا يوجد' },
  ];

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
      {/* Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-80">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[rgba(11,15,18,0.30)]" />
            <Input placeholder="البحث في التذاكر..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pr-10 rounded-full border-[#DADCE0]" />
          </div>
          <select value={selectedPriority} onChange={e => setSelectedPriority(e.target.value)} className="px-3 py-1.5 border border-[#DADCE0] rounded-full bg-white font-arabic text-xs">
            <option value="all">الأولويات</option><option value="urgent">عاجل</option><option value="high">مرتفع</option><option value="medium">متوسط</option><option value="low">منخفض</option>
          </select>
          <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)} className="px-3 py-1.5 border border-[#DADCE0] rounded-full bg-white font-arabic text-xs">
            <option value="all">الحالات</option><option value="open">مفتوح</option><option value="in-progress">قيد المعالجة</option><option value="resolved">محلول</option>
          </select>
        </div>
        <button onClick={() => setShowNewTicketForm(!showNewTicketForm)} className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0B0F12] text-white text-xs font-arabic hover:bg-[#0B0F12]/90 transition-colors">
          <Plus className="w-3.5 h-3.5" /> تذكرة جديدة
        </button>
      </div>

      {/* New Ticket Form */}
      {showNewTicketForm && (
        <div className="rounded-[24px] bg-white border border-[#DADCE0] p-6">
          <span className="text-xs font-medium text-[rgba(11,15,18,0.50)] font-arabic block mb-4">إنشاء تذكرة جديدة</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div><label className="block text-[11px] font-arabic mb-1 text-[rgba(11,15,18,0.50)]">العميل *</label><Input value={newTicket.customer} onChange={e => setNewTicket(p => ({ ...p, customer: e.target.value }))} className="rounded-[12px] border-[#DADCE0]" /></div>
            <div><label className="block text-[11px] font-arabic mb-1 text-[rgba(11,15,18,0.50)]">الأولوية</label><select value={newTicket.priority} onChange={e => setNewTicket(p => ({ ...p, priority: e.target.value }))} className="w-full px-3 py-2 border border-[#DADCE0] rounded-[12px] bg-white font-arabic text-sm"><option value="low">منخفض</option><option value="medium">متوسط</option><option value="high">مرتفع</option><option value="urgent">عاجل</option></select></div>
          </div>
          <div className="mb-4"><label className="block text-[11px] font-arabic mb-1 text-[rgba(11,15,18,0.50)]">الموضوع *</label><Input value={newTicket.subject} onChange={e => setNewTicket(p => ({ ...p, subject: e.target.value }))} className="rounded-[12px] border-[#DADCE0]" /></div>
          <div className="mb-4"><label className="block text-[11px] font-arabic mb-1 text-[rgba(11,15,18,0.50)]">الوصف</label><Textarea value={newTicket.description} onChange={e => setNewTicket(p => ({ ...p, description: e.target.value }))} className="min-h-[80px] rounded-[12px] border-[#DADCE0]" /></div>
          <div className="flex gap-2">
            <button onClick={handleCreateTicket} className="px-4 py-2 rounded-full bg-[#3DBE8B] text-white text-xs font-arabic">إنشاء</button>
            <button onClick={() => setShowNewTicketForm(false)} className="px-4 py-2 rounded-full border border-[#DADCE0] text-xs font-arabic">إلغاء</button>
          </div>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricHeroCard title="تذاكر مفتوحة" value={tickets.filter(t => t.status === 'open').length} description={`من أصل ${tickets.length}`} className="min-h-[130px]" />
        <MetricHeroCard title="وقت الاستجابة" value="1.6" unit="ساعة" className="min-h-[130px]" />
        <MetricHeroCard title="تقييم الرضا" value="4.6" unit="/5" className="min-h-[130px]" />
        <MetricHeroCard title="معدل الحل" value="92%" className="min-h-[130px]" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <DataCardFrame title="وقت الاستجابة">
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={responseTimeData}>
              <XAxis dataKey="month" tick={{ fontSize: 9, fill: 'rgba(11,15,18,0.35)' }} axisLine={false} tickLine={false} /><YAxis hide />
              <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: '#FFF' }} />
              <Line type="monotone" dataKey="avgTime" stroke="#3DA8F5" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </DataCardFrame>
        <DataCardFrame title="التذاكر حسب الفئة">
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={ticketCategoryData} barSize={20}>
              <XAxis dataKey="category" tick={{ fontSize: 9, fill: 'rgba(11,15,18,0.35)' }} axisLine={false} tickLine={false} /><YAxis hide />
              <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: '#FFF' }} />
              <Bar dataKey="count" fill="#3DBE8B" radius={[999, 999, 999, 999]} />
            </BarChart>
          </ResponsiveContainer>
        </DataCardFrame>
        <DataCardFrame title="اتجاه الرضا">
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={satisfactionData}>
              <XAxis dataKey="month" tick={{ fontSize: 9, fill: 'rgba(11,15,18,0.35)' }} axisLine={false} tickLine={false} /><YAxis hide />
              <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: '#FFF' }} />
              <Line type="monotone" dataKey="rating" stroke="#F6C445" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </DataCardFrame>
      </div>

      {/* Tickets List */}
      <div className="rounded-[24px] bg-white border border-[#DADCE0] p-6">
        <span className="text-xs font-medium text-[rgba(11,15,18,0.50)] font-arabic tracking-wide uppercase mb-4 block">
          قائمة التذاكر ({filteredTickets.length})
        </span>
        <div className="space-y-3">
          {filteredTickets.map(ticket => (
            <div key={ticket.id} className="p-4 rounded-[18px] border border-[#DADCE0] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-bold text-[#0B0F12] font-arabic">{ticket.subject}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getPriorityColor(ticket.priority)}`}>{getPriorityText(ticket.priority)}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(ticket.status)}`}>{getStatusText(ticket.status)}</span>
                  </div>
                  <div className="flex gap-3 text-[10px] text-[rgba(11,15,18,0.35)] font-arabic">
                    <span>العميل: {ticket.customerName}</span>
                    <span>المسؤول: {ticket.assignedTo}</span>
                    <span>{ticket.createdDate}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setViewingTicket(ticket)} className="px-3 py-1 rounded-full border border-[#DADCE0] text-[10px] font-arabic hover:bg-[#d9e7ed]/50 transition-colors">عرض</button>
                  {ticket.status === 'open' && (
                    <button onClick={() => handleProcessTicket(ticket.id)} className="px-3 py-1 rounded-full bg-[#3DA8F5] text-white text-[10px] font-arabic">معالجة</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {viewingTicket && <GenericDetailModal isOpen={!!viewingTicket} onClose={() => setViewingTicket(null)} title={`تذكرة: ${viewingTicket.subject}`} fields={getViewFields(viewingTicket)} />}
    </div>
  );
};
