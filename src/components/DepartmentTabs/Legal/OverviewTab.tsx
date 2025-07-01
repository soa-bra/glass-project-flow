import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { AlertTriangle, FileText, Scale, Shield, Calendar, TrendingUp } from 'lucide-react';
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
    }
  ];

  return (
    <div className="h-full overflow-auto">
      {/* مؤشرات الأداء الأساسية */}
      <KPIStatsSection stats={kpiStats} />

      {/* باقي المحتوى */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* عدادات العقود */}
        <BaseCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">العقود</h3>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{metrics.contractsCount.signed}</div>
              <div className="text-sm text-gray-600">موقعة</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{metrics.contractsCount.pending}</div>
              <div className="text-sm text-gray-600">في الانتظار</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{metrics.contractsCount.expired}</div>
              <div className="text-sm text-gray-600">منتهية</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{metrics.contractsCount.underReview}</div>
              <div className="text-sm text-gray-600">قيد المراجعة</div>
            </div>
          </div>
        </BaseCard>

        {/* القضايا النشطة */}
        <BaseCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">القضايا النشطة</h3>
            <Scale className="w-8 h-8 text-orange-600" />
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-600 mb-2">{metrics.activeCases}</div>
            <div className="text-sm text-gray-600">قضية نشطة</div>
          </div>
        </BaseCard>

        {/* درجة الامتثال */}
        <BaseCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">درجة الامتثال</h3>
            <Shield className="w-8 h-8 text-green-600" />
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">{metrics.complianceScore}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${metrics.complianceScore}%` }}
              />
            </div>
          </div>
        </BaseCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* التنبيهات العاجلة */}
        <BaseCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">التنبيهات العاجلة</h3>
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div className="space-y-3">
            {alerts.map(alert => (
              <div key={alert.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-800 mb-1">{alert.message}</div>
                  <div className="text-xs text-gray-600">
                    تاريخ الاستحقاق: {new Date(alert.dueDate).toLocaleDateString('ar-SA')}
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(alert.priority)}`}>
                  {getStatusText(alert.priority)}
                </div>
              </div>
            ))}
          </div>
        </BaseCard>

        {/* الإحصائيات الشهرية */}
        <BaseCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">الإحصائيات الشهرية</h3>
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-xl font-bold text-blue-600">{metrics.monthlyStats.contractsSigned}</div>
              <div className="text-sm text-gray-600">عقد موقع</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-xl font-bold text-green-600">{metrics.monthlyStats.casesResolved}</div>
              <div className="text-sm text-gray-600">قضية محلولة</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-xl font-bold text-yellow-600">{metrics.monthlyStats.complianceChecks}</div>
              <div className="text-sm text-gray-600">فحص امتثال</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-xl font-bold text-red-600">{metrics.monthlyStats.riskAssessments}</div>
              <div className="text-sm text-gray-600">تقييم مخاطر</div>
            </div>
          </div>
        </BaseCard>
      </div>

      {/* مصفوفة المخاطر */}
      <div className="mt-6">
        <BaseCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">مصفوفة المخاطر</h3>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-xs text-gray-600">مرتفع</span>
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span className="text-xs text-gray-600">متوسط</span>
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-xs text-gray-600">منخفض</span>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="text-4xl font-bold text-orange-600 mb-2">{metrics.riskScore}</div>
            <div className="text-sm text-gray-600">درجة المخاطر الإجمالية</div>
            <div className="text-xs text-gray-500 mt-2">
              تم حسابها بناءً على التكاليف والمهام والعقود
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  );
};
