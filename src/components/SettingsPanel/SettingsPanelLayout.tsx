import React from 'react';
import { LAYOUT, SPACING } from '@/components/shared/design-system/constants';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SettingsPanelLayoutProps {
  children: React.ReactNode;
}

export const SettingsPanelLayout: React.FC<SettingsPanelLayoutProps> = ({ children }) => {
  return (
    <div className={`h-full ${LAYOUT.CARD_ROUNDED} overflow-hidden bg-white`}>
      <div className="h-full flex flex-col overflow-hidden">
        <div className={`flex-1 min-h-0 overflow-hidden`}>
          <ScrollArea className="h-full w-full">
            <div className={`${SPACING.CONTENT_PADDING}`}>
              <div className={`${SPACING.SECTION_MARGIN} ${LAYOUT.CARD_ROUNDED} overflow-hidden bg-white`}>
                {children}
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};
