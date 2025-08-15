import React from 'react';
import { Database, Calculator } from 'lucide-react';
import { BaseTabContent } from '@/components/shared/BaseTabContent';
import { BaseCard } from '@/components/shared/BaseCard';
import { BaseActionButton } from '@/components/shared/BaseActionButton';
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
              <select className={cn(
                'w-full px-4 py-2 bg-transparent rounded-lg',
                COLORS.BORDER_COLOR,
                TYPOGRAPHY.SMALL,
                COLORS.PRIMARY_TEXT,
                'focus:outline-none focus:ring-2 focus:ring-blue-500'
              )}>
                <option value="">اختر نوع الحساب</option>
                <option value="asset">أصول</option>
                <option value="liability">خصوم</option>
                <option value="equity">حقوق الملكية</option>
                <option value="revenue">إيرادات</option>
                <option value="expense">مصروفات</option>
              </select>
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
              <select className={cn(
                'w-full px-4 py-2 bg-transparent rounded-lg',
                COLORS.BORDER_COLOR,
                TYPOGRAPHY.SMALL,
                COLORS.PRIMARY_TEXT,
                'focus:outline-none focus:ring-2 focus:ring-blue-500'
              )}>
                <option value="">اختر العملة</option>
                <option value="SAR">ريال سعودي (SAR)</option>
                <option value="USD">دولار أمريكي (USD)</option>
                <option value="EUR">يورو (EUR)</option>
              </select>
            </div>
            <BaseActionButton variant="primary">حفظ الإعدادات</BaseActionButton>
          </div>
        </BaseCard>
      </div>
    </BaseTabContent>
  );
};