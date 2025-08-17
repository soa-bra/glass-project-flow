
import React, { useState, useEffect, useRef } from 'react';
import { GenericCard } from '@/components/ui/GenericCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Target, Plus, Search, Filter, Calendar, DollarSign, TrendingUp, FileText, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { mockOpportunities, mockCRMAnalytics } from './data';
import { SafeChart } from '@/components/ui/SafeChart';

export const OpportunitiesTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const isMountedRef = useRef(true);

  useEffect(() => {
    console.log('OpportunitiesTab mounted');
    return () => {
      console.log('OpportunitiesTab unmounting');
      isMountedRef.current = false;
    };
  }, []);

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

  const filteredOpportunities = mockOpportunities.filter(opp => {
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
        <Button className="bg-green-600 hover:bg-green-700 text-white font-arabic">
          <Plus className="ml-2 h-4 w-4" />
          إضافة فرصة جديدة
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GenericCard className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Target className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold font-arabic text-gray-900">{mockCRMAnalytics.totalOpportunities}</h3>
          <p className="text-gray-600 font-arabic">إجمالي الفرص</p>
          <div className="mt-2 text-sm text-blue-600 font-arabic">
            {filteredOpportunities.length} نشطة
          </div>
        </GenericCard>

        <GenericCard className="text-center">
          <div className="flex items-center justify-center mb-4">
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold font-arabic text-gray-900">{mockCRMAnalytics.conversionRate}%</h3>
          <p className="text-gray-600 font-arabic">معدل التحويل</p>
          <div className="mt-2 text-sm text-green-600 font-arabic">
            {mockCRMAnalytics.wonOpportunities} فرصة ناجحة
          </div>
        </GenericCard>

        <GenericCard className="text-center">
          <div className="flex items-center justify-center mb-4">
            <DollarSign className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold font-arabic text-gray-900">
            {(mockCRMAnalytics.averageDealSize / 1000).toFixed(0)}ك
          </h3>
          <p className="text-gray-600 font-arabic">متوسط قيمة الصفقة</p>
          <div className="mt-2 text-sm text-gray-500 font-arabic">ر.س</div>
        </GenericCard>

        <GenericCard className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Calendar className="h-8 w-8 text-orange-600" />
          </div>
          <h3 className="text-2xl font-bold font-arabic text-gray-900">18</h3>
          <p className="text-gray-600 font-arabic">فرص هذا الشهر</p>
          <div className="mt-2 text-sm text-orange-600 font-arabic">+22% عن الماضي</div>
        </GenericCard>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Funnel */}
        <GenericCard>
          <h3 className="text-xl font-bold font-arabic mb-4 flex items-center">
            <TrendingUp className="ml-2 h-5 w-5" />
            مسار المبيعات
          </h3>
          <SafeChart width="100%" height={300}>
            <BarChart data={funnelData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="stage" className="font-arabic" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'count' ? `${value} فرصة` : `${(value as number / 1000000).toFixed(1)}م ر.س`,
                  name === 'count' ? 'عدد الفرص' : 'القيمة الإجمالية'
                ]} 
              />
              <Bar dataKey="count" fill="#3B82F6" name="count" />
            </BarChart>
          </SafeChart>
        </GenericCard>

        {/* Opportunities by Source */}
        <GenericCard>
          <h3 className="text-xl font-bold font-arabic mb-4 flex items-center">
            <Users className="ml-2 h-5 w-5" />
            مصادر الفرص
          </h3>
          <SafeChart width="100%" height={300}>
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
          </SafeChart>
        </GenericCard>
      </div>

      {/* Opportunities List */}
      <GenericCard>
        <h3 className="text-xl font-bold font-arabic mb-4 flex items-center">
          <FileText className="ml-2 h-5 w-5" />
          قائمة الفرص ({filteredOpportunities.length})
        </h3>
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
                      <Button size="sm" variant="outline" className="font-arabic">
                        عرض
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GenericCard>
    </div>
  );
};
