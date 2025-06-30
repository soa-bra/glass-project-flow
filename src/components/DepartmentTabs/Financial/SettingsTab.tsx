
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
      <h3 className="text-2xl font-bold">إعدادات النظام المالي</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BaseCard variant="operations" className="p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              مخطط الحسابات
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="account-code">رمز الحساب</Label>
              <Input id="account-code" placeholder="مثال: 1100" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="account-name">اسم الحساب</Label>
              <Input id="account-name" placeholder="مثال: النقدية بالصندوق" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="account-type">نوع الحساب</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع الحساب" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asset">أصول</SelectItem>
                  <SelectItem value="liability">خصوم</SelectItem>
                  <SelectItem value="equity">حقوق الملكية</SelectItem>
                  <SelectItem value="revenue">إيرادات</SelectItem>
                  <SelectItem value="expense">مصروفات</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full">إضافة حساب</Button>
          </CardContent>
        </BaseCard>

        <BaseCard variant="operations" className="p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              إعدادات الضرائب
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="vat-rate">معدل ضريبة القيمة المضافة (%)</Label>
              <Input id="vat-rate" type="number" placeholder="15" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tax-number">الرقم الضريبي</Label>
              <Input id="tax-number" placeholder="300000000000003" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">العملة الأساسية</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="اختر العملة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SAR">ريال سعودي (SAR)</SelectItem>
                  <SelectItem value="USD">دولار أمريكي (USD)</SelectItem>
                  <SelectItem value="EUR">يورو (EUR)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full">حفظ الإعدادات</Button>
          </CardContent>
        </BaseCard>
      </div>
    </div>
  );
};
