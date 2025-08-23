// ===============================
// Top Toolbar - Planning Board
// الشريط العلوي للوحة التخطيط
// ===============================

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { COLORS, TYPOGRAPHY, LAYOUT, SPACING } from '@/components/shared/design-system/constants';
import { BoardName } from './BoardName';
import { HistoryControls } from './HistoryControls';
import { FileMenu } from './FileMenu';
import { GridMenu } from './GridMenu';
import { ShareButton } from './ShareButton';
import { CommentToggle } from './CommentToggle';
import { SmartProjectGenerator } from './SmartProjectGenerator';

export const TopToolbar: React.FC = () => {
  return (
    <div className={cn(
      "h-16 px-6 flex items-center justify-between",
      COLORS.BOX_BACKGROUND,
      "border-b border-sb-border"
    )}>
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <BoardName />
      </div>

      {/* Center Section */}
      <div className="flex items-center gap-2">
        <HistoryControls />
        <div className="h-6 w-px bg-sb-border mx-2" />
        <FileMenu />
        <GridMenu />
        <div className="h-6 w-px bg-sb-border mx-2" />
        <SmartProjectGenerator />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        <CommentToggle />
        <ShareButton />
      </div>
    </div>
  );
};

export default TopToolbar;