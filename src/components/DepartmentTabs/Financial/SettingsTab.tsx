
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Database, Calculator, Download } from 'lucide-react';
import { CircularIconButton } from '@/components/ui/CircularIconButton';

export const SettingsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-black font-arabic mx-[26px]">إعدادات النظام المالي</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#f2ffff] rounded-3xl p-6 border border-transparent">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-black font-arabic">
              مخطط الحسابات
            </h3>
            <CircularIconButton 
              icon={Database}
              size="sm"
              className="w-8 h-8 bg-transparent border border-black/20 text-black"
            />
          </div>
          <div className="space-y-4 bg-transparent">
            <div className="space-y-2">
              <Label htmlFor="account-code" className="text-sm font-bold text-black font-arabic">رمز الحساب</Label>
              <Input 
                id="account-code" 
                placeholder="مثال: 1100" 
                className="bg-transparent border border-black/20 rounded-2xl text-black placeholder:text-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="account-name" className="text-sm font-bold text-black font-arabic">اسم الحساب</Label>
              <Input 
                id="account-name" 
                placeholder="مثال: النقدية بالصندوق" 
                className="bg-transparent border border-black/20 rounded-2xl text-black placeholder:text-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="account-type" className="text-sm font-bold text-black font-arabic">نوع الحساب</Label>
              <Select>
                <SelectTrigger className="bg-transparent border border-black/20 rounded-2xl text-black">
                  <SelectValue placeholder="اختر نوع الحساب" />
                </SelectTrigger>
                <SelectContent className="bg-[#f2ffff] border border-black/20 rounded-2xl">
                  <SelectItem value="asset" className="text-black font-arabic">أصول</SelectItem>
                  <SelectItem value="liability" className="text-black font-arabic">خصوم</SelectItem>
                  <SelectItem value="equity" className="text-black font-arabic">حقوق الملكية</SelectItem>
                  <SelectItem value="revenue" className="text-black font-arabic">إيرادات</SelectItem>
                  <SelectItem value="expense" className="text-black font-arabic">مصروفات</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full bg-transparent border border-black/20 text-black hover:bg-black/5 rounded-2xl font-arabic">
              إضافة حساب
            </Button>
          </div>
        </div>

        <div className="bg-[#f2ffff] rounded-3xl p-6 border border-transparent">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-black font-arabic">
              إعدادات الضرائب
            </h3>
            <CircularIconButton 
              icon={Calculator}
              size="sm"
              className="w-8 h-8 bg-transparent border border-black/20 text-black"
            />
          </div>
          <div className="space-y-4 bg-transparent">
            <div className="space-y-2">
              <Label htmlFor="vat-rate" className="text-sm font-bold text-black font-arabic">معدل ضريبة القيمة المضافة (%)</Label>
              <Input 
                id="vat-rate" 
                type="number" 
                placeholder="15" 
                className="bg-transparent border border-black/20 rounded-2xl text-black placeholder:text-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tax-number" className="text-sm font-bold text-black font-arabic">الرقم الضريبي</Label>
              <Input 
                id="tax-number" 
                placeholder="300000000000003" 
                className="bg-transparent border border-black/20 rounded-2xl text-black placeholder:text-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency" className="text-sm font-bold text-black font-arabic">العملة الأساسية</Label>
              <Select>
                <SelectTrigger className="bg-transparent border border-black/20 rounded-2xl text-black">
                  <SelectValue placeholder="اختر العملة" />
                </SelectTrigger>
                <SelectContent className="bg-[#f2ffff] border border-black/20 rounded-2xl">
                  <SelectItem value="SAR" className="text-black font-arabic">ريال سعودي (SAR)</SelectItem>
                  <SelectItem value="USD" className="text-black font-arabic">دولار أمريكي (USD)</SelectItem>
                  <SelectItem value="EUR" className="text-black font-arabic">يورو (EUR)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full bg-transparent border border-black/20 text-black hover:bg-black/5 rounded-2xl font-arabic">
              حفظ الإعدادات
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
