import React, { useState } from 'react';
import { DataCardFrame } from '@/components/shared/visual-data/DataCardFrame';
import { NumericStatCard } from '@/components/shared/visual-data/NumericStatCard';
import { BaseActionButton } from '@/components/shared/BaseActionButton';
import { Input } from '@/components/ui/input';
import { 
  Plus, Search, Building, Users, Phone, Mail, Star, FileText,
  CheckCircle, Clock, AlertCircle, Eye, Edit
} from 'lucide-react';
import { mockCSRPartners } from './data';
import { CSRPartner } from './types';
import { GenericFormModal, FormField } from '../shared/GenericFormModal';
import { GenericDetailModal, DetailField } from '../shared/GenericDetailModal';
import { toast } from 'sonner';

export const PartnershipsTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [partners, setPartners] = useState(mockCSRPartners);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<CSRPartner | null>(null);
  const [viewingPartner, setViewingPartner] = useState<CSRPartner | null>(null);

  const getTypeColor = (type: CSRPartner['type']) => {
    switch (type) { case 'government': return 'bg-blue-100 text-blue-800'; case 'ngo': return 'bg-green-100 text-green-800'; case 'private': return 'bg-purple-100 text-purple-800'; case 'international': return 'bg-orange-100 text-orange-800'; default: return 'bg-gray-100 text-gray-800'; }
  };
  const getTypeText = (type: CSRPartner['type']) => {
    switch (type) { case 'government': return 'حكومي'; case 'ngo': return 'غير ربحي'; case 'private': return 'قطاع خاص'; case 'international': return 'دولي'; default: return type; }
  };
  const getCapacityColor = (c: CSRPartner['capacity']) => ({ high: 'text-green-600', medium: 'text-yellow-600', low: 'text-red-600' }[c] || 'text-gray-600');
  const getCapacityText = (c: CSRPartner['capacity']) => ({ high: 'عالية', medium: 'متوسطة', low: 'منخفضة' }[c] || c);
  const getContractStatusIcon = (s?: CSRPartner['contractStatus']) => ({ signed: CheckCircle, draft: Clock, expired: AlertCircle }[s || ''] || FileText);
  const getContractStatusColor = (s?: CSRPartner['contractStatus']) => ({ signed: 'text-green-600', draft: 'text-yellow-600', expired: 'text-red-600' }[s || ''] || 'text-gray-600');
  const getContractStatusText = (s?: CSRPartner['contractStatus']) => ({ signed: 'موقع', draft: 'مسودة', expired: 'منتهي' }[s || ''] || 'غير محدد');

  const filteredPartners = partners.filter(p => {
    const ms = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    return ms && (selectedType === 'all' || p.type === selectedType);
  });

  const renderStars = (rating: number) => Array.from({ length: 5 }, (_, i) => (
    <Star key={i} className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
  ));

  const addFields: FormField[] = [
    { name: 'name', label: 'اسم الشريك', type: 'text', required: true, placeholder: 'اسم المنظمة' },
    { name: 'type', label: 'النوع', type: 'select', required: true, options: [
      { value: 'government', label: 'حكومي' }, { value: 'ngo', label: 'غير ربحي' }, { value: 'private', label: 'قطاع خاص' }, { value: 'international', label: 'دولي' },
    ]},
    { name: 'contactPerson', label: 'جهة الاتصال', type: 'text', required: true, placeholder: 'الاسم' },
    { name: 'email', label: 'البريد الإلكتروني', type: 'email', required: true },
    { name: 'phone', label: 'الهاتف', type: 'tel', required: true },
    { name: 'expertise', label: 'مجالات الخبرة (مفصولة بفاصلة)', type: 'text', placeholder: 'تعليم, بيئة, صحة' },
  ];

  const handleAddPartner = (data: Record<string, string>) => {
    const newPartner: any = {
      id: `p-${Date.now()}`, name: data.name, type: data.type, contactPerson: data.contactPerson,
      email: data.email, phone: data.phone, expertise: data.expertise ? data.expertise.split(',').map(s => s.trim()) : [],
      rating: 0, capacity: 'medium', previousProjects: 0, contractStatus: 'draft', contractId: '',
      partnership: { startDate: new Date().toISOString().split('T')[0], type: 'strategic', scope: '' },
    };
    setPartners(prev => [newPartner, ...prev]);
  };

  const handleEditPartner = (data: Record<string, string>) => {
    if (!editingPartner) return;
    setPartners(prev => prev.map(p => p.id === editingPartner.id ? {
      ...p, name: data.name, type: data.type as any, contactPerson: data.contactPerson, email: data.email, phone: data.phone,
      expertise: data.expertise ? data.expertise.split(',').map(s => s.trim()) : p.expertise,
    } : p));
    setEditingPartner(null);
  };

  const getViewFields = (p: CSRPartner): DetailField[] => [
    { label: 'الاسم', value: p.name }, { label: 'النوع', value: getTypeText(p.type) },
    { label: 'جهة الاتصال', value: p.contactPerson }, { label: 'البريد', value: p.email },
    { label: 'الهاتف', value: p.phone }, { label: 'التقييم', value: `${p.rating}/5` },
    { label: 'القدرة', value: getCapacityText(p.capacity) }, { label: 'المشاريع السابقة', value: String(p.previousProjects) },
    { label: 'حالة العقد', value: getContractStatusText(p.contractStatus) },
    { label: 'مجالات الخبرة', value: p.expertise.join(', ') },
    { label: 'بداية الشراكة', value: new Date(p.partnership.startDate).toLocaleDateString('ar-SA') },
  ];

  const handleViewContract = (p: CSRPartner) => {
    toast.info(`عقد الشريك: ${p.name} - الحالة: ${getContractStatusText(p.contractStatus)}${p.contractId ? ` (${p.contractId})` : ''}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-96">
            <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            <Input placeholder="البحث في الشركاء..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pr-10" />
          </div>
          <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg font-arabic bg-white">
            <option value="all">جميع الأنواع</option>
            <option value="government">حكومي</option><option value="ngo">غير ربحي</option><option value="private">قطاع خاص</option><option value="international">دولي</option>
          </select>
        </div>
        <BaseActionButton onClick={() => setIsAddOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-arabic">
          <Plus className="ml-2 h-4 w-4" /> إضافة شريك جديد
        </BaseActionButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <NumericStatCard title="إجمالي الشركاء" value={partners.length} icon={<Building className="h-5 w-5" />} accentColor="#3B82F6" />
        <NumericStatCard title="عقود نشطة" value={partners.filter(p => p.contractStatus === 'signed').length} icon={<CheckCircle className="h-5 w-5" />} accentColor="#10B981" />
        <NumericStatCard title="متوسط التقييم" value={(partners.reduce((s, p) => s + p.rating, 0) / partners.length).toFixed(1)} icon={<Star className="h-5 w-5" />} accentColor="#EAB308" />
        <NumericStatCard title="قدرة عالية" value={partners.filter(p => p.capacity === 'high').length} icon={<Users className="h-5 w-5" />} accentColor="#8B5CF6" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPartners.map((partner) => {
          const ContractIcon = getContractStatusIcon(partner.contractStatus);
          return (
            <DataCardFrame key={partner.id} title={partner.name} className="hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(partner.type)}`}>{getTypeText(partner.type)}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">{renderStars(Math.floor(partner.rating))}<span className="mr-2 text-sm text-gray-600 font-arabic">{partner.rating.toFixed(1)}</span></div>
                    <span className={`text-sm font-arabic ${getCapacityColor(partner.capacity)}`}>قدرة {getCapacityText(partner.capacity)}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm"><Users className="h-4 w-4 text-gray-500" /><span className="font-arabic text-gray-700">{partner.contactPerson}</span></div>
                <div className="flex items-center gap-2 text-sm"><Mail className="h-4 w-4 text-gray-500" /><span className="font-arabic text-gray-700">{partner.email}</span></div>
                <div className="flex items-center gap-2 text-sm"><Phone className="h-4 w-4 text-gray-500" /><span className="font-arabic text-gray-700">{partner.phone}</span></div>
              </div>
              <div className="mb-4">
                <p className="text-sm font-semibold font-arabic text-gray-700 mb-2">مجالات الخبرة:</p>
                <div className="flex flex-wrap gap-1">
                  {partner.expertise.slice(0, 3).map((skill, i) => <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded font-arabic">{skill}</span>)}
                  {partner.expertise.length > 3 && <span className="px-2 py-1 bg-gray-50 text-gray-700 text-xs rounded font-arabic">+{partner.expertise.length - 3}</span>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div><p className="text-gray-500 font-arabic">المشاريع السابقة</p><p className="font-semibold font-arabic">{partner.previousProjects}</p></div>
                <div><p className="text-gray-500 font-arabic">بداية الشراكة</p><p className="font-semibold font-arabic">{new Date(partner.partnership.startDate).toLocaleDateString('ar-SA')}</p></div>
              </div>
              {partner.contractStatus && (
                <div className="flex items-center gap-2 mb-4 p-2 bg-gray-50 rounded-lg">
                  <ContractIcon className={`h-4 w-4 ${getContractStatusColor(partner.contractStatus)}`} />
                  <span className="text-sm font-arabic text-gray-700">حالة العقد: <span className={`font-semibold ${getContractStatusColor(partner.contractStatus)}`}>{getContractStatusText(partner.contractStatus)}</span></span>
                </div>
              )}
              <div className="flex gap-2">
                <BaseActionButton size="sm" variant="outline" className="flex-1 font-arabic" onClick={() => setViewingPartner(partner)}><Eye className="h-3 w-3 ml-1" /> عرض التفاصيل</BaseActionButton>
                <BaseActionButton size="sm" variant="outline" className="font-arabic" onClick={() => setEditingPartner(partner)}><Edit className="h-3 w-3 ml-1" /> تعديل</BaseActionButton>
                <BaseActionButton size="sm" variant="outline" className="font-arabic" onClick={() => handleViewContract(partner)}><FileText className="h-3 w-3 ml-1" /> العقد</BaseActionButton>
              </div>
            </DataCardFrame>
          );
        })}
      </div>

      <DataCardFrame title="مخصص الموارد" icon={<Building className="h-5 w-5" />}>
        <p className="text-gray-600 font-arabic mb-4">ربط احتياجات المبادرات بالموارد المتاحة والموردين المعتمدين</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <BaseActionButton variant="outline" className="font-arabic" onClick={() => toast.success('تم فتح قائمة الموردين المعتمدين')}><Building className="ml-2 h-4 w-4" /> إدارة الموردين</BaseActionButton>
          <BaseActionButton variant="outline" className="font-arabic" onClick={() => toast.success('تم فتح أداة تخصيص الموارد')}><Users className="ml-2 h-4 w-4" /> تخصيص الموارد</BaseActionButton>
          <BaseActionButton variant="outline" className="font-arabic" onClick={() => toast.success('تم تصدير تقرير الموارد')}><FileText className="ml-2 h-4 w-4" /> تقارير الموارد</BaseActionButton>
        </div>
      </DataCardFrame>

      <GenericFormModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="إضافة شريك جديد" fields={addFields} onSubmit={handleAddPartner} submitLabel="إضافة" successMessage="تمت إضافة الشريك بنجاح" />
      {editingPartner && (
        <GenericFormModal isOpen={!!editingPartner} onClose={() => setEditingPartner(null)} title={`تعديل: ${editingPartner.name}`}
          fields={addFields.map(f => ({ ...f, defaultValue: String((editingPartner as any)[f.name] || (f.name === 'expertise' ? editingPartner.expertise.join(', ') : '')) }))}
          onSubmit={handleEditPartner} submitLabel="حفظ" successMessage="تم تحديث الشريك بنجاح" />
      )}
      {viewingPartner && <GenericDetailModal isOpen={!!viewingPartner} onClose={() => setViewingPartner(null)} title={viewingPartner.name} fields={getViewFields(viewingPartner)} />}
    </div>
  );
};
