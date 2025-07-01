
import React, { useState } from 'react';
import { GenericCard } from '@/components/ui/GenericCard';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  DollarSign,
  Users,
  Award,
  Activity,
  FileText,
  Download,
  Eye
} from 'lucide-react';
import { mockCSRInitiatives } from './data';

export const MonitoringTab: React.FC = () => {
  const [selectedInitiative, setSelectedInitiative] = useState<string>('all');

  const calculateTotalSROI = () => {
    const totalSROI = mockCSRInitiatives.reduce((sum, init) => sum + init.impact.sroi, 0);
    return (totalSROI / mockCSRInitiatives.length).toFixed(2);
  };

  const calculateTotalBeneficiaries = () => {
    return mockCSRInitiatives.reduce((sum, init) => sum + init.impact.directBeneficiaries + init.impact.indirectBeneficiaries, 0);
  };

  const calculateTotalVolunteerHours = () => {
    return mockCSRInitiatives.reduce((sum, init) => sum + init.impact.volunteerHours, 0);
  };

  const calculateTotalBudget = () => {
    return mockCSRInitiatives.reduce((sum, init) => sum + init.allocatedBudget, 0);
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
      {/* M&E Framework Overview */}
      <GenericCard className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <BarChart3 className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-arabic text-gray-900">
              إطار المتابعة والتقييم (M&E Framework)
            </h3>
            <p className="text-gray-600 font-arabic">
              متابعة شاملة لأداء المبادرات الاجتماعية وقياس الأثر
            </p>
          </div>
        </div>
      </GenericCard>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GenericCard className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Target className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold font-arabic text-gray-900">{calculateTotalSROI()}</h3>
          <p className="text-gray-600 font-arabic">متوسط العائد الاجتماعي (SROI)</p>
          <div className="mt-2 text-sm text-purple-600 font-arabic">
            لكل ريال مستثمر
          </div>
        </GenericCard>

        <GenericCard className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold font-arabic text-gray-900">
            {calculateTotalBeneficiaries().toLocaleString('ar-SA')}
          </h3>
          <p className="text-gray-600 font-arabic">إجمالي المستفيدين</p>
          <div className="mt-2 text-sm text-blue-600 font-arabic">
            مباشر وغير مباشر
          </div>
        </GenericCard>

        <GenericCard className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Activity className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold font-arabic text-gray-900">
            {calculateTotalVolunteerHours().toLocaleString('ar-SA')}
          </h3>
          <p className="text-gray-600 font-arabic">ساعات التطوع</p>
          <div className="mt-2 text-sm text-green-600 font-arabic">
            من موظفي سوبرا
          </div>
        </GenericCard>

        <GenericCard className="text-center">
          <div className="flex items-center justify-center mb-4">
            <DollarSign className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold font-arabic text-gray-900">
            {formatCurrency(calculateTotalBudget())}
          </h3>
          <p className="text-gray-600 font-arabic">إجمالي الاستثمار</p>
          <div className="mt-2 text-sm text-red-600 font-arabic">
            المخصص للمبادرات
          </div>
        </GenericCard>
      </div>

      {/* Initiative Performance Dashboard */}
      <GenericCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold font-arabic">أداء المبادرات</h3>
          <select
            value={selectedInitiative}
            onChange={(e) => setSelectedInitiative(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg font-arabic bg-white"
          >
            <option value="all">جميع المبادرات</option>
            {mockCSRInitiatives.map((initiative) => (
              <option key={initiative.id} value={initiative.id}>
                {initiative.title}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          {mockCSRInitiatives.map((initiative) => (
            <div key={initiative.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold font-arabic text-gray-900">{initiative.title}</h4>
                <span className="text-sm text-gray-500 font-arabic">
                  مؤشر الأثر: {initiative.impact.socialImpactIndex}/10
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-sm text-gray-500 font-arabic">KPIs المحققة</p>
                  <p className="text-xl font-bold text-green-600">
                    {initiative.kpis.filter(kpi => kpi.achieved >= kpi.target).length}/{initiative.kpis.length}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500 font-arabic">SROI</p>
                  <p className="text-xl font-bold text-purple-600">{initiative.impact.sroi}:1</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500 font-arabic">تقدم الميزانية</p>
                  <p className="text-xl font-bold text-blue-600">
                    {((initiative.allocatedBudget / initiative.budget) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {initiative.kpis.map((kpi) => {
                  const progress = (kpi.achieved / kpi.target) * 100;
                  return (
                    <div key={kpi.id}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-arabic text-gray-700">{kpi.metric}</span>
                        <span className="text-sm font-arabic text-gray-600">
                          {kpi.achieved.toLocaleString('ar-SA')} / {kpi.target.toLocaleString('ar-SA')} {kpi.unit}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            progress >= 100 ? 'bg-green-500' : progress >= 80 ? 'bg-blue-500' : 'bg-orange-500'
                          }`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </GenericCard>

      {/* SROI Calculator */}
      <GenericCard>
        <div className="flex items-center gap-3 mb-4">
          <Award className="h-6 w-6 text-yellow-600" />
          <h3 className="text-lg font-bold font-arabic">حاسبة العائد الاجتماعي على الاستثمار (SROI)</h3>
        </div>
        <p className="text-gray-600 font-arabic mb-4">
          أداة لحساب العائد الاجتماعي على الاستثمار وتقييم الأثر الاقتصادي للمبادرات
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold font-arabic text-gray-900 mb-2">مكونات التكلفة</h4>
            <ul className="space-y-1 text-sm font-arabic text-gray-600">
              <li>• الاستثمار المالي المباشر</li>
              <li>• تكلفة ساعات الموظفين</li>
              <li>• تكلفة الموارد والمواد</li>
              <li>• التكاليف الإدارية</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold font-arabic text-gray-900 mb-2">مكونات القيمة</h4>
            <ul className="space-y-1 text-sm font-arabic text-gray-600">
              <li>• زيادة الدخل للمستفيدين</li>
              <li>• توفير التكاليف الصحية</li>
              <li>• تحسين الإنتاجية</li>
              <li>• القيمة البيئية والاجتماعية</li>
            </ul>
          </div>
        </div>
        <div className="mt-4">
          <Button className="bg-yellow-600 hover:bg-yellow-700 text-white font-arabic">
            <TrendingUp className="ml-2 h-4 w-4" />
            حساب SROI لمبادرة جديدة
          </Button>
        </div>
      </GenericCard>

      {/* Data Quality Assurance */}
      <GenericCard>
        <div className="flex items-center gap-3 mb-4">
          <FileText className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-bold font-arabic">ضمان جودة البيانات</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold font-arabic text-gray-900 mb-2">قواعد التحقق المطبقة</h4>
            <ul className="space-y-1 text-sm font-arabic text-gray-600">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                التحقق من اكتمال البيانات المطلوبة
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                التحقق من صحة التواريخ والأرقام
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                مطابقة البيانات مع المصادر الخارجية
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                مراجعة البيانات الشاذة والاستثناءات
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold font-arabic text-gray-900 mb-2">أدوات جمع البيانات</h4>
            <div className="space-y-2">
              <Button size="sm" variant="outline" className="w-full font-arabic">
                <Eye className="ml-2 h-4 w-4" />
                استمارات المسح الميداني
              </Button>
              <Button size="sm" variant="outline" className="w-full font-arabic">
                <Download className="ml-2 h-4 w-4" />
                تطبيق الهاتف المحمول
              </Button>
              <Button size="sm" variant="outline" className="w-full font-arabic">
                <FileText className="ml-2 h-4 w-4" />
                قوالب التقارير الدورية
              </Button>
            </div>
          </div>
        </div>
      </GenericCard>
    </div>
  );
};
