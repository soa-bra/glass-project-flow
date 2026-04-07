
import React, { useState } from 'react';
import { GenericCard } from '@/components/ui/GenericCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Users, Calendar, DollarSign, TrendingUp, Eye, Edit, Play, Pause, CheckCircle, Clock } from 'lucide-react';
import { mockCSRInitiatives } from './data';
import { CSRInitiative } from './types';
import { GenericFormModal, FormField } from '../shared/GenericFormModal';
import { GenericDetailModal, DetailField } from '../shared/GenericDetailModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export const InitiativesTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [initiatives, setInitiatives] = useState(mockCSRInitiatives);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingInit, setEditingInit] = useState<CSRInitiative | null>(null);
  const [viewingInit, setViewingInit] = useState<CSRInitiative | null>(null);
  const [isToCOpen, setIsToCOpen] = useState(false);
  const [tocData, setTocData] = useState({ problem: '', inputs: '', activities: '', outputs: '', outcomes: '', impact: '' });

  const getStatusColor = (status: CSRInitiative['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) { case 'active': return 'نشط'; case 'planning': return 'تخطيط'; case 'completed': return 'مكتمل'; case 'suspended': return 'معلق'; default: return status; }
  };

  const getCategoryText = (category: string) => {
    switch (category) { case 'education': return 'تعليم'; case 'environment': return 'بيئة'; case 'economic_empowerment': return 'تمكين اقتصادي'; case 'health': return 'صحة'; case 'community': return 'مجتمع'; default: return category; }
  };

  const getCategoryColor = (category: string) => {
    switch (category) { case 'education': return 'bg-blue-100 text-blue-800'; case 'environment': return 'bg-green-100 text-green-800'; case 'economic_empowerment': return 'bg-purple-100 text-purple-800'; case 'health': return 'bg-red-100 text-red-800'; case 'community': return 'bg-orange-100 text-orange-800'; default: return 'bg-gray-100 text-gray-800'; }
  };

  const getStatusIcon = (status: string) => {
    switch (status) { case 'active': return Play; case 'planning': return Clock; case 'completed': return CheckCircle; case 'suspended': return Pause; default: return Clock; }
  };

  const filteredInitiatives = initiatives.filter(init => {
    const matchesSearch = init.title.toLowerCase().includes(searchTerm.toLowerCase()) || init.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || init.status === selectedStatus;
    const matchesCategory = selectedCategory === 'all' || init.category === selectedCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const formatCurrency = (amount: number) => new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(amount);

  const addFields: FormField[] = [
    { name: 'title', label: 'اسم المبادرة', type: 'text', required: true, placeholder: 'أدخل اسم المبادرة' },
    { name: 'description', label: 'الوصف', type: 'textarea', required: true, placeholder: 'وصف المبادرة...' },
    { name: 'category', label: 'الفئة', type: 'select', required: true, options: [
      { value: 'education', label: 'تعليم' }, { value: 'environment', label: 'بيئة' }, { value: 'economic_empowerment', label: 'تمكين اقتصادي' }, { value: 'health', label: 'صحة' }, { value: 'community', label: 'مجتمع' },
    ]},
    { name: 'budget', label: 'الميزانية', type: 'number', required: true, placeholder: '0' },
    { name: 'startDate', label: 'تاريخ البداية', type: 'date', required: true },
    { name: 'endDate', label: 'تاريخ النهاية', type: 'date', required: true },
    { name: 'manager', label: 'مدير المبادرة', type: 'text', required: true, placeholder: 'الاسم' },
    { name: 'beneficiaries', label: 'عدد المستفيدين المتوقع', type: 'number', placeholder: '0' },
  ];

  const handleAddInitiative = (data: Record<string, string>) => {
    const newInit: any = {
      id: `csr-${Date.now()}`,
      title: data.title,
      description: data.description,
      status: 'planning',
      category: data.category,
      budget: Number(data.budget),
      allocatedBudget: 0,
      startDate: data.startDate,
      endDate: data.endDate,
      beneficiaries: Number(data.beneficiaries) || 0,
      sdgGoals: [],
      manager: data.manager,
      team: [],
      partnerships: [],
      impact: { socialImpactIndex: 0, sroi: 0, volunteerHours: 0, directBeneficiaries: 0, indirectBeneficiaries: 0 },
      theoryOfChange: { problem: '', inputs: [], activities: [], outputs: [], outcomes: [], impact: [] },
    };
    setInitiatives(prev => [newInit, ...prev]);
  };

  const handleEditInitiative = (data: Record<string, string>) => {
    if (!editingInit) return;
    setInitiatives(prev => prev.map(i => i.id === editingInit.id ? {
      ...i, title: data.title, description: data.description, category: data.category as any, budget: Number(data.budget), manager: data.manager, beneficiaries: Number(data.beneficiaries) || i.beneficiaries,
    } : i));
    setEditingInit(null);
  };

  const handleSaveToC = () => {
    toast.success('تم حفظ نظرية التغيير بنجاح');
    setIsToCOpen(false);
    setTocData({ problem: '', inputs: '', activities: '', outputs: '', outcomes: '', impact: '' });
  };

  const getViewFields = (init: CSRInitiative): DetailField[] => [
    { label: 'العنوان', value: init.title },
    { label: 'الوصف', value: init.description },
    { label: 'الفئة', value: getCategoryText(init.category) },
    { label: 'الحالة', value: getStatusText(init.status) },
    { label: 'الميزانية', value: formatCurrency(init.budget) },
    { label: 'المستفيدين', value: init.beneficiaries.toLocaleString('ar-SA') },
    { label: 'المدير', value: init.manager },
    { label: 'الفريق', value: `${init.team.length} أعضاء` },
    { label: 'مؤشر الأثر الاجتماعي', value: `${init.impact.socialImpactIndex}/10` },
    { label: 'SROI', value: `${init.impact.sroi}x` },
    { label: 'تاريخ البداية', value: new Date(init.startDate).toLocaleDateString('ar-SA') },
    { label: 'تاريخ النهاية', value: new Date(init.endDate).toLocaleDateString('ar-SA') },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-96">
            <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            <Input placeholder="البحث في المبادرات..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pr-10" />
          </div>
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg font-arabic bg-white">
            <option value="all">جميع الحالات</option>
            <option value="active">نشط</option>
            <option value="planning">تخطيط</option>
            <option value="completed">مكتمل</option>
            <option value="suspended">معلق</option>
          </select>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg font-arabic bg-white">
            <option value="all">جميع الفئات</option>
            <option value="education">تعليم</option>
            <option value="environment">بيئة</option>
            <option value="economic_empowerment">تمكين اقتصادي</option>
            <option value="health">صحة</option>
            <option value="community">مجتمع</option>
          </select>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-arabic">
          <Plus className="ml-2 h-4 w-4" /> إضافة مبادرة جديدة
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredInitiatives.map((initiative) => {
          const StatusIcon = getStatusIcon(initiative.status);
          const progressPercentage = initiative.budget > 0 ? (initiative.allocatedBudget / initiative.budget) * 100 : 0;
          return (
            <GenericCard key={initiative.id} className="hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold font-arabic text-gray-900">{initiative.title}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(initiative.status)}`}>
                      <StatusIcon className="inline h-3 w-3 ml-1" />{getStatusText(initiative.status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 font-arabic mb-3">{initiative.description}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(initiative.category)}`}>{getCategoryText(initiative.category)}</span>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      {initiative.sdgGoals.map((goal, index) => (
                        <span key={index} className="px-1 py-0.5 bg-blue-50 text-blue-700 rounded">{goal}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2"><Users className="h-4 w-4 text-blue-600" /><div><p className="text-xs text-gray-500 font-arabic">المستفيدين</p><p className="font-semibold font-arabic">{initiative.beneficiaries.toLocaleString('ar-SA')}</p></div></div>
                <div className="flex items-center gap-2"><DollarSign className="h-4 w-4 text-green-600" /><div><p className="text-xs text-gray-500 font-arabic">الميزانية</p><p className="font-semibold font-arabic">{formatCurrency(initiative.budget)}</p></div></div>
                <div className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-purple-600" /><div><p className="text-xs text-gray-500 font-arabic">مؤشر الأثر</p><p className="font-semibold font-arabic">{initiative.impact.socialImpactIndex}/10</p></div></div>
                <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-orange-600" /><div><p className="text-xs text-gray-500 font-arabic">المدة</p><p className="font-semibold font-arabic text-xs">{new Date(initiative.startDate).toLocaleDateString('ar-SA')} - {new Date(initiative.endDate).toLocaleDateString('ar-SA')}</p></div></div>
              </div>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2"><span className="text-sm font-arabic text-gray-700">تقدم الميزانية</span><span className="text-sm font-arabic text-gray-600">{progressPercentage.toFixed(1)}%</span></div>
                <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progressPercentage}%` }}></div></div>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600 font-arabic mb-4">
                <div><span className="font-semibold">المدير: </span><span>{initiative.manager}</span></div>
                <div><span className="font-semibold">الفريق: </span><span>{initiative.team.length} أعضاء</span></div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1 font-arabic" onClick={() => setViewingInit(initiative)}>
                  <Eye className="h-3 w-3 ml-1" /> عرض التفاصيل
                </Button>
                <Button size="sm" variant="outline" className="font-arabic" onClick={() => setEditingInit(initiative)}>
                  <Edit className="h-3 w-3 ml-1" /> تعديل
                </Button>
              </div>
            </GenericCard>
          );
        })}
      </div>

      <GenericCard>
        <h3 className="text-lg font-bold font-arabic mb-4">أداة بناء نظرية التغيير</h3>
        <p className="text-gray-600 font-arabic mb-4">استخدم هذه الأداة لتصميم وتطوير نظرية التغيير للمبادرات الجديدة</p>
        <Button onClick={() => setIsToCOpen(true)} className="bg-green-600 hover:bg-green-700 text-white font-arabic">
          <Plus className="ml-2 h-4 w-4" /> بناء نظرية تغيير جديدة
        </Button>
      </GenericCard>

      <GenericFormModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="إضافة مبادرة جديدة" fields={addFields} onSubmit={handleAddInitiative} submitLabel="إضافة المبادرة" successMessage="تمت إضافة المبادرة بنجاح" />

      {editingInit && (
        <GenericFormModal
          isOpen={!!editingInit}
          onClose={() => setEditingInit(null)}
          title={`تعديل: ${editingInit.title}`}
          fields={addFields.map(f => ({ ...f, defaultValue: String((editingInit as any)[f.name] || '') }))}
          onSubmit={handleEditInitiative}
          submitLabel="حفظ التعديلات"
          successMessage="تم تحديث المبادرة بنجاح"
        />
      )}

      {viewingInit && (
        <GenericDetailModal isOpen={!!viewingInit} onClose={() => setViewingInit(null)} title={`تفاصيل: ${viewingInit.title}`} fields={getViewFields(viewingInit)} />
      )}

      <Dialog open={isToCOpen} onOpenChange={setIsToCOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-white/80 backdrop-blur-xl border border-white/30 rounded-3xl">
          <DialogHeader><DialogTitle className="text-xl font-bold text-black font-arabic text-center">بناء نظرية التغيير</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-4">
            {[
              { key: 'problem', label: 'المشكلة', placeholder: 'ما هي المشكلة التي تعالجها المبادرة؟' },
              { key: 'inputs', label: 'المدخلات', placeholder: 'الموارد والاستثمارات المطلوبة...' },
              { key: 'activities', label: 'الأنشطة', placeholder: 'الأنشطة والبرامج التي ستنفذ...' },
              { key: 'outputs', label: 'المخرجات', placeholder: 'المخرجات المباشرة المتوقعة...' },
              { key: 'outcomes', label: 'النتائج', placeholder: 'النتائج متوسطة المدى...' },
              { key: 'impact', label: 'الأثر', placeholder: 'الأثر طويل المدى المتوقع...' },
            ].map(item => (
              <div key={item.key} className="space-y-2">
                <Label className="text-black font-arabic font-semibold">{item.label}</Label>
                <Textarea value={(tocData as any)[item.key]} onChange={e => setTocData(prev => ({ ...prev, [item.key]: e.target.value }))} placeholder={item.placeholder} className="bg-white/40 border-black/10 text-black font-arabic min-h-[60px] rounded-2xl" />
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setIsToCOpen(false)} className="font-arabic rounded-full">إلغاء</Button>
            <Button onClick={handleSaveToC} className="bg-black text-white rounded-full font-arabic">حفظ نظرية التغيير</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
