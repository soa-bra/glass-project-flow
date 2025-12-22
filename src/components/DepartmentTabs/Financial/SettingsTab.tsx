import React from 'react';
import { Database, Calculator } from 'lucide-react';
import { BaseTabContent } from '@/components/shared/BaseTabContent';
import { BaseBox as BaseCard } from '@/components/ui/BaseBox';
import { BaseActionButton } from '@/components/shared/BaseActionButton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { buildTitleClasses, COLORS, TYPOGRAPHY, SPACING } from '@/components/shared/design-system/constants';
import { Reveal } from '@/components/shared/motion';
import { cn } from '@/lib/utils';

export const SettingsTab: React.FC = () => {
  return (
    <BaseTabContent value="settings">
      <Reveal>
        <h3 className={cn(buildTitleClasses(), SPACING.SECTION_MARGIN)}>
          إعدادات النظام المالي
        </h3>
      </Reveal>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BaseCard 
          title="مخطط الحسابات" 
          icon={<Database className="h-5 w-5" />}
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="account-code" className={cn(TYPOGRAPHY.SMALL, 'font-semibold', COLORS.PRIMARY_TEXT, TYPOGRAPHY.ARABIC_FONT)}>
                رمز الحساب
              </label>
              <input 
                id="account-code" 
                placeholder="مثال: 1100" 
                className={cn(
                  'w-full px-4 py-2 bg-transparent rounded-lg',
                  COLORS.BORDER_COLOR,
                  TYPOGRAPHY.SMALL,
                  COLORS.PRIMARY_TEXT,
                  'placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500'
                )}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="account-name" className={cn(TYPOGRAPHY.SMALL, 'font-semibold', COLORS.PRIMARY_TEXT, TYPOGRAPHY.ARABIC_FONT)}>
                اسم الحساب
              </label>
              <input 
                id="account-name" 
                placeholder="مثال: النقدية بالصندوق" 
                className={cn(
                  'w-full px-4 py-2 bg-transparent rounded-lg',
                  COLORS.BORDER_COLOR,
                  TYPOGRAPHY.SMALL,
                  COLORS.PRIMARY_TEXT,
                  'placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500'
                )}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="account-type" className={cn(TYPOGRAPHY.SMALL, 'font-semibold', COLORS.PRIMARY_TEXT, TYPOGRAPHY.ARABIC_FONT)}>
                نوع الحساب
              </label>
              <Select>
                <SelectTrigger className="w-full px-4 py-3 rounded-3xl bg-white/30 border border-black/20 focus:border-black text-black placeholder-black/50 text-right font-arabic transition-colors outline-none">
                  <SelectValue placeholder="اختر نوع الحساب" />
                </SelectTrigger>
                <SelectContent 
                  className="z-[10000] text-[#0B0F12] font-arabic"
                  style={{
                    background: 'rgba(255,255,255,0.4)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '24px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <SelectItem value="asset">أصول</SelectItem>
                  <SelectItem value="liability">خصوم</SelectItem>
                  <SelectItem value="equity">حقوق الملكية</SelectItem>
                  <SelectItem value="revenue">إيرادات</SelectItem>
                  <SelectItem value="expense">مصروفات</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <BaseActionButton variant="primary">إضافة حساب</BaseActionButton>
          </div>
        </BaseCard>

        <BaseCard 
          title="إعدادات الضرائب" 
          icon={<Calculator className="h-5 w-5" />}
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="vat-rate" className={cn(TYPOGRAPHY.SMALL, 'font-semibold', COLORS.PRIMARY_TEXT, TYPOGRAPHY.ARABIC_FONT)}>
                معدل ضريبة القيمة المضافة (%)
              </label>
              <input 
                id="vat-rate" 
                type="number" 
                placeholder="15" 
                className={cn(
                  'w-full px-4 py-2 bg-transparent rounded-lg',
                  COLORS.BORDER_COLOR,
                  TYPOGRAPHY.SMALL,
                  COLORS.PRIMARY_TEXT,
                  'placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500'
                )}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="tax-number" className={cn(TYPOGRAPHY.SMALL, 'font-semibold', COLORS.PRIMARY_TEXT, TYPOGRAPHY.ARABIC_FONT)}>
                الرقم الضريبي
              </label>
              <input 
                id="tax-number" 
                placeholder="300000000000003" 
                className={cn(
                  'w-full px-4 py-2 bg-transparent rounded-lg',
                  COLORS.BORDER_COLOR,
                  TYPOGRAPHY.SMALL,
                  COLORS.PRIMARY_TEXT,
                  'placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500'
                )}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="currency" className={cn(TYPOGRAPHY.SMALL, 'font-semibold', COLORS.PRIMARY_TEXT, TYPOGRAPHY.ARABIC_FONT)}>
                العملة الأساسية
              </label>
              <Select>
                <SelectTrigger className="w-full px-4 py-3 rounded-3xl bg-white/30 border border-black/20 focus:border-black text-black placeholder-black/50 text-right font-arabic transition-colors outline-none">
                  <SelectValue placeholder="اختر العملة" />
                </SelectTrigger>
                <SelectContent 
                  className="z-[10000] text-[#0B0F12] font-arabic"
                  style={{
                    background: 'rgba(255,255,255,0.4)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '24px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <SelectItem value="SAR">ريال سعودي (SAR)</SelectItem>
                  <SelectItem value="USD">دولار أمريكي (USD)</SelectItem>
                  <SelectItem value="EUR">يورو (EUR)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <BaseActionButton variant="primary">حفظ الإعدادات</BaseActionButton>
          </div>
        </BaseCard>
      </div>
    </BaseTabContent>
  );
};