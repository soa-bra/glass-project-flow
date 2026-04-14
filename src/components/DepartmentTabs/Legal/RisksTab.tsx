import React, { useState } from 'react';
import { AlertTriangle, Shield, Activity } from 'lucide-react';
import { mockRiskAssessments } from './data';
import { AppDashboardGrid } from '@/components/shared/layout/AppDashboardGrid';
import { AppGridItem } from '@/components/shared/layout/AppGridItem';
import { getStatusColor, getStatusText, calculateRiskScore, formatDate } from './utils';
import { GenericFormModal, FormField } from '../shared/GenericFormModal';
import { GenericDetailModal, DetailField } from '../shared/GenericDetailModal';
import { toast } from 'sonner';
import { AppCardSurface } from '@/components/shared/surfaces/AppCardSurface';

export const RisksTab: React.FC = () => {
  const [risks, setRisks] = useState(mockRiskAssessments);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [viewingRisk, setViewingRisk] = useState<any>(null);

  const riskStats = {
    critical: risks.filter(r => r.riskLevel === 'critical').length,
    high: risks.filter(r => r.riskLevel === 'high').length,
    medium: risks.filter(r => r.riskLevel === 'medium').length,
    low: risks.filter(r => r.riskLevel === 'low').length,
  };

  const getRiskStatusColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-[#f1b5b9] text-black';
      case 'high': return 'bg-[#fbe2aa] text-black';
      case 'medium': return 'bg-[#a4e2f6] text-black';
      case 'low': return 'bg-[#bdeed3] text-black';
      default: return 'bg-[#d9d2fd] text-black';
    }
  };

  const addFields: FormField[] = [
    { name: 'title', label: 'عنوان المخاطرة', type: 'text', required: true, placeholder: 'أدخل عنوان المخاطرة' },
    { name: 'description', label: 'الوصف', type: 'textarea', required: true, placeholder: 'وصف المخاطرة...' },
    { name: 'category', label: 'الفئة', type: 'select', required: true, options: [
      { value: 'legal', label: 'قانوني' }, { value: 'compliance', label: 'امتثال' }, { value: 'contract', label: 'تعاقدي' }, { value: 'litigation', label: 'تقاضي' },
    ]},
    { name: 'probability', label: 'الاحتمالية (1-5)', type: 'number', required: true, placeholder: '3' },
    { name: 'impact', label: 'التأثير (1-5)', type: 'number', required: true, placeholder: '3' },
    { name: 'mitigationStrategy', label: 'استراتيجية التخفيف', type: 'textarea', required: true, placeholder: 'الإجراءات المتخذة...' },
    { name: 'assignedTo', label: 'المسؤول', type: 'text', required: true, placeholder: 'اسم المسؤول' },
    { name: 'targetResolution', label: 'تاريخ الهدف', type: 'date', required: true },
  ];

  const handleAdd = (data: Record<string, string>) => {
    const prob = Math.min(5, Math.max(1, Number(data.probability)));
    const imp = Math.min(5, Math.max(1, Number(data.impact)));
    const score = prob * imp;
    const riskLevel = score >= 12 ? 'critical' : score >= 8 ? 'high' : score >= 4 ? 'medium' : 'low';
    const newRisk = {
      id: `RISK-${Date.now().toString().slice(-4)}`,
      title: data.title,
      description: data.description,
      category: data.category as any,
      riskLevel: riskLevel as any,
      probability: prob,
      impact: imp,
      mitigationStrategy: data.mitigationStrategy,
      status: 'identified' as const,
      assignedTo: data.assignedTo,
      dateIdentified: new Date().toISOString().split('T')[0],
      targetResolution: data.targetResolution,
    };
    setRisks(prev => [newRisk, ...prev]);
  };

  const handleMitigate = (id: string) => {
    setRisks(prev => prev.map(r => r.id === id ? { ...r, status: 'mitigated' as const } : r));
    toast.success('تم تحديث حالة المخاطرة');
  };

  const getViewFields = (risk: any): DetailField[] => [
    { label: 'الرقم', value: risk.id },
    { label: 'العنوان', value: risk.title },
    { label: 'الوصف', value: risk.description },
    { label: 'الفئة', value: getStatusText(risk.category) },
    { label: 'مستوى الخطورة', value: getStatusText(risk.riskLevel) },
    { label: 'الاحتمالية', value: `${risk.probability}/5` },
    { label: 'التأثير', value: `${risk.impact}/5` },
    { label: 'النتيجة', value: String(calculateRiskScore(risk.probability, risk.impact)) },
    { label: 'استراتيجية التخفيف', value: risk.mitigationStrategy },
    { label: 'المسؤول', value: risk.assignedTo },
    { label: 'تاريخ التحديد', value: formatDate(risk.dateIdentified) },
    { label: 'الهدف', value: formatDate(risk.targetResolution) },
  ];

  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-black font-arabic">إدارة المخاطر والنزاعات</h3>
        <button onClick={() => setIsAddOpen(true)} className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-black/90 transition-colors">
          <div className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center"><AlertTriangle className="w-4 h-4" /></div>
          إضافة تقييم جديد
        </button>
      </div>

      {/* نظرة عامة على المخاطر */}
      <AppCardSurface density="spacious" interactive="hoverable">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-black font-arabic flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center"><Shield className="h-4 w-4 text-black" /></div>
            توزيع المخاطر حسب المستوى
          </h3>
        </div>
        <AppDashboardGrid columns={12} density="default" minRowHeight="auto">
          {[
            { label: 'مخاطر حرجة', count: riskStats.critical, icon: AlertTriangle },
            { label: 'مخاطر عالية', count: riskStats.high, icon: AlertTriangle },
            { label: 'مخاطر متوسطة', count: riskStats.medium, icon: Activity },
            { label: 'مخاطر منخفضة', count: riskStats.low, icon: Shield },
          ].map((stat, i) => (
            <AppGridItem key={i} colSpan={3}>
              <div className="text-center p-4 bg-transparent border border-[#DADCE0] rounded-[24px]">
                <div className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center mx-auto mb-2"><stat.icon className="h-4 w-4 text-black" /></div>
                <div className="text-2xl font-bold text-black font-arabic">{stat.count}</div>
                <div className="text-sm font-medium text-black font-arabic">{stat.label}</div>
              </div>
            </AppGridItem>
          ))}
        </AppDashboardGrid>
      </AppCardSurface>

      {/* مصفوفة المخاطر */}
      <AppCardSurface density="spacious" interactive="hoverable">
        <div className="mb-6"><h3 className="text-xl font-semibold text-black font-arabic">مصفوفة المخاطر</h3></div>
        <div className="grid grid-cols-5 gap-2 mb-4">
          <div className="text-center text-sm font-medium text-black font-arabic">الاحتمالية</div>
          <div className="text-center text-sm font-medium text-black font-arabic">منخفض (1)</div>
          <div className="text-center text-sm font-medium text-black font-arabic">متوسط (2)</div>
          <div className="text-center text-sm font-medium text-black font-arabic">عالي (3)</div>
          <div className="text-center text-sm font-medium text-black font-arabic">حرج (4)</div>
          {[5, 4, 3, 2, 1].map(impact => <React.Fragment key={impact}>
              <div className="text-center text-sm font-medium text-black font-arabic py-2">التأثير ({impact})</div>
              {[1, 2, 3, 4].map(probability => {
                const score = probability * impact;
                let colorClass = 'bg-[#bdeed3]';
                if (score >= 12) colorClass = 'bg-[#f1b5b9]'; else if (score >= 8) colorClass = 'bg-[#fbe2aa]'; else if (score >= 4) colorClass = 'bg-[#a4e2f6]';
                return <div key={`${impact}-${probability}`} className={`h-12 flex items-center justify-center rounded-[24px] ${colorClass} border border-[#DADCE0]`}><span className="text-sm font-medium text-black">{score}</span></div>;
              })}
            </React.Fragment>)}
        </div>
      </AppCardSurface>

      {/* تقييمات المخاطر */}
      <AppCardSurface density="spacious" interactive="hoverable">
        <div className="mb-6"><h3 className="text-xl font-semibold text-black font-arabic">تقييمات المخاطر</h3></div>
        <div className="space-y-4">
          {risks.map(risk => <div key={risk.id} className="p-4 bg-transparent border border-[#DADCE0] rounded-[24px]">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-black font-arabic">{risk.title}</h4>
                    <span className={`px-3 py-1 text-xs rounded-full font-arabic ${getStatusColor(risk.status)}`}>{getStatusText(risk.status)}</span>
                  </div>
                  <p className="text-sm text-black/70 font-arabic mb-2">{risk.description}</p>
                  <div className="flex items-center gap-4 text-sm text-black/70 font-arabic">
                    <span>الفئة: {getStatusText(risk.category)}</span>
                    <span>المسؤول: {risk.assignedTo}</span>
                    <span>تاريخ التحديد: {formatDate(risk.dateIdentified)}</span>
                  </div>
                </div>
                <div className="text-left">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-black font-bold ${getRiskStatusColor(risk.riskLevel)}`}>
                    {calculateRiskScore(risk.probability, risk.impact)}
                  </div>
                  <div className="text-xs text-center mt-1 text-black/70 font-arabic">{getStatusText(risk.riskLevel)}</div>
                </div>
              </div>
              <div className="bg-transparent border border-[#DADCE0] rounded-[24px] p-3">
                <div className="text-sm font-medium text-black font-arabic mb-1">استراتيجية التخفيف:</div>
                <div className="text-sm text-black/70 font-arabic">{risk.mitigationStrategy}</div>
              </div>
              <div className="flex justify-between items-center mt-3 text-sm text-black/70 font-arabic">
                <span>الاحتمالية: {risk.probability}/5</span>
                <span>التأثير: {risk.impact}/5</span>
                <div className="flex items-center gap-2">
                  <span>الهدف: {formatDate(risk.targetResolution)}</span>
                  <button onClick={() => setViewingRisk(risk)} className="px-3 py-1 text-xs rounded-full border border-black font-arabic hover:bg-black/5 transition-colors">عرض</button>
                  {risk.status !== 'mitigated' && (
                    <button onClick={() => handleMitigate(risk.id)} className="px-3 py-1 text-xs rounded-full bg-[#bdeed3] text-black font-arabic hover:bg-[#bdeed3]/80 transition-colors">تم التخفيف</button>
                  )}
                </div>
              </div>
            </div>)}
        </div>
      </AppCardSurface>

      <GenericFormModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="إضافة تقييم مخاطر جديد" fields={addFields} onSubmit={handleAdd} submitLabel="إضافة" successMessage="تمت إضافة تقييم المخاطر بنجاح" />
      {viewingRisk && <GenericDetailModal isOpen={!!viewingRisk} onClose={() => setViewingRisk(null)} title={`تفاصيل: ${viewingRisk.title}`} fields={getViewFields(viewingRisk)} />}
    </div>;
};
