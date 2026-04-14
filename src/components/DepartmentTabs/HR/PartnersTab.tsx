import React, { useState } from 'react';
import { AppDashboardGrid } from '@/components/shared/layout/AppDashboardGrid';
import { AppGridItem } from '@/components/shared/layout/AppGridItem';
import { DataCardFrame } from '@/components/shared/visual-data/DataCardFrame';
import { NumericStatCard } from '@/components/shared/visual-data/NumericStatCard';
import { Input } from '@/components/ui/input';
import { BaseActionButton } from '@/components/shared/BaseActionButton';
import { Users, Search, Plus, Mail, Phone, MapPin, Star, Calendar, TrendingUp, Edit, Trash2, Tag } from 'lucide-react';
import { usePartnersStore } from '@/stores/partnersStore';

export const PartnersTab: React.FC = () => {
  const { partners, deletePartner } = usePartnersStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPartner, setSelectedPartner] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredPartners = partners.filter(partner => {
    const matchesSearch = partner.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         partner.representativeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         partner.entityType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || partner.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const selectedPartnerData = selectedPartner ? 
    partners.find(p => p.id === selectedPartner) : null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'inactive': return 'غير نشط';
      case 'pending': return 'قيد المراجعة';
      default: return status;
    }
  };

  const getEntityTypeText = (type: string) => {
    switch (type) {
      case 'individual': return 'فرد';
      case 'government': return 'مؤسسة حكومية';
      case 'semi-government': return 'مؤسسة شبه حكومية';
      case 'commercial': return 'مؤسسة تجارية';
      case 'charity': return 'مؤسسة خيرية';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-96">
            <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            <Input placeholder="البحث في الشركاء..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pr-10" />
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg font-arabic bg-white">
            <option value="all">جميع الحالات</option><option value="active">نشط</option><option value="inactive">غير نشط</option><option value="pending">قيد المراجعة</option>
          </select>
        </div>
        <BaseActionButton className="bg-blue-600 hover:bg-blue-700 text-white font-arabic">
          <Plus className="ml-2 h-4 w-4" /> إضافة شريك جديد
        </BaseActionButton>
      </div>

      <AppDashboardGrid columns={12}>
        <AppGridItem colSpan={3}><NumericStatCard title="إجمالي الشركاء" value={partners.length} icon={<Users className="h-5 w-5" />} accentColor="#3B82F6" /></AppGridItem>
        <AppGridItem colSpan={3}><NumericStatCard title="الشركاء النشطين" value={partners.filter(p => p.status === 'active').length} icon={<TrendingUp className="h-5 w-5" />} accentColor="#10B981" /></AppGridItem>
        <AppGridItem colSpan={3}><NumericStatCard title="المشاريع المشتركة" value={partners.reduce((sum, p) => sum + p.projectsCount, 0)} icon={<Star className="h-5 w-5" />} accentColor="#F97316" /></AppGridItem>
        <AppGridItem colSpan={3}><NumericStatCard title="قيد المراجعة" value={partners.filter(p => p.status === 'pending').length} icon={<Calendar className="h-5 w-5" />} accentColor="#8B5CF6" /></AppGridItem>
      </AppDashboardGrid>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <DataCardFrame title={`قائمة الشركاء (${filteredPartners.length})`} icon={<Users className="h-5 w-5" />}>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredPartners.map((partner) => (
                <div key={partner.id} onClick={() => setSelectedPartner(partner.id)}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${selectedPartner === partner.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold font-arabic text-gray-900">{partner.entityName}</h4>
                      <p className="text-sm text-gray-600 font-arabic">{getEntityTypeText(partner.entityType)}</p>
                      <div className="flex items-center mt-2">
                        <span className={`px-2 py-1 text-xs rounded-full font-arabic ${getStatusColor(partner.status)}`}>{getStatusText(partner.status)}</span>
                        {partner.projectsCount > 0 && (
                          <div className="mr-2 flex items-center"><Star className="h-3 w-3 text-yellow-500 ml-1" /><span className="text-xs text-gray-600">{partner.projectsCount} مشروع</span></div>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 font-arabic">
                      <div className="text-right"><div className="text-xs text-gray-400">آخر تفاعل</div><div>{partner.lastInteraction}</div></div>
                    </div>
                  </div>
                </div>
              ))}
              {filteredPartners.length === 0 && <div className="text-center py-8 text-gray-500 font-arabic">لا توجد شركاء مطابقة للبحث</div>}
            </div>
          </DataCardFrame>
        </div>

        <div className="lg:col-span-2">
          {selectedPartnerData ? (
            <div className="space-y-6">
              <DataCardFrame title={selectedPartnerData.entityName}>
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-2">
                        <BaseActionButton variant="ghost" size="sm" className="p-2 hover:bg-blue-100 text-blue-600"><Edit size={16} /></BaseActionButton>
                        <BaseActionButton variant="ghost" size="sm" className="p-2 hover:bg-red-100 text-red-600" onClick={() => deletePartner(selectedPartnerData.id)}><Trash2 size={16} /></BaseActionButton>
                      </div>
                    </div>
                    <p className="text-lg text-gray-600 font-arabic">{getEntityTypeText(selectedPartnerData.entityType)}</p>
                    <div className="flex items-center mt-2">
                      <span className={`px-3 py-1 text-sm rounded-full font-arabic ${getStatusColor(selectedPartnerData.status)}`}>{getStatusText(selectedPartnerData.status)}</span>
                      <div className="mr-4 flex items-center"><Calendar className="h-4 w-4 text-gray-400 ml-1" /><span className="text-sm text-gray-600 font-arabic">شريك منذ {selectedPartnerData.dateAdded}</span></div>
                    </div>
                  </div>
                  <div className="text-left">
                    {selectedPartnerData.projectsCount > 0 && <div className="text-2xl font-bold text-blue-600">{selectedPartnerData.projectsCount}</div>}
                    <div className="text-sm text-gray-500 font-arabic">المشاريع المشتركة</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold font-arabic text-gray-900 mb-3">معلومات الاتصال</h4>
                    <div className="space-y-2">
                      <div className="flex items-center"><Mail className="h-4 w-4 text-gray-400 ml-2" /><span className="text-sm font-arabic">{selectedPartnerData.email}</span></div>
                      {selectedPartnerData.phone && <div className="flex items-center"><Phone className="h-4 w-4 text-gray-400 ml-2" /><span className="text-sm font-arabic">{selectedPartnerData.phone}</span></div>}
                      <div className="flex items-center"><Users className="h-4 w-4 text-gray-400 ml-2" /><span className="text-sm font-arabic">{selectedPartnerData.representativeName}</span></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold font-arabic text-gray-900 mb-3">تفاصيل الشراكة</h4>
                    <div className="space-y-2 text-sm font-arabic">
                      {selectedPartnerData.partnershipDescription ? <p className="text-gray-700">{selectedPartnerData.partnershipDescription}</p> : <p className="text-gray-500 italic">لا يوجد وصف للشراكة</p>}
                    </div>
                  </div>
                </div>
                {selectedPartnerData.tags.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold font-arabic text-gray-900 mb-2 flex items-center"><Tag className="h-4 w-4 ml-2" />التصنيفات</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPartnerData.tags.map((tag, index) => <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-arabic">{tag}</span>)}
                    </div>
                  </div>
                )}
              </DataCardFrame>

              <DataCardFrame title="أنشطة الشراكة" icon={<TrendingUp className="h-5 w-5" />}>
                <div className="text-center py-8">
                  <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-arabic">لا توجد أنشطة مسجلة بعد</p>
                  <BaseActionButton className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-arabic">إضافة نشاط جديد</BaseActionButton>
                </div>
              </DataCardFrame>
            </div>
          ) : (
            <DataCardFrame title="تفاصيل الشريك">
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold font-arabic text-gray-500 mb-2">اختر شريكاً لعرض التفاصيل</h3>
                <p className="text-gray-400 font-arabic">قم بالنقر على أحد الشركاء من القائمة لعرض ملفه الكامل</p>
              </div>
            </DataCardFrame>
          )}
        </div>
      </div>
    </div>
  );
};
