
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { mockComplianceItems } from './data';
import { getStatusColor, getStatusText, formatDate } from './utils';

export const ComplianceTab: React.FC = () => {
  const complianceStats = {
    compliant: mockComplianceItems.filter(item => item.status === 'compliant').length,
    actionRequired: mockComplianceItems.filter(item => item.status === 'action_required').length,
    pendingReview: mockComplianceItems.filter(item => item.status === 'pending_review').length,
    nonCompliant: mockComplianceItems.filter(item => item.status === 'non_compliant').length,
  };

  const totalItems = mockComplianceItems.length;
  const compliancePercentage = Math.round((complianceStats.compliant / totalItems) * 100);

  return (
    <div className="h-full overflow-auto">
      {/* Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <BaseCard className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-600">{complianceStats.compliant}</div>
          <div className="text-sm text-gray-600">متوافق</div>
        </BaseCard>
        
        <BaseCard className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-red-600">{complianceStats.actionRequired}</div>
          <div className="text-sm text-gray-600">يتطلب إجراء</div>
        </BaseCard>
        
        <BaseCard className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
          <div className="text-2xl font-bold text-yellow-600">{complianceStats.pendingReview}</div>
          <div className="text-sm text-gray-600">قيد المراجعة</div>
        </BaseCard>
        
        <BaseCard className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-600">{compliancePercentage}%</div>
          <div className="text-sm text-gray-600">معدل الامتثال</div>
        </BaseCard>
      </div>

      {/* Compliance Score Chart */}
      <BaseCard className="p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">درجة الامتثال الإجمالية</h3>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-green-600 h-4 rounded-full transition-all duration-300"
                style={{ width: `${compliancePercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>0%</span>
              <span>{compliancePercentage}%</span>
              <span>100%</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-green-600">{compliancePercentage}%</div>
        </div>
      </BaseCard>

      {/* Compliance Items */}
      <BaseCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">مصفوفة المتطلبات القانونية</h3>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            إضافة متطلب جديد
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-3 text-sm font-semibold text-gray-700">المتطلب</th>
                <th className="pb-3 text-sm font-semibold text-gray-700">الفئة</th>
                <th className="pb-3 text-sm font-semibold text-gray-700">الحالة</th>
                <th className="pb-3 text-sm font-semibold text-gray-700">المسؤول</th>
                <th className="pb-3 text-sm font-semibold text-gray-700">آخر مراجعة</th>
                <th className="pb-3 text-sm font-semibold text-gray-700">المراجعة القادمة</th>
                <th className="pb-3 text-sm font-semibold text-gray-700">الوثائق</th>
              </tr>
            </thead>
            <tbody>
              {mockComplianceItems.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4">
                    <div className="font-medium text-gray-800">{item.requirement}</div>
                    <div className="text-sm text-gray-600">{item.id}</div>
                  </td>
                  <td className="py-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {getStatusText(item.category)}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(item.status)}`}>
                      {getStatusText(item.status)}
                    </span>
                  </td>
                  <td className="py-4 text-gray-700">{item.responsible}</td>
                  <td className="py-4 text-gray-600">{formatDate(item.lastReview)}</td>
                  <td className="py-4 text-gray-600">{formatDate(item.nextReview)}</td>
                  <td className="py-4">
                    <div className="text-sm text-blue-600">
                      {item.documents.length} وثيقة
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </BaseCard>
    </div>
  );
};
