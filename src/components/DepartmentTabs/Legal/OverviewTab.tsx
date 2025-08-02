import React from 'react';
import { AlertTriangle, FileText, Scale, Shield, Calendar, TrendingUp, Bell, CheckCircle, Clock } from 'lucide-react';
import { KPIStatsSection } from '@/components/shared/KPIStatsSection';
import { mockLegalMetrics, mockAlerts } from './data';
import { getStatusColor, getStatusText, getPriorityColor } from './utils';

export const OverviewTab: React.FC = () => {
  const metrics = mockLegalMetrics;
  const alerts = mockAlerts.filter(alert => alert.status === 'pending').slice(0, 5);

  const kpiStats = [
    {
      title: 'العقود الموقعة',
      value: metrics.contractsCount.signed,
      unit: 'عقد',
      description: 'عقود نشطة ومعتمدة'
    },
    {
      title: 'القضايا النشطة',
      value: metrics.activeCases,
      unit: 'قضية',
      description: 'قضايا تحتاج متابعة'
    },
    {
      title: 'درجة الامتثال',
      value: `${metrics.complianceScore}%`,
      unit: 'امتثال',
      description: 'مستوى الامتثال القانوني'
    },
    {
      title: 'المخاطر المحلولة',
      value: '15',
      unit: 'خطر',
      description: 'تم حلها هذا الشهر'
    }
  ];

  const getAlertBadgeColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-[#f1b5b9] text-black';
      case 'medium': return 'bg-[#fbe2aa] text-black';
      case 'low': return 'bg-[#bdeed3] text-black';
      default: return 'bg-[#a4e2f6] text-black';
    }
  };

  return (
    <div className="space-y-6">
      {/* مؤشرات الأداء الأساسية */}
      <KPIStatsSection stats={kpiStats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* إحصائيات العقود */}
        <div className="bg-[#f2ffff] p-9 rounded-3xl border border-black/10 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-black font-arabic flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center">
                <FileText className="h-4 w-4 text-black" />
              </div>
              توزيع العقود حسب الحالة
            </h3>
          </div>
          <div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-transparent border border-black/10 rounded-3xl">
                <div className="text-2xl font-bold text-black font-arabic">{metrics.contractsCount.signed}</div>
                <div className="text-sm font-medium text-black font-arabic">موقعة</div>
              </div>
              <div className="text-center p-4 bg-transparent border border-black/10 rounded-3xl">
                <div className="text-2xl font-bold text-black font-arabic">{metrics.contractsCount.pending}</div>
                <div className="text-sm font-medium text-black font-arabic">في الانتظار</div>
              </div>
              <div className="text-center p-4 bg-transparent border border-black/10 rounded-3xl">
                <div className="text-2xl font-bold text-black font-arabic">{metrics.contractsCount.expired}</div>
                <div className="text-sm font-medium text-black font-arabic">منتهية</div>
              </div>
              <div className="text-center p-4 bg-transparent border border-black/10 rounded-3xl">
                <div className="text-2xl font-bold text-black font-arabic">{metrics.contractsCount.underReview}</div>
                <div className="text-sm font-medium text-black font-arabic">قيد المراجعة</div>
              </div>
            </div>
          </div>
        </div>

        {/* درجة الامتثال ومؤشرات المخاطر */}
        <div className="bg-[#f2ffff] p-9 rounded-3xl border border-black/10 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-black font-arabic flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center">
                <Shield className="h-4 w-4 text-black" />
              </div>
              مؤشرات الامتثال والمخاطر
            </h3>
          </div>
          <div>
            <div className="space-y-4">
              <div className="text-center p-4 bg-transparent border border-black/10 rounded-3xl">
                <div className="text-4xl font-bold text-black font-arabic mb-2">{metrics.complianceScore}%</div>
                <div className="text-sm font-medium text-black font-arabic">درجة الامتثال</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-[#bdeed3] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${metrics.complianceScore}%` }}
                  />
                </div>
              </div>
              <div className="text-center p-4 bg-transparent border border-black/10 rounded-3xl">
                <div className="text-2xl font-bold text-black font-arabic mb-2">{metrics.riskScore}</div>
                <div className="text-sm font-medium text-black font-arabic">درجة المخاطر الإجمالية</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* الإحصائيات الشهرية */}
        <div className="bg-[#f2ffff] p-9 rounded-3xl border border-black/10 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-black font-arabic flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-black" />
              </div>
              الإنجازات الشهرية
            </h3>
          </div>
          <div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-transparent border border-black/10 rounded-3xl">
                <div className="text-2xl font-bold text-black font-arabic">{metrics.monthlyStats.contractsSigned}</div>
                <div className="text-sm font-medium text-black font-arabic">عقد موقع</div>
              </div>
              <div className="text-center p-4 bg-transparent border border-black/10 rounded-3xl">
                <div className="text-2xl font-bold text-black font-arabic">{metrics.monthlyStats.casesResolved}</div>
                <div className="text-sm font-medium text-black font-arabic">قضية محلولة</div>
              </div>
              <div className="text-center p-4 bg-transparent border border-black/10 rounded-3xl">
                <div className="text-2xl font-bold text-black font-arabic">{metrics.monthlyStats.complianceChecks}</div>
                <div className="text-sm font-medium text-black font-arabic">فحص امتثال</div>
              </div>
              <div className="text-center p-4 bg-transparent border border-black/10 rounded-3xl">
                <div className="text-2xl font-bold text-black font-arabic">{metrics.monthlyStats.riskAssessments}</div>
                <div className="text-sm font-medium text-black font-arabic">تقييم مخاطر</div>
              </div>
            </div>
          </div>
        </div>

        {/* التنبيهات القانونية */}
        <div className="bg-[#f2ffff] p-9 rounded-3xl border border-black/10 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-black font-arabic flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center">
                <Bell className="h-4 w-4 text-black" />
              </div>
              تنبيهات قانونية عاجلة
            </h3>
          </div>
          <div>
            <div className="space-y-3">
              {alerts.map(alert => (
                <div 
                  key={alert.id} 
                  className="p-4 rounded-3xl bg-transparent border border-black/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center">
                      {alert.priority === 'high' && <AlertTriangle className="h-4 w-4 text-black" />}
                      {alert.priority === 'medium' && <Clock className="h-4 w-4 text-black" />}
                      {alert.priority === 'low' && <CheckCircle className="h-4 w-4 text-black" />}
                    </div>
                    <span className="text-sm font-medium text-black font-arabic flex-1">{alert.message}</span>
                    <div className={`px-3 py-1 rounded-full text-xs font-normal ${getAlertBadgeColor(alert.priority)}`}>
                      {alert.priority === 'high' ? 'عالي' : alert.priority === 'medium' ? 'متوسط' : 'منخفض'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};