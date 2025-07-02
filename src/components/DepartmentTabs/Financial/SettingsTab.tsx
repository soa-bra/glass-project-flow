
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Calculator } from 'lucide-react';
import { BaseCard } from '@/components/ui/BaseCard';

export const SettingsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-large font-semibold text-black font-arabic mx-[26px]">إعدادات النظام المالي</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#f2ffff] p-6 rounded-3xl border border-black/10">
          <div className="px-0 pt-0 mb-6">
            <h3 className="text-large font-semibold text-black font-arabic flex items-center gap-2">
              <Database className="h-5 w-5 text-black" />
              مخطط الحسابات
            </h3>
          </div>
          <div className="px-0 space-y-4">
            <div className="space-y-2">
              <label htmlFor="account-code" className="text-sm font-bold text-black font-arabic">رمز الحساب</label>
              <input 
                id="account-code" 
                placeholder="مثال: 1100" 
                className="w-full px-4 py-2 bg-transparent border border-black/10 rounded-full text-sm font-normal text-black placeholder:text-gray-400 focus:outline-none focus:border-black"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="account-name" className="text-sm font-bold text-black font-arabic">اسم الحساب</label>
              <input 
                id="account-name" 
                placeholder="مثال: النقدية بالصندوق" 
                className="w-full px-4 py-2 bg-transparent border border-black/10 rounded-full text-sm font-normal text-black placeholder:text-gray-400 focus:outline-none focus:border-black"
              />
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
            <button className="w-full bg-black text-white px-4 py-2 rounded-full text-sm font-medium">إضافة حساب</button>
          </div>
        </div>

        <div className="bg-[#f2ffff] p-6 rounded-3xl border border-black/10">
          <div className="px-0 pt-0 mb-6">
            <h3 className="text-large font-semibold text-black font-arabic flex items-center gap-2">
              <Calculator className="h-5 w-5 text-black" />
              إعدادات الضرائب
            </h3>
          </div>
          <div className="px-0 space-y-4">
            <div className="space-y-2">
              <label htmlFor="vat-rate" className="text-sm font-bold text-black font-arabic">معدل ضريبة القيمة المضافة (%)</label>
              <input 
                id="vat-rate" 
                type="number" 
                placeholder="15" 
                className="w-full px-4 py-2 bg-transparent border border-black/10 rounded-full text-sm font-normal text-black placeholder:text-gray-400 focus:outline-none focus:border-black"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="tax-number" className="text-sm font-bold text-black font-arabic">الرقم الضريبي</label>
              <input 
                id="tax-number" 
                placeholder="300000000000003" 
                className="w-full px-4 py-2 bg-transparent border border-black/10 rounded-full text-sm font-normal text-black placeholder:text-gray-400 focus:outline-none focus:border-black"
              />
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
            <button className="w-full bg-black text-white px-4 py-2 rounded-full text-sm font-medium">حفظ الإعدادات</button>
          </div>
        </div>
      </div>
    </div>
  );
};
