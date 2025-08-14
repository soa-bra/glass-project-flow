
import React from 'react';
import { Archive } from 'lucide-react';
import { COLORS, LAYOUT, TYPOGRAPHY } from '@/components/shared/design-system/constants';

export const EmptyArchiveState: React.FC = () => {
  return (
    <div className={`h-full ${LAYOUT.CARD_ROUNDED} overflow-hidden ${LAYOUT.FLEX_CENTER} ${COLORS.CARD_BACKGROUND}`}>
      <div className="text-center">
        <Archive className="h-16 w-16 text-soabra-ink-30 mx-auto mb-4" />
        <h3 className={`${TYPOGRAPHY.TITLE_SIZE} text-soabra-ink-60 mb-2 ${TYPOGRAPHY.ARABIC_FONT}`}>
          اختر فئة من الأرشيف
        </h3>
        <p className={`text-soabra-ink-30 ${TYPOGRAPHY.ARABIC_FONT}`}>
          قم بتحديد فئة من الشريط الجانبي لعرض محتوى الأرشيف
        </p>
      </div>
    </div>
  );
};
