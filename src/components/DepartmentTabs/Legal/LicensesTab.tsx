import React from 'react';
import { Award, AlertTriangle, Calendar, DollarSign, Plus } from 'lucide-react';
import { mockLicenses } from './data';
import { getStatusColor, getStatusText, formatCurrency, formatDate, getDaysUntil } from './utils';
export const LicensesTab: React.FC = () => {
  const licenseStats = {
    active: mockLicenses.filter(license => license.status === 'active').length,
    expired: mockLicenses.filter(license => license.status === 'expired').length,
    pendingRenewal: mockLicenses.filter(license => license.status === 'pending_renewal').length,
    suspended: mockLicenses.filter(license => license.status === 'suspended').length
  };
  const totalRenewalCost = mockLicenses.filter(license => license.status === 'pending_renewal').reduce((sum, license) => sum + license.renewalCost, 0);
  const getLicenseStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-[#bdeed3] text-black';
      case 'pending_renewal':
        return 'bg-[#fbe2aa] text-black';
      case 'expired':
        return 'bg-[#f1b5b9] text-black';
      case 'suspended':
        return 'bg-[#d9d2fd] text-black';
      default:
        return 'bg-[#a4e2f6] text-black';
    }
  };
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-black font-arabic">التراخيص والملكية الفكرية</h3>
        <button className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-black/90 transition-colors">
          <div className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center">
            <Plus className="w-4 h-4" />
          </div>
          إضافة ترخيص جديد
        </button>
      </div>

      {/* إحصائيات التراخيص */}
      <div className="rounded-[41px] bg-[#FFFFFF] border border-[#DADCE0] p-9 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-black font-arabic flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center">
              <Award className="h-4 w-4 text-black" />
            </div>
            إحصائيات التراخيص
          </h3>
        </div>
        <div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-transparent border border-[#DADCE0] rounded-[41px]">
              <div className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center mx-auto mb-2">
                <Award className="h-4 w-4 text-black" />
              </div>
              <div className="text-2xl font-bold text-black font-arabic">{licenseStats.active}</div>
              <div className="text-sm font-medium text-black font-arabic">تراخيص نشطة</div>
            </div>
            <div className="text-center p-4 bg-transparent border border-[#DADCE0] rounded-[41px]">
              <div className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center mx-auto mb-2">
                <AlertTriangle className="h-4 w-4 text-black" />
              </div>
              <div className="text-2xl font-bold text-black font-arabic">{licenseStats.pendingRenewal}</div>
              <div className="text-sm font-medium text-black font-arabic">تحتاج تجديد</div>
            </div>
            <div className="text-center p-4 bg-transparent border border-[#DADCE0] rounded-[41px]">
              <div className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center mx-auto mb-2">
                <Calendar className="h-4 w-4 text-black" />
              </div>
              <div className="text-2xl font-bold text-black font-arabic">{licenseStats.expired}</div>
              <div className="text-sm font-medium text-black font-arabic">منتهية</div>
            </div>
            <div className="text-center p-4 bg-transparent border border-[#DADCE0] rounded-[41px]">
              <div className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center mx-auto mb-2">
                <DollarSign className="h-4 w-4 text-black" />
              </div>
              <div className="text-2xl font-bold text-black font-arabic">{totalRenewalCost.toLocaleString()}</div>
              <div className="text-sm font-medium text-black font-arabic">تكلفة التجديد (ر.س)</div>
            </div>
          </div>
        </div>
      </div>

      {/* جدول التراخيص */}
      <div className="rounded-[41px] bg-[#FFFFFF] border border-[#DADCE0] p-9 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-black font-arabic">قائمة التراخيص</h3>
        </div>
        <div>
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="border-b border-black/10">
                  <th className="pb-4 text-sm font-semibold text-black font-arabic">الترخيص</th>
                  <th className="pb-4 text-sm font-semibold text-black font-arabic">النوع</th>
                  <th className="pb-4 text-sm font-semibold text-black font-arabic">الحالة</th>
                  <th className="pb-4 text-sm font-semibold text-black font-arabic">تاريخ الانتهاء</th>
                  <th className="pb-4 text-sm font-semibold text-black font-arabic">تكلفة التجديد</th>
                </tr>
              </thead>
              <tbody>
                {mockLicenses.map(license => <tr key={license.id} className="border-b border-black/10 hover:bg-white/10 transition-colors">
                    <td className="py-4">
                      <div className="font-medium text-black font-arabic">{license.name}</div>
                      <div className="text-sm text-black/70 font-arabic">{license.id}</div>
                    </td>
                    <td className="py-4">
                      <span className="px-3 py-1 text-xs rounded-full bg-[#a4e2f6] text-black font-arabic">
                        {getStatusText(license.type)}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className={`px-3 py-1 text-xs rounded-full font-arabic ${getLicenseStatusColor(license.status)}`}>
                        {getStatusText(license.status)}
                      </span>
                    </td>
                    <td className="py-4 text-black font-arabic">{formatDate(license.expiryDate)}</td>
                    <td className="py-4 font-medium text-black font-arabic">{formatCurrency(license.renewalCost)}</td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>;
};