import React, { useState } from 'react';
import { AppDashboardGrid } from '@/components/shared/layout/AppDashboardGrid';
import { AppGridItem } from '@/components/shared/layout/AppGridItem';
import { Shield, AlertTriangle } from 'lucide-react';
import { NumericStatCard, ArcGaugeCard } from '@/components/shared/visual-data';
import { mockComplianceItems } from './data';
import { getStatusText, formatDate } from './utils';
import { GenericFormModal, FormField } from '../shared/GenericFormModal';
import { GenericDetailModal, DetailField } from '../shared/GenericDetailModal';
import { toast } from 'sonner';
import { AppCardSurface } from '@/components/shared/surfaces/AppCardSurface';

export const ComplianceTab: React.FC = () => {
  const [items, setItems] = useState(mockComplianceItems);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState<any>(null);

  const complianceStats = {
    compliant: items.filter(item => item.status === 'compliant').length,
    actionRequired: items.filter(item => item.status === 'action_required').length,
    pendingReview: items.filter(item => item.status === 'pending_review').length,
    nonCompliant: items.filter(item => item.status === 'non_compliant').length
  };
  const totalItems = items.length;
  const compliancePercentage = Math.round(complianceStats.compliant / totalItems * 100);

  const getComplianceStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-[#bdeed3] text-black';
      case 'action_required': return 'bg-[#fbe2aa] text-black';
      case 'pending_review': return 'bg-[#a4e2f6] text-black';
      case 'non_compliant': return 'bg-[#f1b5b9] text-black';
      default: return 'bg-[#d9d2fd] text-black';
    }
  };

  const addFields: FormField[] = [
    { name: 'requirement', label: 'المتطلب القانوني', type: 'text', required: true, placeholder: 'أدخل المتطلب' },
    { name: 'category', label: 'الفئة', type: 'select', required: true, options: [
      { value: 'labor', label: 'عمل' }, { value: 'tax', label: 'ضرائب' }, { value: 'data_protection', label: 'حماية بيانات' }, { value: 'intellectual_property', label: 'ملكية فكرية' }, { value: 'professional', label: 'مهني' },
    ]},
    { name: 'responsible', label: 'المسؤول', type: 'text', required: true, placeholder: 'اسم المسؤول' },
    { name: 'nextReview', label: 'تاريخ المراجعة القادمة', type: 'date', required: true },
  ];

  const handleAdd = (data: Record<string, string>) => {
    const newItem = {
      id: `COMP-${Date.now().toString().slice(-4)}`,
      requirement: data.requirement,
      category: data.category as any,
      status: 'pending_review' as const,
      lastReview: new Date().toISOString().split('T')[0],
      nextReview: data.nextReview,
      responsible: data.responsible,
      documents: [],
    };
    setItems(prev => [newItem, ...prev]);
  };

  const handleMarkCompliant = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'compliant' as const, lastReview: new Date().toISOString().split('T')[0] } : i));
    toast.success('تم تحديث حالة الامتثال');
  };

  const getViewFields = (item: any): DetailField[] => [
    { label: 'الرقم', value: item.id },
    { label: 'المتطلب', value: item.requirement },
    { label: 'الفئة', value: getStatusText(item.category) },
    { label: 'الحالة', value: getStatusText(item.status) },
    { label: 'المسؤول', value: item.responsible },
    { label: 'آخر مراجعة', value: formatDate(item.lastReview) },
    { label: 'المراجعة القادمة', value: formatDate(item.nextReview) },
    { label: 'الوثائق', value: `${item.documents.length} وثيقة` },
  ];

  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-black font-arabic">إدارة الامتثال القانوني</h3>
        <button onClick={() => setIsAddOpen(true)} className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-black/90 transition-colors">
          <div className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center">
            <Shield className="w-4 h-4" />
          </div>
          إضافة متطلب جديد
        </button>
      </div>

      {/* نظرة عامة على الامتثال */}
      <AppCardSurface density="spacious" interactive="hoverable">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-black font-arabic flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center">
              <Shield className="h-4 w-4 text-black" />
            </div>
            حالة الامتثال العامة
          </h3>
        </div>
        <div>
          <AppDashboardGrid columns={12} density="compact">
            <AppGridItem colSpan={3} tabletSpan={6}>
              <ArcGaugeCard title="نسبة الامتثال" value={compliancePercentage} color="#3DBE8B" className="min-h-[180px]" />
            </AppGridItem>
            <AppGridItem colSpan={2} tabletSpan={3}>
              <NumericStatCard title="متوافقة" value={complianceStats.compliant} accentColor="#3DBE8B" size="sm" />
            </AppGridItem>
            <AppGridItem colSpan={2} tabletSpan={3}>
              <NumericStatCard title="تحتاج إجراء" value={complianceStats.actionRequired} accentColor="#F6C445" size="sm" />
            </AppGridItem>
            <AppGridItem colSpan={2} tabletSpan={3}>
              <NumericStatCard title="قيد المراجعة" value={complianceStats.pendingReview} accentColor="#3DA8F5" size="sm" />
            </AppGridItem>
            <AppGridItem colSpan={3} tabletSpan={3}>
              <NumericStatCard title="غير متوافقة" value={complianceStats.nonCompliant} accentColor="#E5564D" size="sm" />
            </AppGridItem>
          </AppDashboardGrid>
        </div>
      </AppCardSurface>

      {/* قائمة عناصر الامتثال */}
      <AppCardSurface density="spacious" interactive="hoverable">
        <div className="mb-6"><h3 className="text-xl font-semibold text-black font-arabic">مصفوفة المتطلبات القانونية</h3></div>
        <div>
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="border-b border-black/10">
                  <th className="pb-4 text-sm font-semibold text-black font-arabic">المتطلب</th>
                  <th className="pb-4 text-sm font-semibold text-black font-arabic">الفئة</th>
                  <th className="pb-4 text-sm font-semibold text-black font-arabic">الحالة</th>
                  <th className="pb-4 text-sm font-semibold text-black font-arabic">المسؤول</th>
                  <th className="pb-4 text-sm font-semibold text-black font-arabic">آخر مراجعة</th>
                  <th className="pb-4 text-sm font-semibold text-black font-arabic">المراجعة القادمة</th>
                  <th className="pb-4 text-sm font-semibold text-black font-arabic">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => <tr key={item.id} className="border-b border-black/10 hover:bg-white/10 transition-colors">
                    <td className="py-4">
                      <div className="font-medium text-black font-arabic">{item.requirement}</div>
                      <div className="text-sm text-black/70 font-arabic">{item.id}</div>
                    </td>
                    <td className="py-4"><span className="px-3 py-1 text-xs rounded-full bg-[#a4e2f6] text-black font-arabic">{getStatusText(item.category)}</span></td>
                    <td className="py-4"><span className={`px-3 py-1 text-xs rounded-full font-arabic ${getComplianceStatusColor(item.status)}`}>{getStatusText(item.status)}</span></td>
                    <td className="py-4 text-black font-arabic">{item.responsible}</td>
                    <td className="py-4 text-black font-arabic">{formatDate(item.lastReview)}</td>
                    <td className="py-4 text-black font-arabic">{formatDate(item.nextReview)}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setViewingItem(item)} className="px-3 py-1 text-xs rounded-full border border-black font-arabic hover:bg-black/5 transition-colors">عرض</button>
                        {item.status !== 'compliant' && (
                          <button onClick={() => handleMarkCompliant(item.id)} className="px-3 py-1 text-xs rounded-full bg-[#bdeed3] text-black font-arabic hover:bg-[#bdeed3]/80 transition-colors">✓ متوافق</button>
                        )}
                      </div>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </AppCardSurface>

      {/* العناصر التي تحتاج إجراء عاجل */}
      <AppCardSurface density="spacious" interactive="hoverable">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-black font-arabic flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center"><AlertTriangle className="h-4 w-4 text-black" /></div>
            إجراءات عاجلة مطلوبة
          </h3>
        </div>
        <div>
          <div className="space-y-3">
            {items.filter(item => item.status === 'action_required' || item.status === 'non_compliant').slice(0, 5).map(item => <div key={item.id} className="p-4 bg-transparent border border-[#DADCE0] rounded-[24px]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center"><AlertTriangle className="h-4 w-4 text-black" /></div>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-black font-arabic">{item.requirement}</span>
                      <div className="text-xs font-normal text-black font-arabic mt-1">الموعد النهائي: {formatDate(item.nextReview)}</div>
                    </div>
                    <span className={`px-3 py-1 text-xs font-normal rounded-full font-arabic ${getComplianceStatusColor(item.status)}`}>{getStatusText(item.status)}</span>
                    <button onClick={() => handleMarkCompliant(item.id)} className="px-3 py-1 text-xs rounded-full bg-black text-white font-arabic hover:bg-black/90 transition-colors">معالجة</button>
                  </div>
                </div>)}
          </div>
        </div>
      </AppCardSurface>

      <GenericFormModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="إضافة متطلب امتثال جديد" fields={addFields} onSubmit={handleAdd} submitLabel="إضافة" successMessage="تمت إضافة المتطلب بنجاح" />

      {viewingItem && <GenericDetailModal isOpen={!!viewingItem} onClose={() => setViewingItem(null)} title={`تفاصيل: ${viewingItem.requirement}`} fields={getViewFields(viewingItem)} />}
    </div>;
};
