
import React, { useState } from 'react';
import { AppDashboardGrid } from '@/components/shared/layout/AppDashboardGrid';
import { AppGridItem } from '@/components/shared/layout/AppGridItem';
import { NumericStatCard } from '@/components/shared/visual-data/NumericStatCard';
import { DataCardFrame } from '@/components/shared/visual-data/DataCardFrame';
import { BaseActionButton } from '@/components/shared/BaseActionButton';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Target, Plus, Search, Calendar, DollarSign, TrendingUp, FileText,
  Eye, Edit, User, BarChart3, Percent, Clock, Tag,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartTooltipShell, CHART_CURSOR_STYLE, RingMetricCard } from '@/components/shared/visual-data';
import { mockOpportunities, mockCRMAnalytics } from './data';
import { GenericFormModal, FormField } from '../shared/GenericFormModal';
import { toast } from 'sonner';

// ─── Labels ─────────────────────────────────────────────────────
const STAGE_MAP: Record<string, { label: string; color: string }> = {
  lead:          { label: 'عميل محتمل', color: '#6B7280' },
  qualified:     { label: 'مؤهل',       color: '#3B82F6' },
  proposal:      { label: 'عرض',        color: '#F59E0B' },
  negotiation:   { label: 'تفاوض',      color: '#8B5CF6' },
  'closed-won':  { label: 'مغلق - فوز', color: '#10B981' },
  'closed-lost': { label: 'مغلق - خسارة', color: '#EF4444' },
};

const SOURCE_MAP: Record<string, string> = {
  website: 'الموقع الإلكتروني', referral: 'الإحالات', marketing: 'التسويق',
  direct: 'التواصل المباشر', other: 'أخرى',
};

export const OpportunitiesTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [opportunities, setOpportunities] = useState(mockOpportunities);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingOpp, setEditingOpp] = useState<any>(null);
  const [viewingOpp, setViewingOpp] = useState<any>(null);

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = selectedStage === 'all' || opp.stage === selectedStage;
    return matchesSearch && matchesStage;
  });

  const funnelData = mockCRMAnalytics.salesFunnel;

  const opportunityBySource = [
    { name: 'الموقع الإلكتروني', value: 35, color: '#3B82F6' },
    { name: 'الإحالات', value: 28, color: '#10B981' },
    { name: 'التسويق', value: 22, color: '#F59E0B' },
    { name: 'التواصل المباشر', value: 10, color: '#8B5CF6' },
    { name: 'أخرى', value: 5, color: '#6B7280' },
  ];

  // ── Form fields ──
  const formFields: FormField[] = [
    { name: 'title', label: 'عنوان الفرصة', type: 'text', required: true, placeholder: 'مثال: مشروع إعادة بناء الهوية لشركة...' },
    { name: 'customerName', label: 'العميل', type: 'text', required: true, placeholder: 'اسم العميل أو الشركة' },
    { name: 'value', label: 'القيمة المتوقعة (ر.س)', type: 'number', required: true, placeholder: '0' },
    { name: 'probability', label: 'احتمالية الإغلاق (%)', type: 'number', required: true, placeholder: '50' },
    { name: 'stage', label: 'المرحلة الحالية', type: 'select', required: true, options: [
      { value: 'lead', label: 'عميل محتمل' }, { value: 'qualified', label: 'مؤهل' },
      { value: 'proposal', label: 'عرض' }, { value: 'negotiation', label: 'تفاوض' },
      { value: 'closed-won', label: 'مغلق - فوز' }, { value: 'closed-lost', label: 'مغلق - خسارة' },
    ]},
    { name: 'expectedCloseDate', label: 'تاريخ الإغلاق المتوقع', type: 'date', required: true },
    { name: 'assignedTo', label: 'المسؤول', type: 'text', placeholder: 'اسم مدير الحساب' },
    { name: 'description', label: 'تفاصيل الفرصة', type: 'textarea', placeholder: 'وصف الفرصة والمتطلبات الرئيسية...' },
  ];

  // ── Handlers ──
  const handleAddOpportunity = (data: Record<string, string>) => {
    const newOpp = {
      id: `opp-${Date.now()}`, customerId: `c-${Date.now()}`, customerName: data.customerName,
      title: data.title, description: data.description || '', value: Number(data.value), currency: 'SAR',
      probability: Number(data.probability), stage: data.stage as any, source: 'other' as const,
      expectedCloseDate: data.expectedCloseDate, assignedTo: data.assignedTo || 'غير محدد',
      createdDate: new Date().toISOString().split('T')[0], lastActivityDate: new Date().toISOString().split('T')[0],
      nextSteps: '', competitors: [], tags: [], documents: [],
    };
    setOpportunities(prev => [newOpp, ...prev]);
  };

  const handleEditOpportunity = (data: Record<string, string>) => {
    if (!editingOpp) return;
    setOpportunities(prev => prev.map(o => o.id === editingOpp.id ? {
      ...o, title: data.title, customerName: data.customerName, value: Number(data.value),
      probability: Number(data.probability), stage: data.stage as any,
      expectedCloseDate: data.expectedCloseDate, assignedTo: data.assignedTo || o.assignedTo,
      description: data.description || o.description, lastActivityDate: new Date().toISOString().split('T')[0],
    } : o));
    setEditingOpp(null);
  };

  const StageBadge = ({ stage }: { stage: string }) => {
    const entry = STAGE_MAP[stage];
    if (!entry) return <BaseBadge variant="secondary">{stage}</BaseBadge>;
    return (
      <span
        className="px-2 py-0.5 text-[10px] rounded-full font-medium font-arabic"
        style={{ backgroundColor: `${entry.color}18`, color: entry.color, border: `1px solid ${entry.color}30` }}
      >
        {entry.label}
      </span>
    );
  };

  const totalPipeline = opportunities
    .filter(o => !['closed-won', 'closed-lost'].includes(o.stage))
    .reduce((s, o) => s + o.value, 0);

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-80">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[rgba(11,15,18,0.4)]" />
            <Input placeholder="البحث بالعنوان أو العميل..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pr-10" />
          </div>
          <Select value={selectedStage} onValueChange={setSelectedStage}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="المرحلة" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع المراحل</SelectItem>
              {Object.entries(STAGE_MAP).map(([v, { label }]) => <SelectItem key={v} value={v}>{label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <BaseActionButton onClick={() => setIsAddOpen(true)} className="flex items-center gap-1.5">
          <Plus className="h-4 w-4" /> إضافة فرصة جديدة
        </BaseActionButton>
      </div>

      {/* ── KPIs ── */}
      <AppDashboardGrid columns={12}>
        <AppGridItem colSpan={3}><NumericStatCard title="إجمالي الفرص" value={opportunities.length} description={`${filteredOpportunities.length} معروضة`} accentColor="#8B5CF6" /></AppGridItem>
        <AppGridItem colSpan={3}><NumericStatCard title="معدل التحويل" value={`${mockCRMAnalytics.conversionRate}%`} description={`${mockCRMAnalytics.wonOpportunities} فرصة ناجحة`} accentColor="#10B981" /></AppGridItem>
        <AppGridItem colSpan={3}><NumericStatCard title="متوسط الصفقة" value={`${(mockCRMAnalytics.averageDealSize / 1000).toFixed(0)}ك`} unit="ر.س" accentColor="#3B82F6" /></AppGridItem>
        <AppGridItem colSpan={3}><NumericStatCard title="قيمة الأنبوب" value={`${(totalPipeline / 1000000).toFixed(1)}`} unit="مليون ر.س" accentColor="#F59E0B" /></AppGridItem>
      </AppDashboardGrid>

      {/* ── Charts ── */}
      <AppDashboardGrid columns={12}>
        <AppGridItem colSpan={6}>
          <DataCardFrame title="مسار المبيعات">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={funnelData} margin={{ top: 20, right: 10, left: 10, bottom: 5 }}>
                <XAxis dataKey="stage" axisLine={false} tickLine={false} tick={{ fill: 'rgba(11,15,18,0.35)', fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(11,15,18,0.35)', fontSize: 10 }} />
                <Tooltip content={<ChartTooltipShell />} cursor={CHART_CURSOR_STYLE} />
                <Bar dataKey="count" fill="#3DA8F5" barSize={20} radius={[999, 999, 999, 999]} />
              </BarChart>
            </ResponsiveContainer>
          </DataCardFrame>
        </AppGridItem>
        <AppGridItem colSpan={6}>
          <RingMetricCard
            title="مصادر الفرص"
            centerValue={opportunityBySource.reduce((s, d) => s + d.value, 0)}
            centerUnit="فرصة"
            layers={opportunityBySource.map(s => ({ value: s.value, color: s.color, label: s.name }))}
          />
        </AppGridItem>
      </AppDashboardGrid>

      {/* ── Opportunities Table ── */}
      <DataCardFrame title={`قائمة الفرص (${filteredOpportunities.length})`}>
        {filteredOpportunities.length === 0 ? (
          <div className="text-center py-10 text-[rgba(11,15,18,0.4)]">
            <Target className="h-10 w-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm font-arabic">لا توجد فرص مطابقة للبحث أو التصفية</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#DADCE0]">
                  {['الفرصة', 'العميل', 'المرحلة', 'القيمة', 'الاحتمالية', 'الإغلاق', 'المسؤول', ''].map((h, i) => (
                    <th key={i} className="text-right font-arabic text-xs font-semibold text-[rgba(11,15,18,0.5)] p-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredOpportunities.map((opp) => (
                  <tr key={opp.id} className="border-b border-[rgba(11,15,18,0.06)] hover:bg-[rgba(11,15,18,0.02)] transition-colors group">
                    <td className="p-3">
                      <div className="font-semibold font-arabic text-sm">{opp.title}</div>
                      {opp.description && <div className="text-xs text-[rgba(11,15,18,0.4)] line-clamp-1 mt-0.5">{opp.description}</div>}
                    </td>
                    <td className="p-3 font-arabic text-sm">{opp.customerName}</td>
                    <td className="p-3"><StageBadge stage={opp.stage} /></td>
                    <td className="p-3 font-arabic text-sm font-semibold text-[#3DBE8B]">{(opp.value / 1000).toFixed(0)}ك ر.س</td>
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-14 bg-[rgba(11,15,18,0.08)] rounded-full h-1.5">
                          <div className="bg-[#3DA8F5] h-1.5 rounded-full transition-all" style={{ width: `${opp.probability}%` }} />
                        </div>
                        <span className="text-xs text-[rgba(11,15,18,0.6)] tabular-nums">{opp.probability}%</span>
                      </div>
                    </td>
                    <td className="p-3 font-arabic text-xs text-[rgba(11,15,18,0.6)]">{opp.expectedCloseDate}</td>
                    <td className="p-3 font-arabic text-xs text-[rgba(11,15,18,0.6)]">{opp.assignedTo}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <BaseActionButton size="sm" variant="outline" onClick={() => setViewingOpp(opp)}><Eye className="h-3 w-3" /></BaseActionButton>
                        <BaseActionButton size="sm" variant="outline" onClick={() => setEditingOpp(opp)}><Edit className="h-3 w-3" /></BaseActionButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DataCardFrame>

      {/* ═══════ MODAL: Add Opportunity ═══════ */}
      <GenericFormModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="إضافة فرصة بيع جديدة"
        fields={formFields}
        onSubmit={handleAddOpportunity}
        submitLabel="إضافة الفرصة"
        successMessage="تمت إضافة الفرصة بنجاح"
      />

      {/* ═══════ MODAL: Edit Opportunity ═══════ */}
      {editingOpp && (
        <GenericFormModal
          isOpen={!!editingOpp}
          onClose={() => setEditingOpp(null)}
          title={`تعديل: ${editingOpp.title}`}
          fields={formFields.map(f => ({
            ...f,
            defaultValue: f.name === 'value' ? String(editingOpp.value)
              : f.name === 'probability' ? String(editingOpp.probability)
              : String((editingOpp as any)[f.name] || ''),
          }))}
          onSubmit={handleEditOpportunity}
          submitLabel="حفظ التعديلات"
          successMessage="تم تحديث الفرصة بنجاح"
        />
      )}

      {/* ═══════ MODAL: View Opportunity Details ═══════ */}
      {viewingOpp && (
        <Dialog open={!!viewingOpp} onOpenChange={() => setViewingOpp(null)}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold font-arabic text-center">تفاصيل الفرصة</DialogTitle>
            </DialogHeader>

            <div className="space-y-5 mt-4">
              {/* Hero */}
              <div className="p-4 bg-white/30 rounded-2xl border border-black/5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold font-arabic">{viewingOpp.title}</h3>
                    <p className="text-sm text-[rgba(11,15,18,0.6)] font-arabic mt-1">{viewingOpp.customerName}</p>
                  </div>
                  <StageBadge stage={viewingOpp.stage} />
                </div>
                {viewingOpp.description && (
                  <p className="text-sm text-[rgba(11,15,18,0.7)] font-arabic mt-3">{viewingOpp.description}</p>
                )}
              </div>

              {/* Value hero */}
              <div className="flex items-center gap-4 p-4 bg-white/30 rounded-2xl border border-black/5">
                <div className="flex-1 text-center">
                  <div className="text-2xl font-bold text-[#3DBE8B]">{(viewingOpp.value / 1000).toFixed(0)}ك ر.س</div>
                  <div className="text-xs text-[rgba(11,15,18,0.5)] font-arabic">القيمة المتوقعة</div>
                </div>
                <div className="w-px h-10 bg-[rgba(11,15,18,0.1)]" />
                <div className="flex-1 text-center">
                  <div className="text-2xl font-bold text-[#3DA8F5]">{viewingOpp.probability}%</div>
                  <div className="text-xs text-[rgba(11,15,18,0.5)] font-arabic">احتمالية الإغلاق</div>
                </div>
                <div className="w-px h-10 bg-[rgba(11,15,18,0.1)]" />
                <div className="flex-1 text-center">
                  <div className="text-2xl font-bold text-[rgba(11,15,18,0.8)]">{(viewingOpp.value * viewingOpp.probability / 100000).toFixed(0)}ك</div>
                  <div className="text-xs text-[rgba(11,15,18,0.5)] font-arabic">القيمة المرجّحة</div>
                </div>
              </div>

              {/* Metadata grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: User, label: 'المسؤول', value: viewingOpp.assignedTo },
                  { icon: BarChart3, label: 'المصدر', value: SOURCE_MAP[viewingOpp.source] || viewingOpp.source || 'غير محدد' },
                  { icon: Calendar, label: 'الإغلاق المتوقع', value: viewingOpp.expectedCloseDate },
                  { icon: Clock, label: 'تاريخ الإنشاء', value: viewingOpp.createdDate },
                  { icon: Calendar, label: 'آخر نشاط', value: viewingOpp.lastActivityDate },
                  { icon: Tag, label: 'العملة', value: viewingOpp.currency || 'SAR' },
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

              {/* Competitors */}
              {viewingOpp.competitors?.length > 0 && (
                <div className="p-4 bg-white/30 rounded-2xl border border-black/5">
                  <span className="text-sm font-semibold font-arabic">المنافسون</span>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {viewingOpp.competitors.map((c: string, i: number) => (
                      <BaseBadge key={i} variant="outline">{c}</BaseBadge>
                    ))}
                  </div>
                </div>
              )}

              {/* Next steps */}
              {viewingOpp.nextSteps && (
                <div className="p-4 bg-white/30 rounded-2xl border border-black/5">
                  <span className="text-sm font-semibold font-arabic">الخطوات التالية</span>
                  <p className="text-sm text-[rgba(11,15,18,0.7)] font-arabic mt-1">{viewingOpp.nextSteps}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <BaseActionButton variant="outline" size="sm" onClick={() => { setViewingOpp(null); setEditingOpp(viewingOpp); }}>
                <Edit className="h-3.5 w-3.5 ml-1" /> تعديل
              </BaseActionButton>
              <BaseActionButton variant="outline" onClick={() => setViewingOpp(null)}>إغلاق</BaseActionButton>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
