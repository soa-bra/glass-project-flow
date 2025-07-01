
import React, { useState } from 'react';
import { GenericCard } from '@/components/ui/GenericCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  FileText, 
  Plus, 
  Search, 
  Download, 
  Eye, 
  Calendar,
  BarChart3,
  Target,
  Globe,
  TrendingUp,
  Filter,
  Users,
  Award
} from 'lucide-react';

export const ReportsTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  const reportTypes = [
    { id: 'impact', label: 'تقرير الأثر', icon: TrendingUp, color: 'text-blue-600' },
    { id: 'esg', label: 'تقرير ESG', icon: Award, color: 'text-green-600' },
    { id: 'sdg', label: 'تقرير SDG', icon: Globe, color: 'text-purple-600' },
    { id: 'sroi', label: 'تقرير SROI', icon: Target, color: 'text-orange-600' },
    { id: 'annual', label: 'التقرير السنوي', icon: BarChart3, color: 'text-red-600' }
  ];

  const mockReports = [
    {
      id: 'rep-001',
      title: 'تقرير الأثر الاجتماعي - الربع الثاني 2024',
      type: 'impact',
      period: { start: '2024-04-01', end: '2024-06-30' },
      generatedDate: '2024-07-15',
      status: 'published',
      metrics: {
        totalBudget: 450000,
        totalBeneficiaries: 2500,
        totalVolunteerHours: 680,
        averageSROI: 3.4
      }
    },
    {
      id: 'rep-002',
      title: 'تقرير ESG - النصف الأول 2024',
      type: 'esg',
      period: { start: '2024-01-01', end: '2024-06-30' },
      generatedDate: '2024-07-20',
      status: 'review',
      metrics: {
        totalBudget: 850000,
        totalBeneficiaries: 5000,
        totalVolunteerHours: 1200,
        averageSROI: 3.1
      }
    }
  ];

  const getTypeInfo = (type: string) => {
    return reportTypes.find(t => t.id === type) || reportTypes[0];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published': return 'منشور';
      case 'approved': return 'معتمد';
      case 'review': return 'قيد المراجعة';
      case 'draft': return 'مسودة';
      default: return status;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-96">
            <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="البحث في التقارير..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg font-arabic bg-white"
          >
            <option value="all">جميع الأنواع</option>
            {reportTypes.map(type => (
              <option key={type.id} value={type.id}>{type.label}</option>
            ))}
          </select>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-arabic">
          <Plus className="ml-2 h-4 w-4" />
          إنشاء تقرير جديد
        </Button>
      </div>

      {/* Report Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportTypes.map((type) => {
          const IconComponent = type.icon;
          return (
            <GenericCard key={type.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-gray-50 rounded-full">
                    <IconComponent className={`h-8 w-8 ${type.color}`} />
                  </div>
                </div>
                <h3 className="text-lg font-bold font-arabic text-gray-900 mb-2">
                  {type.label}
                </h3>
                <p className="text-sm text-gray-600 font-arabic mb-4">
                  {type.id === 'impact' && 'تقرير شامل عن الأثر الاجتماعي للمبادرات'}
                  {type.id === 'esg' && 'تقرير الحوكمة البيئية والاجتماعية والمؤسسية'}
                  {type.id === 'sdg' && 'تقرير مساهمة المبادرات في أهداف التنمية المستدامة'}
                  {type.id === 'sroi' && 'تقرير العائد الاجتماعي على الاستثمار'}
                  {type.id === 'annual' && 'التقرير السنوي الشامل للمسؤولية الاجتماعية'}
                </p>
                <Button className="w-full font-arabic" variant="outline">
                  <Plus className="ml-2 h-4 w-4" />
                  إنشاء {type.label}
                </Button>
              </div>
            </GenericCard>
          );
        })}
      </div>

      {/* Recent Reports */}
      <GenericCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold font-arabic">التقارير الحديثة</h3>
          <Button variant="outline" size="sm" className="font-arabic">
            <Filter className="ml-2 h-4 w-4" />
            تصفية
          </Button>
        </div>

        <div className="space-y-4">
          {mockReports.map((report) => {
            const typeInfo = getTypeInfo(report.type);
            const IconComponent = typeInfo.icon;
            
            return (
              <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <IconComponent className={`h-5 w-5 ${typeInfo.color}`} />
                    </div>
                    <div>
                      <h4 className="font-semibold font-arabic text-gray-900">{report.title}</h4>
                      <p className="text-sm text-gray-600 font-arabic">
                        {new Date(report.period.start).toLocaleDateString('ar-SA')} - {new Date(report.period.end).toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(report.status)}`}>
                    {getStatusText(report.status)}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-500 font-arabic">الميزانية</p>
                    <p className="font-semibold font-arabic">{formatCurrency(report.metrics.totalBudget)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500 font-arabic">المستفيدين</p>
                    <p className="font-semibold font-arabic">{report.metrics.totalBeneficiaries.toLocaleString('ar-SA')}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500 font-arabic">ساعات التطوع</p>
                    <p className="font-semibold font-arabic">{report.metrics.totalVolunteerHours}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500 font-arabic">SROI</p>
                    <p className="font-semibold font-arabic">{report.metrics.averageSROI}:1</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-gray-500 font-arabic">
                    <Calendar className="h-4 w-4" />
                    <span>تم الإنشاء في {new Date(report.generatedDate).toLocaleDateString('ar-SA')}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="font-arabic">
                      <Eye className="h-3 w-3 ml-1" />
                      عرض
                    </Button>
                    <Button size="sm" variant="outline" className="font-arabic">
                      <Download className="h-3 w-3 ml-1" />
                      تحميل
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </GenericCard>

      {/* SDG Mapping Tool */}
      <GenericCard>
        <div className="flex items-center gap-3 mb-4">
          <Globe className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-bold font-arabic">أداة ربط أهداف التنمية المستدامة</h3>
        </div>
        <p className="text-gray-600 font-arabic mb-4">
          ربط المبادرات الاجتماعية بأهداف التنمية المستدامة للأمم المتحدة وقياس المساهمة
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">
              4
            </div>
            <p className="text-sm font-arabic font-semibold">التعليم الجيد</p>
            <p className="text-xs text-blue-600 font-arabic">3 مبادرات</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">
              7
            </div>
            <p className="text-sm font-arabic font-semibold">طاقة نظيفة</p>
            <p className="text-xs text-green-600 font-arabic">2 مبادرات</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">
              8
            </div>
            <p className="text-sm font-arabic font-semibold">عمل لائق</p>
            <p className="text-xs text-purple-600 font-arabic">4 مبادرات</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">
              13
            </div>
            <p className="text-sm font-arabic font-semibold">العمل المناخي</p>
            <p className="text-xs text-orange-600 font-arabic">1 مبادرة</p>
          </div>
        </div>
        <div className="mt-4">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-arabic">
            <Target className="ml-2 h-4 w-4" />
            إنشاء خريطة SDG شاملة
          </Button>
        </div>
      </GenericCard>
    </div>
  );
};
