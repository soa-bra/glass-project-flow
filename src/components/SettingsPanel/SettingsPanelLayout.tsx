import React from 'react';
import { COLORS, LAYOUT, SPACING } from '@/components/shared/design-system/constants';

interface SettingsPanelLayoutProps {
  children: React.ReactNode;
}

export const SettingsPanelLayout: React.FC<SettingsPanelLayoutProps> = ({
  children
}) => {
  return (
    <div className={`h-full ${LAYOUT.CARD_ROUNDED} overflow-hidden`} style={{ background: '#F8F9FA' }}>
      <div className="h-full flex flex-col">
        <div className={`flex-1 overflow-auto ${SPACING.CONTENT_PADDING}`}>
          <div className={`h-full ${SPACING.SECTION_MARGIN} ${LAYOUT.CARD_ROUNDED} overflow-hidden`} style={{ background: '#F8F9FA' }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};