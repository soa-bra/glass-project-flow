
import React, { useState } from 'react';
import { NumericStatCard } from '@/components/shared/visual-data/NumericStatCard';
import { DataCardFrame } from '@/components/shared/visual-data/DataCardFrame';
import { BaseActionButton } from '@/components/shared/BaseActionButton';
import { Input } from '@/components/ui/input';
import { Target, Plus, Search, Calendar, DollarSign, TrendingUp, FileText, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { mockOpportunities, mockCRMAnalytics } from './data';
import { GenericFormModal, FormField } from '../shared/GenericFormModal';
import { GenericDetailModal, DetailField } from '../shared/GenericDetailModal';


export const OpportunitiesTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [opportunities, setOpportunities] = useState(mockOpportunities);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [viewingOpp, setViewingOpp] = useState<any>(null);

  const stageColors = {
    'lead': '#6B7280',
    'qualified': '#3B82F6',
    'proposal': '#F59E0B',
    'negotiation': '#8B5CF6',
    'closed-won': '#10B981',
    'closed-lost': '#EF4444'
  };

  const getStageText = (stage: string) => {
    switch (stage) {
      case 'lead': return 'عميل محتمل';
      case 'qualified': return 'مؤهل';
      case 'proposal': return 'عرض';
      case 'negotiation': return 'تفاوض';
      case 'closed-won': return 'مغلق - فوز';
      case 'closed-lost': return 'مغلق - خسارة';
      default: return stage;
    }
  };

  const getStageColor = (stage: string) => {
    const baseColor = stageColors[stage as keyof typeof stageColors] || '#6B7280';
    return {
      bg: `${baseColor}20`,
      text: baseColor,
      border: `${baseColor}40`
    };
  };

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
    { name: 'أخرى', value: 5, color: '#6B7280' }
  ];

  const addFields: FormField[] = [
    { name: 'title', label: 'عنوان الفرصة', type: 'text', required: true, placeholder: 'أدخل عنوان الفرصة' },
    { name: 'customerName', label: 'العميل', type: 'text', required: true, placeholder: 'اسم العميل' },
    { name: 'value', label: 'القيمة المتوقعة (ر.س)', type: 'number', required: true, placeholder: '0' },
    { name: 'probability', label: 'الاحتمالية (%)', type: 'number', required: true, placeholder: '50' },
    { name: 'stage', label: 'المرحلة', type: 'select', required: true, options: [
      { value: 'lead', label: 'عميل محتمل' },
      { value: 'qualified', label: 'مؤهل' },
      { value: 'proposal', label: 'عرض' },
      { value: 'negotiation', label: 'تفاوض' },
    ]},
    { name: 'expectedCloseDate', label: 'تاريخ الإغلاق المتوقع', type: 'date', required: true },
    { name: 'assignedTo', label: 'المسؤول', type: 'text', placeholder: 'اسم المسؤول' },
    { name: 'description', label: 'الوصف', type: 'textarea', placeholder: 'تفاصيل الفرصة...' },
  ];

  const handleAddOpportunity = (data: Record<string, string>) => {
    const newOpp = {
      id: `opp-${Date.now()}`,
      customerId: `c-${Date.now()}`,
      customerName: data.customerName,
      title: data.title,
      description: data.description || '',
      value: Number(data.value),
      currency: 'SAR',
      probability: Number(data.probability),
      stage: data.stage as any,
      source: 'other' as const,
      expectedCloseDate: data.expectedCloseDate,
      assignedTo: data.assignedTo || 'غير محدد',
      createdDate: new Date().toISOString().split('T')[0],
      lastActivityDate: new Date().toISOString().split('T')[0],
      nextSteps: '',
      competitors: [],
      tags: [],
      documents: [],
    };
    setOpportunities(prev => [newOpp, ...prev]);
  };

  const getViewFields = (opp: any): DetailField[] => [
    { label: 'العنوان', value: opp.title },
    { label: 'العميل', value: opp.customerName },
    { label: 'المرحلة', value: getStageText(opp.stage) },
    { label: 'القيمة', value: `${(opp.value / 1000).toFixed(0)}ك ر.س` },
    { label: 'الاحتمالية', value: `${opp.probability}%` },
    { label: 'تاريخ الإغلاق المتوقع', value: opp.expectedCloseDate },
    { label: 'المسؤول', value: opp.assignedTo },
    { label: 'المصدر', value: opp.source || 'غير محدد' },
    { label: 'الوصف', value: opp.description || 'لا يوجد وصف' },
  ];

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-96">
            <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="البحث في الفرص..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg font-arabic bg-white"
          >
            <option value="all">جميع المراحل</option>
            <option value="lead">عميل محتمل</option>
            <option value="qualified">مؤهل</option>
            <option value="proposal">عرض</option>
            <option value="negotiation">تفاوض</option>
            <option value="closed-won">مغلق - فوز</option>
            <option value="closed-lost">مغلق - خسارة</option>
          </select>
        </div>
        <BaseActionButton onClick={() => setIsAddOpen(true)} className="bg-green-600 hover:bg-green-700 text-white font-arabic">
          <Plus className="ml-2 h-4 w-4" />
          إضافة فرصة جديدة
        </BaseActionButton>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <NumericStatCard
          title="إجمالي الفرص"
          value={mockCRMAnalytics.totalOpportunities}
          description={`${filteredOpportunities.length} نشطة`}
          icon={<Target className="h-5 w-5" />}
          accentColor="#8B5CF6"
        />
        <NumericStatCard
          title="معدل التحويل"
          value={`${mockCRMAnalytics.conversionRate}%`}
          description={`${mockCRMAnalytics.wonOpportunities} فرصة ناجحة`}
          icon={<TrendingUp className="h-5 w-5" />}
          accentColor="#10B981"
        />
        <NumericStatCard
          title="متوسط قيمة الصفقة"
          value={`${(mockCRMAnalytics.averageDealSize / 1000).toFixed(0)}ك`}
          unit="ر.س"
          icon={<DollarSign className="h-5 w-5" />}
          accentColor="#3B82F6"
        />
        <NumericStatCard
          title="فرص هذا الشهر"
          value={18}
          description="+22% عن الماضي"
          icon={<Calendar className="h-5 w-5" />}
          accentColor="#F59E0B"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DataCardFrame title="مسار المبيعات" icon={<TrendingUp className="h-5 w-5" />}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={funnelData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(11,15,18,0.08)" />
              <XAxis dataKey="stage" className="font-arabic" axisLine={false} tickLine={false} tick={{ fill: 'rgba(11,15,18,0.35)', fontSize: 10 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(11,15,18,0.35)', fontSize: 10 }} />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'count' ? `${value} فرصة` : `${(value as number / 1000000).toFixed(1)}م ر.س`,
                  name === 'count' ? 'عدد الفرص' : 'القيمة الإجمالية'
                ]} 
              />
              <Bar dataKey="count" fill="#3B82F6" name="count" barSize={20} radius={[999, 999, 999, 999]} />
            </BarChart>
          </ResponsiveContainer>
        </DataCardFrame>

        <DataCardFrame title="مصادر الفرص" icon={<Users className="h-5 w-5" />}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={opportunityBySource}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {opportunityBySource.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </DataCardFrame>
      </div>

      {/* Opportunities List */}
      <DataCardFrame title={`قائمة الفرص (${filteredOpportunities.length})`} icon={<FileText className="h-5 w-5" />}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-right font-arabic font-semibold p-3">العنوان</th>
                <th className="text-right font-arabic font-semibold p-3">العميل</th>
                <th className="text-right font-arabic font-semibold p-3">المرحلة</th>
                <th className="text-right font-arabic font-semibold p-3">القيمة</th>
                <th className="text-right font-arabic font-semibold p-3">الاحتمالية</th>
                <th className="text-right font-arabic font-semibold p-3">تاريخ الانتهاء</th>
                <th className="text-right font-arabic font-semibold p-3">المسؤول</th>
                <th className="text-right font-arabic font-semibold p-3">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredOpportunities.map((opportunity) => {
                const stageStyle = getStageColor(opportunity.stage);
                return (
                  <tr key={opportunity.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-3">
                      <div className="font-semibold font-arabic text-gray-900">{opportunity.title}</div>
                      <div className="text-sm text-gray-600 font-arabic">{opportunity.description.substring(0, 50)}...</div>
                    </td>
                    <td className="p-3 font-arabic">{opportunity.customerName}</td>
                    <td className="p-3">
                      <span 
                        className="px-2 py-1 text-xs rounded-full font-arabic"
                        style={{ 
                          backgroundColor: stageStyle.bg, 
                          color: stageStyle.text,
                          border: `1px solid ${stageStyle.border}`
                        }}
                      >
                        {getStageText(opportunity.stage)}
                      </span>
                    </td>
                    <td className="p-3 font-arabic text-green-600 font-semibold">
                      {(opportunity.value / 1000).toFixed(0)}ك ر.س
                    </td>
                    <td className="p-3">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 ml-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${opportunity.probability}%` }}
                          />
                        </div>
                        <span className="text-sm font-arabic">{opportunity.probability}%</span>
                      </div>
                    </td>
                    <td className="p-3 font-arabic text-sm">{opportunity.expectedCloseDate}</td>
                    <td className="p-3 font-arabic text-sm">{opportunity.assignedTo}</td>
                    <td className="p-3">
                      <BaseActionButton size="sm" variant="outline" className="font-arabic" onClick={() => setViewingOpp(opportunity)}>
                        عرض
                      </BaseActionButton>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </DataCardFrame>

      {/* Add Opportunity Modal */}
      <GenericFormModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="إضافة فرصة جديدة"
        fields={addFields}
        onSubmit={handleAddOpportunity}
        submitLabel="إضافة"
        successMessage="تمت إضافة الفرصة بنجاح"
      />

      {/* View Opportunity Modal */}
      {viewingOpp && (
        <GenericDetailModal
          isOpen={!!viewingOpp}
          onClose={() => setViewingOpp(null)}
          title={viewingOpp.title}
          fields={getViewFields(viewingOpp)}
        />
      )}
    </div>
  );
};
