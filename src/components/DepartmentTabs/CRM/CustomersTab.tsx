
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@/contexts/NavigationContext';
import { DataCardFrame } from '@/components/shared/visual-data/DataCardFrame';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BaseActionButton } from '@/components/shared/BaseActionButton';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { Users, Search, Plus, Mail, Phone, MapPin, Star, Calendar, TrendingUp, Edit, Globe, Briefcase, Clock } from 'lucide-react';
import { mockCustomers } from './data';
import type { Customer } from './types';
import { GenericFormModal, FormField } from '../shared/GenericFormModal';
import { toast } from 'sonner';

// ─── Maps ───────────────────────────────────────────────────────
const STATUS_MAP: Record<string, { label: string; color: string }> = {
  active:   { label: 'نشط',     color: '#3DBE8B' },
  prospect: { label: 'محتمل',   color: '#3DA8F5' },
  inactive: { label: 'غير نشط', color: 'rgba(11,15,18,0.40)' },
  churned:  { label: 'منقطع',   color: '#E5564D' },
};

const StatusBadge = ({ status }: { status: string }) => {
  const entry = STATUS_MAP[status];
  if (!entry) return <BaseBadge variant="secondary">{status}</BaseBadge>;
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
const customerFields: FormField[] = [
  { name: 'name', label: 'اسم العميل', type: 'text', required: true, placeholder: 'الاسم الكامل' },
  { name: 'company', label: 'الشركة', type: 'text', required: true, placeholder: 'اسم الشركة' },
  { name: 'email', label: 'البريد الإلكتروني', type: 'email', required: true, placeholder: 'email@company.com' },
  { name: 'phone', label: 'رقم الهاتف', type: 'tel', required: true, placeholder: '+966...' },
  { name: 'city', label: 'المدينة', type: 'text', placeholder: 'المدينة' },
  { name: 'industry', label: 'القطاع', type: 'text', placeholder: 'مثال: تقنية، تجارة، صحة...' },
  { name: 'status', label: 'الحالة', type: 'select', required: true, options: [
    { value: 'prospect', label: 'محتمل' }, { value: 'active', label: 'نشط' },
    { value: 'inactive', label: 'غير نشط' }, { value: 'churned', label: 'منقطع' },
  ]},
];

export const CustomersTab: React.FC = () => {
  const { navigationState } = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [customers, setCustomers] = useState(mockCustomers);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    if (navigationState.selectedCustomer) {
      setSelectedCustomer(navigationState.selectedCustomer);
    }
  }, [navigationState.selectedCustomer]);

  const handleAddCustomer = (data: Record<string, string>) => {
    const newCustomer: Customer = {
      id: `cust-${Date.now()}`, name: data.name, company: data.company, email: data.email, phone: data.phone,
      city: data.city || 'غير محدد', country: 'السعودية', industry: data.industry || 'غير محدد', website: '',
      status: (data.status as Customer['status']) || 'prospect',
      customerSince: new Date().toISOString().split('T')[0], lastContact: new Date().toISOString().split('T')[0],
      totalValue: 0, assignedManager: '',
      preferences: { communicationChannel: 'email', contactTiming: '09:00-17:00', language: 'ar', meetingPreference: 'virtual', documentFormat: 'pdf' },
      specialNeeds: [], interactionHistory: [], projects: [],
      satisfaction: { npsScore: 0, overallRating: 0, lastSurveyDate: '' }, tags: [],
    };
    setCustomers(prev => [newCustomer, ...prev]);
  };

  const handleEditCustomer = (data: Record<string, string>) => {
    if (!editingCustomer) return;
    setCustomers(prev => prev.map(c => c.id === editingCustomer.id ? {
      ...c, name: data.name, company: data.company, email: data.email, phone: data.phone,
      city: data.city || c.city, industry: data.industry || c.industry,
      status: (data.status as Customer['status']) || c.status,
    } : c));
    setEditingCustomer(null);
  };

  const handleSendSurvey = () => {
    const activeCount = customers.filter(c => c.status === 'active').length;
    toast.success(`تم إرسال استطلاع الرضا إلى ${activeCount} عميل نشط`, { description: 'سيتم جمع الردود خلال 7 أيام عمل' });
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || customer.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || customer.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const selectedCustomerData = selectedCustomer ? customers.find(c => c.id === selectedCustomer) : null;

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-80">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[rgba(11,15,18,0.4)]" />
            <Input placeholder="البحث في العملاء..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pr-10" />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="الحالة" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الحالات</SelectItem>
              {Object.entries(STATUS_MAP).map(([v, { label }]) => <SelectItem key={v} value={v}>{label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <BaseActionButton onClick={() => setIsAddOpen(true)} className="flex items-center gap-1.5">
          <Plus className="h-4 w-4" /> إضافة عميل جديد
        </BaseActionButton>
      </div>

      {/* ── Main Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer List */}
        <div className="lg:col-span-1">
          <DataCardFrame title={`قائمة العملاء (${filteredCustomers.length})`}>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {filteredCustomers.map((customer) => (
                <div
                  key={customer.id}
                  onClick={() => setSelectedCustomer(customer.id)}
                  className={`p-3 rounded-2xl cursor-pointer transition-all border ${
                    selectedCustomer === customer.id
                      ? 'border-[#3DA8F5] bg-[#3DA8F5]/5'
                      : 'border-[#DADCE0] hover:border-[rgba(11,15,18,0.2)] hover:bg-[rgba(11,15,18,0.02)]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold font-arabic text-[#0B0F12] truncate">{customer.name}</h4>
                      <p className="text-xs text-[rgba(11,15,18,0.5)] font-arabic truncate">{customer.company}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <StatusBadge status={customer.status} />
                        {customer.satisfaction.npsScore > 0 && (
                          <div className="flex items-center">
                            <Star className="h-3 w-3 text-[#F6C445] fill-[#F6C445] ml-0.5" />
                            <span className="text-[10px] text-[rgba(11,15,18,0.5)] tabular-nums">{customer.satisfaction.npsScore}/10</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {customer.totalValue > 0 && (
                      <div className="text-xs font-semibold text-[#3DBE8B] tabular-nums shrink-0">{(customer.totalValue / 1000).toFixed(0)}ك</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </DataCardFrame>
        </div>

        {/* Customer Detail */}
        <div className="lg:col-span-2">
          {selectedCustomerData ? (
            <div className="space-y-5">
              {/* Hero */}
              <DataCardFrame title={selectedCustomerData.name}>
                <div className="flex items-start justify-between mb-5">
                  <div className="flex-1">
                    <p className="text-base text-[rgba(11,15,18,0.6)] font-arabic">{selectedCustomerData.company}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <StatusBadge status={selectedCustomerData.status} />
                      <span className="text-xs text-[rgba(11,15,18,0.5)] font-arabic flex items-center">
                        <Calendar className="h-3 w-3 ml-1" />عميل منذ {selectedCustomerData.customerSince}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <BaseActionButton size="sm" variant="outline" onClick={() => setEditingCustomer(selectedCustomerData)}>
                      <Edit className="h-3.5 w-3.5 ml-1" /> تعديل
                    </BaseActionButton>
                    {selectedCustomerData.totalValue > 0 && (
                      <div className="text-left">
                        <div className="text-2xl font-bold text-[#3DBE8B]">{(selectedCustomerData.totalValue / 1000).toFixed(0)}ك</div>
                        <div className="text-[10px] text-[rgba(11,15,18,0.4)] font-arabic">ر.س</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact + Preferences grid */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Mail, label: 'البريد', value: selectedCustomerData.email },
                    { icon: Phone, label: 'الهاتف', value: selectedCustomerData.phone },
                    { icon: MapPin, label: 'الموقع', value: `${selectedCustomerData.city}, ${selectedCustomerData.country}` },
                    { icon: Briefcase, label: 'القطاع', value: selectedCustomerData.industry || 'غير محدد' },
                    { icon: Globe, label: 'قناة التواصل', value: selectedCustomerData.preferences.communicationChannel === 'email' ? 'البريد الإلكتروني' : selectedCustomerData.preferences.communicationChannel },
                    { icon: Clock, label: 'أوقات التواصل', value: selectedCustomerData.preferences.contactTiming },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5 p-3 bg-white/30 rounded-xl border border-black/5">
                      <item.icon className="h-4 w-4 text-[rgba(11,15,18,0.4)] shrink-0" />
                      <div className="min-w-0">
                        <div className="text-[10px] text-[rgba(11,15,18,0.5)] font-arabic">{item.label}</div>
                        <div className="text-sm font-semibold font-arabic truncate">{item.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </DataCardFrame>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Projects */}
                <DataCardFrame title="المشاريع الحالية">
                  {selectedCustomerData.projects.length > 0 ? (
                    <div className="space-y-2">
                      {selectedCustomerData.projects.map((project) => (
                        <div key={project.id} className="p-3 rounded-xl border border-[#DADCE0]">
                          <h5 className="text-sm font-bold font-arabic">{project.name}</h5>
                          <p className="text-xs text-[rgba(11,15,18,0.5)] font-arabic mt-0.5 line-clamp-2">{project.description}</p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs font-semibold text-[#3DBE8B]">{(project.value / 1000).toFixed(0)}ك ر.س</span>
                            {project.satisfaction && (
                              <div className="flex items-center">
                                <Star className="h-3 w-3 text-[#F6C445] fill-[#F6C445] ml-0.5" />
                                <span className="text-[10px] text-[rgba(11,15,18,0.5)]">{project.satisfaction}/10</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <TrendingUp className="h-8 w-8 mx-auto mb-2 text-[rgba(11,15,18,0.15)]" />
                      <p className="text-xs text-[rgba(11,15,18,0.4)] font-arabic">لا توجد مشاريع حالية</p>
                    </div>
                  )}
                </DataCardFrame>

                {/* Satisfaction */}
                <DataCardFrame title="رضا العميل">
                  {selectedCustomerData.satisfaction.npsScore > 0 ? (
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[#3DA8F5] mb-1">{selectedCustomerData.satisfaction.npsScore}/10</div>
                      <div className="text-xs text-[rgba(11,15,18,0.5)] font-arabic mb-3">درجة NPS</div>
                      <div className="flex items-center justify-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-5 w-5 ${i < selectedCustomerData.satisfaction.overallRating ? 'text-[#F6C445] fill-[#F6C445]' : 'text-[rgba(11,15,18,0.1)]'}`} />
                        ))}
                      </div>
                      <div className="text-[10px] text-[rgba(11,15,18,0.4)] font-arabic mb-3">آخر تقييم: {selectedCustomerData.satisfaction.lastSurveyDate}</div>
                      <BaseActionButton size="sm" variant="outline" onClick={handleSendSurvey}>إرسال استطلاع جديد</BaseActionButton>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Star className="h-8 w-8 mx-auto mb-2 text-[rgba(11,15,18,0.15)]" />
                      <p className="text-xs text-[rgba(11,15,18,0.4)] font-arabic mb-3">لم يتم تقييم العميل بعد</p>
                      <BaseActionButton size="sm" variant="outline" onClick={handleSendSurvey}>إرسال استطلاع رضا</BaseActionButton>
                    </div>
                  )}
                </DataCardFrame>
              </div>

              {/* Interactions timeline */}
              <DataCardFrame title="تاريخ التفاعلات">
                {selectedCustomerData.interactionHistory.length > 0 ? (
                  <div className="space-y-3">
                    {selectedCustomerData.interactionHistory.map((interaction) => {
                      const sentimentColor = interaction.sentimentScore >= 7 ? '#3DBE8B' : interaction.sentimentScore >= 5 ? '#F6C445' : '#E5564D';
                      return (
                        <div key={interaction.id} className="p-3 rounded-xl border border-[#DADCE0]" style={{ borderRightWidth: 3, borderRightColor: sentimentColor }}>
                          <div className="flex justify-between items-start mb-1">
                            <h5 className="text-sm font-bold font-arabic">{interaction.subject}</h5>
                            <span className="text-[10px] text-[rgba(11,15,18,0.4)] tabular-nums shrink-0">{interaction.date}</span>
                          </div>
                          <p className="text-xs text-[rgba(11,15,18,0.6)] font-arabic mb-2 line-clamp-2">{interaction.summary}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] text-[rgba(11,15,18,0.5)] font-arabic">{interaction.employeeName}</span>
                            <span
                              className="px-2 py-0.5 text-[10px] rounded-full font-medium"
                              style={{ backgroundColor: `${sentimentColor}18`, color: sentimentColor }}
                            >
                              {interaction.sentimentScore}/10
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Calendar className="h-8 w-8 mx-auto mb-2 text-[rgba(11,15,18,0.15)]" />
                    <p className="text-xs text-[rgba(11,15,18,0.4)] font-arabic">لا توجد تفاعلات مسجلة</p>
                  </div>
                )}
              </DataCardFrame>
            </div>
          ) : (
            <DataCardFrame title="تفاصيل العميل">
              <div className="text-center py-16">
                <Users className="h-12 w-12 text-[rgba(11,15,18,0.12)] mx-auto mb-3" />
                <h3 className="text-sm font-semibold font-arabic text-[rgba(11,15,18,0.4)] mb-1">اختر عميلاً لعرض التفاصيل</h3>
                <p className="text-xs text-[rgba(11,15,18,0.3)] font-arabic">انقر على أحد العملاء من القائمة</p>
              </div>
            </DataCardFrame>
          )}
        </div>
      </div>

      {/* ═══════ MODAL: Add Customer ═══════ */}
      <GenericFormModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="إضافة عميل جديد"
        fields={customerFields}
        onSubmit={handleAddCustomer}
        submitLabel="إضافة العميل"
        successMessage="تمت إضافة العميل بنجاح"
      />

      {/* ═══════ MODAL: Edit Customer ═══════ */}
      {editingCustomer && (
        <GenericFormModal
          isOpen={!!editingCustomer}
          onClose={() => setEditingCustomer(null)}
          title={`تعديل: ${editingCustomer.name}`}
          fields={customerFields.map(f => ({
            ...f,
            defaultValue: String((editingCustomer as any)[f.name] || ''),
          }))}
          onSubmit={handleEditCustomer}
          submitLabel="حفظ التعديلات"
          successMessage="تم تحديث بيانات العميل بنجاح"
        />
      )}
    </div>
  );
};
