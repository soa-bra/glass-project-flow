import React, { useState } from 'react';
import { Award, AlertTriangle, Calendar, DollarSign, Plus, Eye, Download } from 'lucide-react';
import { mockLicenses } from './data';
import { getStatusText, formatCurrency, formatDate } from './utils';
import { GenericFormModal, FormField } from '../shared/GenericFormModal';
import { GenericDetailModal, DetailField } from '../shared/GenericDetailModal';
import { downloadAsCSV } from '../shared/downloadUtils';
import { toast } from 'sonner';
import type { License } from './types';

export const LicensesTab: React.FC = () => {
  const [licenses, setLicenses] = useState(mockLicenses);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [viewingLicense, setViewingLicense] = useState<any>(null);

  const licenseStats = {
    active: licenses.filter(l => l.status === 'active').length,
    expired: licenses.filter(l => l.status === 'expired').length,
    pendingRenewal: licenses.filter(l => l.status === 'pending_renewal').length,
    suspended: licenses.filter(l => l.status === 'suspended').length,
  };
  const totalRenewalCost = licenses.filter(l => l.status === 'pending_renewal').reduce((sum, l) => sum + l.renewalCost, 0);

  const getLicenseStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-[#bdeed3] text-black';
      case 'pending_renewal': return 'bg-[#fbe2aa] text-black';
      case 'expired': return 'bg-[#f1b5b9] text-black';
      case 'suspended': return 'bg-[#d9d2fd] text-black';
      default: return 'bg-[#a4e2f6] text-black';
    }
  };

  const addFields: FormField[] = [
    { name: 'name', label: 'اسم الترخيص', type: 'text', required: true, placeholder: 'أدخل اسم الترخيص' },
    { name: 'type', label: 'النوع', type: 'select', required: true, options: [
      { value: 'business', label: 'تجاري' }, { value: 'professional', label: 'مهني' }, { value: 'software', label: 'برمجيات' }, { value: 'intellectual_property', label: 'ملكية فكرية' },
    ]},
    { name: 'issuer', label: 'الجهة المصدرة', type: 'text', required: true, placeholder: 'اسم الجهة' },
    { name: 'expiryDate', label: 'تاريخ الانتهاء', type: 'date', required: true },
    { name: 'renewalCost', label: 'تكلفة التجديد (ر.س)', type: 'number', required: true, placeholder: '0' },
  ];

  const handleAdd = (data: Record<string, string>) => {
    const newLicense: License = {
      id: `LIC-${Date.now().toString().slice(-4)}`,
      name: data.name,
      type: data.type as License['type'],
      status: 'active',
      issuer: data.issuer,
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate: data.expiryDate,
      renewalCost: Number(data.renewalCost),
      documents: [],
    };
    setLicenses(prev => [newLicense, ...prev]);
  };

  const handleRenew = (id: string) => {
    setLicenses(prev => prev.map(l => l.id === id ? { ...l, status: 'active' as const, expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0] } : l));
    toast.success('تم تجديد الترخيص بنجاح');
  };

  const handleDownload = (license: any) => {
    downloadAsCSV(
      ['رقم الترخيص', 'الاسم', 'النوع', 'الحالة', 'تاريخ الانتهاء', 'تكلفة التجديد'],
      [[license.id, license.name, getStatusText(license.type), getStatusText(license.status), license.expiryDate, String(license.renewalCost)]],
      `ترخيص-${license.id}`
    );
    toast.success('تم تنزيل بيانات الترخيص');
  };

  const getViewFields = (license: any): DetailField[] => [
    { label: 'الرقم', value: license.id },
    { label: 'الاسم', value: license.name },
    { label: 'النوع', value: getStatusText(license.type) },
    { label: 'الحالة', value: getStatusText(license.status) },
    { label: 'الجهة المصدرة', value: license.issuer },
    { label: 'تاريخ الإصدار', value: formatDate(license.issueDate) },
    { label: 'تاريخ الانتهاء', value: formatDate(license.expiryDate) },
    { label: 'تكلفة التجديد', value: formatCurrency(license.renewalCost) },
  ];

  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-black font-arabic">التراخيص والملكية الفكرية</h3>
        <button onClick={() => setIsAddOpen(true)} className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-black/90 transition-colors">
          <div className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center"><Plus className="w-4 h-4" /></div>
          إضافة ترخيص جديد
        </button>
      </div>

      {/* إحصائيات التراخيص */}
      <div className="rounded-[41px] bg-[#FFFFFF] border border-[#DADCE0] p-9 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-black font-arabic flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center"><Award className="h-4 w-4 text-black" /></div>
            إحصائيات التراخيص
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-transparent border border-[#DADCE0] rounded-[41px]">
            <div className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center mx-auto mb-2"><Award className="h-4 w-4 text-black" /></div>
            <div className="text-2xl font-bold text-black font-arabic">{licenseStats.active}</div>
            <div className="text-sm font-medium text-black font-arabic">تراخيص نشطة</div>
          </div>
          <div className="text-center p-4 bg-transparent border border-[#DADCE0] rounded-[41px]">
            <div className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center mx-auto mb-2"><AlertTriangle className="h-4 w-4 text-black" /></div>
            <div className="text-2xl font-bold text-black font-arabic">{licenseStats.pendingRenewal}</div>
            <div className="text-sm font-medium text-black font-arabic">تحتاج تجديد</div>
          </div>
          <div className="text-center p-4 bg-transparent border border-[#DADCE0] rounded-[41px]">
            <div className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center mx-auto mb-2"><Calendar className="h-4 w-4 text-black" /></div>
            <div className="text-2xl font-bold text-black font-arabic">{licenseStats.expired}</div>
            <div className="text-sm font-medium text-black font-arabic">منتهية</div>
          </div>
          <div className="text-center p-4 bg-transparent border border-[#DADCE0] rounded-[41px]">
            <div className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center mx-auto mb-2"><DollarSign className="h-4 w-4 text-black" /></div>
            <div className="text-2xl font-bold text-black font-arabic">{totalRenewalCost.toLocaleString()}</div>
            <div className="text-sm font-medium text-black font-arabic">تكلفة التجديد (ر.س)</div>
          </div>
        </div>
      </div>

      {/* جدول التراخيص */}
      <div className="rounded-[41px] bg-[#FFFFFF] border border-[#DADCE0] p-9 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="mb-6"><h3 className="text-xl font-semibold text-black font-arabic">قائمة التراخيص</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-black/10">
                <th className="pb-4 text-sm font-semibold text-black font-arabic">الترخيص</th>
                <th className="pb-4 text-sm font-semibold text-black font-arabic">النوع</th>
                <th className="pb-4 text-sm font-semibold text-black font-arabic">الحالة</th>
                <th className="pb-4 text-sm font-semibold text-black font-arabic">تاريخ الانتهاء</th>
                <th className="pb-4 text-sm font-semibold text-black font-arabic">تكلفة التجديد</th>
                <th className="pb-4 text-sm font-semibold text-black font-arabic">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {licenses.map(license => <tr key={license.id} className="border-b border-black/10 hover:bg-white/10 transition-colors">
                  <td className="py-4">
                    <div className="font-medium text-black font-arabic">{license.name}</div>
                    <div className="text-sm text-black/70 font-arabic">{license.id}</div>
                  </td>
                  <td className="py-4"><span className="px-3 py-1 text-xs rounded-full bg-[#a4e2f6] text-black font-arabic">{getStatusText(license.type)}</span></td>
                  <td className="py-4"><span className={`px-3 py-1 text-xs rounded-full font-arabic ${getLicenseStatusColor(license.status)}`}>{getStatusText(license.status)}</span></td>
                  <td className="py-4 text-black font-arabic">{formatDate(license.expiryDate)}</td>
                  <td className="py-4 font-medium text-black font-arabic">{formatCurrency(license.renewalCost)}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div onClick={() => setViewingLicense(license)} className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"><Eye className="w-4 h-4 text-black" /></div>
                      <div onClick={() => handleDownload(license)} className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"><Download className="w-4 h-4 text-black" /></div>
                      {(license.status === 'pending_renewal' || license.status === 'expired') && (
                        <button onClick={() => handleRenew(license.id)} className="px-3 py-1 text-xs rounded-full bg-[#bdeed3] text-black font-arabic hover:bg-[#bdeed3]/80 transition-colors">تجديد</button>
                      )}
                    </div>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>

      <GenericFormModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="إضافة ترخيص جديد" fields={addFields} onSubmit={handleAdd} submitLabel="إضافة" successMessage="تمت إضافة الترخيص بنجاح" />
      {viewingLicense && <GenericDetailModal isOpen={!!viewingLicense} onClose={() => setViewingLicense(null)} title={`تفاصيل: ${viewingLicense.name}`} fields={getViewFields(viewingLicense)} />}
    </div>;
};
