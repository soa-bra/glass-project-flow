import React from 'react';
import { Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { mockComplianceItems } from './data';
import { getStatusColor, getStatusText, formatDate } from './utils';
export const ComplianceTab: React.FC = () => {
  const complianceStats = {
    compliant: mockComplianceItems.filter(item => item.status === 'compliant').length,
    actionRequired: mockComplianceItems.filter(item => item.status === 'action_required').length,
    pendingReview: mockComplianceItems.filter(item => item.status === 'pending_review').length,
    nonCompliant: mockComplianceItems.filter(item => item.status === 'non_compliant').length
  };
  const totalItems = mockComplianceItems.length;
  const compliancePercentage = Math.round(complianceStats.compliant / totalItems * 100);
  const getComplianceStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'bg-[#bdeed3] text-black';
      case 'action_required':
        return 'bg-[#fbe2aa] text-black';
      case 'pending_review':
        return 'bg-[#a4e2f6] text-black';
      case 'non_compliant':
        return 'bg-[#f1b5b9] text-black';
      default:
        return 'bg-[#d9d2fd] text-black';
    }
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="h-5 w-5 text-black" />;
      case 'action_required':
        return <AlertTriangle className="h-5 w-5 text-black" />;
      case 'pending_review':
        return <Clock className="h-5 w-5 text-black" />;
      case 'non_compliant':
        return <AlertTriangle className="h-5 w-5 text-black" />;
      default:
        return <Shield className="h-5 w-5 text-black" />;
    }
  };
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-black font-arabic">إدارة الامتثال القانوني</h3>
        <button className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-black/90 transition-colors">
          <div className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center">
            <Shield className="w-4 h-4" />
          </div>
          إضافة متطلب جديد
        </button>
      </div>

      {/* نظرة عامة على الامتثال */}
      <div className="rounded-[41px] bg-[#FFFFFF] border border-[#DADCE0] p-9 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-black font-arabic flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center">
              <Shield className="h-4 w-4 text-black" />
            </div>
            حالة الامتثال العامة
          </h3>
        </div>
        <div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-transparent border border-[#DADCE0] rounded-[41px]">
              <div className="text-3xl font-bold text-black font-arabic mb-2">{compliancePercentage}%</div>
              <div className="text-sm font-medium text-black font-arabic">نسبة الامتثال</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-[#bdeed3] h-2 rounded-full transition-all duration-300" style={{
                width: `${compliancePercentage}%`
              }} />
              </div>
            </div>
            <div className="text-center p-4 bg-transparent border border-[#DADCE0] rounded-[41px]">
              <div className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="h-4 w-4 text-black" />
              </div>
              <div className="text-2xl font-bold text-black font-arabic">{complianceStats.compliant}</div>
              <div className="text-sm font-medium text-black font-arabic">متوافقة</div>
            </div>
            <div className="text-center p-4 bg-transparent border border-[#DADCE0] rounded-[41px]">
              <div className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center mx-auto mb-2">
                <AlertTriangle className="h-4 w-4 text-black" />
              </div>
              <div className="text-2xl font-bold text-black font-arabic">{complianceStats.actionRequired}</div>
              <div className="text-sm font-medium text-black font-arabic">تحتاج إجراء</div>
            </div>
            <div className="text-center p-4 bg-transparent border border-[#DADCE0] rounded-[41px]">
              <div className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center mx-auto mb-2">
                <Clock className="h-4 w-4 text-black" />
              </div>
              <div className="text-2xl font-bold text-black font-arabic">{complianceStats.pendingReview}</div>
              <div className="text-sm font-medium text-black font-arabic">قيد المراجعة</div>
            </div>
            <div className="text-center p-4 bg-transparent border border-[#DADCE0] rounded-[41px]">
              <div className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center mx-auto mb-2">
                <AlertTriangle className="h-4 w-4 text-black" />
              </div>
              <div className="text-2xl font-bold text-black font-arabic">{complianceStats.nonCompliant}</div>
              <div className="text-sm font-medium text-black font-arabic">غير متوافقة</div>
            </div>
          </div>
        </div>
      </div>

      {/* قائمة عناصر الامتثال */}
      <div className="rounded-[41px] bg-[#FFFFFF] border border-[#DADCE0] p-9 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-black font-arabic">مصفوفة المتطلبات القانونية</h3>
        </div>
        <div>
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="border-b border-black/10">
                  <th className="pb-4 text-sm font-semibold text-black font-arabic">المتطلب</th>
                  <th className="pb-4 text-sm font-semibold text-black font-arabic">الفئة</th>
                  <th className="pb-4 text-sm font-semibold text-black font-arabic">الحالة</th>
                  <th className="pb-4 text-sm font-semibold text-black font-arabic">المسؤول</th>
                  <th className="pb-4 text-sm font-semibold text-black font-arabic">آخر مراجعة</th>
                  <th className="pb-4 text-sm font-semibold text-black font-arabic">المراجعة القادمة</th>
                  <th className="pb-4 text-sm font-semibold text-black font-arabic">الوثائق</th>
                </tr>
              </thead>
              <tbody>
                {mockComplianceItems.map(item => <tr key={item.id} className="border-b border-black/10 hover:bg-white/10 transition-colors">
                    <td className="py-4">
                      <div className="font-medium text-black font-arabic">{item.requirement}</div>
                      <div className="text-sm text-black/70 font-arabic">{item.id}</div>
                    </td>
                    <td className="py-4">
                      <span className="px-3 py-1 text-xs rounded-full bg-[#a4e2f6] text-black font-arabic">
                        {getStatusText(item.category)}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className={`px-3 py-1 text-xs rounded-full font-arabic ${getComplianceStatusColor(item.status)}`}>
                        {getStatusText(item.status)}
                      </span>
                    </td>
                    <td className="py-4 text-black font-arabic">{item.responsible}</td>
                    <td className="py-4 text-black font-arabic">{formatDate(item.lastReview)}</td>
                    <td className="py-4 text-black font-arabic">{formatDate(item.nextReview)}</td>
                    <td className="py-4">
                      <div className="text-sm text-black font-arabic">
                        {item.documents.length} وثيقة
                      </div>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* العناصر التي تحتاج إجراء عاجل */}
      <div className="rounded-[41px] bg-[#FFFFFF] border border-[#DADCE0] p-9 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-black font-arabic flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-black" />
            </div>
            إجراءات عاجلة مطلوبة
          </h3>
        </div>
        <div>
          <div className="space-y-3">
            {mockComplianceItems.filter(item => item.status === 'action_required' || item.status === 'non_compliant').slice(0, 5).map(item => <div key={item.id} className="p-4 bg-transparent border border-[#DADCE0] rounded-[41px]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center">
                      <AlertTriangle className="h-4 w-4 text-black" />
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-black font-arabic">{item.requirement}</span>
                      <div className="text-xs font-normal text-black font-arabic mt-1">
                        الموعد النهائي: {formatDate(item.nextReview)}
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-xs font-normal rounded-full font-arabic ${getComplianceStatusColor(item.status)}`}>
                      {getStatusText(item.status)}
                    </span>
                  </div>
                </div>)}
          </div>
        </div>
      </div>
    </div>;
};