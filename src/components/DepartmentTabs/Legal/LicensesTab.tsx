
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { Award, AlertTriangle, Calendar, DollarSign } from 'lucide-react';
import { mockLicenses } from './data';
import { getStatusColor, getStatusText, formatCurrency, formatDate, getDaysUntil } from './utils';

export const LicensesTab: React.FC = () => {
  const licenseStats = {
    active: mockLicenses.filter(license => license.status === 'active').length,
    expired: mockLicenses.filter(license => license.status === 'expired').length,
    pendingRenewal: mockLicenses.filter(license => license.status === 'pending_renewal').length,
    suspended: mockLicenses.filter(license => license.status === 'suspended').length,
  };

  const totalRenewalCost = mockLicenses
    .filter(license => license.status === 'pending_renewal')
    .reduce((sum, license) => sum + license.renewalCost, 0);

  return (
    <div className="h-full overflow-auto">
      {/* License Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <BaseCard className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Award className="w-8 h-8 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-600">{licenseStats.active}</div>
          <div className="text-sm text-gray-600">تراخيص نشطة</div>
        </BaseCard>
        
        <BaseCard className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          </div>
          <div className="text-2xl font-bold text-yellow-600">{licenseStats.pendingRenewal}</div>
          <div className="text-sm text-gray-600">تحتاج تجديد</div>
        </BaseCard>
        
        <BaseCard className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Calendar className="w-8 h-8 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-red-600">{licenseStats.expired}</div>
          <div className="text-sm text-gray-600">منتهية</div>
        </BaseCard>
        
        <BaseCard className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <DollarSign className="w-8 h-8 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-600">{totalRenewalCost.toLocaleString()}</div>
          <div className="text-sm text-gray-600">تكلفة التجديد (ر.س)</div>
        </BaseCard>
      </div>

      {/* Renewal Alerts */}
      <BaseCard className="p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">تنبيهات التجديد</h3>
        <div className="space-y-3">
          {mockLicenses
            .filter(license => {
              const daysUntilExpiry = getDaysUntil(license.expiryDate);
              return daysUntilExpiry <= 90 && daysUntilExpiry > 0;
            })
            .map(license => {
              const daysUntilExpiry = getDaysUntil(license.expiryDate);
              const urgencyLevel = daysUntilExpiry <= 30 ? 'urgent' : daysUntilExpiry <= 60 ? 'high' : 'medium';
              
              return (
                <div key={license.id} className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{license.name}</div>
                    <div className="text-sm text-gray-600">
                      ينتهي في {daysUntilExpiry} يوم - {formatDate(license.expiryDate)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      urgencyLevel === 'urgent' ? 'bg-red-100 text-red-800' :
                      urgencyLevel === 'high' ? 'bg-orange-100 text-orange-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {urgencyLevel === 'urgent' ? 'عاجل' :
                       urgencyLevel === 'high' ? 'مهم' : 'تذكير'}
                    </span>
                    <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                      جدد الآن
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </BaseCard>

      {/* Licenses Table */}
      <BaseCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">التراخيص والملكية الفكرية</h3>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            إضافة ترخيص جديد
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-3 text-sm font-semibold text-gray-700">الترخيص</th>
                <th className="pb-3 text-sm font-semibold text-gray-700">النوع</th>
                <th className="pb-3 text-sm font-semibold text-gray-700">الحالة</th>
                <th className="pb-3 text-sm font-semibold text-gray-700">الجهة المصدرة</th>
                <th className="pb-3 text-sm font-semibold text-gray-700">تاريخ الإصدار</th>
                <th className="pb-3 text-sm font-semibold text-gray-700">تاريخ الانتهاء</th>
                <th className="pb-3 text-sm font-semibold text-gray-700">تكلفة التجديد</th>
                <th className="pb-3 text-sm font-semibold text-gray-700">الوثائق</th>
              </tr>
            </thead>
            <tbody>
              {mockLicenses.map((license) => {
                const daysUntilExpiry = getDaysUntil(license.expiryDate);
                
                return (
                  <tr key={license.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4">
                      <div className="font-medium text-gray-800">{license.name}</div>
                      <div className="text-sm text-gray-600">{license.id}</div>
                    </td>
                    <td className="py-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {getStatusText(license.type)}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(license.status)}`}>
                        {getStatusText(license.status)}
                      </span>
                    </td>
                    <td className="py-4 text-gray-700">{license.issuer}</td>
                    <td className="py-4 text-gray-600">{formatDate(license.issueDate)}</td>
                    <td className="py-4">
                      <div className="text-gray-600">{formatDate(license.expiryDate)}</div>
                      {daysUntilExpiry > 0 && daysUntilExpiry <= 90 && (
                        <div className="text-xs text-orange-600">
                          {daysUntilExpiry} يوم متبقي
                        </div>
                      )}
                    </td>
                    <td className="py-4 font-medium">{formatCurrency(license.renewalCost)}</td>
                    <td className="py-4">
                      <div className="text-sm text-blue-600">
                        {license.documents.length} وثيقة
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </BaseCard>
    </div>
  );
};
