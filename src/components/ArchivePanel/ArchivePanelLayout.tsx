import React from 'react';
import { LAYOUT, SPACING } from '@/components/shared/design-system/constants';

interface ArchivePanelLayoutProps {
  children: React.ReactNode;
}

export const ArchivePanelLayout: React.FC<ArchivePanelLayoutProps> = ({ children }) => {
  return (
    <div className={`h-full ${LAYOUT.CARD_ROUNDED} overflow-hidden bg-white`}>
      <div className="h-full flex flex-col">
        <div className={`flex-1 overflow-auto ${SPACING.CONTENT_PADDING}`}>
          <div className={`h-full ${SPACING.SECTION_MARGIN} ${LAYOUT.CARD_ROUNDED} overflow-hidden bg-white`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
