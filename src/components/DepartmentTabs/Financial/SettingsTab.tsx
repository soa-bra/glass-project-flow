import React from 'react';
import { Database, Calculator } from 'lucide-react';
import { UnifiedSystemCard } from '@/components/ui/UnifiedSystemCard';
import { UnifiedSystemButton } from '@/components/ui/UnifiedSystemButton';
export const SettingsTab: React.FC = () => {
  return <div className="space-y-6">
      <h3 className="text-xl font-semibold text-black font-arabic">إعدادات النظام المالي</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UnifiedSystemCard title="مخطط الحسابات" icon={<Database className="px-[4px]" />}>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="account-code" className="text-sm font-bold text-black font-arabic">رمز الحساب</label>
              <input id="account-code" placeholder="مثال: 1100" className="w-full px-4 py-2 bg-transparent border border-black/10 rounded-full text-sm font-normal text-black placeholder:text-gray-400 focus:outline-none focus:border-black" />
            </div>
            <div className="space-y-2">
              <label htmlFor="account-name" className="text-sm font-bold text-black font-arabic">اسم الحساب</label>
              <input id="account-name" placeholder="مثال: النقدية بالصندوق" className="w-full px-4 py-2 bg-transparent border border-black/10 rounded-full text-sm font-normal text-black placeholder:text-gray-400 focus:outline-none focus:border-black" />
            </div>
            <div className="space-y-2">
              <label htmlFor="account-type" className="text-sm font-bold text-black font-arabic">نوع الحساب</label>
              <select className="w-full px-4 py-2 bg-transparent border border-black/10 rounded-full text-sm font-normal text-black focus:outline-none focus:border-black">
                <option value="">اختر نوع الحساب</option>
                <option value="asset">أصول</option>
                <option value="liability">خصوم</option>
                <option value="equity">حقوق الملكية</option>
                <option value="revenue">إيرادات</option>
                <option value="expense">مصروفات</option>
              </select>
            </div>
            <UnifiedSystemButton variant="primary">إضافة حساب</UnifiedSystemButton>
          </div>
        </UnifiedSystemCard>

        <UnifiedSystemCard title="إعدادات الضرائب" icon={<Calculator className="px-[4px]" />}>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="vat-rate" className="text-sm font-bold text-black font-arabic">معدل ضريبة القيمة المضافة (%)</label>
              <input id="vat-rate" type="number" placeholder="15" className="w-full px-4 py-2 bg-transparent border border-black/10 rounded-full text-sm font-normal text-black placeholder:text-gray-400 focus:outline-none focus:border-black" />
            </div>
            <div className="space-y-2">
              <label htmlFor="tax-number" className="text-sm font-bold text-black font-arabic">الرقم الضريبي</label>
              <input id="tax-number" placeholder="300000000000003" className="w-full px-4 py-2 bg-transparent border border-black/10 rounded-full text-sm font-normal text-black placeholder:text-gray-400 focus:outline-none focus:border-black" />
            </div>
            <div className="space-y-2">
              <label htmlFor="currency" className="text-sm font-bold text-black font-arabic">العملة الأساسية</label>
              <select className="w-full px-4 py-2 bg-transparent border border-black/10 rounded-full text-sm font-normal text-black focus:outline-none focus:border-black">
                <option value="">اختر العملة</option>
                <option value="SAR">ريال سعودي (SAR)</option>
                <option value="USD">دولار أمريكي (USD)</option>
                <option value="EUR">يورو (EUR)</option>
              </select>
            </div>
            <UnifiedSystemButton variant="primary">حفظ الإعدادات</UnifiedSystemButton>
          </div>
        </UnifiedSystemCard>
      </div>
    </div>;
};