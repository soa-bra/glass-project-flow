import React from 'react';
import { GenericCard } from '@/components/ui/GenericCard';
import { 
  Heart, 
  Users, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  Target,
  Award,
  Activity
} from 'lucide-react';
import { mockCSRDashboardData } from './data';
import { KPIStatsSection } from '@/components/shared/KPIStatsSection';

export const OverviewTab: React.FC = () => {
  const { overview } = mockCSRDashboardData;

  const kpiStats = [
    {
      title: 'إجمالي المبادرات',
      value: overview.totalInitiatives,
      unit: 'مبادرة',
      description: `${overview.activeInitiatives} مبادرة نشطة`
    },
    {
      title: 'إجمالي المستفيدين',
      value: overview.totalBeneficiaries.toLocaleString('ar-SA'),
      unit: 'مستفيد',
      description: 'مستفيد مباشر وغير مباشر'
    },
    {
      title: 'مؤشر الأثر الاجتماعي',
      value: overview.socialImpactIndex.toFixed(1),
      unit: 'نقطة',
      description: 'من 10 نقاط'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const statsCards = [
    {
      title: 'إجمالي المبادرات',
      value: overview.totalInitiatives,
      icon: Heart,
      color: 'text-red-600 bg-red-100',
      description: `${overview.activeInitiatives} مبادرة نشطة`
    },
    {
      title: 'إجمالي المستفيدين',
      value: overview.totalBeneficiaries.toLocaleString('ar-SA'),
      icon: Users,
      color: 'text-blue-600 bg-blue-100',
      description: 'مستفيد مباشر وغير مباشر'
    },
    {
      title: 'ساعات التطوع',
      value: overview.totalVolunteerHours.toLocaleString('ar-SA'),
      icon: Clock,
      color: 'text-green-600 bg-green-100',
      description: 'ساعة تطوعية'
    },
    {
      title: 'إجمالي الاستثمار',
      value: formatCurrency(overview.totalBudget),
      icon: DollarSign,
      color: 'text-purple-600 bg-purple-100',
      description: 'استثمار مجتمعي'
    },
    {
      title: 'مؤشر الأثر الاجتماعي',
      value: overview.socialImpactIndex.toFixed(1),
      icon: TrendingUp,
      color: 'text-orange-600 bg-orange-100',
      description: 'من 10 نقاط'
    },
    {
      title: 'العائد الاجتماعي',
      value: `${overview.averageSROI.toFixed(1)}:1`,
      icon: Target,
      color: 'text-teal-600 bg-teal-100',
      description: 'متوسط SROI'
    }
  ];

  return (
    <div className="space-y-6">
      {/* مؤشرات الأداء الأساسية */}
      <KPIStatsSection stats={kpiStats} />

      {/* باقي المحتوى */}
      {/* Welcome Section */}
      <GenericCard className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-100 rounded-full">
            <Heart className="h-8 w-8 text-red-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-arabic text-gray-900 mb-2">
              مرحباً بك في لوحة إدارة المسؤولية الاجتماعية
            </h3>
            <p className="text-gray-600 font-arabic">
              تتبع وإدارة المبادرات الاجتماعية وقياس الأثر المجتمعي لمؤسسة سوبرا
            </p>
          </div>
        </div>
      </GenericCard>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <GenericCard key={index} className="text-center hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center mb-4">
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <IconComponent className="h-6 w-6" />
                </div>
              </div>
              <h3 className="text-2xl font-bold font-arabic text-gray-900 mb-1">
                {stat.value}
              </h3>
              <p className="text-gray-900 font-semibold font-arabic mb-1">
                {stat.title}
              </p>
              <p className="text-sm text-gray-600 font-arabic">
                {stat.description}
              </p>
            </GenericCard>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GenericCard>
          <div className="flex items-center gap-3 mb-4">
            <Activity className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-bold font-arabic">النشاط الأخير</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-arabic text-sm text-gray-900">تم إكمال ورشة المهارات الرقمية</p>
                <p className="font-arabic text-xs text-gray-500">منذ ساعتين</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-arabic text-sm text-gray-900">إضافة شريك جديد - جمعية البيئة</p>
                <p className="font-arabic text-xs text-gray-500">منذ 4 ساعات</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-arabic text-sm text-gray-900">تحديث مؤشرات الأداء لمبادرة الطاقة النظيفة</p>
                <p className="font-arabic text-xs text-gray-500">منذ 6 ساعات</p>
              </div>
            </div>
          </div>
        </GenericCard>

        <GenericCard>
          <div className="flex items-center gap-3 mb-4">
            <Award className="h-5 w-5 text-yellow-600" />
            <h3 className="text-lg font-bold font-arabic">الإنجازات الحديثة</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
              <Award className="h-5 w-5 text-yellow-600" />
              <div className="flex-1">
                <p className="font-arabic text-sm text-gray-900 font-semibold">تحقيق هدف 500 مستفيد</p>
                <p className="font-arabic text-xs text-gray-600">برنامج محو الأمية الرقمية</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div className="flex-1">
                <p className="font-arabic text-sm text-gray-900 font-semibold">زيادة مؤشر الأثر بنسبة 15%</p>
                <p className="font-arabic text-xs text-gray-600">مقارنة بالربع السابق</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <p className="font-arabic text-sm text-gray-900 font-semibold">انضمام 15 متطوع جديد</p>
                <p className="font-arabic text-xs text-gray-600">هذا الشهر</p>
              </div>
            </div>
          </div>
        </GenericCard>
      </div>
    </div>
  );
};
