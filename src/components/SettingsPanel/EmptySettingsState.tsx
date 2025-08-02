import React from 'react';
import { Settings } from 'lucide-react';
import { COLORS, LAYOUT, TYPOGRAPHY } from '@/components/shared/design-system/constants';

export const EmptySettingsState: React.FC = () => {
  return (
    <div className={`w-full h-full ${LAYOUT.CARD_ROUNDED} ${LAYOUT.FLEX_CENTER} ${COLORS.CARD_BACKGROUND}`}>
      <div className="text-center space-y-6 max-w-md mx-auto p-8">
        <div className={`w-24 h-24 mx-auto ${COLORS.TRANSPARENT_BACKGROUND} ${LAYOUT.CARD_ROUNDED} ${LAYOUT.FLEX_CENTER} ${COLORS.BORDER_COLOR}`}>
          <Settings className="w-12 h-12 text-gray-600" />
        </div>
        
        <div className="space-y-3">
          <h3 className={`${TYPOGRAPHY.LARGE_TITLE_SIZE} ${COLORS.PRIMARY_TEXT} ${TYPOGRAPHY.ARABIC_FONT}`}>
            مرحباً بك في الإعدادات
          </h3>
          <p className={`text-gray-600 leading-relaxed ${TYPOGRAPHY.ARABIC_FONT}`}>
            اختر فئة من الشريط الجانبي لبدء تخصيص إعدادات النظام حسب احتياجاتك
          </p>
        </div>
        
        <div className={`${COLORS.TRANSPARENT_BACKGROUND} ${LAYOUT.CARD_ROUNDED} p-4 ${COLORS.BORDER_COLOR}`}>
          <p className={`${TYPOGRAPHY.CAPTION_TEXT} text-gray-600 ${TYPOGRAPHY.ARABIC_FONT}`}>
            💡 <strong>نصيحة:</strong> يمكنك البدء بإعدادات الملف الشخصي أو الأمان والخصوصية
          </p>
        </div>
      </div>
    </div>
  );
};